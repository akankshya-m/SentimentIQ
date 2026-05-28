import aiosqlite, json
from datetime import datetime

DB = "sentiment.db"

async def init_db():
    async with aiosqlite.connect(DB) as db:
        await db.execute("""CREATE TABLE IF NOT EXISTS runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            keyword TEXT, sources TEXT, post_count INTEGER,
            score REAL, summary TEXT, created_at TEXT)""")
        await db.commit()

async def save_run(keyword, sources, posts, summary):
    async with aiosqlite.connect(DB) as db:
        await db.execute(
            "INSERT INTO runs (keyword,sources,post_count,score,summary,created_at) VALUES (?,?,?,?,?,?)",
            (keyword, json.dumps(sources), len(posts),
             summary.get("score", 0), json.dumps(summary),
             datetime.utcnow().isoformat()))
        await db.commit()

async def get_recent_runs(limit=10):
    async with aiosqlite.connect(DB) as db:
        async with db.execute("SELECT * FROM runs ORDER BY id DESC LIMIT ?", (limit,)) as cur:
            rows = await cur.fetchall()
            return [{"id":r[0],"keyword":r[1],"sources":json.loads(r[2]),
                     "post_count":r[3],"score":r[4],"summary":json.loads(r[5]),
                     "created_at":r[6]} for r in rows]
