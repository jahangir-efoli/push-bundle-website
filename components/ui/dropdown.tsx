"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Dropdown menu — used by the Resources nav and language switcher (Phase 2).
 *
 * A11y (docs/PLAN.md §6):
 *  - trigger exposes aria-haspopup / aria-expanded / aria-controls
 *  - Escape closes and returns focus to the trigger (no keyboard trap)
 *  - Arrow keys move between items, Home/End jump
 *  - outside click / focus-out closes
 */

export type DropdownItem = {
  label: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  /** Marks the active choice (e.g. current locale). */
  current?: boolean;
};

export function Dropdown({
  trigger,
  items,
  align = "start",
  className,
  menuClassName,
}: {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
  menuClassName?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  // Close on outside pointer down, and on Escape from anywhere in the widget
  // (focus may still be on the trigger after a click, so a document-level
  // listener is needed — a handler on the menu alone would never fire).
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const focusItem = (index: number) => {
    const count = items.length;
    const next = (index + count) % count;
    itemRefs.current[next]?.focus();
  };

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = itemRefs.current.findIndex(
      (el) => el === document.activeElement,
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(currentIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(currentIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(items.length - 1);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${baseId}-menu`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className="inline-flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-surface-subtle"
      >
        {trigger}
        <span aria-hidden="true" className={cn("transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>

      {open && (
        <div
          id={`${baseId}-menu`}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={onMenuKeyDown}
          className={cn(
            // space-y-0.5: keeps a small gap so an active item's highlight
            // never touches the adjacent hovered item.
            "absolute z-50 mt-2 flex min-w-52 flex-col gap-0.5 rounded-xl border border-border bg-surface p-1.5 shadow-lift",
            align === "end" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {items.map((item, i) => {
            const shared = {
              role: "menuitem" as const,
              tabIndex: -1,
              className: cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                item.current
                  ? "bg-primary-subtle text-primary"
                  : "text-foreground hover:bg-surface-subtle",
              ),
            };

            return item.href ? (
              <Link
                key={i}
                {...shared}
                href={item.href}
                aria-current={item.current ? "true" : undefined}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={i}
                {...shared}
                type="button"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => {
                  item.onSelect?.();
                  close(true);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
