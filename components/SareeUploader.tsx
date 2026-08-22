"use client";

import React, { useRef, useState } from "react";
import { Shirt, Upload, X, RefreshCw, CheckCircle2 } from "lucide-react";
import { compressImage } from "@/lib/imageUtils";

interface SareeUploaderProps {
  sareeImage: string | null;
  onUpload: (imageUrl: string) => void;
  onClear: () => void;
}

export function SareeUploader({ sareeImage, onUpload, onClear }: SareeUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const rawDataUrl = e.target.result as string;
        // Compress image client-side to optimize speed and API payload cost
        const { compressedUrl } = await compressImage(rawDataUrl, 1280, 0.85);
        onUpload(compressedUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-1.5">
              <Shirt className="w-4 h-4 text-purple-600" />
              <span>Saree Style Reference</span>
            </h3>
            <p className="text-xs text-slate-500">
              Upload the saree style, fabric pattern, or border design
            </p>
          </div>
        </div>

        {sareeImage && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Uploaded
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {sareeImage ? (
        /* Preview Card */
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[3/4] flex items-center justify-center shadow-xs">
          <img
            src={sareeImage}
            alt="Uploaded Saree Style Reference"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm backdrop-blur-xs transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                onClick={onClear}
                className="py-2 px-3 bg-rose-500/90 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm backdrop-blur-xs transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[220px] ${
            isDragging
              ? "border-purple-500 bg-purple-50/50 scale-[0.99]"
              : "border-slate-300 hover:border-purple-400 bg-slate-50/60 hover:bg-purple-50/20"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Click to upload saree photo
          </p>
          <p className="text-xs text-slate-500 mt-1">
            or drag & drop your image file here
          </p>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Auto-compressed for fast generation & lower API cost
          </p>
        </div>
      )}
    </div>
  );
}
