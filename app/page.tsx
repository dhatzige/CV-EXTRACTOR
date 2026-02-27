"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import CVUploader from "@/components/CVUploader";
import ExtractionForm from "@/components/ExtractionForm";
import { ResourceEntry } from "@/lib/schema";

type AppState = "upload" | "loading" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("upload");
  const [data, setData] = useState<ResourceEntry | null>(null);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFileSelected = useCallback(async (file: File) => {
    setState("loading");
    setFileName(file.name);
    setError("");

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Extraction failed");
      }

      setData(result.data);
      setState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setState("error");
    }
  }, []);

  const handleFieldChange = useCallback(
    (field: keyof ResourceEntry, value: string | number) => {
      setData((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const handleReset = useCallback(() => {
    setState("upload");
    setData(null);
    setError("");
    setFileName("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Upload State */}
      {state === "upload" && (
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              Resource Pool Extractor
            </h2>
            <p className="text-gray-500">
              Upload a candidate CV to automatically extract data for your
              Resource Pool Tracker
            </p>
          </div>
          <CVUploader onFileSelected={handleFileSelected} isLoading={false} />
        </main>
      )}

      {/* Loading State */}
      {state === "loading" && (
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-navy" />
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              Extracting candidate data...
            </h2>
            <p className="text-sm text-gray-500">{fileName}</p>
            <p className="mt-1 text-xs text-gray-400">
              This typically takes 3-6 seconds
            </p>
          </div>

          {/* Skeleton form preview */}
          <div className="mt-10 space-y-3">
            {[
              "Personal Details",
              "Contact & Location",
              "Skills & Experience",
            ].map((name) => (
              <div
                key={name}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                <div className="bg-brand-navy/20 px-4 py-2.5">
                  <div className="h-4 w-32 animate-pulse rounded bg-brand-navy/30" />
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="mb-1 h-3 w-20 animate-pulse rounded bg-gray-200" />
                      <div className="h-9 w-full animate-pulse rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Results State */}
      {state === "results" && data && (
        <ExtractionForm
          data={data}
          onChange={handleFieldChange}
          onReset={handleReset}
        />
      )}

      {/* Error State */}
      {state === "error" && (
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-red-800">
              Extraction Failed
            </h2>
            <p className="mb-6 text-sm text-red-600">{error}</p>
            <button
              onClick={handleReset}
              className="rounded-lg bg-brand-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light"
            >
              Try Again
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
