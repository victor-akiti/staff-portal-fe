"use client";

import Modal from "@/components/modal";
import { Button, Field, inputClass } from "@/components/ui";
import { errorMessage } from "@/redux/baseQuery";
import { useDeleteTemplateMutation } from "@/redux/apis/templatesApi";
import type { DocumentTemplate } from "@/types/templates.types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DeleteTemplateModal = ({
  template,
  onClose,
}: {
  template: DocumentTemplate | null;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [deleteTemplate, { isLoading }] = useDeleteTemplateMutation();

  useEffect(() => {
    setReason("");
    setError("");
  }, [template]);

  const submit = async () => {
    if (!reason.trim()) return setError("Please give a reason - it is kept in the audit log.");
    if (!template) return;
    try {
      await deleteTemplate({ id: template.id, reason: reason.trim() }).unwrap();
      toast.success(`"${template.title}" removed.`);
      onClose();
    } catch (submitError) {
      toast.error(errorMessage(submitError, "The template could not be removed."));
    }
  };

  return (
    <Modal
      open={Boolean(template)}
      title="Remove template"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={submit} loading={isLoading}>
            Remove template
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-gray-600">
        <b className="text-ink">{template?.title}</b> will no longer be available to staff. The file
        and its history are kept for the audit trail.
      </p>
      <Field label="Reason" required error={error}>
        <input
          className={inputClass}
          value={reason}
          onChange={(event) => (setReason(event.target.value), setError(""))}
          placeholder="e.g. Replaced by the 2026 letterhead"
          maxLength={500}
          autoFocus
        />
      </Field>
    </Modal>
  );
};

export default DeleteTemplateModal;
