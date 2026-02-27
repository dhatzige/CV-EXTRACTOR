"use client";

import { useState } from "react";
import { ResourceEntry } from "@/lib/schema";
import { toTSV } from "@/lib/exportTSV";
import { generateExcelRow } from "@/lib/exportExcel";

interface CopyBarProps {
  data: ResourceEntry;
  onReset: () => void;
}

export default function CopyBar({ data, onReset }: CopyBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyTSV = async () => {
    const tsv = toTSV(data);
    await navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadExcel = async () => {
    const blob = await generateExcelRow(data);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (data.full_name || "resource").replace(/\s+/g, "_");
    a.download = `${safeName}_Resource_Entry.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {data.full_name || "Extracted Data"}
          </p>
          <p className="text-xs text-gray-500">
            {data.job_title_role || "Review and edit fields below"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTSV}
            className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
          <button
            onClick={handleDownloadExcel}
            className="rounded-lg border border-brand-navy px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5"
          >
            Download Excel
          </button>
          <button
            onClick={onReset}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  );
}
