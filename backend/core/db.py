import aiosqlite, json, os, hashlib
from datetime import datetime

DB = os.environ.get("DB_PATH", "sentiment.db")

def _hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

SEED_USERS = [
    ("admin@sentimentiq.com",   _hash("admin123"),   "Admin"),
    ("analyst@sentimentiq.com", _hash("analyst123"), "Analyst"),
    ("demo@sentimentiq.com",    _hash("demo123"),    "Demo User"),
]

async def init_db():
    async with aiosqlite.connect(DB) as db:
        await db.execute("""CREATE TABLE IF NOT EXISTS runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            keyword TEXT, sources TEXT, post_count INTEGER,
            score REAL, summary TEXT, posts TEXT, created_at TEXT)""")
        # migrate existing DBs that lack the posts column
        try:
            await db.execute("ALTER TABLE runs ADD COLUMN posts TEXT")
        except aiosqlite.OperationalError:
            pass
        await db.execute("""CREATE TABLE IF NOT EXISTS users (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            email   TEXT UNIQUE NOT NULL,
            pw_hash TEXT NOT NULL,
            name    TEXT)""")
        for email, pw_hash, name in SEED_USERS:
            await db.execute(
                "INSERT OR IGNORE INTO users (email, pw_hash, name) VALUES (?,?,?)",
                (email, pw_hash, name))
        await db.commit()

async def verify_user(email: str, password: str):
    async with aiosqlite.connect(DB) as db:
        async with db.execute(
            "SELECT id, name FROM users WHERE email=? AND pw_hash=?",
            (email.lower().strip(), _hash(password))
        ) as cur:
            row = await cur.fetchone()
            if row:
                return {"id": row[0], "name": row[1], "email": email.lower().strip()}
            return None

async def save_run(keyword, sources, posts, summary):
    async with aiosqlite.connect(DB) as db:
        sql = (
            "INSERT INTO runs "
            "(keyword,sources,post_count,score,summary,posts,created_at) "
            "VALUES (?,?,?,?,?,?,?)"
        )
        await db.execute(sql, (
            keyword, json.dumps(sources), len(posts),
            summary.get("score", 0), json.dumps(summary),
            json.dumps(posts), datetime.utcnow().isoformat(),
        ))
        await db.commit()

async def get_recent_runs(limit=50):
    async with aiosqlite.connect(DB) as db:
        sql = (
            "SELECT id,keyword,sources,post_count,score,summary,posts,created_at"
            " FROM runs ORDER BY id DESC LIMIT ?"
        )
        async with db.execute(sql, (limit,)) as cur:
            rows = await cur.fetchall()
            return [
                {"id": r[0], "keyword": r[1], "sources": json.loads(r[2]),
                 "post_count": r[3], "score": r[4], "summary": json.loads(r[5]),
                 "posts": json.loads(r[6]) if r[6] else [],
                 "created_at": r[7]}
                for r in rows
            ]
