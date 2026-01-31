// src/components/boot/boot-footer.tsx
import { FC } from "react";
import { motion } from "framer-motion";

interface BootFooterProps {
  isComplete: boolean;
}

export const BootFooter: FC<BootFooterProps> = () => (
  <footer className="w-full relative z-20">
    <div className="flex justify-between items-end text-[9px] md:text-[11px] p-6 opacity-60 tracking-widest">
      <div className="flex gap-8">
        <aside>
          <p className="opacity-40 uppercase text-[8px]">Local_IP</p>
          <p className="font-bold">192.168.1.XXX</p>
        </aside>
        <aside>
          <p className="opacity-40 uppercase text-[8px]">Bitrate</p>
          <p className="font-bold uppercase">128 Gbps</p>
        </aside>
      </div>
      <aside className="text-right">
        <p className="opacity-40 uppercase text-[8px]">Encryption</p>
        <p className="font-bold uppercase">AES_X_2048</p>
      </aside>
    </div>

    <div className="relative w-full h-1 bg-os-surface/30 overflow-hidden">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "linear" }}
        className="h-full bg-os-accent shadow-[0_0_15px_#52D3D6]"
      />
    </div>
  </footer>
);
