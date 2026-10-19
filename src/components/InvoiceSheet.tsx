import { seller } from "@/data/site";
import { amountInWords, formatInvoiceDate, sellerLines } from "@/lib/invoice";
import { formatINR, paymentMode, type Order } from "@/lib/order";

export function InvoiceSheet({ order }: { order: Order }) {
  const mode = paymentMode(order.payment);

  return (
    <article className="invoice-sheet border border-ink/30 bg-white p-4 text-[13px] leading-snug text-ink sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-wide">Bill to</p>
          <p className="mt-1 font-semibold">{order.customer.name}</p>
          <p className="max-w-sm">{order.customer.address}</p>
          <p>Phone: {order.customer.phone}</p>
          <p>Email: {order.customer.email}</p>
        </div>
        <p className="text-[12px] text-muted">1/1</p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-base font-bold tracking-[0.18em]">{seller.legalName}</p>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.22em]">TAX INVOICE</p>
        <p className="mt-3 text-sm font-semibold">{order.id}</p>
      </div>

      <div className="mt-5 grid gap-4 border-t border-ink/20 pt-4 sm:grid-cols-2">
        <div>
          <p className="font-semibold">Sold by</p>
          {sellerLines().map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div>
          <p className="font-semibold">Order details</p>
          <p>Payment mode — {mode}</p>
          <p>{order.payment}</p>
          <p>Total amount — {formatINR(order.total)}</p>
          <p>Invoice no — {order.id}</p>
          <p>Order ID — {order.id}</p>
          <p>Date — {formatInvoiceDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead>
            <tr>
              <th className="border border-ink/25 px-2 py-1.5 font-semibold">Product Name</th>
              <th className="border border-ink/25 px-2 py-1.5 text-right font-semibold">
                Quantity
              </th>
              <th className="border border-ink/25 px-2 py-1.5 text-right font-semibold">
                Unit Price
              </th>
              <th className="border border-ink/25 px-2 py-1.5 text-right font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => (
              <tr key={`${line.slug}-${line.packSize}`}>
                <td className="border border-ink/25 px-2 py-1.5">
                  {line.name} | {line.packSize}
                </td>
                <td className="border border-ink/25 px-2 py-1.5 text-right">{line.qty}</td>
                <td className="border border-ink/25 px-2 py-1.5 text-right">
                  {formatINR(line.unitPrice)}
                </td>
                <td className="border border-ink/25 px-2 py-1.5 text-right">
                  {formatINR(line.lineTotal)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-ink/25 px-2 py-1.5 font-semibold" colSpan={3}>
                Total quantity: {order.itemCount}
              </td>
              <td className="border border-ink/25 px-2 py-1.5" />
            </tr>
            <tr>
              <td className="border border-ink/25 px-2 py-1.5" colSpan={3}>
                Subtotal
              </td>
              <td className="border border-ink/25 px-2 py-1.5 text-right">
                {formatINR(order.subtotal)}
              </td>
            </tr>
            {order.discount > 0 ? (
              <tr>
                <td className="border border-ink/25 px-2 py-1.5" colSpan={3}>
                  Discount{order.discountCode ? ` (${order.discountCode})` : ""}
                </td>
                <td className="border border-ink/25 px-2 py-1.5 text-right">
                  -{formatINR(order.discount)}
                </td>
              </tr>
            ) : null}
            <tr>
              <td className="border border-ink/25 px-2 py-1.5" colSpan={3}>
                Shipping
              </td>
              <td className="border border-ink/25 px-2 py-1.5 text-right">
                {order.shipping === 0 ? "Free" : formatINR(order.shipping)}
              </td>
            </tr>
            <tr>
              <td className="border border-ink/25 px-2 py-1.5 font-semibold" colSpan={3}>
                Total amount
              </td>
              <td className="border border-ink/25 px-2 py-1.5 text-right font-semibold">
                {formatINR(order.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[12px]">Amount in words: {amountInWords(order.total)}</p>
      <p className="mt-1 text-[11px] text-muted">Prices are inclusive of applicable taxes.</p>
      <p className="mt-6 text-center text-[10px] tracking-[0.08em] text-muted uppercase">
        This is an auto-generated invoice and does not need a signature.
      </p>
    </article>
  );
}
