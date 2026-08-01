import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai, Roboto, Roboto_Mono } from "next/font/google";
import { SETTINGS_BOOTSTRAP } from "@/app/shared/settings/settings";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#182035" },
  ],
};

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
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
    // The bootstrap script below writes `data-theme`, `lang` and `data-motion`
    // before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SETTINGS_BOOTSTRAP }} />
      </head>
      <body
        className={`${roboto.variable} ${robotoMono.variable} ${notoSansThai.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
