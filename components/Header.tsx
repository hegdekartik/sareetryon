"use client";

import React from "react";
import { Sparkles, Key, BookOpen } from "lucide-react";

interface HeaderProps {
  onOpenApiGuide: () => void;
  onOpenSettings: () => void;
}

export function Header({ onOpenApiGuide, onOpenSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Saree<span className="gold-text-gradient">Studio</span>
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                Nano Banana 2
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden xs:block font-medium">
              Powered by Google Nano Banana 2 on Replicate
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Model Badge */}
          <button
            onClick={onOpenSettings}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Replicate API Ready</span>
          </button>

          {/* API Guide Button */}
          <button
            onClick={onOpenApiGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">API Info</span>
          </button>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-sm"
            title="Configure Replicate API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">API Setup</span>
          </button>
        </div>
      </div>
    </header>
  );
}
