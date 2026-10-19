"use client";

import { useState } from "react";
import Link from "next/link";
import type { Pack } from "@/data/site";
import { formatINR } from "@/lib/order";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({
  slug,
  packSize,
  qty = 1,
  label = "Add to cart",
  className = "rounded-[10px] bg-pink px-6 py-3 text-[15px] font-bold text-white",
}: {
  slug: string;
  packSize: string;
  qty?: number;
  label?: string;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(slug, packSize, qty);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "Added to cart" : label}
    </button>
  );
}

export function BuyBox({
  slug,
  packs,
}: {
  slug: string;
  packs: Pack[];
}) {
  const [packSize, setPackSize] = useState(packs[0]?.size ?? "");
  const [qty, setQty] = useState(1);
  const selected = packs.find((pack) => pack.size === packSize) ?? packs[0];

  if (!selected) return null;

  return (
    <div className="mt-6 rounded-[16px] border border-ink/10 bg-white p-4 sm:p-5 md:mt-8">
      <p className="font-serif text-3xl sm:text-4xl">{formatINR(selected.price)}</p>
      <p className="mt-1 text-sm text-muted">{selected.size} pack</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Pack size">
        {packs.map((pack) => {
          const active = pack.size === selected.size;
          return (
            <button
              key={pack.size}
              type="button"
              aria-pressed={active}
              onClick={() => setPackSize(pack.size)}
              className={`min-h-11 rounded-[10px] px-4 py-2 text-sm font-semibold ${
                active ? "bg-maroon text-white" : "border border-ink/15"
              }`}
            >
              {pack.size} · {formatINR(pack.price)}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="text-[11px] tracking-[0.14em] uppercase text-muted">Qty</span>
        <div className="inline-flex border border-ink/15">
          <button
            type="button"
            className="h-11 w-11"
            aria-label="Decrease quantity"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
          >
            −
          </button>
          <span className="flex h-11 w-11 items-center justify-center border-x border-ink/15">
            {qty}
          </span>
          <button
            type="button"
            className="h-11 w-11"
            aria-label="Increase quantity"
            onClick={() => setQty((value) => Math.min(20, value + 1))}
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <AddToCartButton
          slug={slug}
          packSize={selected.size}
          qty={qty}
          className="w-full rounded-[10px] bg-pink px-6 py-3 text-[15px] font-bold text-white sm:w-auto"
        />
        <Link
          href="/cart"
          className="inline-flex min-h-11 items-center text-[12px] tracking-[0.14em] uppercase text-maroon"
        >
          View cart
        </Link>
      </div>
      <p className="mt-4 text-sm text-muted">
        {/* Buy 3 or more packs for 8% off. */}
        Shipping is ₹130, and free from ₹1,000.
      </p>
    </div>
  );
}
