"use client";

import Modal from "@/components/modal";
import { Badge, Button, Field, inputClass } from "@/components/ui";
import useDebounce from "@/hooks/useDebounce";
import { errorMessage } from "@/redux/baseQuery";
import {
  useCreateCompanyMutation,
  usePreviewCompanyMutation,
  useUpdateCompanyMutation,
} from "@/redux/apis/companiesApi";
import type { CodePreview, Company, CompanyFields } from "@/types/companies.types";
import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EMPTY: CompanyFields = {
  companyName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  registered: false,
  approved: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isYes = (value: unknown) => value === true || value === "true" || value === "yes";

const Toggle = ({
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => (
  <label
    className={`flex items-start gap-3 rounded-lg border border-gray-200 p-3 ${
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-brand/40"
    }`}
  >
    <input
      type="checkbox"
      disabled={disabled}
      className="mt-0.5 h-4 w-4 accent-[#e26b09]"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span>
      <span className="block text-sm font-medium text-ink">{label}</span>
      <span className="text-xs text-gray-500">{hint}</span>
    </span>
  </label>
);

/** New company / company request (company = null), or edit details of an approved company. */
const CompanyFormModal = ({
  open,
  company,
  canManage,
  onClose,
}: {
  open: boolean;
  company: Company | null;
  canManage: boolean;
  onClose: () => void;
}) => {
  const isEdit = Boolean(company);
  const [fields, setFields] = useState<CompanyFields>(EMPTY);
  const [initial, setInitial] = useState<CompanyFields>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<CodePreview | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [previewCompany, { isLoading: previewing }] = usePreviewCompanyMutation();
  const [createCompany, { isLoading: creating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: updating }] = useUpdateCompanyMutation();
  const debouncedName = useDebounce(fields.companyName.trim(), 400);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setPreview(null);
    setAcknowledged(false);
    const start = company
      ? {
          companyName: company.companyName || company.label || "",
          contactName: company.contactName || "",
          contactEmail: company.contactEmail || "",
          contactPhone: company.contactPhone || "",
          contactAddress: company.contactAddress || "",
          registered: isYes(company.registered),
          approved: isYes(company.approved),
        }
      : EMPTY;
    setFields(start);
    setInitial(start);
  }, [open, company]);

  // Live code preview and duplicate check while typing a new company's name
  useEffect(() => {
    if (!open || isEdit || debouncedName.length < 2) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    previewCompany(debouncedName)
      .unwrap()
      .then((result) => !cancelled && (setPreview(result), setAcknowledged(false)))
      .catch(() => !cancelled && setPreview(null));
    return () => {
      cancelled = true;
    };
  }, [debouncedName, open, isEdit, previewCompany]);

  const set =
    (field: keyof CompanyFields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: "" }));
    };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fields.companyName.trim()) next.companyName = "A company name is required.";
    if (!fields.contactName.trim()) next.contactName = "A contact person is required.";
    if (!fields.contactEmail.trim()) next.contactEmail = "A contact email is required.";
    else if (!EMAIL_REGEX.test(fields.contactEmail.trim()))
      next.contactEmail = "Please enter a valid email.";
    if (!isEdit && preview?.exactDuplicate) next.companyName = "This company already exists.";
    if (!isEdit && preview?.similar.length && !acknowledged) {
      next.similar = "Confirm this is a different company to continue.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      if (company) {
        // Only send what changed, so untouched legacy values (e.g. registered: "yes") are left as they are
        const changed = (Object.keys(fields) as (keyof CompanyFields)[]).filter(
          (key) => fields[key] !== initial[key],
        );
        if (!changed.length) {
          toast.info("No changes to save.");
          return onClose();
        }
        const update = Object.fromEntries(
          changed.map((key) => [key, fields[key]]),
        ) as Partial<CompanyFields>;
        await updateCompany({ code: company.code, fields: update }).unwrap();
        toast.success(`${company.code} updated.`);
      } else {
        const result = await createCompany({
          ...fields,
          acknowledgeSimilar: acknowledged,
        }).unwrap();
        toast.success(
          result.requested
            ? `Request sent - ${result.company.code} is reserved until Information Management reviews it.`
            : `${result.company.companyName} added with code ${result.company.code}.`,
        );
      }
      onClose();
    } catch (error) {
      const message = errorMessage(error, "The company could not be saved.");
      if (/similar company/i.test(message)) setErrors({ similar: message });
      else if (/already (exists|has a pending)/i.test(message)) setErrors({ companyName: message });
      else toast.error(message);
    }
  };

  const title = isEdit
    ? `Edit ${company?.code}`
    : canManage
      ? "Add a company"
      : "Request a company code";

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="company-form" loading={creating || updating}>
            {isEdit ? "Save changes" : canManage ? "Add company" : "Send request"}
          </Button>
        </>
      }
    >
      <form id="company-form" onSubmit={submit} className="space-y-4" noValidate>
        {!isEdit && !canManage && (
          <p className="rounded-md bg-brand-50 px-3 py-2 text-sm text-gray-700">
            Information Management will review your request. The code below is reserved for you
            meanwhile.
          </p>
        )}

        <Field label="Company name" required error={errors.companyName}>
          <input
            className={inputClass}
            value={fields.companyName}
            onChange={set("companyName")}
            placeholder="Full registered name, e.g. Acme Energy Services Limited"
            maxLength={200}
            autoFocus
          />
        </Field>

        {isEdit ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Code <Badge tone="brand">{company?.code}</Badge>
            <span className="text-xs text-gray-400">
              Codes never change - they are part of document numbers.
            </span>
          </div>
        ) : (
          <div
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
            aria-live="polite"
          >
            {fields.companyName.trim().length < 2 ? (
              <p className="text-sm text-gray-500">
                The code is assigned automatically from the name.
              </p>
            ) : previewing && !preview ? (
              <p className="text-sm text-gray-500">Checking...</p>
            ) : preview?.exactDuplicate ? (
              <p className="flex items-start gap-2 text-sm text-red-700">
                <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4" />
                <span>
                  <b>{preview.exactDuplicate.companyName}</b> already{" "}
                  {preview.exactDuplicate.pending ? "has a pending request" : "exists"} with code{" "}
                  <b>{preview.exactDuplicate.code}</b>. Use that code instead.
                </span>
              </p>
            ) : preview ? (
              <>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4 text-green-600" />
                  Code to be assigned:
                  <span className="rounded bg-white px-2 py-0.5 font-mono text-base font-semibold text-brand-dark shadow-sm">
                    {preview.code}
                  </span>
                </p>
                {preview.similar.length > 0 && (
                  <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <p className="font-medium">Similar companies already exist:</p>
                    <ul className="mt-1 list-inside list-disc">
                      {preview.similar.map((match) => (
                        <li key={match.code}>
                          {match.companyName} <span className="font-mono">({match.code})</span>
                          {match.pending && " - pending request"}
                        </li>
                      ))}
                    </ul>
                    <label className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#e26b09]"
                        checked={acknowledged}
                        onChange={(event) => (
                          setAcknowledged(event.target.checked),
                          setErrors({ ...errors, similar: "" })
                        )}
                      />
                      This is a different company
                    </label>
                    {errors.similar && (
                      <p className="mt-1 text-xs text-red-600">{errors.similar}</p>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact person" required error={errors.contactName}>
            <input
              className={inputClass}
              value={fields.contactName}
              onChange={set("contactName")}
              maxLength={150}
            />
          </Field>
          <Field label="Contact email" required error={errors.contactEmail}>
            <input
              type="email"
              className={inputClass}
              value={fields.contactEmail}
              onChange={set("contactEmail")}
              maxLength={254}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={fields.contactPhone}
              onChange={set("contactPhone")}
              maxLength={50}
            />
          </Field>
          <Field label="Address">
            <input
              className={inputClass}
              value={fields.contactAddress}
              onChange={set("contactAddress")}
              maxLength={500}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            label="Company is registered"
            hint="Registered with Amni as a contractor."
            checked={fields.registered}
            onChange={(value) =>
              setFields((current) => ({
                ...current,
                registered: value,
                approved: value && current.approved,
              }))
            }
          />
          <Toggle
            label="Registration approved"
            hint="Only once the company is registered."
            checked={fields.registered && fields.approved}
            onChange={(value) => setFields((current) => ({ ...current, approved: value }))}
            disabled={!fields.registered}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CompanyFormModal;
