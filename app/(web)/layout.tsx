"use client";
import { MotionConfig } from "framer-motion";
import { useSetting } from "@/app/shared/settings/use-setting";

/**
 * The motion preference, handed to Framer once for the whole shell.
 *
 * CSS covers transitions and keyframes on its own — see `[data-motion="reduced"]`
 * in globals.css — but everything the window manager moves is a spring, and a
 * spring is JavaScript. This is the one switch that reaches all of them.
 *
 * `always`/`never` rather than Framer's own `user`: the preference already has
 * the machine's answer folded into it, and a visitor who asked for full motion
 * on a device set to reduce it has said the last word on the subject.
 */
export default function WebLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { value: motion } = useSetting("motion");

  return (
    <MotionConfig reducedMotion={motion === "reduced" ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
