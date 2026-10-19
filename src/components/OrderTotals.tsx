import { Tag } from "lucide-react";
import { shop } from "@/data/site";
import { formatINR, type Quote } from "@/lib/order";

export function OrderTotals({
  quote,
  showHints = false,
}: {
  quote: Quote;
  showHints?: boolean;
}) {
  const packsToDiscount = Math.max(0, shop.discountMinQty - quote.itemCount);

  return (
    <div>
      <dl className="space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt>
            Subtotal · {quote.itemCount} {quote.itemCount === 1 ? "item" : "items"}
          </dt>
          <dd>{formatINR(quote.subtotal)}</dd>
        </div>
        {quote.discount > 0 ? (
          <div className="flex items-start justify-between gap-4">
            <dt>
              Order discount
              <span className="mt-1 flex items-center gap-1 text-[12px] text-maroon">
                <Tag size={12} aria-hidden />
                {quote.discountCode}
              </span>
            </dt>
            <dd>-{formatINR(quote.discount)}</dd>
          </div>
        ) : null}
        <div className="flex items-start justify-between gap-4">
          <dt>Shipping</dt>
          <dd>{quote.shipping === 0 ? "Free" : formatINR(quote.shipping)}</dd>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-ink/10 pt-3">
          <dt className="font-serif text-2xl">Total</dt>
          <dd className="text-right">
            <span className="mr-2 text-[11px] tracking-[0.14em] uppercase text-muted">
              INR
            </span>
            <span className="text-lg font-semibold">{formatINR(quote.total)}</span>
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">Prices include applicable taxes.</p>
      {quote.discount > 0 ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <Tag size={16} aria-hidden />
          Total savings {formatINR(quote.discount)}
        </p>
      ) : null}
      {showHints && packsToDiscount > 0 ? (
        <p className="mt-3 text-sm text-muted">
          Add {packsToDiscount} more {packsToDiscount === 1 ? "pack" : "packs"} for 8%
          off with {shop.discountCode}.
        </p>
      ) : null}
      {showHints && quote.shipping > 0 ? (
        <p className="mt-2 text-sm text-muted">
          Free shipping on orders of ₹1,000 or more.
        </p>
      ) : null}
    </div>
  );
}
