"use client";

import Modal from "@/components/modal";
import { Badge, Button } from "@/components/ui";
import { downloadProtectedFile, formatBytes, formatDateTime } from "@/lib/download";
import { useGetAuditLogsQuery, useGetTemplateQuery } from "@/redux/apis/templatesApi";
import type { AuditLog, DocumentTemplate } from "@/types/templates.types";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ACTION_LABELS: Record<string, string> = {
  created: "Uploaded",
  updated: "Details edited",
  fileReplaced: "New version uploaded",
  deleted: "Removed",
};

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  docNumber: "Document number",
  docNumberRegistered: "In number register",
  category: "Category",
  entity: "Entity",
  description: "Description",
  fileName: "File",
  version: "Version",
  size: "Size",
  ext: "File type",
  contentType: "Content type",
};

const show = (value: unknown) =>
  value === null || value === undefined || value === "" ? "(empty)" : String(value);

const LogEntry = ({ log }: { log: AuditLog }) => (
  <li className="relative pb-5 pl-6 last:pb-0">
    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-brand" />
    <span className="absolute bottom-0 left-[4px] top-4 w-px bg-gray-200" />
    <p className="text-sm text-ink">
      <b>{ACTION_LABELS[log.action] || log.action}</b> by{" "}
      {log.actor?.name || log.actor?.email || "Unknown"}
    </p>
    <p className="text-xs text-gray-500">{formatDateTime(log.at)}</p>
    {log.changes?.length > 0 && (
      <ul className="mt-2 space-y-1 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
        {log.changes
          .filter((change) => FIELD_LABELS[change.field])
          .map((change) => (
            <li key={change.field}>
              {FIELD_LABELS[change.field]}:{" "}
              <span className="line-through">{show(change.from)}</span> →{" "}
              <span className="font-medium text-ink">{show(change.to)}</span>
            </li>
          ))}
      </ul>
    )}
    {log.note && <p className="mt-1 text-xs italic text-gray-600">&ldquo;{log.note}&rdquo;</p>}
  </li>
);

const HistoryModal = ({
  template,
  onClose,
}: {
  template: DocumentTemplate | null;
  onClose: () => void;
}) => {
  const skip = !template;
  const { data: detail } = useGetTemplateQuery(template?.id || "", { skip });
  const { data: logs = [], isLoading } = useGetAuditLogsQuery(
    { entity: "template", entityId: template?.id },
    { skip },
  );

  const download = (version: number, fileName: string) =>
    downloadProtectedFile(`templates/${template?.id}/download?version=${version}`, fileName).catch(
      (error) => toast.error(error.message),
    );

  return (
    <Modal
      open={Boolean(template)}
      title={`History - ${template?.title || ""}`}
      onClose={onClose}
      size="lg"
    >
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Versions</h3>
      <ul className="mb-6 divide-y divide-gray-100 rounded-lg border border-gray-200">
        {(detail?.versions || []).map((version) => (
          <li key={version.version} className="flex items-center gap-3 px-3 py-2.5">
            <Badge tone={version.version === detail?.version ? "brand" : "gray"}>
              v{version.version}
            </Badge>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-ink">{version.fileName}</span>
              <span className="text-xs text-gray-500">
                {formatBytes(version.size)} - {formatDateTime(version.uploadedAt)} -{" "}
                {version.uploadedBy?.name || version.uploadedBy?.email}
                {version.note && ` - ${version.note}`}
              </span>
            </span>
            <Button
              variant="ghost"
              icon={faDownload}
              onClick={() => download(version.version, version.fileName)}
            >
              <span className="sr-only">Download v{version.version}</span>
            </Button>
          </li>
        ))}
      </ul>

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Audit log
      </h3>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : logs.length ? (
        <ul>
          {logs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No changes recorded yet.</p>
      )}
    </Modal>
  );
};

export default HistoryModal;
