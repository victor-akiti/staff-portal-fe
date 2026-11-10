import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

const PageHeader = ({
  title,
  subtitle,
  crumbs,
  actions,
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
}) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-1 text-xs text-gray-500">
          {crumbs.map((crumb, index) => (
            <span key={crumb.label}>
              {index > 0 && <span className="mx-1.5 text-gray-300">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-brand">
                  {crumb.label}
                </Link>
              ) : (
                crumb.label
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
