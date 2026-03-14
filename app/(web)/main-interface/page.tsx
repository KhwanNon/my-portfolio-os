"use client";
import { motion } from "framer-motion";
import { Taskbar } from "./_components/taskbar";
import { DesktopIcon } from "./_components/desktop-icon";
import { DesktopSection } from "./_components/desktop-section";
import { WindowFrame } from "./_components/window/window-frame";
import { FileRenderer } from "./_components/file-renderer";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/app/modules/desktop/context/window-manager-context";
import { desktopFileSystem, desktopSections } from "./_data/file-system-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function Desktop() {
  const { windows } = useWindowManager();
  const fileMap = Object.fromEntries(desktopFileSystem.map((f) => [f.id, f]));

  return (
    <div className="relative h-screen w-full bg-os-bg text-os-accent font-os-mono overflow-hidden flex flex-col">
      {/* Desktop icon sections */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex-1 flex flex-col overflow-y-auto custom-scrollbar pt-4 min-h-0"
      >
        {desktopSections.map((section) => (
          <motion.div
            key={section.title}
            variants={itemVariants}
            className="flex-1 flex flex-col min-h-0"
          >
            <DesktopSection title={section.title} variant={section.variant}>
              {section.ids.map((id) => {
                const node = fileMap[id];
                return node ? <DesktopIcon key={id} fileNode={node} /> : null;
              })}
            </DesktopSection>
          </motion.div>
        ))}
      </motion.main>

      {/* Windows — rendered directly inside the relative root so absolute positions are correct */}
      {windows.map((win) => (
        <WindowFrame key={win.id} window={win}>
          <FileRenderer fileNode={win.fileNode} />
        </WindowFrame>
      ))}

      {/* Taskbar */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-40"
      >
        <Taskbar />
      </motion.div>
    </div>
  );
}

export default function MainInterfaceScreen() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}
