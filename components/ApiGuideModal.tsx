"use client";

import React from "react";
import { X, CheckCircle, HelpCircle, ExternalLink, Sparkles } from "lucide-react";

interface ApiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiGuideModal({ isOpen, onClose }: ApiGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-2xl flex flex-col gap-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl">
                Google Nano Banana 2 API Guide
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Saree Virtual Try-On powered by Replicate & Nano Banana 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Section */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                How Google Nano Banana 2 Works
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-200 text-amber-900 rounded-full">
                Multimodal Image-to-Image
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs font-medium">
              Google Nano Banana 2 (Gemini Image Generation Engine) on Replicate takes:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-xs space-y-1 pl-1 font-medium">
              <li><strong>Reference Image 1:</strong> The person or model photo.</li>
              <li><strong>Reference Image 2:</strong> The saree style or garment texture photo.</li>
              <li><strong>Prompt Instruction:</strong> <code>Apply the saree with clear texture and border over person. Keep it consistant.</code></li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Setup Instructions
            </h3>
            <ol className="list-decimal list-inside text-slate-700 text-xs space-y-1.5 font-medium">
              <li>Obtain your API token from Replicate (begins with <code>r8_...</code>).</li>
              <li>Click <strong>API Setup</strong> in the top header bar and paste your key.</li>
              <li>Or save it as <code>REPLICATE_API_TOKEN</code> in your <code>.env.local</code> file.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <a
            href="https://replicate.com/google/nano-banana-2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-semibold"
          >
            <span>View google/nano-banana-2 on Replicate</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
