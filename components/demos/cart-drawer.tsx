"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type CartItem = { name: string; variant?: string; img?: string };
export type CartBundle = {
  title: string;
  id?: string;
  /** Bundle thumbnail (local path). */
  img?: string;
  /** Bundle line price (after discount). */
  price: number;
  subtotal: number;
  items: CartItem[];
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

/**
 * Slide-in cart drawer for the interactive demos (models the live PushBundle
 * cart). The bundle is shown as ONE line item with its nested products, matching
 * how a bundle appears in a real cart. Rendered inside the (relative) preview
 * window so it slides in over the storefront, exactly like the reference.
 */
export function CartDrawer({
  bundle,
  onClose,
}: {
  bundle: CartBundle | null;
  onClose: () => void;
}) {
  const open = !!bundle;
  const [showItems, setShowItems] = useState(true);

  // Re-expand the nested items each time a new bundle is added.
  useEffect(() => {
    if (bundle) setShowItems(true);
  }, [bundle]);

  return (
    <>
      {/* Dim mask */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-30 bg-[rgba(20,25,40,0.34)] transition-opacity duration-250",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Your cart"
        aria-hidden={!open}
        className={cn(
          "absolute top-0 right-0 z-40 flex h-full w-[86%] max-w-[340px] flex-col bg-white transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          // Only cast the leftward panel shadow while OPEN — when closed the
          // panel parks at translate-x-full (just off the right edge) and its
          // shadow would otherwise bleed left onto the preview's right side.
          open
            ? "translate-x-0 shadow-[-14px_0_44px_rgba(0,0,0,0.2)]"
            : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-[#eceef2] px-4 py-3.5 text-sm font-bold text-[#1f2430]">
          <span>Your cart</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="cursor-pointer text-base leading-none text-[#9aa0ac] hover:text-[#1f2430]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {bundle && (
            <div className="rounded-xl border border-[#eceef2] p-3">
              <div className="flex items-center gap-2.5">
                {bundle.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bundle.img}
                    alt=""
                    className="size-11 shrink-0 rounded-lg bg-[#f3f1ee] object-cover"
                  />
                )}
                <div className="min-w-0 flex-1 text-xs leading-tight font-bold text-[#1f2430]">
                  {bundle.title}
                  {bundle.id && (
                    <small className="mt-0.5 block font-normal text-[10.5px] text-[#9aa0ac]">
                      BundleId: {bundle.id}
                    </small>
                  )}
                </div>
                <span className="text-[13px] font-bold text-[#1f2430]">
                  {usd(bundle.price)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowItems((s) => !s)}
                className="mt-2.5 cursor-pointer text-[11.5px] font-bold text-[#c81e63]"
              >
                {showItems
                  ? `Hide ${bundle.items.length} items ▲`
                  : `Show ${bundle.items.length} items ▼`}
              </button>

              {showItems && (
                <div className="mt-1 ml-1.5 border-l-2 border-[#eceef2] pl-2.5">
                  {bundle.items.map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 py-1.5 text-xs text-[#1f2430]"
                    >
                      {it.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={it.img}
                          alt=""
                          className="size-[30px] shrink-0 rounded-md bg-[#f3f1ee] object-cover"
                        />
                      )}
                      <span className="min-w-0 flex-1 leading-tight">
                        1 × {it.name}
                        {it.variant && (
                          <small className="text-[#9aa0ac]"> / {it.variant}</small>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[#eceef2] p-4">
          <div className="mb-2.5 flex justify-between text-sm font-bold text-[#1f2430]">
            <span>Subtotal</span>
            <span>{bundle ? usd(bundle.subtotal) : "$0.00"}</span>
          </div>
          <button
            type="button"
            className="block w-full cursor-pointer rounded-[10px] bg-[#1f2430] py-3 text-center text-sm font-semibold text-white hover:bg-black"
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}
