"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { PersonUploader } from "@/components/PersonUploader";
import { SareeUploader } from "@/components/SareeUploader";
import { TryOnViewer } from "@/components/TryOnViewer";
import { ApiGuideModal } from "@/components/ApiGuideModal";
import { ApiSettingsModal } from "@/components/ApiSettingsModal";
import { DEFAULT_PROMPT } from "@/lib/presets";
import { User, Sliders, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  // Image Upload states
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [personAspectRatio, setPersonAspectRatio] = useState<string | null>(null);
  const [sareeImage, setSareeImage] = useState<string | null>(null);

  // Model & Generation parameters (black-forest-labs/flux-schnell is default for lowest cost)
  const [selectedModel, setSelectedModel] = useState<string>("black-forest-labs/flux-schnell");
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [aspectRatio, setAspectRatio] = useState<string>("match_input_image");
  const [resolution, setResolution] = useState<string>("1K");

  // Output & API states
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

  // Modals & Navigation
  const [isApiGuideOpen, setIsApiGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"upload" | "canvas">("upload");

  const handleUploadPerson = (
    url: string,
    _w?: number,
    _h?: number,
    closestRatio?: string
  ) => {
    setPersonImage(url);
    if (closestRatio) {
      setPersonAspectRatio(closestRatio);
    }
    setResultImage(null);
    setError(null);
  };

  const handleClearPerson = () => {
    setPersonImage(null);
    setPersonAspectRatio(null);
    setResultImage(null);
  };

  const handleUploadSaree = (url: string) => {
    setSareeImage(url);
    setResultImage(null);
    setError(null);
  };

  const handleClearSaree = () => {
    setSareeImage(null);
    setResultImage(null);
  };

  const handleGenerateTryOn = async () => {
    if (!personImage) {
      setError("Please upload a Person Reference Image first.");
      return;
    }

    if (!sareeImage) {
      setError("Please upload a Saree Style Reference Image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Auto-switch to canvas view on mobile
    setMobileTab("canvas");

    try {
      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImage,
          sareeImage,
          prompt,
          model: selectedModel,
          aspect_ratio: aspectRatio,
          personAspectRatio,
          resolution,
          apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate virtual saree try-on.");
      }

      if (data.resultImage) {
        setResultImage(data.resultImage);
      } else {
        throw new Error("No image output received from AI provider.");
      }
    } catch (err: any) {
      console.error("Virtual Try-On Error:", err);
      setError(err?.message || "Generation error. Please check your Replicate API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const providerDisplayName =
    selectedModel === "google/nano-banana-2"
      ? "Google Nano Banana 2"
      : "FLUX SCHNELL (~$0.003 / img)";

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50/50 text-slate-900 selection:bg-amber-400 selection:text-slate-900">
      {/* Header */}
      <Header
        onOpenApiGuide={() => setIsApiGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 px-3 py-2 sticky top-[57px] z-30">
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMobileTab("upload")}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === "upload"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Upload Images</span>
          </button>

          <button
            onClick={() => setMobileTab("canvas")}
            className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === "canvas"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Canvas Output</span>
          </button>
        </div>
      </div>

      {/* Main Content Studio Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Uploaders */}
        <div
          className={`md:col-span-5 flex flex-col gap-5 ${
            mobileTab === "upload" ? "block" : "hidden md:flex"
          }`}
        >
          {/* Section 1: Upload Person */}
          <PersonUploader
            personImage={personImage}
            onUpload={handleUploadPerson}
            onClear={handleClearPerson}
          />

          {/* Section 2: Upload Saree */}
          <SareeUploader
            sareeImage={sareeImage}
            onUpload={handleUploadSaree}
            onClear={handleClearSaree}
          />

          {/* Quick Mobile Generate Button */}
          {personImage && sareeImage && (
            <div className="md:hidden pt-2">
              <button
                onClick={handleGenerateTryOn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate Try-On</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Virtual Try-On Canvas */}
        <div
          className={`md:col-span-7 h-full min-h-[500px] ${
            mobileTab === "canvas" ? "block" : "hidden md:block"
          }`}
        >
          <TryOnViewer
            personImage={personImage}
            sareeImage={sareeImage}
            resultImage={resultImage}
            prompt={prompt}
            onPromptChange={setPrompt}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            resolution={resolution}
            onResolutionChange={setResolution}
            isLoading={isLoading}
            onGenerateTryOn={handleGenerateTryOn}
            providerName={providerDisplayName}
            error={error}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <p>© {new Date().getFullYear()} SareeStudio AI — Powered by FLUX SCHNELL & Replicate</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiGuideOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              API Info
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Configure Replicate Key
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiGuideModal
        isOpen={isApiGuideOpen}
        onClose={() => setIsApiGuideOpen(false)}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveSettings={(newKey) => setApiKey(newKey)}
      />
    </div>
  );
}
