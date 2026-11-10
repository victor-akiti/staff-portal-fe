import type { ApiSuccess } from "@/types/auth.types";
import type { AuditLog, DocumentTemplate, TemplateList } from "@/types/templates.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

export interface TemplateDetails {
  title: string;
  docNumber: string;
  category: string;
  entity: string;
  description: string;
}

/** Document template store - staff-portal-be /templates and /audit-logs */
export const templatesApi = createApi({
  reducerPath: "templatesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Templates", "Template", "Audit"],
  endpoints: (builder) => ({
    getTemplates: builder.query<TemplateList, void>({
      query: () => "templates",
      transformResponse: (response: ApiSuccess<TemplateList>) => response.data,
      providesTags: ["Templates"],
    }),

    getTemplate: builder.query<DocumentTemplate, string>({
      query: (id) => `templates/${id}`,
      transformResponse: (response: ApiSuccess<{ template: DocumentTemplate }>) =>
        response.data.template,
      providesTags: (_result, _error, id) => [{ type: "Template", id }],
    }),

    /** multipart: file + details */
    createTemplate: builder.mutation<DocumentTemplate, { file: File; details: TemplateDetails }>({
      query: ({ file, details }) => {
        const body = new FormData();
        body.append("file", file);
        Object.entries(details).forEach(([key, value]) => body.append(key, value));
        return { url: "templates", method: "POST", body };
      },
      transformResponse: (response: ApiSuccess<{ template: DocumentTemplate }>) =>
        response.data.template,
      invalidatesTags: ["Templates", "Audit"],
    }),

    updateTemplate: builder.mutation<
      DocumentTemplate,
      { id: string; details: Partial<TemplateDetails> }
    >({
      query: ({ id, details }) => ({ url: `templates/${id}`, method: "PATCH", body: details }),
      transformResponse: (response: ApiSuccess<{ template: DocumentTemplate }>) =>
        response.data.template,
      invalidatesTags: (_result, _error, { id }) => [
        "Templates",
        "Audit",
        { type: "Template", id },
      ],
    }),

    replaceTemplateFile: builder.mutation<
      DocumentTemplate,
      { id: string; file: File; note: string }
    >({
      query: ({ id, file, note }) => {
        const body = new FormData();
        body.append("file", file);
        body.append("note", note);
        return { url: `templates/${id}/file`, method: "POST", body };
      },
      transformResponse: (response: ApiSuccess<{ template: DocumentTemplate }>) =>
        response.data.template,
      invalidatesTags: (_result, _error, { id }) => [
        "Templates",
        "Audit",
        { type: "Template", id },
      ],
    }),

    deleteTemplate: builder.mutation<{ id: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `templates/${id}`, method: "DELETE", body: { reason } }),
      invalidatesTags: ["Templates", "Audit"],
    }),

    getAuditLogs: builder.query<AuditLog[], { entity?: string; entityId?: string }>({
      query: (params) => ({ url: "audit-logs", params }),
      transformResponse: (response: ApiSuccess<{ logs: AuditLog[] }>) => response.data.logs,
      providesTags: ["Audit"],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useReplaceTemplateFileMutation,
  useDeleteTemplateMutation,
  useGetAuditLogsQuery,
} = templatesApi;
