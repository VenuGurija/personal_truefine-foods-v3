"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { OrderTotals } from "@/components/OrderTotals";
import {
  buildOrderMessage,
  formatINR,
  isOrder,
  ORDER_STORAGE_KEY,
  ORDER_WHATSAPP_KEY,
  smsHref,
  whatsappHref,
  type Order,
} from "@/lib/order";

export function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (isOrder(parsed)) setOrder(parsed);
      setWhatsappOpened(sessionStorage.getItem(ORDER_WHATSAPP_KEY) === "1");
    } catch {
      setOrder(null);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="mx-auto max-w-xl px-5 py-16 text-muted">Loading your order…</p>;
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-xl px-4 py-10 sm:px-5 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl">No recent order</h1>
        <p className="mt-4 text-muted">
          Place an order and the confirmation will appear here, with WhatsApp and SMS
          ready to send.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-maroon px-6 py-3 text-[12px] tracking-[0.14em] uppercase text-white"
        >
          Browse products
        </Link>
      </section>
    );
  }

  const message = buildOrderMessage(order);
  const placedOn = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <section className="mx-auto max-w-xl px-4 py-8 sm:px-5 md:py-14">
      <article className="border border-ink/10 bg-white p-5 shadow-sm md:p-7">
        <div className="flex gap-3">
          <Check className="mt-1 shrink-0" size={18} aria-hidden />
          <div>
            <h1 className="text-lg font-semibold">Confirmed</h1>
            <p>We&apos;re preparing these items for shipping.</p>
            <p className="mt-2 text-sm text-muted">{placedOn}</p>
          </div>
        </div>

        <ul className="mt-6 divide-y divide-ink/10">
          {order.lines.map((line) => (
            <li key={`${line.slug}-${line.packSize}`} className="flex items-center gap-3 py-4 sm:gap-4">
              <div
                className="relative h-16 w-16 shrink-0"
                style={{ backgroundColor: line.accent }}
              >
                {line.image ? (
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-white">
                  {line.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p>
                  {line.name} | {line.packSize}
                </p>
                <p className="text-sm text-muted">{line.packSize}</p>
              </div>
              <p className="shrink-0">{formatINR(line.lineTotal)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-2 border-t border-ink/10 pt-4">
          <OrderTotals quote={order} />
        </div>
      </article>

      <div className="mt-6 border border-ink/10 bg-white p-5">
        <p className="text-[11px] tracking-[0.16em] uppercase text-maroon">
          Order {order.id}
        </p>
        <p className="mt-3 text-sm">
          {whatsappOpened
            ? "WhatsApp opened with your order. Send that message so TRUEFINE receives it and you keep a copy in the chat."
            : "Your browser did not open WhatsApp. Use the button below to send the order."}
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-[12px] tracking-[0.12em] uppercase">
            Order message
          </summary>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {message}
          </pre>
        </details>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={whatsappHref(message)}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] px-5 py-3 text-center text-[12px] tracking-[0.12em] uppercase text-white"
          >
            Send on WhatsApp
          </a>
          <a
            href={smsHref(message)}
            className="border border-ink/20 px-5 py-3 text-center text-[12px] tracking-[0.12em] uppercase"
          >
            Send by SMS
          </a>
        </div>
        <p className="mt-4 text-sm text-muted">
          Payment: {order.payment}. No payment is taken on this page.
        </p>
      </div>

      <Link
        href="/products"
        className="mt-6 inline-block text-[12px] tracking-[0.14em] uppercase text-maroon"
      >
        Continue shopping
      </Link>
    </section>
  );
}
