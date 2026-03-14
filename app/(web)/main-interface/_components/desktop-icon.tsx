"use client";
import Image from "next/image"; // นำเข้าคอมโพเนนต์รูปภาพ

interface DesktopIconProps {
  label: string;
  iconPath: string; // เพิ่ม props สำหรับรับที่อยู่ไฟล์รูป
}

export const DesktopIcon = ({ label, iconPath }: DesktopIconProps) => (
  <div className="flex flex-col items-center justify-center group outline-none cursor-pointer m-4 transition-all duration-300">
    {/* กล่องใส่ไอคอน */}
    <div
      style={{
        width: "60px",
        height: "60px",
      }}
      className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-110"
    >
      {/* 1. รูปภาพไอคอนจาก Assets */}
      <Image
        src={iconPath} // เช่น "/assets/c-drive.png"
        alt={label}
        width={50}
        height={50}
        className="object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(82,211,214,0.8)]"
      />

      {/* 2. เอฟเฟกต์เรืองแสงด้านหลัง (Optional) */}
      <div className="absolute inset-0 bg-os-accent/0 group-hover:bg-os-accent/10 rounded-lg transition-all duration-300 -z-10" />
    </div>

    {/* Label (Tooltip แบบเดิมที่พี่ต้องการ) */}
    <div className="mt-2 h-4 flex items-center justify-center">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-os-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </span>
    </div>
  </div>
);
