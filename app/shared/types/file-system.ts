export type FileType = "txt" | "pdf" | "link" | "slide" | "ui" | "folder" | "program";

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  iconPath?: string;
  data?: FileData;
}

export type FileData =
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

export interface LinkFileData {
  kind: "link";
  url: string;
}

export interface SlideFileData {
  kind: "slide";
  images: Array<{ src: string; caption?: string }>;
  title?: string;
}

export interface UiFileData {
  kind: "ui";
  component: string;
}

export interface FolderData {
  kind: "folder";
  children: FileNode[];
}

export interface ProgramData {
  kind: "program";
  component: string;
}
