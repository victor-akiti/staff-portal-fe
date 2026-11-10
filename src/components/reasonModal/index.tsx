"use client";

import Modal from "@/components/modal";
import { Button, Field, inputClass } from "@/components/ui";
import { useEffect, useState } from "react";

/** Confirmation that requires a reason (kept in the audit log / sent to the requester). */
const ReasonModal = ({
  open,
  title,
  message,
  confirmLabel,
  placeholder,
  loading,
  danger = true,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  placeholder?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  const submit = () => {
    if (!reason.trim()) return setError("Please give a reason.");
    onConfirm(reason.trim());
  };

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={submit} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="mb-4 text-sm text-gray-600">{message}</div>
      <Field label="Reason" required error={error}>
        <input
          className={inputClass}
          value={reason}
          onChange={(event) => (setReason(event.target.value), setError(""))}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          placeholder={placeholder}
          maxLength={500}
          autoFocus
        />
      </Field>
    </Modal>
  );
};

export default ReasonModal;
