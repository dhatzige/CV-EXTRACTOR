"use client";

export default function Header() {
  return (
    <header className="bg-brand-navy text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">CV Extractor</h1>
          <p className="text-sm text-white/70">AI-powered CV parsing</p>
        </div>
        <div className="text-right text-xs text-white/50">
          Resource Pool Tool
        </div>
      </div>
    </header>
  );
}
