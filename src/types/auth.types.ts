/**
 * Shapes match the users/{uid} documents the legacy Angular portal wrote,
 * now created and returned by staff-portal-be (PUT /user/ver, GET /user/me).
 */

export interface UserPermissions {
  platformAdmin?: boolean;
  hrAdmin?: boolean;
  operationsAdmin?: boolean;
  protocolAdmin?: boolean;
  documentsAdmin?: boolean;
  [key: string]: boolean | undefined;
}

export interface User {
  uid: string;
  email: string | null;
  login: string | null;
  name?: string;
  phone?: string;
  providerId?: string;
  msProfile?: Record<string, any>;
  updateFlag?: boolean;
  isAdmin?: boolean;
  permissions?: UserPermissions;
}

export interface ApiSuccess<T> {
  status: "OK";
  data: T;
}

export interface ApiFailure {
  status: "Failed" | "FAILED";
  error: { message: string };
}

export interface StaffVerifyRequest {
  token: string;
  msProfile?: Record<string, any>;
  providerId?: string;
}

export type UserResponse = ApiSuccess<{ user: User }>;
