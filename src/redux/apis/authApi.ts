import type { StaffVerifyRequest, UserResponse } from "@/types/auth.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

/**
 * Auth API - staff-portal-be session endpoints (same names as contractor-portal-FE).
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    /**
     * PUT /user/ver - after Microsoft sign-in. Creates/backfills users/{uid}
     * and sets the session cookie.
     */
    verifyStaffToken: builder.mutation<UserResponse, StaffVerifyRequest>({
      query: ({ token, msProfile, providerId }) => ({
        url: "user/ver",
        method: "PUT",
        headers: { token },
        body: { msProfile, providerId },
      }),
      invalidatesTags: ["User"],
    }),

    /** GET /user/me - restore the session on page load */
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => "user/me",
      providesTags: ["User"],
    }),

    /** POST /auth/logout - clears the session cookie */
    logout: builder.mutation<{ status: string }, void>({
      query: () => ({ url: "auth/logout", method: "POST" }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useVerifyStaffTokenMutation, useGetCurrentUserQuery, useLogoutMutation } = authApi;
