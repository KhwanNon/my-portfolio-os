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

const TITLE = "Portfolio OS — Khwanchai Nontawichit";
const DESCRIPTION =
  "An interactive desktop operating system built as a portfolio. Window manager, virtual filesystem, terminal, and more — by Khwan, Mobile Developer (Flutter).";

/**
 * The tab and home-screen icons come from `app/icon.png` and
 * `app/apple-icon.png` by file convention — Next writes those link tags itself,
 * so the only mark named here is the one a link preview unfurls.
 */
/**
 * Where the logo resolves from when a card is unfurled. A preview is fetched by
 * something that is not this browser, so a relative path is not enough — and no
 * domain is committed to here: the host tells us at build time, and localhost is
 * only the answer when nobody has.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/assets/logo.png", width: 2000, height: 2000 }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/assets/logo.png"],
  },
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
