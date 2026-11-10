// Mirrors staff-portal-be/helpers/templateRules.js so mistakes are caught before upload.

export const ACCEPTED_EXTENSIONS = [
  "doc",
  "docx",
  "dot",
  "dotx",
  "rtf",
  "odt",
  "xls",
  "xlsx",
  "xlsm",
  "xltx",
  "ppt",
  "pptx",
  "potx",
  "pdf",
  "txt",
  "dwg",
  "dxf",
  "vsd",
  "vsdx",
];

export const MAX_UPLOAD_MB = 25;

export const extensionOf = (name: string) => name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] || "";

export const normaliseDocNumber = (value: string) => value.trim().toUpperCase().replace(/\s+/g, "");

export const isValidDocNumber = (value: string) =>
  /^[A-Z0-9]+(?:[-/][A-Z0-9]+)+$/.test(value) && value.length <= 80;

/** Returns an error message, or "" when the file is acceptable. */
export const checkFile = (file: File | null) => {
  if (!file) return "Please choose the template file.";
  const ext = extensionOf(file.name);
  if (!ACCEPTED_EXTENSIONS.includes(ext))
    return `.${ext || "?"} files are not accepted as templates.`;
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024)
    return `The file is larger than ${MAX_UPLOAD_MB} MB.`;
  return "";
};
