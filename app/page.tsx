"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/app/shared/constants/storage";

export default function Root() {
  const router = useRouter();

  // First visit gets the boot sequence; returning visitors go straight to the desktop.
  useEffect(() => {
    const hasBooted = localStorage.getItem(STORAGE_KEYS.hasBooted);
    router.replace(hasBooted ? "/main-interface" : "/boot");
  }, [router]);

  return <div className="bg-black h-screen w-full" />;
}
