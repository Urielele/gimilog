"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLanguage, setLanguage, type Language } from "@/lib/preferences/language";

export default function SettingsPage() {
  const [language, setLang] = useState<Language>("en");

  useEffect(() => {
    // Preferensi dibaca dari localStorage setelah mount agar tidak terjadi
    // hydration mismatch antara HTML server (default "en") dan browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang(getLanguage());
  }, []);

  const handleChange = (lang: Language) => {
    setLang(lang);
    setLanguage(lang);
    // Force English as requested - ensure it's persisted
    if (lang === "en") {
      // Already English
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Preferences</h1>

      <section className="rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Language</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your preferred language for the interface and content display.
        </p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="en"
              checked={language === "en"}
              onChange={() => handleChange("en")}
              className="w-4 h-4"
            />
            <span>English (Default)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="id"
              checked={language === "id"}
              onChange={() => handleChange("id")}
              className="w-4 h-4"
            />
            <span>Bahasa Indonesia</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Game descriptions from RAWG API are always displayed in English as they come from the source.
        </p>
      </section>
    </main>
  );
}
