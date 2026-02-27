"use client";

import { useState } from "react";
import { ResourceEntry } from "@/lib/schema";
import FieldInput from "./FieldInput";

interface CategorySectionProps {
  name: string;
  fields: (keyof ResourceEntry)[];
  data: ResourceEntry;
  onChange: (field: keyof ResourceEntry, value: string | number) => void;
}

export default function CategorySection({
  name,
  fields,
  data,
  onChange,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-brand-navy px-4 py-2.5 text-left text-sm font-semibold text-white transition-colors hover:bg-brand-navy-light"
      >
        <span>{name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="grid gap-4 bg-white p-4 sm:grid-cols-2">
          {fields.map((field) => (
            <FieldInput
              key={field}
              field={field}
              value={data[field]}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
