import type { ApiSuccess } from "@/types/auth.types";
import type { CodePreview, Company, CompanyFields } from "@/types/companies.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

interface CompanyList {
  companies: Company[];
  status: "approved" | "requested";
  canManage: boolean;
}

/** Companies - staff-portal-be /companies */
export const companiesApi = createApi({
  reducerPath: "companiesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Companies"],
  endpoints: (builder) => ({
    getCompanies: builder.query<CompanyList, "approved" | "requested">({
      query: (status) => ({ url: "companies", params: { status } }),
      transformResponse: (response: ApiSuccess<CompanyList>) => response.data,
      providesTags: (_result, _error, status) => [{ type: "Companies", id: status }],
    }),

    previewCompany: builder.mutation<CodePreview, string>({
      query: (companyName) => ({ url: "companies/preview", method: "POST", body: { companyName } }),
      transformResponse: (response: ApiSuccess<CodePreview>) => response.data,
    }),

    createCompany: builder.mutation<
      { company: Company; requested: boolean },
      CompanyFields & { acknowledgeSimilar?: boolean }
    >({
      query: (body) => ({ url: "companies", method: "POST", body }),
      transformResponse: (response: ApiSuccess<{ company: Company; requested: boolean }>) =>
        response.data,
      invalidatesTags: [
        { type: "Companies", id: "approved" },
        { type: "Companies", id: "requested" },
      ],
    }),

    approveRequest: builder.mutation<{ company: Company }, string>({
      query: (id) => ({ url: `companies/requests/${id}/approve`, method: "POST" }),
      transformResponse: (response: ApiSuccess<{ company: Company }>) => response.data,
      invalidatesTags: [
        { type: "Companies", id: "approved" },
        { type: "Companies", id: "requested" },
      ],
    }),

    rejectRequest: builder.mutation<unknown, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `companies/requests/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: [{ type: "Companies", id: "requested" }],
    }),

    updateCompany: builder.mutation<
      { company: Company },
      { code: string; fields: Partial<CompanyFields> }
    >({
      query: ({ code, fields }) => ({
        url: `companies/${encodeURIComponent(code)}`,
        method: "PATCH",
        body: fields,
      }),
      transformResponse: (response: ApiSuccess<{ company: Company }>) => response.data,
      invalidatesTags: [{ type: "Companies", id: "approved" }],
    }),

    deleteCompany: builder.mutation<unknown, { code: string; reason: string }>({
      query: ({ code, reason }) => ({
        url: `companies/${encodeURIComponent(code)}`,
        method: "DELETE",
        body: { reason },
      }),
      invalidatesTags: [{ type: "Companies", id: "approved" }],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  usePreviewCompanyMutation,
  useCreateCompanyMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;
