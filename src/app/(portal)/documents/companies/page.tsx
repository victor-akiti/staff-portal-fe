"use client";

import PageHeader from "@/components/pageHeader";
import ReasonModal from "@/components/reasonModal";
import { Badge, Button, EmptyState, inputClass } from "@/components/ui";
import { formatDate } from "@/lib/download";
import { errorMessage } from "@/redux/baseQuery";
import {
  useApproveRequestMutation,
  useDeleteCompanyMutation,
  useGetCompaniesQuery,
  useRejectRequestMutation,
} from "@/redux/apis/companiesApi";
import type { Company } from "@/types/companies.types";
import {
  faBuilding,
  faCheck,
  faClockRotateLeft,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CompanyFormModal, { isYes } from "./_components/companyFormModal";
import CompanyHistoryModal from "./_components/companyHistoryModal";

type Tab = "approved" | "requested";
type Dialog =
  { kind: "create" } | { kind: "edit" | "delete" | "history" | "reject"; company: Company } | null;

const PAGE_SIZE = 50;

const matches = (company: Company, term: string) =>
  !term ||
  [company.code, company.companyName, company.label, company.contactName, company.contactEmail]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(term);

const IconButton = ({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon: typeof faPen;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    className={`rounded-md p-2 hover:bg-gray-100 ${danger ? "text-red-600" : "text-gray-500"}`}
  >
    <FontAwesomeIcon icon={icon} className="h-4 w-4" />
  </button>
);

export default function CompaniesPage() {
  const [tab, setTab] = useState<Tab>("approved");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [dialog, setDialog] = useState<Dialog>(null);

  const approvedQuery = useGetCompaniesQuery("approved");
  const requestedQuery = useGetCompaniesQuery("requested");
  const [approveRequest, { isLoading: approving, originalArgs: approvingId }] =
    useApproveRequestMutation();
  const [rejectRequest, { isLoading: rejecting }] = useRejectRequestMutation();
  const [deleteCompany, { isLoading: deleting }] = useDeleteCompanyMutation();

  const canManage = Boolean(approvedQuery.data?.canManage);
  const active = tab === "approved" ? approvedQuery : requestedQuery;
  const companies = useMemo(() => active.data?.companies || [], [active.data]);
  const requestCount = requestedQuery.data?.companies.length || 0;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return companies.filter((company) => matches(company, term));
  }, [companies, search]);

  const selected = dialog && "company" in dialog ? dialog.company : null;
  const close = () => setDialog(null);

  const approve = async (company: Company) => {
    try {
      await approveRequest(company.id).unwrap();
      toast.success(`${company.companyName} approved as ${company.code}.`);
    } catch (error) {
      toast.error(errorMessage(error, "The request could not be approved."));
    }
  };

  const reject = async (reason: string) => {
    if (!selected) return;
    try {
      await rejectRequest({ id: selected.id, reason }).unwrap();
      toast.success("Request rejected - the requester has been told.");
      close();
    } catch (error) {
      toast.error(errorMessage(error, "The request could not be rejected."));
    }
  };

  const remove = async (reason: string) => {
    if (!selected) return;
    try {
      await deleteCompany({ code: selected.code, reason }).unwrap();
      toast.success(`${selected.code} deleted. The code will not be reused.`);
      close();
    } catch (error) {
      toast.error(errorMessage(error, "The company could not be deleted."));
    }
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "approved", label: "Companies", count: approvedQuery.data?.companies.length },
    { id: "requested", label: canManage ? "Pending requests" : "My requests", count: requestCount },
  ];

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Third-party company codes used in document numbers."
        crumbs={[{ label: "Information Management", href: "/documents" }, { label: "Companies" }]}
        actions={
          <Button icon={faPlus} onClick={() => setDialog({ kind: "create" })}>
            {canManage ? "Add company" : "Request a company"}
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist">
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => (setTab(item.id), setLimit(PAGE_SIZE))}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === item.id ? "bg-white text-ink shadow-sm" : "text-gray-600 hover:text-ink"
              }`}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    item.id === "requested" && item.count > 0
                      ? "bg-brand text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative sm:w-80">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Search code, name or contact"
            value={search}
            onChange={(event) => (setSearch(event.target.value), setLimit(PAGE_SIZE))}
            aria-label="Search companies"
          />
        </div>
      </div>

      {active.isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="h-14 animate-pulse rounded-lg bg-white" />
          ))}
        </div>
      ) : active.error ? (
        <EmptyState icon={faBuilding} title="Companies could not be loaded">
          {errorMessage(active.error)}
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={faBuilding}
          title={
            search
              ? "No companies match"
              : tab === "approved"
                ? "No companies yet"
                : "No pending requests"
          }
        >
          {search ? "Try a different search." : null}
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">
                  {tab === "approved" ? "Added" : "Requested"}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, limit).map((company) => (
                <tr key={company.id} className="hover:bg-brand-50/40">
                  <td className="px-4 py-3">
                    <span className="rounded bg-brand-light px-2 py-0.5 font-mono text-sm font-semibold text-brand-dark">
                      {company.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {company.companyName || company.label}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>{company.contactName || "-"}</div>
                    {company.contactEmail && (
                      <div className="text-xs text-gray-400">{company.contactEmail}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {tab === "requested" ? (
                      <Badge tone="amber">Pending review</Badge>
                    ) : isYes(company.registered) ? (
                      <Badge tone={isYes(company.approved) ? "green" : "brand"}>
                        {isYes(company.approved) ? "Registered, approved" : "Registered"}
                      </Badge>
                    ) : (
                      <Badge>Not registered</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <div>{formatDate(company.timestamp)}</div>
                    {tab === "requested" && company.createdBy?.name && (
                      <div className="text-xs text-gray-400">by {company.createdBy.name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {tab === "requested" && canManage && (
                        <>
                          <Button
                            variant="secondary"
                            icon={faCheck}
                            loading={approving && approvingId === company.id}
                            onClick={() => approve(company)}
                          >
                            Approve
                          </Button>
                          <IconButton
                            label="Reject"
                            icon={faXmark}
                            danger
                            onClick={() => setDialog({ kind: "reject", company })}
                          />
                        </>
                      )}
                      {tab === "approved" && canManage && (
                        <>
                          <IconButton
                            label="Edit"
                            icon={faPen}
                            onClick={() => setDialog({ kind: "edit", company })}
                          />
                          <IconButton
                            label="History"
                            icon={faClockRotateLeft}
                            onClick={() => setDialog({ kind: "history", company })}
                          />
                          <IconButton
                            label="Delete"
                            icon={faTrashCan}
                            danger
                            onClick={() => setDialog({ kind: "delete", company })}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!active.isLoading && filtered.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>
            Showing {Math.min(limit, filtered.length)} of {filtered.length}
          </span>
          {filtered.length > limit && (
            <Button variant="ghost" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
              Show more
            </Button>
          )}
        </div>
      )}

      <CompanyFormModal
        open={dialog?.kind === "create" || dialog?.kind === "edit"}
        company={dialog?.kind === "edit" ? selected : null}
        canManage={canManage}
        onClose={close}
      />
      <CompanyHistoryModal company={dialog?.kind === "history" ? selected : null} onClose={close} />
      <ReasonModal
        open={dialog?.kind === "reject"}
        title="Reject request"
        message={
          <>
            <b className="text-ink">{selected?.companyName}</b> will not be added and code{" "}
            {selected?.code} is released. The requester is emailed the reason.
          </>
        }
        confirmLabel="Reject request"
        placeholder="e.g. Already exists as Acme Group (ACG)"
        loading={rejecting}
        onConfirm={reject}
        onClose={close}
      />
      <ReasonModal
        open={dialog?.kind === "delete"}
        title={`Delete ${selected?.code}`}
        message={
          <>
            <b className="text-ink">{selected?.companyName}</b> will be removed from the staff,
            contractor and invoicing portals&apos; company lists. Its code <b>{selected?.code}</b>{" "}
            is retired and never reissued, and a full copy is kept in the audit log.
          </>
        }
        confirmLabel="Delete company"
        placeholder="e.g. Duplicate of ACM"
        loading={deleting}
        onConfirm={remove}
        onClose={close}
      />
    </div>
  );
}
