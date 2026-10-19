"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { OrderTotals } from "@/components/OrderTotals";
import { buildInvoiceText } from "@/lib/invoice";
import {
  buildOrderMessage,
  formatINR,
  normalizePhone,
  INVOICE_EMAIL_KEY,
  ORDER_STORAGE_KEY,
  ORDER_WHATSAPP_KEY,
  quoteCart,
  whatsappHref,
  type Order,
  type PaymentMethod,
} from "@/lib/order";

async function sendInvoiceEmail(accessKey: string, order: Order) {
  if (!accessKey) return false;
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `TRUFINE invoice ${order.id} — ${order.customer.name}`,
        from_name: "TRUFINE FOODS",
        email: order.customer.email,
        name: order.customer.name,
        phone: order.customer.phone,
        address: order.customer.address,
        payment: order.payment,
        order_id: order.id,
        invoice_no: order.id,
        total: order.total,
        message: buildInvoiceText(order),
      }),
    });
    const data = (await response.json()) as { success?: boolean };
    return response.ok && data.success !== false;
  } catch {
    return false;
  }
}

const payments: PaymentMethod[] = ["Cash on delivery", "Pay on WhatsApp (UPI)"];

export function CheckoutForm({ accessKey }: { accessKey: string }) {
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const quote = useMemo(() => quoteCart(lines), [lines]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!ready) {
    return <p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading checkout…</p>;
  }

  if (!quote.lines.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-5 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl">Checkout</h1>
        <p className="mt-4 text-muted">Add a pack before checkout.</p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-maroon px-6 py-3 text-[12px] tracking-[0.14em] uppercase text-white"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-5 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="order-2 lg:order-1">
        <p className="text-[11px] tracking-[0.18em] uppercase text-maroon">
          <Link href="/cart">Cart</Link>
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Checkout</h1>
        <p className="mt-4 max-w-xl text-muted">
          Place the order here. An invoice is emailed with the order, and
          WhatsApp opens so you can send the same order in one tap.
        </p>
        <form
          className="mt-8 grid gap-4 border border-ink/10 bg-white p-4 sm:p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (submitting) return;
            const form = new FormData(event.currentTarget);
            const name = String(form.get("name") ?? "").trim();
            const email = String(form.get("email") ?? "").trim();
            const address = String(form.get("address") ?? "")
              .trim()
              .replace(/\s+/g, " ");
            const phone = normalizePhone(String(form.get("phone") ?? ""));
            const payment = String(form.get("payment") ?? "") as PaymentMethod;

            if (!phone) {
              setError("Enter a 10-digit Indian mobile number.");
              return;
            }
            if (address.length < 10) {
              setError("Enter the full delivery address, including the PIN code.");
              return;
            }
            if (!payments.includes(payment)) {
              setError("Choose how you would like to pay.");
              return;
            }

            setError("");
            setSubmitting(true);
            const order = {
              ...quote,
              id: `TF-${Date.now()}`,
              createdAt: new Date().toISOString(),
              customer: { name, phone, email, address },
              payment,
            };
            const message = buildOrderMessage(order);
            sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
            let invoiceEmailed = false;
            try {
              const [, emailed] = await Promise.all([
                fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(order),
                }),
                sendInvoiceEmail(accessKey, order),
              ]);
              invoiceEmailed = emailed;
            } catch {
              invoiceEmailed = false;
            }
            sessionStorage.setItem(INVOICE_EMAIL_KEY, invoiceEmailed ? "1" : "0");
            const opened = window.open(
              whatsappHref(message),
              "_blank",
              "noopener,noreferrer",
            );
            sessionStorage.setItem(ORDER_WHATSAPP_KEY, opened ? "1" : "0");
            clear();
            router.push("/order/confirmation");
          }}
        >
          <label className="text-sm">
            Name *
            <input
              required
              name="name"
              autoComplete="name"
              className="mt-1 h-11 w-full border border-ink/15 px-3"
            />
          </label>
          <label className="text-sm">
            Phone *
            <input
              required
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="10-digit mobile number"
              className="mt-1 h-11 w-full border border-ink/15 px-3"
            />
          </label>
          <label className="text-sm">
            Email *
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="mt-1 h-11 w-full border border-ink/15 px-3"
            />
          </label>
          <label className="text-sm">
            Delivery address *
            <textarea
              required
              name="address"
              rows={3}
              autoComplete="street-address"
              placeholder="Area, city, state, PIN code"
              className="mt-1 w-full border border-ink/15 px-3 py-2"
            />
          </label>
          <fieldset className="text-sm">
            <legend>Payment *</legend>
            <div className="mt-2 grid gap-2">
              {payments.map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    required
                    type="radio"
                    name="payment"
                    value={method}
                    defaultChecked={method === payments[0]}
                  />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>
          {error ? <p className="text-sm text-maroon">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 bg-maroon px-6 py-3 text-[12px] tracking-[0.14em] uppercase text-white disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>
      </div>
      <aside className="order-1 h-fit border border-ink/10 bg-white p-4 sm:p-6 lg:order-2">
        <h2 className="font-serif text-3xl">Your order</h2>
        <ul className="mt-4 divide-y divide-ink/10 text-sm">
          {quote.lines.map((line) => (
            <li
              key={`${line.slug}-${line.packSize}`}
              className="flex flex-col gap-1 py-3 min-[420px]:flex-row min-[420px]:justify-between min-[420px]:gap-4"
            >
              <span>
                {line.name} · {line.packSize} × {line.qty}
              </span>
              <span className="shrink-0">{formatINR(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <OrderTotals quote={quote} />
        </div>
      </aside>
    </section>
  );
}
