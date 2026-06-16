from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os

from core.url_validator import validate_url
from core.reel_resolver import resolve_reel, download_audio
from core.transcriber import transcribe_audio
from core.report_builder import build_report

app = FastAPI(title="ReelDNA Backend", version="2.0.0")

# Allow frontend origins (Netlify, Render, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeUrlRequest(BaseModel):
    url: str


class AnalyzeUrlResponse(BaseModel):
    status: str
    source: str
    message: str | None = None
    transcript: str | None = None
    caption: str | None = None
    title: str | None = None
    platform: str | None = None
    report: dict | None = None


class AnalyzeTextRequest(BaseModel):
    text: str


@app.get("/api/health")
def health():
    openai_ready = bool(os.environ.get("OPENAI_API_KEY"))
    return {
        "status": "ok",
        "version": "2.0.0",
        "transcription": {
            "faster_whisper": "ready",
            "openai_api_fallback": "ready" if openai_ready else "no_api_key",
        },
    }


@app.post("/api/analyze-url", response_model=AnalyzeUrlResponse)
def analyze_url(req: AnalyzeUrlRequest):
    validation = validate_url(req.url)
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["reason"])

    platform = validation["platform"]

    # 1. Try to extract metadata + caption
    try:
        info = resolve_reel(req.url)
    except Exception as e:
        return AnalyzeUrlResponse(
            status="NEEDS_MANUAL_TEXT",
            source="url",
            message=f"Could not extract this Reel. {str(e)}",
            platform=platform,
        )

    caption = info.get("caption", "")
    title = info.get("title", "")
    transcript = ""

    # 2. If caption is good enough, return it as transcript
    if caption and len(caption) > 30:
        transcript = caption
    else:
        # 3. Try audio download + transcription
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                audio_path = download_audio(req.url, tmpdir)
                transcript = transcribe_audio(audio_path)
        except Exception as e:
            # If audio fails but we have caption, still return caption
            if caption:
                transcript = caption
            else:
                return AnalyzeUrlResponse(
                    status="NEEDS_MANUAL_TEXT",
                    source="url",
                    message=f"Could not extract audio or caption. {str(e)}",
                    platform=platform,
                )

    report = build_report(transcript, caption, title, platform)

    return AnalyzeUrlResponse(
        status="DONE",
        source="url",
        transcript=transcript,
        caption=caption,
        title=title,
        platform=platform,
        report=report,
    )


@app.post("/api/analyze-text")
def analyze_text(req: AnalyzeTextRequest):
    # Frontend handles analysis; backend just echoes back or validates
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Empty text")
    return {
        "status": "DONE",
        "source": "text",
        "transcript": req.text.strip(),
        "report": build_report(req.text.strip(), "", "", "manual"),
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
