import React, { useState, useCallback } from 'react';
import { X, ImagePlus, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxFiles?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange, maxFiles = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setError('');
    
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (newFiles.length === 0) {
      setError('Only image files are allowed (JPG, PNG, WebP)');
      return;
    }
    
    const combined = [...images, ...newFiles];
    if (combined.length > maxFiles) {
      setError(`Maximum ${maxFiles} images. You already have ${images.length}.`);
      return;
    }
    
    onImagesChange(combined);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [images]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const previews = images.map(f => URL.createObjectURL(f));

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((_img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-dark/40">
              <img src={previews[i]} alt={`upload-${i}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] text-white/60 bg-black/50 px-1 rounded">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {images.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-cyan-glow bg-cyan-glow/5'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="image-upload"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <ImagePlus className="w-8 h-8 text-slate-500" />
            <div className="text-sm text-slate-300 font-medium">
              Drop screenshots here or click to upload
            </div>
            <div className="text-xs text-slate-500">
              JPG, PNG, WebP · Up to {maxFiles} images · First frame, mid, CTA, end
            </div>
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
};
