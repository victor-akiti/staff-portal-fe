"use client";

import AuditTimeline from "@/components/auditTimeline";
import Modal from "@/components/modal";
import { Badge, Button } from "@/components/ui";
import { downloadProtectedFile, formatBytes, formatDateTime } from "@/lib/download";
import { useGetAuditLogsQuery, useGetTemplateQuery } from "@/redux/apis/templatesApi";
import type { DocumentTemplate } from "@/types/templates.types";
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
      <AuditTimeline
        logs={logs}
        loading={isLoading}
        actionLabels={ACTION_LABELS}
        fieldLabels={FIELD_LABELS}
      />
    </Modal>
  );
};

export default HistoryModal;
