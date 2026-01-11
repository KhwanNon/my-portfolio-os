import { ThemeSwitcher } from "./presentation/components/components/theme-switcher";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ThemeSwitcher />
        <div className="bg-os-surface border border-os-accent/30 rounded-lg overflow-hidden">
          <div className="bg-os-header px-4 py-1 flex justify-between">
            <span className="text-xs">terminal.exe</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-os-accent/50" />
              <div className="w-2 h-2 rounded-full bg-os-accent" />
            </div>
          </div>
          <div className="p-4 font-os-mono glow-text">{">"} SYSTEM READY_</div>
        </div>
      </main>
    </div>
  );
}
