"use client";

import {
  ResourceEntry,
  COLUMN_LABELS,
  SELECT_FIELDS,
  TEXTAREA_FIELDS,
} from "@/lib/schema";

interface FieldInputProps {
  field: keyof ResourceEntry;
  value: string | number;
  onChange: (field: keyof ResourceEntry, value: string | number) => void;
}

export default function FieldInput({ field, value, onChange }: FieldInputProps) {
  const label = COLUMN_LABELS[field];
  const selectOptions = SELECT_FIELDS[field];
  const isTextarea = TEXTAREA_FIELDS.includes(field);
  const isReadOnly = field === "resource_id";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const newValue =
      field === "years_experience" ? Number(e.target.value) || 0 : e.target.value;
    onChange(field, newValue);
  };

  const baseClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy";

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      {selectOptions ? (
        <select
          value={String(value)}
          onChange={handleChange}
          className={`${baseClass} bg-white`}
        >
          <option value="">—</option>
          {selectOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : isTextarea ? (
        <textarea
          value={String(value)}
          onChange={handleChange}
          rows={3}
          className={`${baseClass} resize-y`}
        />
      ) : (
        <input
          type={field === "years_experience" ? "number" : "text"}
          value={String(value)}
          onChange={handleChange}
          readOnly={isReadOnly}
          placeholder={isReadOnly ? "Auto-assigned on paste" : ""}
          className={`${baseClass} ${isReadOnly ? "bg-gray-50 text-gray-400" : ""}`}
        />
      )}
    </div>
  );
}
