"use client";

import { formatBytes } from "@/lib/download";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import FileIcon from "./fileIcon";
import { ACCEPTED_EXTENSIONS, MAX_UPLOAD_MB, extensionOf } from "./rules";

/** Drag-and-drop or click-to-browse file picker. */
const FileDrop = ({
  file,
  onChange,
  error,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) =>
          (event.key === "Enter" || event.key === " ") && inputRef.current?.click()
        }
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onChange(event.dataTransfer.files?.[0] || null);
        }}
        className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed px-4 py-5 transition ${
          dragging
            ? "border-brand bg-brand-50"
            : error
              ? "border-red-300 bg-red-50/40"
              : "border-gray-300 hover:border-brand/60 hover:bg-brand-50/50"
        }`}
      >
        {file ? (
          <>
            <FileIcon ext={extensionOf(file.name)} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{file.name}</span>
              <span className="text-xs text-gray-500">
                {formatBytes(file.size)} - click to change
              </span>
            </span>
          </>
        ) : (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-light text-brand">
              <FontAwesomeIcon icon={faCloudArrowUp} className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-medium text-ink">
                Drop the file here or click to browse
              </span>
              <span className="text-xs text-gray-500">
                Word, Excel, PowerPoint, PDF or drawing files, up to {MAX_UPLOAD_MB} MB
              </span>
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
        onChange={(event) => {
          onChange(event.target.files?.[0] || null);
          event.target.value = "";
        }}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FileDrop;
