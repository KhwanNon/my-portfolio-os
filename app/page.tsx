"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markBooted, wantsBootSequence } from "@/app/shared/state/boot-session";

export default function Root() {
  const router = useRouter();

  // Every arrival boots, unless the visitor has already said otherwise in
  // Preferences. Nothing is remembered between visits about the sequence having
  // *run* — it is the way in, not a first-run greeting — only about whether it
  // is wanted at all.
  useEffect(() => {
    if (wantsBootSequence()) {
      router.replace("/boot");
      return;
    }
    // Nothing to come through, so the desktop is told the machine is already up.
    markBooted();
    router.replace("/desktop");
  }, [router]);

  // The paper the boot screen is about to land on, in whichever theme is set —
  // so the redirect passes through a held frame rather than a flash of another
  // colour. No `boot-shell` here: that class is the rain's ramp, and there is
  // no rain on a screen that exists for one tick.
  return <div className="bg-os-bg h-screen w-full" />;
}
