# Sentiment Intelligence

Real-time AI sentiment analysis from Reddit & Google News, powered by LLaMA 3.3 (Groq) with Gemini fallback.

## Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
bash run_local.sh        # uvicorn on port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev              # Vite dev server on port 5173
```

> The frontend `.env` points `VITE_API_URL` to `http://localhost:8000` by default.

---

## Deploy Backend (Modal)

1. `pip install modal`
2. `modal token new`
3. Create the Modal secret (one-time):
   ```bash
   modal secret create sentiment-secrets \
     GROQ_API_KEY=... \
     REDDIT_COOKIE=... \
     GEMINI_API_KEY=...
   ```
4. `modal deploy modal_app.py`
5. Copy the output URL (e.g. `https://your-org--sentiment-analysis-web.modal.run`) into  
   `frontend/.env.production` as `VITE_API_URL`.

---

## Deploy Frontend (GitHub Pages)

> **Note:** The built output lives in `/docs` at the repo root (not in `.gitignore`) so  
> GitHub Pages can serve it directly from the `main` branch `/docs` directory.  
> Always commit the `/docs` folder after building.

1. Set your Modal URL in `frontend/.env.production`:
   ```
   VITE_API_URL=https://<your-modal-url>
   ```
2. Build:
   ```bash
   cd frontend && npm run build   # outputs to /docs
   ```
3. Commit `docs/` and push to `main` — GitHub Actions deploys automatically.
4. First time only: enable GitHub Pages in repo **Settings → Pages → Deploy from branch `main` `/docs`**.
