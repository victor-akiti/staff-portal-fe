import { BACKEND_BASE_URL } from "@/lib/config";
import { auth } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";

/** Reads the file name from Content-Disposition (RFC 5987 filename* first). */
const fileNameFrom = (header: string | null, fallback: string) => {
  if (!header) return fallback;
  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {}
  }
  const plain = header.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : fallback;
};

/**
 * Downloads a protected file from staff-portal-be (cookie + Bearer token)
 * and hands it to the browser as a normal download.
 */
export const downloadProtectedFile = async (path: string, fallbackName: string) => {
  const headers: Record<string, string> = {};
  if (auth.currentUser) headers.Authorization = `Bearer ${await getIdToken(auth.currentUser)}`;

  const response = await fetch(`${BACKEND_BASE_URL}/${path.replace(/^\//, "")}`, {
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    let message = "The file could not be downloaded.";
    try {
      const body = await response.json();
      message = body?.error?.message || message;
    } catch {}
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileNameFrom(response.headers.get("Content-Disposition"), fallbackName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export const formatBytes = (bytes: number) => {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
};

export const formatDate = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

export const formatDateTime = (timestamp?: number) =>
  timestamp
    ? new Date(timestamp).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";
