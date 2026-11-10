"use client";

import Modal from "@/components/modal";
import { Button, Field, inputClass } from "@/components/ui";
import { errorMessage } from "@/redux/baseQuery";
import { useReplaceTemplateFileMutation } from "@/redux/apis/templatesApi";
import type { DocumentTemplate } from "@/types/templates.types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FileDrop from "./fileDrop";
import { checkFile } from "./rules";

const ReplaceFileModal = ({
  template,
  onClose,
}: {
  template: DocumentTemplate | null;
  onClose: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [replaceFile, { isLoading }] = useReplaceTemplateFileMutation();

  useEffect(() => {
    setFile(null);
    setNote("");
    setError("");
  }, [template]);

  const submit = async () => {
    const fileError = checkFile(file);
    setError(fileError);
    if (fileError || !template) return;
    try {
      const updated = await replaceFile({ id: template.id, file: file as File, note }).unwrap();
      toast.success(`New version uploaded (v${updated.version}).`);
      onClose();
    } catch (submitError) {
      toast.error(errorMessage(submitError, "The file could not be replaced."));
    }
  };

  return (
    <Modal
      open={Boolean(template)}
      title="Upload a new version"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} loading={isLoading}>
            Upload new version
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-gray-600">
        Staff will download the new file from now on. Version {template?.version} and earlier stay
        in the history.
      </p>
      <div className="space-y-4">
        <FileDrop
          file={file}
          onChange={(next) => (setFile(next), setError(checkFile(next)))}
          error={error}
        />
        <Field label="What changed?" hint="Optional - shown in the history.">
          <input
            className={inputClass}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Updated address and logo"
            maxLength={500}
          />
        </Field>
      </div>
    </Modal>
  );
};

export default ReplaceFileModal;
