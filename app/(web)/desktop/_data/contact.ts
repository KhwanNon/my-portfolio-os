import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

/**
 * Reaching out is the one thing a visitor might come here to *do*, and it used
 * to live three folders down inside About — which is where an action goes to be
 * missed. So it stands on its own and takes a dock slot.
 *
 * It moved rather than being copied: About no longer carries a contact file,
 * because two ways in to the same three links is the same door twice and one of
 * them would eventually drift.
 *
 * Named without an extension, unlike the `.ui` files it used to sit beside. The
 * suffix is how this file system says "a thing to read"; a slot in the dock is
 * a thing to launch, and it is titled the way the other launchers are.
 */
export const contactApp: FileNode = uiNode(
  { id: "contact", name: "Contact", icon: ICONS.contact },
  "ContactUI",
  {
    links: [
      {
        label: "Email",
        value: "khwan.nontawichit@gmail.com",
        href: "mailto:khwan.nontawichit@gmail.com",
      },
      {
        label: "GitHub",
        value: "github.com/KhwanNon",
        href: "https://github.com/KhwanNon",
      },
      {
        label: "Location",
        value: "Bangkok, Thailand",
        href: "https://maps.google.com/?q=Bangkok,Thailand",
      },
    ],
  },
);
