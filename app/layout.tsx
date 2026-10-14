import type { Metadata, Viewport } from "next";
import {
  JetBrains_Mono,
  Noto_Sans_Thai,
  Pixelify_Sans,
  Roboto,
  VT323,
} from "next/font/google";
import { SETTINGS_BOOTSTRAP } from "@/app/shared/settings/settings";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8bd75",
};

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

/** The system voice: desktop labels, taskbar, title bars, terminal. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

/** The pixel voice: every piece of chrome — labels, title bars, menus, headings. */
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Pixel terminal face for the boot screen only (see `.boot-shell`). */
const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

/**
 * Thai has no glyphs in Roboto, so it is loaded alongside rather than instead:
 * both stacks in `globals.css` end in this face, and the browser falls through
 * to it per glyph. Latin keeps Roboto's metrics whichever language is set, and
 * nothing about the type has to know what the language is.
 */
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  weight: ["400", "500", "700", "900"],
});

const TITLE = "Portfolio OS — Khwanchai Nontawichit";
const DESCRIPTION =
  "An interactive desktop operating system built as a portfolio. Window manager, virtual filesystem, terminal, and more — by Khwan, Mobile Developer (Flutter).";

/** Explicit icon metadata keeps both browser and home-screen icons in public/assets. */
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
  icons: {
    icon: { url: "/assets/icon-valley.webp", type: "image/webp", sizes: "64x64" },
    apple: { url: "/assets/apple-icon-valley.jpg", type: "image/jpeg", sizes: "180x180" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/assets/logo-valley.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/assets/logo-valley.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The bootstrap script below writes `lang` and `data-motion`
    // before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SETTINGS_BOOTSTRAP }} />
      </head>
      <body
        className={`${roboto.variable} ${jetbrainsMono.variable} ${pixelify.variable} ${vt323.variable} ${notoSansThai.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
