"use client";
import { motion } from "framer-motion";
import { Taskbar } from "./_components/taskbar";
import { DesktopIcon } from "./_components/desktop-icon";
import { DesktopSection } from "./_components/desktop-section";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function MainInterfaceScreen() {
  return (
    <div className="relative h-screen w-full bg-os-bg text-os-accent font-os-mono overflow-hidden flex flex-col">
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex-1 flex flex-col overflow-y-auto custom-scrollbar pt-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col min-h-0"
        >
          <DesktopSection title="Directories">
            <DesktopIcon
              label="C-DRIVE"
              iconPath="/assets/images/c-drive.png"
            />
            <DesktopIcon
              label="Recycle Bin"
              iconPath="/assets/images/recycle-bin.png"
            />
          </DesktopSection>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col min-h-0"
        >
          <DesktopSection title="Assets">
            <DesktopIcon
              label="Profile.txt"
              iconPath="/assets/images/file-txt.png"
            />
          </DesktopSection>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col min-h-0"
        >
          <DesktopSection title="Executables" variant="active">
            <DesktopIcon
              label="System Command"
              iconPath="/assets/images/system-command.png"
            />
            <DesktopIcon
              label="Preferences"
              iconPath="/assets/images/preferences.png"
            />
          </DesktopSection>
        </motion.div>
      </motion.main>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-30"
      >
        <Taskbar />
      </motion.div>
    </div>
  );
}
