// Small shared UI primitives in the Amni brand.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark disabled:bg-brand/60",
  secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
  ghost: "text-gray-600 hover:bg-gray-100",
};

export const Button = ({
  variant = "primary",
  icon,
  loading,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: IconDefinition;
  loading?: boolean;
}) => (
  <button
    type="button"
    {...props}
    disabled={props.disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
  >
    {loading ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ) : (
      icon && <FontAwesomeIcon icon={icon} className="h-4 w-4" />
    )}
    {children}
  </button>
);

export const Field = ({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-0.5 text-brand">*</span>}
    </span>
    {children}
    {hint && !error && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export const Badge = ({
  tone = "gray",
  children,
}: {
  tone?: "gray" | "brand" | "green" | "amber" | "red";
  children: React.ReactNode;
}) => {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    brand: "bg-brand-light text-brand-dark",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

export const EmptyState = ({
  icon,
  title,
  children,
}: {
  icon: IconDefinition;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
    <FontAwesomeIcon icon={icon} className="mx-auto h-8 w-8 text-gray-300" />
    <p className="mt-3 font-medium text-ink">{title}</p>
    {children && <div className="mt-1 text-sm text-gray-500">{children}</div>}
  </div>
);
