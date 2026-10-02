// src/components/boot/boot-footer.tsx
import { FC } from "react";

interface BootFooterProps {
  isComplete: boolean;
}

export const BootFooter: FC<BootFooterProps> = () => (
  <footer className="w-full relative z-20">
    <div className="flex justify-between items-end text-sm md:text-lg p-6 text-os-text-dim tracking-widest">
      <div className="flex gap-8">
        <aside>
          <p className="font-os-pixel text-os-text-subtle uppercase text-[11px] md:text-sm">
            <span aria-hidden className="mr-1 inline-block size-1.5 bg-os-text-subtle" />
            Local_IP
          </p>
          <p>192.168.1.XXX</p>
        </aside>
        <aside>
          <p className="font-os-pixel text-os-text-subtle uppercase text-[11px] md:text-sm">
            <span aria-hidden className="mr-1 inline-block size-1.5 bg-os-text-subtle" />
            Bitrate
          </p>
          <p className="uppercase">128 Gbps</p>
        </aside>
      </div>
      <aside className="text-right">
        <p className="font-os-pixel text-os-text-subtle uppercase text-[11px] md:text-sm">
          Encryption
          <span aria-hidden className="ml-1 inline-block size-1.5 bg-os-text-subtle" />
        </p>
        <p className="uppercase">AES_X_2048</p>
      </aside>
    </div>

  </footer>
);
