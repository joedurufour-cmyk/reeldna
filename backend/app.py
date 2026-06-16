from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
import shutil

from core.url_validator import validate_url
from core.reel_resolver import resolve_reel, download_audio
from core.transcriber import transcribe_audio
from core.report_builder import build_report
from core.vision_analyzer import analyze_images

app = FastAPI(title="ReelDNA Backend", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "version": "2.1.0",
        "features": {
            "text_analysis": True,
            "url_extraction": True,
            "vision_analysis": openai_ready,
        },
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

    try:
        info = resolve_reel(req.url)
    except Exception:
        return AnalyzeUrlResponse(
            status="NEEDS_MANUAL_TEXT",
            source="url",
            message="Instagram blocks cloud extraction. The text you need is already visible below the video on the Instagram page — just select it, copy it, and paste it in the text box below.",
            platform=platform,
        )

    caption = info.get("caption", "")
    title = info.get("title", "")
    transcript = ""

    if caption and len(caption) > 30:
        transcript = caption
    else:
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                audio_path = download_audio(req.url, tmpdir)
                transcript = transcribe_audio(audio_path)
        except Exception:
            if caption:
                transcript = caption
            else:
                return AnalyzeUrlResponse(
                    status="NEEDS_MANUAL_TEXT",
                    source="url",
                    message="Could not download this video. Copy the caption text you see below the video on Instagram and paste it in the text box below.",
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
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Empty text")
    return {
        "status": "DONE",
        "source": "text",
        "transcript": req.text.strip(),
        "report": build_report(req.text.strip(), "", "", "manual"),
    }


@app.post("/api/analyze-visual")
def analyze_visual(
    caption: str = Form(...),
    platform: str = Form("instagram"),
    images: list[UploadFile] = File(...),
):
    """
    Analyze caption + up to 5 screenshots/images using OpenAI GPT-4o mini vision.
    Returns combined text + visual analysis.
    """
    if not os.environ.get("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="Vision analysis not available. OpenAI API key not configured.")

    if len(images) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images allowed")

    if not caption.strip():
        raise HTTPException(status_code=400, detail="Caption is required")

    saved_paths = []
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            for img in images:
                if not img.content_type or not img.content_type.startswith("image/"):
                    continue
                ext = os.path.splitext(img.filename or "")[1] or ".jpg"
                path = os.path.join(tmpdir, f"img_{len(saved_paths)}{ext}")
                with open(path, "wb") as f:
                    shutil.copyfileobj(img.file, f)
                saved_paths.append(path)
            
            if not saved_paths:
                raise HTTPException(status_code=400, detail="No valid images uploaded")
            
            visual_report = analyze_images(caption, saved_paths, platform)
            
            return {
                "status": "DONE",
                "source": "visual",
                "transcript": caption,
                "report": {
                    "transcript": caption,
                    "platform": platform,
                },
                "visual_report": visual_report,
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
