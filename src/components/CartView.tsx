"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { formatINR, quoteCart } from "@/lib/order";
import { useCart } from "@/components/CartProvider";
import { OrderTotals } from "@/components/OrderTotals";

export function CartView() {
  const { lines, ready, setQty, remove } = useCart();
  const quote = useMemo(() => quoteCart(lines), [lines]);

  if (!ready) {
    return <p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading cart…</p>;
  }

  if (!quote.lines.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl">Your cart</h1>
        <p className="mt-4 text-muted">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-[10px] bg-pink px-6 py-3 text-[15px] font-bold text-white"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-5 md:py-14 lg:grid-cols-[1.4fr_0.8fr] lg:gap-10">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl">Your cart</h1>
        <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {quote.lines.map((line) => (
            <li key={`${line.slug}-${line.packSize}`} className="flex gap-3 py-5 sm:gap-4">
              <div
                className="relative h-20 w-16 shrink-0 sm:h-24 sm:w-20"
                style={{ backgroundColor: line.accent }}
              >
                {line.image ? (
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div className="min-w-0">
                    <Link href={`/products/${line.slug}`} className="font-serif text-xl sm:text-2xl">
                      {line.name}
                    </Link>
                    <p className="text-sm text-muted">{line.packSize}</p>
                  </div>
                  <p className="shrink-0 font-semibold">{formatINR(line.lineTotal)}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="inline-flex border border-ink/15">
                    <button
                      type="button"
                      className="h-11 w-11"
                      aria-label={`Decrease ${line.name} quantity`}
                      onClick={() => setQty(line.slug, line.packSize, line.qty - 1)}
                    >
                      −
                    </button>
                    <span className="flex h-11 w-11 items-center justify-center border-x border-ink/15 text-sm">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      className="h-11 w-11"
                      aria-label={`Increase ${line.name} quantity`}
                      onClick={() => setQty(line.slug, line.packSize, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="min-h-11 px-1 text-[12px] tracking-[0.12em] uppercase text-maroon"
                    onClick={() => remove(line.slug, line.packSize)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit border border-ink/10 bg-white p-6">
        <h2 className="font-serif text-3xl">Summary</h2>
        <div className="mt-6">
          <OrderTotals quote={quote} showHints />
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex w-full justify-center bg-maroon px-6 py-3 text-[12px] tracking-[0.14em] uppercase text-white"
        >
          Checkout
        </Link>
      </aside>
    </section>
  );
}
