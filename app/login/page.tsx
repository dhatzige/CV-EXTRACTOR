"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Incorrect passphrase");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold tracking-tight text-[#243B60]">
            CV EXTRACTOR
          </h1>
          <p className="mt-1 text-sm text-gray-500">CV Extractor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="passphrase"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase"
              autoFocus
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#243B60] focus:outline-none focus:ring-1 focus:ring-[#243B60]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !passphrase}
            className="w-full rounded-lg bg-[#243B60] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d4a78] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Internal tool — Example Consultancy
        </p>
      </div>
    </div>
  );
}
