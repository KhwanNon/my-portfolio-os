"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    router.push("/boot-screen");
  }, [router]);

  return <div className="bg-black h-screen w-full" />;
}
