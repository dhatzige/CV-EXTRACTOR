"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface CVUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export default function CVUploader({
  onFileSelected,
  isLoading,
}: CVUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${
        isDragActive
          ? "border-brand-navy bg-brand-navy/5"
          : "border-gray-300 hover:border-brand-navy/50 hover:bg-gray-50"
      } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy/10">
        <svg
          className="h-8 w-8 text-brand-navy"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-gray-800">
        {isDragActive ? "Drop CV here" : "Upload a CV"}
      </h2>
      <p className="text-sm text-gray-500">
        Drag & drop a PDF or DOCX file, or click to browse
      </p>
      <p className="mt-1 text-xs text-gray-400">Maximum file size: 10MB</p>
    </div>
  );
}
