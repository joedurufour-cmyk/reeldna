import os
from typing import Optional
import base64
from pathlib import Path

def _encode_image(image_path: str) -> str:
    """Encode image to base64 for OpenAI API."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def analyze_images(caption: str, image_paths: list[str], platform: str = "instagram") -> dict:
    """
    Analyze up to 5 screenshots using OpenAI GPT-4o mini vision.
    Returns visual analysis: hook, CTA, format, emotion, composition, colors.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not configured. Vision analysis unavailable.")
    
    try:
        import openai
    except ImportError:
        raise RuntimeError("openai package not installed.")
    
    client = openai.OpenAI(api_key=api_key)
    
    # Build content with images
    content = [
        {
            "type": "text",
            "text": f"""You are a viral content analyst. Analyze the following {platform} content and provide a structured visual analysis.

Caption / Transcript:
---
{caption}
---

Analyze the images/screenshots and return ONLY a JSON object with these exact fields:
{{
  "visualHook": "string - what visual element stops the scroll in the first 1 second",
  "visualCTA": "string - any visual call-to-action (arrows, buttons, text overlays asking to follow/save/click)",
  "format": "string - talking head, greenscreen, B-roll, screen recording, carousel, text-on-image, meme, etc.",
  "composition": "string - layout description: close-up, split-screen, single subject, busy background, etc.",
  "colorMood": "string - dominant colors and emotional tone they convey",
  "facialExpression": "string - if human faces visible, describe the emotion shown (shock, pain, excitement, authority, etc.)",
  "editingPace": "string - inferred from text/screenshots: fast cuts, slow, static, transitions, etc.",
  "textOverlay": "string - any text visible ON the video/image (not caption), and its style/size/color",
  "brandConsistency": "string - consistent colors, fonts, framing, or random each time?",
  "visualDNA": {{
    "scrollStop": "number 0-10",
    "clarity": "number 0-10",
    "emotionalImpact": "number 0-10",
    "professionalism": "number 0-10",
    "authenticity": "number 0-10",
    "shareability": "number 0-10"
  }}
}}

Be concise. One sentence per field. Scores are 0-10. Return ONLY the JSON."""
        }
    ]
    
    for img_path in image_paths[:5]:
        ext = Path(img_path).suffix.lower().replace(".", "")
        if ext in ("jpg", "jpeg"):
            ext = "jpeg"
        elif ext == "png":
            ext = "png"
        else:
            ext = "jpeg"
        
        b64 = _encode_image(img_path)
        content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/{ext};base64,{b64}",
                "detail": "low"
            }
        })
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": content
            }
        ],
        max_tokens=800,
        temperature=0.3,
    )
    
    raw = response.choices[0].message.content.strip()
    
    # Extract JSON from markdown code block if present
    import json, re
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].split("```")[0].strip()
    
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: try to extract JSON from text
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise RuntimeError(f"OpenAI returned non-JSON: {raw[:200]}")
