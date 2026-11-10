import { formatDateTime } from "@/lib/download";
import type { AuditLog } from "@/types/templates.types";

const show = (value: unknown) =>
  value === null || value === undefined || value === ""
    ? "(empty)"
    : value === true
      ? "Yes"
      : value === false
        ? "No"
        : String(value);

/** Vertical timeline of audit log entries, newest first. */
const AuditTimeline = ({
  logs,
  actionLabels,
  fieldLabels,
  loading,
}: {
  logs: AuditLog[];
  actionLabels: Record<string, string>;
  fieldLabels: Record<string, string>;
  loading?: boolean;
}) => {
  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!logs.length) return <p className="text-sm text-gray-500">No changes recorded yet.</p>;

  return (
    <ul>
      {logs.map((log) => {
        const changes = (log.changes || []).filter((change) => fieldLabels[change.field]);
        return (
          <li key={log.id} className="relative pb-5 pl-6 last:pb-0">
            <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-brand" />
            <span className="absolute bottom-0 left-[4px] top-4 w-px bg-gray-200" />
            <p className="text-sm text-ink">
              <b>{actionLabels[log.action] || log.action}</b> by{" "}
              {log.actor?.name || log.actor?.email || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">{formatDateTime(log.at)}</p>
            {changes.length > 0 && (
              <ul className="mt-2 space-y-1 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
                {changes.map((change) => (
                  <li key={change.field}>
                    {fieldLabels[change.field]}:{" "}
                    <span className="line-through">{show(change.from)}</span> →{" "}
                    <span className="font-medium text-ink">{show(change.to)}</span>
                  </li>
                ))}
              </ul>
            )}
            {log.note && (
              <p className="mt-1 text-xs italic text-gray-600">&ldquo;{log.note}&rdquo;</p>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AuditTimeline;
