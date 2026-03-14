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
  { id: "default", label: "Dark Theme", preview: "#182035" },
  { id: "matrix", label: "Matrix Theme", preview: "#020502" },
  { id: "light", label: "Light Theme", preview: "#f0f2f5" },
];

const LANGUAGES: { id: string; label: string }[] = [
  { id: "en", label: "English" },
  { id: "th", label: "Thai" },
];

function OsVersionSection() {
  return (
    <div className="p-5 text-xs font-os-mono space-y-4 overflow-y-auto custom-scrollbar h-full">
      {/* Header */}
      <div
        className="pb-3"
        style={{ borderBottom: "1px solid rgba(82,211,214,0.15)" }}
      >
        <div className="opacity-30 mb-2" style={{ color: "var(--os-accent)" }}>
          ──────────────────────────────────────────────────────
        </div>
        <div style={{ color: "var(--os-accent)" }}>[ ICON ] Portfolio OS</div>
        <div className="ml-7 opacity-80" style={{ color: "var(--os-accent)" }}>
          Version 2.4.0 (Build 2024.Alpha)
        </div>
        <div className="ml-7 opacity-60" style={{ color: "var(--os-accent)" }}>
          © 2024 Khwanchai Nontawichit. All rights reserved.
        </div>
        <div className="opacity-30 mt-2" style={{ color: "var(--os-accent)" }}>
          ──────────────────────────────────────────────────────
        </div>
      </div>

      {/* Device Specs */}
      <div className="space-y-1">
        <div className="opacity-70" style={{ color: "var(--os-accent)" }}>
          Device Specifications:
        </div>
        <div className="opacity-30" style={{ color: "var(--os-accent)" }}>
          ──────────────────────────────────────────
        </div>
        {[
          ["Device Name", "PORTFOLIO-MASTER-UNIT"],
          ["Developer", "Khwanchai (Khwan)"],
          ["Main Stack", "Flutter · React · Next.js"],
          ["Efficiency", "High-Performance Coding"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex gap-3"
            style={{ color: "var(--os-accent)" }}
          >
            <span className="opacity-60 w-28 shrink-0">{k}:</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* OS Specs */}
      <div className="space-y-1">
        <div className="opacity-70" style={{ color: "var(--os-accent)" }}>
          Windows Specifications:
        </div>
        <div className="opacity-30" style={{ color: "var(--os-accent)" }}>
          ──────────────────────────────────────────
        </div>
        {[
          ["Edition", "Portfolio Pro Edition"],
          ["Experience", "3+ Years of Professional Dev"],
          ["Install Date", "10/24/2024"],
          ["OS Build", "22631.3447"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex gap-3"
            style={{ color: "var(--os-accent)" }}
          >
            <span className="opacity-60 w-28 shrink-0">{k}:</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        className="pt-3 flex gap-3 flex-wrap"
        style={{ borderTop: "1px solid rgba(82,211,214,0.15)" }}
      >
        {["Check for Updates", "View License", "Copy Specs"].map((label) => (
          <button
            key={label}
            className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-opacity hover:opacity-100 opacity-60 cursor-pointer"
            style={{
              border: "1px solid rgba(82,211,214,0.3)",
              color: "var(--os-accent)",
            }}
          >
            [ {label} ]
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
            className="w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-200 cursor-pointer group"
            style={{
              background: isActive
                ? "rgba(82,211,214,0.1)"
                : "rgba(82,211,214,0.03)",
              border: isActive
                ? "1px solid rgba(82,211,214,0.4)"
                : "1px solid rgba(82,211,214,0.1)",
            }}
            onClick={() => changeTheme(t.id)}
          >
            <div className="flex items-center gap-3">
              {/* Color swatch */}
              <div
                className="w-4 h-4 rounded-sm shrink-0"
                style={{
                  background: t.preview,
                  border: "1px solid rgba(82,211,214,0.3)",
                }}
              />
              <span
                className="text-xs tracking-widest"
                style={{ color: "var(--os-accent)" }}
              >
                {t.label}
              </span>
            </div>
            {isActive && (
              <span
                className="text-[10px] tracking-widest"
                style={{ color: "#e8a21a" }}
              >
                active now
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
            className="w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-200 cursor-pointer"
            style={{
              background: isActive
                ? "rgba(82,211,214,0.1)"
                : "rgba(82,211,214,0.03)",
              border: isActive
                ? "1px solid rgba(82,211,214,0.4)"
                : "1px solid rgba(82,211,214,0.1)",
            }}
            onClick={() => setLang(l.id)}
          >
            <span
              className="text-xs tracking-widest"
              style={{ color: "var(--os-accent)" }}
            >
              {l.label}
            </span>
            {isActive && (
              <span
                className="text-[10px] tracking-widest"
                style={{ color: "#e8a21a" }}
              >
                active now
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
      className="h-full flex font-os-mono"
      style={{ background: "var(--os-surface)" }}
    >
      {/* Sidebar Nav */}
      <div
        className="shrink-0 flex flex-col"
        style={{
          width: 160,
          borderRight: "1px solid rgba(82,211,214,0.2)",
          background: "var(--os-header)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className="px-4 py-4 text-xs text-left tracking-widest transition-all duration-200 cursor-pointer"
              style={{
                color: "var(--os-accent)",
                background: isActive ? "rgba(82,211,214,0.15)" : "transparent",
                borderLeft: isActive
                  ? "2px solid var(--os-accent)"
                  : "2px solid transparent",
                opacity: isActive ? 1 : 0.6,
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
