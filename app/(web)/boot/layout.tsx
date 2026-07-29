import type { Metadata } from "next";

// The boot sequence is transient screen state, not a destination — nothing
// here should outrank /desktop in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
