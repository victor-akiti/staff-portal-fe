"use client";

import PageHeader from "@/components/pageHeader";
import { Badge, Button, EmptyState, inputClass } from "@/components/ui";
import { downloadProtectedFile, formatBytes, formatDate } from "@/lib/download";
import { errorMessage } from "@/redux/baseQuery";
import { useGetTemplatesQuery } from "@/redux/apis/templatesApi";
import type { DocumentTemplate } from "@/types/templates.types";
import {
  faClockRotateLeft,
  faDownload,
  faEllipsisVertical,
  faFileArrowUp,
  faFolderOpen,
  faMagnifyingGlass,
  faPen,
  faRotate,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import DeleteTemplateModal from "./_components/deleteTemplateModal";
import FileIcon from "./_components/fileIcon";
import HistoryModal from "./_components/historyModal";
import ReplaceFileModal from "./_components/replaceFileModal";
import TemplateFormModal from "./_components/templateFormModal";

type Dialog =
  | { kind: "create" }
  | { kind: "edit" | "replace" | "delete" | "history"; template: DocumentTemplate }
  | null;

const RowMenu = ({
  onSelect,
}: {
  onSelect: (kind: "edit" | "replace" | "history" | "delete") => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) =>
      ref.current && !ref.current.contains(event.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const items = [
    { kind: "edit" as const, label: "Edit details", icon: faPen },
    { kind: "replace" as const, label: "Upload new version", icon: faRotate },
    { kind: "history" as const, label: "History", icon: faClockRotateLeft },
    { kind: "delete" as const, label: "Remove", icon: faTrashCan, danger: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.kind}
              role="menuitem"
              onClick={() => (setOpen(false), onSelect(item.kind))}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                item.danger ? "text-red-600" : "text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function TemplatesPage() {
  const { data, isLoading, error } = useGetTemplatesQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [entity, setEntity] = useState("All");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const templates = useMemo(() => data?.templates || [], [data]);
  const canManage = Boolean(data?.canManage);

  const usedCategories = useMemo(
    () => [
      "All",
      ...(data?.categories || []).filter((c) => templates.some((t) => t.category === c)),
    ],
    [data, templates],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return templates.filter(
      (template) =>
        (category === "All" || template.category === category) &&
        (entity === "All" || template.entity === entity) &&
        (!term ||
          [template.title, template.docNumber, template.fileName, template.description]
            .join(" ")
            .toLowerCase()
            .includes(term)),
    );
  }, [templates, search, category, entity]);

  const download = async (template: DocumentTemplate) => {
    setDownloading(template.id);
    try {
      await downloadProtectedFile(`templates/${template.id}/download`, template.fileName);
    } catch (downloadError: any) {
      toast.error(downloadError.message);
    } finally {
      setDownloading(null);
    }
  };

  const close = () => setDialog(null);
  const selected = dialog && "template" in dialog ? dialog.template : null;

  return (
    <div>
      <PageHeader
        title="Document templates"
        subtitle="Official Amni templates for letters, memos, documents and drawings. Always start from the latest version here."
        crumbs={[{ label: "Information Management", href: "/documents" }, { label: "Templates" }]}
        actions={
          canManage && (
            <Button icon={faFileArrowUp} onClick={() => setDialog({ kind: "create" })}>
              Upload template
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Search by title, document number or file name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search templates"
          />
        </div>
        <select
          className={`${inputClass} sm:w-48`}
          value={entity}
          onChange={(event) => setEntity(event.target.value)}
          aria-label="Filter by entity"
        >
          <option value="All">All entities</option>
          {(data?.entities || []).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        {usedCategories.map((option) => (
          <button
            key={option}
            role="tab"
            aria-selected={category === option}
            onClick={() => setCategory(option)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              category === option
                ? "border-brand bg-brand text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-brand/50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="h-[76px] animate-pulse rounded-lg bg-white" />
          ))}
        </div>
      ) : error ? (
        <EmptyState icon={faFolderOpen} title="Templates could not be loaded">
          {errorMessage(error)}
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={faFolderOpen}
          title={templates.length ? "No templates match" : "No templates yet"}
        >
          {templates.length
            ? "Try a different search or filter."
            : canManage
              ? "Upload the first template to get started."
              : "Information Management has not published any templates yet."}
        </EmptyState>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-visible rounded-xl border border-gray-200 bg-white">
          {filtered.map((template) => (
            <li
              key={template.id}
              className="flex flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap"
            >
              <FileIcon ext={template.ext} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{template.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  {template.docNumber ? (
                    <span className="font-mono text-gray-700" title="Document number">
                      {template.docNumber}
                    </span>
                  ) : (
                    <Badge tone="amber">Not tagged</Badge>
                  )}
                  <span>
                    {template.category} · {template.entity}
                  </span>
                  <span>
                    v{template.version} · {template.ext.toUpperCase()} ·{" "}
                    {formatBytes(template.size)}
                  </span>
                  <span>Updated {formatDate(template.updatedAt)}</span>
                </div>
                {template.description && (
                  <p className="mt-1 text-sm text-gray-600">{template.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  icon={faDownload}
                  loading={downloading === template.id}
                  onClick={() => download(template)}
                >
                  Download
                </Button>
                {canManage && <RowMenu onSelect={(kind) => setDialog({ kind, template })} />}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && templates.length > 0 && (
        <p className="mt-3 text-xs text-gray-400">
          {filtered.length} of {templates.length} templates
        </p>
      )}

      <TemplateFormModal
        open={dialog?.kind === "create" || dialog?.kind === "edit"}
        template={dialog?.kind === "edit" ? selected : null}
        categories={data?.categories || []}
        entities={data?.entities || []}
        onClose={close}
      />
      <ReplaceFileModal template={dialog?.kind === "replace" ? selected : null} onClose={close} />
      <DeleteTemplateModal template={dialog?.kind === "delete" ? selected : null} onClose={close} />
      <HistoryModal template={dialog?.kind === "history" ? selected : null} onClose={close} />
    </div>
  );
}
