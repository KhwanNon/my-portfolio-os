import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

export const downloadFolder: FileNode = {
  id: "download",
  name: "Download",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "download-resume",
        name: "resume.pdf",
        type: "pdf",
        icon: ICONS.pdf,
        data: {
          kind: "pdf",
          url: "/assets/resume.pdf",
          filename: "Khwanchai_Resume.pdf",
        },
      },
    ],
  },
};
