"use client";

const STORAGE_KEY = "gimilog_language";

export type Language = "en" | "id";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") return stored;
  } catch {}
  return "en";
}

export function setLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
}

export function getDefaultLanguage(): Language {
  return "en";
}
