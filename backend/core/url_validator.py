import re
from urllib.parse import urlparse

INSTAGRAM_REEL_PATTERN = re.compile(
    r'^https?://(www\.)?instagram\.com/reels?/[A-Za-z0-9_-]+/?.*$'
)
INSTAGRAM_SHARE_PATTERN = re.compile(
    r'^https?://(www\.)?instagram\.com/share/reel/[A-Za-z0-9_-]+/?.*$'
)
TIKTOK_PATTERN = re.compile(
    r'^https?://(www\.)?tiktok\.com/.+/(video|photo)/\d+.*$'
)
YOUTUBE_SHORTS_PATTERN = re.compile(
    r'^https?://(www\.)?youtube\.com/shorts/[A-Za-z0-9_-]+.*$'
)

VALID_DOMAINS = {
    'instagram.com',
    'tiktok.com',
    'youtube.com',
    'www.instagram.com',
    'www.tiktok.com',
    'www.youtube.com',
}


def validate_url(url: str) -> dict:
    """Validate a social media URL and return normalized info."""
    if not url or not isinstance(url, str):
        return {"valid": False, "reason": "Empty URL", "platform": None}

    parsed = urlparse(url.strip())
    if not parsed.scheme or not parsed.netloc:
        return {"valid": False, "reason": "Invalid URL format", "platform": None}

    if parsed.netloc not in VALID_DOMAINS:
        return {"valid": False, "reason": "Unsupported platform", "platform": None}

    if INSTAGRAM_REEL_PATTERN.match(url) or INSTAGRAM_SHARE_PATTERN.match(url):
        return {"valid": True, "reason": None, "platform": "instagram"}
    if TIKTOK_PATTERN.match(url):
        return {"valid": True, "reason": None, "platform": "tiktok"}
    if YOUTUBE_SHORTS_PATTERN.match(url):
        return {"valid": True, "reason": None, "platform": "youtube"}

    return {"valid": False, "reason": "URL is not a recognized Reel / Short / TikTok format", "platform": None}
