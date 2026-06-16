import os
import requests
from typing import Optional

# Cache the faster-whisper model globally to avoid reloading on every request
_faster_model = None

def _load_faster_model():
    global _faster_model
    if _faster_model is not None:
        return _faster_model
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise RuntimeError("faster-whisper not installed.")
    # Use 'cpu' with int8 quantization for speed on free tier
    _faster_model = WhisperModel("base", device="cpu", compute_type="int8")
    return _faster_model


def transcribe_with_faster_whisper(audio_path: str) -> str:
    """Transcribe using faster-whisper (CTranslate2). Much faster on CPU."""
    model = _load_faster_model()
    segments, _ = model.transcribe(audio_path, language="en", beam_size=5, vad_filter=True)
    text = " ".join([segment.text for segment in segments])
    return text.strip()


def transcribe_with_openai_api(audio_path: str) -> str:
    """Fallback to OpenAI Whisper API if faster-whisper fails or is too slow."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set. Cannot fallback to OpenAI API.")
    url = "https://api.openai.com/v1/audio/transcriptions"
    headers = {"Authorization": f"Bearer {api_key}"}
    with open(audio_path, "rb") as f:
        files = {"file": (os.path.basename(audio_path), f, "audio/mpeg")}
        data = {"model": "whisper-1", "language": "en"}
        response = requests.post(url, headers=headers, files=files, data=data, timeout=120)
    if response.status_code != 200:
        raise RuntimeError(f"OpenAI API error: {response.status_code} {response.text}")
    return response.json().get("text", "").strip()


def transcribe_audio(audio_path: str) -> str:
    """
    Try faster-whisper first. If that fails, fallback to OpenAI API.
    If both fail, raise RuntimeError.
    """
    errors = []

    # Try faster-whisper first
    try:
        return transcribe_with_faster_whisper(audio_path)
    except Exception as e:
        errors.append(f"faster-whisper failed: {e}")

    # Fallback to OpenAI API
    if os.environ.get("OPENAI_API_KEY"):
        try:
            return transcribe_with_openai_api(audio_path)
        except Exception as e:
            errors.append(f"OpenAI API failed: {e}")

    raise RuntimeError("Transcription failed. " + " | ".join(errors))
