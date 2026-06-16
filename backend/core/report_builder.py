from typing import Any


def build_report(transcript: str, caption: str = "", title: str = "", platform: str = "") -> dict:
    """
    Build a minimal report envelope.
    The frontend runs the actual heuristic analyzer client-side.
    This just returns the raw transcript and metadata.
    """
    return {
        "transcript": transcript,
        "caption": caption,
        "title": title,
        "platform": platform,
    }
