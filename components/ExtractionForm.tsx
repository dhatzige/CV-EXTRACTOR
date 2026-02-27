"use client";

import { ResourceEntry, CATEGORIES } from "@/lib/schema";
import CategorySection from "./CategorySection";
import CopyBar from "./CopyBar";

interface ExtractionFormProps {
  data: ResourceEntry;
  onChange: (field: keyof ResourceEntry, value: string | number) => void;
  onReset: () => void;
}

export default function ExtractionForm({
  data,
  onChange,
  onReset,
}: ExtractionFormProps) {
  return (
    <div>
      <CopyBar data={data} onReset={onReset} />
      <div className="mx-auto max-w-4xl space-y-4 px-6 py-6">
        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          Review the extracted data below. All fields are editable. When ready,
          use <strong>Copy to Clipboard</strong> to paste directly into your
          Excel tracker (select cell A in the target row, then Ctrl+V).
        </div>
        {CATEGORIES.map((category) => (
          <CategorySection
            key={category.name}
            name={category.name}
            fields={category.fields as unknown as (keyof ResourceEntry)[]}
            data={data}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
