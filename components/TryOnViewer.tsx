"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Maximize2,
  Columns,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquareText,
  Settings2,
  Image as ImageIcon,
  Cpu
} from "lucide-react";
import { ASPECT_RATIOS, RESOLUTION_OPTIONS, MODEL_OPTIONS } from "@/lib/presets";

interface TryOnViewerProps {
  personImage: string | null;
  sareeImage: string | null;
  resultImage: string | null;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  aspectRatio: string;
  onAspectRatioChange: (aspectRatio: string) => void;
  resolution: string;
  onResolutionChange: (resolution: string) => void;
  isLoading: boolean;
  onGenerateTryOn: () => void;
  providerName?: string;
  error?: string | null;
}

export function TryOnViewer({
  personImage,
  sareeImage,
  resultImage,
  prompt,
  onPromptChange,
  selectedModel,
  onModelChange,
  aspectRatio,
  onAspectRatioChange,
  resolution,
  onResolutionChange,
  isLoading,
  onGenerateTryOn,
  providerName = "IDM-VTON",
  error,
}: TryOnViewerProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"slider" | "split" | "result">("result");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const isInputsReady = Boolean(personImage && sareeImage);

  // Auto-switch to result view mode when a new result arrives
  useEffect(() => {
    if (resultImage) {
      setViewMode("result");
    }
  }, [resultImage]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `saree-tryon-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col gap-5 h-full">
      {/* Top Header & View Modes */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              Virtual Try-On Canvas
            </h2>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
              {providerName}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {resultImage
              ? "Generation complete! View output or select another model below."
              : "Upload both reference images to generate virtual saree fit."}
          </p>
        </div>

        {/* View Mode Switcher */}
        {resultImage && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("result")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "result"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Result Only</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "split"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode("slider")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "slider"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Before / After</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-center gap-3 text-rose-800 text-xs shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Settings & Model Selector Box */}
      <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-3.5 flex flex-col gap-3">
        {/* Model Selection Header */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>AI Try-On Model</span>
          </label>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showAdvancedSettings ? "Hide Options" : "More Options"}</span>
          </button>
        </div>

        {/* Model Dropdown Selector */}
        <div className="grid grid-cols-1 gap-2">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-2xs"
          >
            {MODEL_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label} — {opt.costLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt & Advanced Settings */}
        {showAdvancedSettings && (
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-200">
            {selectedModel === "google/nano-banana-2" && (
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <MessageSquareText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Prompt Instruction (Gemini Multimodal)</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder="Enter prompt instructions for Nano Banana..."
                  rows={2}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => onAspectRatioChange(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  {ASPECT_RATIOS.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Resolution Output
                </label>
                <select
                  value={resolution}
                  onChange={(e) => onResolutionChange(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  {RESOLUTION_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Display Canvas */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
        {isLoading ? (
          /* Animated Loading State */
          <div className="flex flex-col items-center justify-center p-8 gap-4 text-center z-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="font-bold text-white text-base">
                Running Virtual Try-On...
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs font-medium animate-pulse">
                Warping saree pattern, border embellishments & pallu details onto persona
              </p>
            </div>
            <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 via-amber-400 to-purple-500 h-full w-full animate-pulse"></div>
            </div>
          </div>
        ) : resultImage ? (
          viewMode === "split" ? (
            /* Split View */
            <div className="grid grid-cols-3 w-full h-full gap-2 p-2 bg-slate-950">
              <div className="relative h-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                <img
                  src={personImage || ""}
                  alt="Original Person"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-950/80 text-[10px] text-white font-medium rounded border border-slate-700">
                  Person
                </span>
              </div>
              <div className="relative h-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                <img
                  src={sareeImage || ""}
                  alt="Saree Style"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-950/80 text-[10px] text-white font-medium rounded border border-slate-700">
                  Saree Style
                </span>
              </div>
              <div className="relative h-full rounded-lg overflow-hidden border border-emerald-500/40 bg-slate-900 flex items-center justify-center">
                <img
                  src={resultImage}
                  alt="AI Try-On Result"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-emerald-500 text-[10px] text-slate-950 font-bold rounded">
                  AI Output
                </span>
              </div>
            </div>
          ) : viewMode === "slider" && personImage ? (
            /* Interactive Slider */
            <div
              ref={containerRef}
              onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e.clientX);
              }}
              onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e.touches[0].clientX);
              }}
              className="relative w-full h-full select-none cursor-ew-resize overflow-hidden bg-slate-950"
            >
              <img
                src={resultImage}
                alt="AI Try-On Output"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-[11px] font-bold text-slate-950 rounded-md shadow-sm z-10">
                AI Saree Fit
              </span>

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={personImage}
                  alt="Original Person Reference"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    width: containerRef.current?.clientWidth || "100%",
                    maxWidth: "none",
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-800/90 text-[11px] font-semibold text-white rounded-md border border-slate-700 shadow-sm z-10">
                  Original Person
                </span>
              </div>

              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-lg flex items-center justify-center text-white">
                  <Sliders className="w-3.5 h-3.5 rotate-90" />
                </div>
              </div>
            </div>
          ) : (
            /* Result Only View */
            <div className="relative w-full h-full bg-slate-950 flex items-center justify-center p-2">
              <img
                src={resultImage}
                alt="AI Try-On Output"
                className="w-full h-full object-contain max-h-[500px] rounded-lg"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500/90 text-slate-950 text-xs font-bold rounded-md shadow-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Generated Output</span>
              </span>
            </div>
          )
        ) : (
          /* Empty / Initial Canvas Prompt */
          <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mb-1">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">
              Ready for Virtual Try-On
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Upload both the Person Reference Image and Saree Style Image on the left, then click Generate.
            </p>
          </div>
        )}
      </div>

      {/* Action CTA Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          onClick={onGenerateTryOn}
          disabled={isLoading || !isInputsReady}
          className={`flex-1 min-w-[200px] py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] ${
            isInputsReady && !isLoading
              ? "bg-slate-900 hover:bg-slate-800 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Generating Try-On...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                {!isInputsReady
                  ? "Upload Both Images to Generate"
                  : resultImage
                  ? "Re-Generate Saree Fit"
                  : "Generate Virtual Try-On"}
              </span>
            </>
          )}
        </button>

        {resultImage && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="py-3.5 px-4 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Download Generated Output"
            >
              <Download className="w-4 h-4 text-amber-700" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="py-3.5 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer shadow-xs transition-colors"
              title="Fullscreen Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isFullscreen && resultImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-4 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-slate-900 hover:text-slate-950 p-2.5 rounded-full bg-white text-xs font-bold px-4 shadow-xl cursor-pointer"
          >
            ✕ Close Preview
          </button>
          <img
            src={resultImage}
            alt="AI Saree Output HD"
            className="max-w-full max-h-[88vh] object-contain rounded-xl bg-slate-900 shadow-2xl p-2"
          />
        </div>
      )}
    </div>
  );
}
