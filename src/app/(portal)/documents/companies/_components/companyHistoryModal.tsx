"use client";

import AuditTimeline from "@/components/auditTimeline";
import Modal from "@/components/modal";
import { useGetAuditLogsQuery } from "@/redux/apis/templatesApi";
import type { Company } from "@/types/companies.types";

const ACTION_LABELS: Record<string, string> = {
  requested: "Requested",
  created: "Added",
  approved: "Request approved",
  rejected: "Request rejected",
  updated: "Details edited",
  deleted: "Deleted",
};

const FIELD_LABELS: Record<string, string> = {
  companyName: "Company name",
  contactName: "Contact person",
  contactEmail: "Contact email",
  contactPhone: "Phone",
  contactAddress: "Address",
  registered: "Registered",
  approved: "Registration approved",
};

const CompanyHistoryModal = ({
  company,
  onClose,
}: {
  company: Company | null;
  onClose: () => void;
}) => {
  const { data: logs = [], isLoading } = useGetAuditLogsQuery(
    { entityId: company?.code },
    { skip: !company },
  );

  return (
    <Modal
      open={Boolean(company)}
      title={`History - ${company?.code} ${company?.companyName || ""}`}
      onClose={onClose}
    >
      <AuditTimeline
        logs={logs}
        loading={isLoading}
        actionLabels={ACTION_LABELS}
        fieldLabels={FIELD_LABELS}
      />
      <p className="mt-4 text-xs text-gray-400">
        Changes made in the portal from this release onwards. Earlier changes were not recorded.
      </p>
    </Modal>
  );
};

export default CompanyHistoryModal;
