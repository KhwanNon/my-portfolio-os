// src/app/main/_components/desktop-section.tsx
interface DesktopSectionProps {
  title: string;
  children: React.ReactNode;
  variant?: "default" | "active";
}

export const DesktopSection = ({
  title,
  children,
  variant = "default",
}: DesktopSectionProps) => {
  const themeColor =
    variant === "active" ? "var(--os-accent)" : "var(--os-header)";
  const textColor = "var(--os-accent)";

  return (
    <div
      style={{ borderBottomColor: themeColor }}
      className="flex flex-1 w-full border-b min-h-50 transition-colors duration-300"
    >
      <div
        style={{
          width: "30px",
          backgroundColor: "var(--os-header)",
          borderRightColor: themeColor,
        }}
        className="border-r flex items-center justify-center shrink-0 pt-6 pb-6 transition-colors duration-300"
      >
        <span
          style={{
            writingMode: "vertical-lr",
            color: textColor,
            transform: "rotate(180deg)",
          }}
          className="text-[10px] tracking-[0.4em] font-bold whitespace-nowrap normal-case mb-4"
        >
          {title}
        </span>
      </div>

      <div className="flex flex-wrap items-start content-start overflow-x-auto">
        {children}
      </div>
    </div>
  );
};
