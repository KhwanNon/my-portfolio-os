"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  // Every arrival boots. Nothing is remembered between visits — the sequence is
  // the way in, not a first-run greeting.
  useEffect(() => {
    router.replace("/boot");
  }, [router]);

  // The paper the boot screen is about to land on, in whichever theme is set —
  // so the redirect passes through a held frame rather than a flash of another
  // colour. No `boot-shell` here: that class is the rain's ramp, and there is
  // no rain on a screen that exists for one tick.
  return <div className="bg-os-bg h-screen w-full" />;
}
