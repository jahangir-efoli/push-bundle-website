import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Form field (docs/PLAN.md §6 forms a11y):
 *  - always a visible <label> (never placeholder-as-label)
 *  - inline error wired via aria-describedby + aria-invalid
 *  - ≥44px tall touch target
 * Server Component (works inside client forms too).
 */

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

function FieldShell({
  label,
  error,
  hint,
  id,
  describedBy,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  id: string;
  describedBy?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${describedBy}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${describedBy}-error`}
          className="text-sm font-medium text-error-foreground"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const CONTROL =
  "w-full rounded-lg border bg-surface px-4 text-foreground placeholder:text-muted " +
  "transition-colors focus-visible:border-primary aria-invalid:border-error";

export function Input({
  label,
  error,
  hint,
  className,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = props.id ?? autoId;
  const described = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;

  return (
    <FieldShell label={label} error={error} hint={hint} id={id} describedBy={id}>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={described}
        className={cn(CONTROL, "h-12 border-border", className)}
      />
    </FieldShell>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className,
  ...props
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const id = props.id ?? autoId;
  const described = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;

  return (
    <FieldShell label={label} error={error} hint={hint} id={id} describedBy={id}>
      <textarea
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={described}
        className={cn(CONTROL, "min-h-32 border-border py-3", className)}
      />
    </FieldShell>
  );
}
