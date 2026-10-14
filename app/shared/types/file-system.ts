type FileType = "txt" | "pdf" | "link" | "slide" | "ui" | "folder" | "program";

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  /** Key into the FileGraphic icon registry (e.g. "folder", "txt", "sysCmd"). */
  icon?: string;
  /** The one node to open first. Folders inherit the mark — see `leadsToFeatured`. */
  featured?: boolean;
  data?: FileData;
}

type FileData =
  | TxtFileData
  | PdfFileData
  | LinkFileData
  | SlideFileData
  | UiFileData
  | FolderData
  | ProgramData;

export interface TxtFileData {
  kind: "txt";
  content: string;
}

export interface PdfFileData {
  kind: "pdf";
  url: string;
  filename?: string;
}

interface LinkFileData {
  kind: "link";
  url: string;
}

export interface SlideFileData {
  kind: "slide";
  images: Array<{ src: string; caption?: string }>;
  title?: string;
}

interface UiFileData {
  kind: "ui";
  component: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
}

interface FolderData {
  kind: "folder";
  children: FileNode[];
}

interface ProgramData {
  kind: "program";
  component: string;
}
