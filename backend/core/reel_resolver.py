import os
import subprocess
import tempfile
import json
from pathlib import Path


def resolve_reel(url: str) -> dict:
    """
    Use yt-dlp to extract metadata, description, and optionally download audio.
    Returns dict with info or raises exception on failure.
    """
    # Step 1: extract info with yt-dlp
    info_cmd = [
        "yt-dlp",
        "--dump-json",
        "--no-download",
        "--skip-download",
        "--no-playlist",
        "--quiet",
        url,
    ]
    try:
        result = subprocess.run(
            info_cmd,
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode != 0 or not result.stdout:
            raise RuntimeError(f"yt-dlp info failed: {result.stderr}")
        info = json.loads(result.stdout.strip().splitlines()[0])
    except Exception as e:
        raise RuntimeError(f"Failed to extract reel info: {str(e)}")

    # Extract description / caption
    caption = info.get("description", "") or ""
    title = info.get("title", "") or ""
    duration = info.get("duration", 0)
    uploader = info.get("uploader", "") or ""

    return {
        "caption": caption,
        "title": title,
        "duration": duration,
        "uploader": uploader,
        "info": info,
    }


def download_audio(url: str, output_dir: str) -> str:
    """
    Download audio from URL using yt-dlp, extract to mp3 with ffmpeg.
    Returns path to mp3 file.
    """
    base_path = os.path.join(output_dir, "audio")
    # Download best audio
    cmd = [
        "yt-dlp",
        "-f", "bestaudio/best",
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "0",
        "--no-playlist",
        "--quiet",
        "--no-warnings",
        "-o", f"{base_path}.%(ext)s",
        url,
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=120)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Audio download failed: {e.stderr}")

    # Find the downloaded mp3
    mp3_path = f"{base_path}.mp3"
    if not os.path.exists(mp3_path):
        # sometimes yt-dlp keeps original ext and ffmpeg converts
        for f in os.listdir(output_dir):
            if f.startswith("audio."):
                src = os.path.join(output_dir, f)
                # Convert to mp3 with ffmpeg
                mp3_path = f"{base_path}.mp3"
                ffmpeg_cmd = [
                    "ffmpeg", "-y", "-i", src, "-vn", "-ar", "16000", "-ac", "1", "-b:a", "32k", mp3_path
                ]
                subprocess.run(ffmpeg_cmd, check=True, capture_output=True, text=True, timeout=60)
                break
    if not os.path.exists(mp3_path):
        raise RuntimeError("Audio file not found after download")
    return mp3_path
