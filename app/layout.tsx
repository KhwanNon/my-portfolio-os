import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { STORAGE_KEYS } from "@/app/shared/constants/storage";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1117" },
  ],
};

/**
 * Re-applies the saved theme before first paint. Daylight is the default, so
 * only the dark scheme needs an attribute — a returning visitor never sees a
 * flash of white before their theme lands.
 */
const THEME_BOOTSTRAP = `try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.theme,
)});if(t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio OS — Khwanchai Nontawichit",
  description:
    "An interactive desktop operating system built as a portfolio. Window manager, virtual filesystem, terminal, and more — by Khwan, Mobile Developer (Flutter).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The bootstrap script below writes `data-theme` before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
