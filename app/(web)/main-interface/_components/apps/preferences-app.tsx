"use client";
import { useState } from "react";
import { useTheme } from "@/app/shared/hooks/use-theme";

type Section = "os-version" | "theme" | "language";

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: "os-version", label: "OS Version" },
  { id: "theme", label: "Theme Mode" },
  { id: "language", label: "Language" },
];

const THEMES: {
  id: "default" | "matrix" | "light";
  label: string;
  preview: string;
}[] = [
  { id: "default", label: "Dark Theme", preview: "#10151c" },
  { id: "matrix", label: "Matrix Theme", preview: "#05080a" },
  { id: "light", label: "Light Theme", preview: "#f4f7f8" },
];

const LANGUAGES: { id: string; label: string }[] = [
  { id: "en", label: "English" },
  { id: "th", label: "Thai" },
];

function OsVersionSection() {
  return (
    <div className="p-5 text-[13px] space-y-5 overflow-y-auto custom-scrollbar h-full">
      {/* Header */}
      <div
        className="pb-4"
        style={{ borderBottom: "1px solid var(--os-border)", color: "var(--os-text)" }}
      >
        <div className="font-bold text-sm">Portfolio OS</div>
        <div className="mt-1 opacity-80">Version 2.4.0 (Build 2024.Alpha)</div>
        <div className="mt-0.5 opacity-60">
          © 2024 Khwanchai Nontawichit. All rights reserved.
        </div>
      </div>

      {/* Device Specs */}
      <div className="space-y-1.5" style={{ color: "var(--os-text)" }}>
        <div className="opacity-70 font-medium mb-1">Device Specifications</div>
        {[
          ["Device Name", "Portfolio Master Unit"],
          ["Developer", "Khwanchai (Khwan)"],
          ["Main Stack", "Flutter · React · Next.js"],
          ["Efficiency", "High-Performance Coding"],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="opacity-60 w-28 shrink-0">{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* OS Specs */}
      <div className="space-y-1.5" style={{ color: "var(--os-text)" }}>
        <div className="opacity-70 font-medium mb-1">System Specifications</div>
        {[
          ["Edition", "Portfolio Pro Edition"],
          ["Experience", "3+ Years of Professional Dev"],
          ["Install Date", "10/24/2024"],
          ["OS Build", "22631.3447"],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="opacity-60 w-28 shrink-0">{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        className="pt-4 flex gap-2 flex-wrap"
        style={{ borderTop: "1px solid var(--os-border)" }}
      >
        {["Check for Updates", "View License", "Copy Specs"].map((label) => (
          <button
            key={label}
            className="px-3 py-1.5 text-[11px] font-medium rounded-md transition-opacity hover:opacity-100 opacity-80 cursor-pointer"
            style={{
              border: "1px solid var(--os-border-strong)",
              color: "var(--os-text)",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemeSection() {
  const { theme, changeTheme } = useTheme();

  return (
    <div className="p-5 space-y-2 overflow-y-auto custom-scrollbar h-full">
      {THEMES.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group"
            style={{
              background: isActive ? "var(--os-accent-container)" : "var(--os-surface-3)",
              border: isActive ? "1px solid transparent" : "1px solid var(--os-border)",
            }}
            onClick={() => changeTheme(t.id)}
          >
            <div className="flex items-center gap-3">
              {/* Color swatch */}
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{
                  background: t.preview,
                  border: "1px solid var(--os-border-strong)",
                }}
              />
              <span
                className="text-[13px]"
                style={{ color: isActive ? "var(--os-on-accent-container)" : "var(--os-text)" }}
              >
                {t.label}
              </span>
            </div>
            {isActive && (
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--os-on-accent-container)" }}
              >
                Active
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LanguageSection() {
  const [lang, setLang] = useState("en");

  return (
    <div className="p-5 space-y-2 overflow-y-auto custom-scrollbar h-full">
      {LANGUAGES.map((l) => {
        const isActive = lang === l.id;
        return (
          <button
            key={l.id}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              background: isActive ? "var(--os-accent-container)" : "var(--os-surface-3)",
              border: isActive ? "1px solid transparent" : "1px solid var(--os-border)",
            }}
            onClick={() => setLang(l.id)}
          >
            <span
              className="text-[13px]"
              style={{ color: isActive ? "var(--os-on-accent-container)" : "var(--os-text)" }}
            >
              {l.label}
            </span>
            {isActive && (
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--os-on-accent-container)" }}
              >
                Active
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function PreferencesApp() {
  const [active, setActive] = useState<Section>("os-version");

  return (
    <div
      className="h-full flex"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Sidebar Nav */}
      <div
        className="shrink-0 flex flex-col py-2"
        style={{
          width: 160,
          borderRight: "1px solid var(--os-border)",
          background: "var(--os-header)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className="mx-2 px-3 py-2.5 text-[13px] text-left rounded-md transition-all duration-200 cursor-pointer"
              style={{
                color: isActive ? "var(--os-on-accent-container)" : "var(--os-text-dim)",
                background: isActive ? "var(--os-accent-container)" : "transparent",
                fontWeight: isActive ? 500 : 400,
              }}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Content Panel */}
      <div className="flex-1 overflow-hidden">
        {active === "os-version" && <OsVersionSection />}
        {active === "theme" && <ThemeSection />}
        {active === "language" && <LanguageSection />}
      </div>
    </div>
  );
}
