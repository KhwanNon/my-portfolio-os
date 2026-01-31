"use client";
import { useEffect, useRef } from "react";

interface MatrixRainProps {
  /** Canvas opacity (0 to 1). Default is 0.5. */
  opacity?: number;
  /** Global speed factor for the falling animation. Default is 1. */
  speedMultiplier?: number;
  /** Multiplier for character stream density. Higher values create more columns. Default is 1. */
  density?: number;
}

/**
 * MatrixRain - A high-performance canvas-based binary rain background.
 * Adapts dynamically to CSS variables (--os-bg, --os-accent) for theme-aware rendering.
 */
export const MatrixRain = ({
  opacity = 0.5,
  speedMultiplier = 1,
  density = 1,
}: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /** Sync canvas dimensions with the browser viewport */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 18;
    // Calculate total columns based on screen width and requested density
    const columns = Math.floor((canvas.width / fontSize) * density);

    // Initialize vertical positions (drops) with random negative offsets for staggered entry
    const drops: number[] = Array(columns)
      .fill(0)
      .map(() => Math.random() * -100);

    // Assign randomized velocities to each column to simulate independent data streams
    const speeds: number[] = Array(columns)
      .fill(0)
      .map(() => (Math.random() * 0.8 + 0.9) * speedMultiplier);

    const draw = () => {
      // Fetch dynamic theme colors from the DOM root to support runtime theme switching
      const bgColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--os-bg")
          .trim() || "#000";
      const accentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--os-accent")
          .trim() || "#00ff41";

      // Apply a semi-transparent fill over the previous frame to create the "motion trail" effect
      ctx.fillStyle = `rgba(${hexToRgb(bgColor)}, 0.15)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Shuffle characters between frames for a high-speed "decryption" flicker effect
        const text = Math.random() > 0.5 ? "1" : "0";
        const x = (i * fontSize) / density;
        const y = drops[i] * fontSize;

        // Randomly highlight characters in white to simulate "head" of the data stream
        if (Math.random() > 0.99) {
          ctx.fillStyle = "#fff";
        } else {
          ctx.fillStyle = accentColor;
        }

        // Apply glow effect for a cinematic terminal aesthetic
        ctx.shadowBlur = 8;
        ctx.shadowColor = accentColor;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0; // Reset shadow for performance efficiency

        // Reset column to the top once it passes the viewport bottom, with a randomized restart
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Update vertical position based on assigned stream speed
        drops[i] += speeds[i];
      }
    };

    /** Utility: Converts hex color strings to RGB format for use in rgba() values */
    function hexToRgb(hex: string) {
      hex = hex.replace("#", "");
      if (hex.length === 3)
        hex = hex
          .split("")
          .map((s) => s + s)
          .join("");
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    }

    // High-frequency animation interval (approx. 40 FPS)
    const interval = setInterval(draw, 25);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [speedMultiplier, density]); // Re-initialize streams if global animation props change

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity: opacity }}
      className="fixed inset-0 -z-10 pointer-events-none transition-opacity duration-500"
    />
  );
};
