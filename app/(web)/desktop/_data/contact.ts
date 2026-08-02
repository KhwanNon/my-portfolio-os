import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

/**
 * Reaching out is the one thing a visitor might come here to *do*, and it used
 * to live three folders down inside About — which is where an action goes to be
 * missed. So it stands on its own and takes a dock slot, and it is the only copy
 * of these links anywhere in the tree: two ways in to the same address is the
 * same door twice, and one of them would eventually drift.
 *
 * Named without an extension, unlike the `.ui` files it used to sit beside. The
 * suffix is how this file system says "a thing to read"; a slot in the dock is
 * a thing to launch, and it is titled the way the other launchers are.
 *
 * Only the row labels take a translation. An address and a handle are what they
 * are in any language, and a translated one would simply be wrong.
 *
 * Ordered by how directly a row answers "how do I reach you" — the two that
 * ring a person first, then the places the work can be read, then where the
 * person is. Every row is a link a visitor can act on rather than copy by eye.
 */
export function contactApp(L: Localize): FileNode {
  return uiNode(
    { id: "contact", name: "Contact", icon: ICONS.contact },
    "ContactUI",
    {
      links: [
        {
          label: L("Email", "อีเมล"),
          value: "khwan.nontawichit@gmail.com",
          href: "mailto:khwan.nontawichit@gmail.com",
        },
        {
          // Written the way it is read aloud here, dialled the way a phone
          // needs it: `tel:` takes digits and a country code, nothing else.
          label: L("Phone", "โทรศัพท์"),
          value: "+66 642-565-976",
          href: "tel:+66642565976",
        },
        {
          label: L("GitHub", "GitHub"),
          value: "github.com/KhwanNon",
          href: "https://github.com/KhwanNon",
        },
        {
          label: L("LinkedIn", "LinkedIn"),
          value: "linkedin.com/in/khwan-hajin-x",
          href: "https://linkedin.com/in/khwan-hajin-x",
        },
        {
          label: L("Website", "เว็บไซต์"),
          value: "my-portfolio-os-omega.vercel.app",
          href: "https://my-portfolio-os-omega.vercel.app",
        },
        {
          label: L("Location", "ที่อยู่"),
          value: L("Nonthaburi, Thailand", "นนทบุรี ประเทศไทย"),
          href: "https://maps.google.com/?q=Nonthaburi,Thailand",
        },
      ],
    },
  );
}
