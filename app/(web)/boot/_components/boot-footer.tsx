// src/components/boot/boot-footer.tsx
import { FC } from "react";
import { motion } from "framer-motion";

interface BootFooterProps {
  isComplete: boolean;
}

export const BootFooter: FC<BootFooterProps> = () => (
  <footer className="w-full relative z-20">
    <div className="flex justify-between items-end text-xs md:text-base p-6 text-os-text-dim tracking-widest">
      <div className="flex gap-8">
        <aside>
          <p className="text-os-text-subtle uppercase text-[10px] md:text-sm">
            <span aria-hidden className="mr-1 inline-block size-1.5 bg-os-text-subtle" />
            Local_IP
          </p>
          <p>192.168.1.XXX</p>
        </aside>
        <aside>
          <p className="text-os-text-subtle uppercase text-[10px] md:text-sm">
            <span aria-hidden className="mr-1 inline-block size-1.5 bg-os-text-subtle" />
            Bitrate
          </p>
          <p className="uppercase">128 Gbps</p>
        </aside>
      </div>
      <aside className="text-right">
        <p className="text-os-text-subtle uppercase text-[10px] md:text-sm">
          Encryption
          <span aria-hidden className="ml-1 inline-block size-1.5 bg-os-text-subtle" />
        </p>
        <p className="uppercase">AES_X_2048</p>
      </aside>
    </div>

    {/* Hard-edged, square-ended bar: a system indicator, not a widget. */}
    <div className="relative w-full h-0.75 bg-[#062410] overflow-hidden">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 3.3, ease: "linear" }}
        className="h-full bg-os-accent shadow-[0_0_8px_rgba(57,255,106,0.7)]"
      />
    </div>
  </footer>
);
