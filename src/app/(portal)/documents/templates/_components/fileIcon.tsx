import {
  faCompassDrafting,
  faFile,
  faFileExcel,
  faFileLines,
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ICONS: Record<string, { icon: typeof faFile; className: string }> = {
  word: { icon: faFileWord, className: "bg-blue-50 text-blue-700" },
  excel: { icon: faFileExcel, className: "bg-green-50 text-green-700" },
  powerpoint: { icon: faFilePowerpoint, className: "bg-orange-50 text-orange-600" },
  pdf: { icon: faFilePdf, className: "bg-red-50 text-red-600" },
  drawing: { icon: faCompassDrafting, className: "bg-slate-100 text-slate-600" },
  text: { icon: faFileLines, className: "bg-gray-100 text-gray-600" },
  other: { icon: faFile, className: "bg-gray-100 text-gray-500" },
};

const KIND: Record<string, keyof typeof ICONS> = {
  doc: "word",
  docx: "word",
  dot: "word",
  dotx: "word",
  rtf: "word",
  odt: "word",
  xls: "excel",
  xlsx: "excel",
  xlsm: "excel",
  xltx: "excel",
  ppt: "powerpoint",
  pptx: "powerpoint",
  potx: "powerpoint",
  pdf: "pdf",
  dwg: "drawing",
  dxf: "drawing",
  vsd: "drawing",
  vsdx: "drawing",
  txt: "text",
};

const FileIcon = ({ ext, size = "md" }: { ext: string; size?: "sm" | "md" }) => {
  const { icon, className } = ICONS[KIND[ext?.toLowerCase()] || "other"];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg ${className} ${
        size === "sm" ? "h-8 w-8" : "h-11 w-11"
      }`}
    >
      <FontAwesomeIcon icon={icon} className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </span>
  );
};

export default FileIcon;
