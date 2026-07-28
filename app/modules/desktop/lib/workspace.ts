/**
 * The box a window is allowed to occupy.
 *
 * The rail sits in the flow, so the workspace element already excludes it and
 * there is nothing to subtract — it is measured rather than derived from
 * constants, so it stays true whatever the chrome around it does.
 */
export function workspaceBox(): { width: number; height: number } {
  const box = document.querySelector("[data-workspace]")?.getBoundingClientRect();
  return {
    width: box?.width ?? window.innerWidth,
    height: box?.height ?? window.innerHeight,
  };
}
