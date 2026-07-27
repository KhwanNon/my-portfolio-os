/**
 * The box a window is allowed to occupy.
 *
 * Both chrome bars sit in the flow, so the workspace element already excludes
 * them and there is nothing to subtract — it is measured rather than derived
 * from constants, so it stays true whatever the chrome around it does.
 */
export function workspaceBox(): { width: number; height: number } {
  const box = document.querySelector("[data-workspace]")?.getBoundingClientRect();
  return {
    width: box?.width ?? window.innerWidth,
    height: box?.height ?? window.innerHeight,
  };
}

/**
 * The height of one chrome bar. Overlays anchored to the viewport rather than
 * to the workspace need it to stay clear of the dock.
 */
export function barHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--os-bar-h",
  );
  return parseFloat(raw) || 0;
}
