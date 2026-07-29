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

  return <div className="bg-black h-screen w-full" />;
}
