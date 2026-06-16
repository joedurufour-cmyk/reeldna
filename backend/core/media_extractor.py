import os
import subprocess


def extract_audio_with_ffmpeg(video_path: str, output_path: str) -> str:
    """Extract audio from video to mp3 using ffmpeg."""
    cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vn", "-ar", "16000", "-ac", "1", "-b:a", "32k",
        output_path,
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=60)
    return output_path
