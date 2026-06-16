const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export type PipelineStatus =
  | 'IDLE'
  | 'VALIDATING_URL'
  | 'EXTRACTING_MEDIA'
  | 'TRANSCRIBING'
  | 'ANALYZING'
  | 'DONE'
  | 'NEEDS_MANUAL_TEXT'
  | 'ERROR';

export interface AnalyzeUrlResponse {
  status: 'DONE' | 'NEEDS_MANUAL_TEXT' | 'ERROR';
  source: string;
  message?: string;
  transcript?: string;
  caption?: string;
  title?: string;
  platform?: string;
  report?: Record<string, any>;
}

export async function analyzeUrl(url: string): Promise<AnalyzeUrlResponse> {
  const res = await fetch(`${API_BASE}/api/analyze-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function analyzeVisual(caption: string, images: File[], platform: string = 'instagram'): Promise<{ visual_report: any; transcript: string }> {
  const formData = new FormData();
  formData.append('caption', caption);
  formData.append('platform', platform);
  images.forEach(img => formData.append('images', img));

  const res = await fetch(`${API_BASE}/api/analyze-visual`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}
