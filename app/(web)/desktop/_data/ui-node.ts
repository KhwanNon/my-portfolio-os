import type { FileNode } from "@/app/shared/types/file-system";
import type {
  UiComponentName,
  UiComponentProps,
} from "../_components/apps/ui-registry";
import { ICONS } from "./icons";

/**
 * Build a UI FileNode whose `props` are checked against the chosen `component`.
 * The compiler rejects an unknown component name, a misspelled prop, or a wrong
 * prop shape — so authoring portfolio data is guided by autocomplete and can't
 * silently render a blank panel.
 */
export function uiNode<K extends UiComponentName>(
  base: { id: string; name: string; icon?: string; featured?: boolean },
  component: K,
  props: UiComponentProps<K>,
): FileNode {
  return {
    id: base.id,
    name: base.name,
    type: "ui",
    icon: base.icon ?? ICONS.ui,
    featured: base.featured,
    // Cast at this trusted seam: `props` is already checked against `component`
    // above; `FileData.props` is deliberately loose for the generic renderer.
    data: { kind: "ui", component, props: props as Record<string, unknown> },
  };
}
