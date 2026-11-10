"use client";

import Modal from "@/components/modal";
import { Button, Field, inputClass } from "@/components/ui";
import { errorMessage } from "@/redux/baseQuery";
import {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  type TemplateDetails,
} from "@/redux/apis/templatesApi";
import type { DocumentTemplate } from "@/types/templates.types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FileDrop from "./fileDrop";
import { checkFile, isValidDocNumber, normaliseDocNumber } from "./rules";

const EMPTY: TemplateDetails = {
  title: "",
  docNumber: "",
  category: "Letter",
  entity: "Amni International",
  description: "",
};

/** Upload a new template (template = null) or edit an existing one's details. */
const TemplateFormModal = ({
  open,
  template,
  categories,
  entities,
  onClose,
}: {
  open: boolean;
  template: DocumentTemplate | null;
  categories: string[];
  entities: string[];
  onClose: () => void;
}) => {
  const isEdit = Boolean(template);
  const [details, setDetails] = useState<TemplateDetails>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createTemplate, { isLoading: creating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: updating }] = useUpdateTemplateMutation();

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setFile(null);
    setDetails(
      template
        ? {
            title: template.title,
            docNumber: template.docNumber || "",
            category: template.category,
            entity: template.entity,
            description: template.description || "",
          }
        : EMPTY,
    );
  }, [open, template]);

  const set =
    (field: keyof TemplateDetails) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setDetails((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: "" }));
    };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!details.title.trim()) next.title = "A title is required.";
    const docNumber = normaliseDocNumber(details.docNumber);
    if (!docNumber) next.docNumber = "A document number is required.";
    else if (!isValidDocNumber(docNumber))
      next.docNumber = "Expected a format like CEO-AMN-ABC-1124-LET-20001.";
    if (!isEdit) {
      const fileError = checkFile(file);
      if (fileError) next.file = fileError;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = { ...details, docNumber: normaliseDocNumber(details.docNumber) };

    try {
      if (template) {
        await updateTemplate({ id: template.id, details: payload }).unwrap();
        toast.success("Template details updated.");
      } else {
        await createTemplate({ file: file as File, details: payload }).unwrap();
        toast.success(`"${payload.title}" uploaded.`);
      }
      onClose();
    } catch (error) {
      const message = errorMessage(error, "The template could not be saved.");
      if (/document number/i.test(message)) setErrors({ docNumber: message });
      else toast.error(message);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit template details" : "Upload a template"}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="template-form" loading={creating || updating}>
            {isEdit ? "Save changes" : "Upload template"}
          </Button>
        </>
      }
    >
      <form id="template-form" onSubmit={submit} className="space-y-4" noValidate>
        {!isEdit && (
          <Field label="File" required>
            <FileDrop
              file={file}
              onChange={(next) => {
                setFile(next);
                setErrors((current) => ({ ...current, file: checkFile(next) }));
              }}
              error={errors.file}
            />
          </Field>
        )}

        <Field label="Title" required error={errors.title}>
          <input
            className={inputClass}
            value={details.title}
            onChange={set("title")}
            placeholder="e.g. Letter - Amni International"
            maxLength={150}
          />
        </Field>

        <Field
          label="Document number"
          required
          error={errors.docNumber}
          hint="The controlled document number of this template, from the document number generator."
        >
          <input
            className={`${inputClass} font-mono uppercase`}
            value={details.docNumber}
            onChange={set("docNumber")}
            placeholder="CEO-AMN-ABC-1124-LET-20001"
            maxLength={80}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select className={inputClass} value={details.category} onChange={set("category")}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </Field>
          <Field label="Entity">
            <select className={inputClass} value={details.entity} onChange={set("entity")}>
              {entities.map((entity) => (
                <option key={entity}>{entity}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Description" hint="Optional - when to use this template.">
          <textarea
            className={inputClass}
            rows={3}
            value={details.description}
            onChange={set("description")}
            maxLength={1000}
          />
        </Field>
      </form>
    </Modal>
  );
};

export default TemplateFormModal;
