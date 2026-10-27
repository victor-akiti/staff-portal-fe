"use client";

import { SUGGESTION_DEPARTMENTS } from "@/content/suggestionDepartments";
import { errorMessage } from "@/redux/baseQuery";
import { useSubmitSuggestionMutation, type SuggestionForm } from "@/redux/apis/staffApi";
import Image from "next/image";
import { useState } from "react";

const EMPTY_FORM: SuggestionForm = { name: "", email: "", department: "", suggestion: "" };
const EMAIL_REGEX = /^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/;

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none";

// Same checks and messages as the legacy SuggestionboxComponent (the backend repeats them)
const validate = (form: SuggestionForm) => {
  if (form.email && !EMAIL_REGEX.test(form.email)) return "Please enter a valid email address.";
  if (!form.department) return "Please select the department your suggestion concerns.";
  if (!form.suggestion.trim()) return "The suggestion box cannot be left empty!";
  return "";
};

export default function SuggestionBoxPage() {
  const [form, setForm] = useState<SuggestionForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitSuggestion, { isLoading }] = useSubmitSuggestionMutation();

  const update =
    (field: keyof SuggestionForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess("");
    const validationError = validate(form);
    setError(validationError);
    if (validationError) return;

    try {
      await submitSuggestion(form).unwrap();
      setSuccess("Your suggestion has been submitted successfully!");
      setForm(EMPTY_FORM);
    } catch (submitError) {
      setError(errorMessage(submitError, "Could not submit your suggestion."));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/ideas.jpg"
          alt="Suggestion box"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-10">
        <form onSubmit={submit} className="w-full max-w-md space-y-4">
          <Image src="/images/logo.png" alt="Amni logo" width={120} height={50} />
          <h1 className="text-2xl font-semibold text-brand">Suggestion Box</h1>
          <p className="text-sm text-gray-600">
            Do you have a request or an idea for improvement? Let us know! We're always looking to
            hear from you. Submit your suggestions and we'll get on them as quickly as possible.
          </p>

          {success && <p className="text-sm text-green-700">{success}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <input
            className={inputClass}
            placeholder="Name [Optional]"
            value={form.name}
            onChange={update("name")}
          />
          <input
            className={inputClass}
            placeholder="Email [Optional]"
            value={form.email}
            onChange={update("email")}
          />
          <select className={inputClass} value={form.department} onChange={update("department")}>
            <option value="" disabled>
              Department Concerned
            </option>
            {SUGGESTION_DEPARTMENTS.map((department) => (
              <option key={department.value} value={department.value}>
                {department.label}
              </option>
            ))}
          </select>
          <textarea
            className={inputClass}
            placeholder="Drop a message here..."
            rows={8}
            value={form.suggestion}
            onChange={update("suggestion")}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>

          <p className="text-xs text-gray-500">
            Confidentiality is key! We understand that some feedback might be sensitive. This
            suggestion box is completely anonymous, so you can share your thoughts and ideas freely.
            We encourage open communication and appreciate your willingness to help us improve.
          </p>
        </form>
      </div>
    </div>
  );
}
