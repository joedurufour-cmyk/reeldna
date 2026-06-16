# ReelDNA V2

Instagram Reel / TikTok / Shorts reverse-engineer. Extract transcript from URL, analyze hook, emotion, narrative, and framework.

## Architecture

```
Frontend (Netlify) → Backend (Render / Docker) → yt-dlp → ffmpeg → faster-whisper / OpenAI API → Report
```

## Transcription Engine

| Engine | Speed | Cost | When it runs |
|--------|-------|------|-------------|
| **faster-whisper** (CTranslate2) | Fast on CPU | Free | Always first |
| **OpenAI Whisper API** | Fast | Pay-per-use | Fallback if faster-whisper fails |

faster-whisper runs `int8` quantization on CPU. For a 30-second reel, expect ~3-5 seconds on Render free tier. For 90-second reels, ~8-12 seconds. If it times out, the backend auto-falls back to OpenAI API (if `OPENAI_API_KEY` is set).

## Quick Start

### Frontend

```bash
cd reeldna
npm install
npm run dev      # localhost:5173
npm run build    # dist/ for Netlify
```

Set backend URL:
```bash
VITE_API_URL=https://your-backend.onrender.com npm run build
```

### Backend (local)

```bash
cd reeldna/backend
pip install -r requirements.txt
# Requires ffmpeg on system
export OPENAI_API_KEY=sk-...  # optional fallback
./start.sh
```

### Backend (Docker)

```bash
cd reeldna/backend
docker build -t reeldna-backend .
docker run -p 8000:8000 -e OPENAI_API_KEY=sk-... reeldna-backend
```

## Deploy

### Frontend → Netlify

1. Build with your backend URL:
```bash
VITE_API_URL=https://reeldna-backend.onrender.com npm run build
```
2. Drag `dist/` folder to Netlify deploy.

### Backend → Render.com

1. Push `reeldna/backend/` to a GitHub repo.
2. In Render.com → **New Web Service** → connect your repo.
3. Select **Docker** as environment.
4. Set environment variables:
   - `PORT` = `8000` (Render auto-sets this)
   - `OPENAI_API_KEY` = `sk-...` (optional, for fallback)
5. Deploy. Render auto-builds from `Dockerfile`.

### Backend → Railway (alternative)

Same steps as Render, but connect Railway to the repo.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check + transcription engine status |
| POST | `/api/analyze-url` | Extract + transcribe from URL |
| POST | `/api/analyze-text` | Echo text for manual analysis |

## Fallback Behavior

If URL extraction fails, frontend automatically shows manual text input. No user login required. No Instagram API required.

## Supported Platforms

- Instagram Reels (public)
- TikTok (public)
- YouTube Shorts (public)

## Limitations

- Private accounts / geo-blocked content will fail → fallback to manual
- Muted videos / no speech → fallback to manual
- Very long reels (>3 min) may timeout on free tier → fallback to manual
- OpenAI API fallback only works if `OPENAI_API_KEY` is set

## License

MIT
