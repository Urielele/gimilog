"use client";

import { useEffect, useState } from "react";
import {
  getLanguage,
  setLanguage,
  type Language,
} from "@/lib/preferences/language";
import {
  Card,
  Container,
  PageShell,
  SectionHeading,
  TextLink,
} from "@/components/gm";

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
  };

  return (
    <PageShell>
      <Container className="py-12">
        <TextLink href="/" className="inline-flex h-11 items-center">
          ← Back to home
        </TextLink>

        <h1 className="mt-6 text-2xl leading-[1.25] font-semibold text-ink">
          Preferences
        </h1>

        <Card className="mt-6 p-6">
          <SectionHeading>Language</SectionHeading>
          <p className="mt-2 text-base leading-[1.5] text-muted">
            Choose your preferred language for the interface and content
            display.
          </p>

          <div className="mt-4 flex flex-col">
            <label className="flex h-11 cursor-pointer items-center gap-2 text-base text-ink">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === "en"}
                onChange={() => handleChange("en")}
                className="size-4"
              />
              <span>English (Default)</span>
            </label>
            <label className="flex h-11 cursor-pointer items-center gap-2 text-base text-ink">
              <input
                type="radio"
                name="language"
                value="id"
                checked={language === "id"}
                onChange={() => handleChange("id")}
                className="size-4"
              />
              <span>Bahasa Indonesia</span>
            </label>
          </div>

          <p className="mt-4 text-xs leading-[1.5] text-muted">
            Game descriptions from RAWG API are always displayed in English as
            they come from the source.
          </p>
        </Card>
      </Container>
    </PageShell>
  );
}
