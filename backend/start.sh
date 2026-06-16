#!/bin/bash
# Local dev start for ReelDNA backend
# Requires: Python 3.11+, ffmpeg, yt-dlp

pip install -r requirements.txt
uvicorn app:app --reload --port 8000
