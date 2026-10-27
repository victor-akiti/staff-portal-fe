import type { ApiSuccess } from "@/types/auth.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

export interface SimpleEmail {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export interface EntryPayload {
  entry: Record<string, any>;
  collection: string;
  idString?: string;
}

export interface SuggestionForm {
  name: string;
  email: string;
  department: string;
  suggestion: string;
}

/**
 * Staff API - staff-portal-be endpoints that replace the legacy Render services.
 * Module endpoints get added here as each module is migrated.
 */
export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /** POST /users/send - replaces MailerService.sendToApi */
    sendEmail: builder.mutation<ApiSuccess<{ messageId: string | null }>, SimpleEmail>({
      query: (email) => ({ url: "users/send", method: "POST", body: email }),
    }),

    /** POST /users/user - find a user's uid by email */
    findUserByEmail: builder.mutation<
      ApiSuccess<{ uid: string; email: string; name: string; login: string | null }>,
      string
    >({
      query: (email) => ({ url: "users/user", method: "POST", body: { email } }),
    }),

    /** POST /v1/add - replaces UtilityService.addEntry */
    addEntry: builder.mutation<ApiSuccess<{ id: string; collection: string }>, EntryPayload>({
      query: (payload) => ({ url: "v1/add", method: "POST", body: { payload } }),
    }),

    /** POST /suggestion/new - public, same { form } body as the legacy app */
    submitSuggestion: builder.mutation<ApiSuccess<{ id: string }>, SuggestionForm>({
      query: (form) => ({ url: "suggestion/new", method: "POST", body: { form } }),
    }),
  }),
});

export const {
  useSendEmailMutation,
  useFindUserByEmailMutation,
  useAddEntryMutation,
  useSubmitSuggestionMutation,
} = staffApi;
