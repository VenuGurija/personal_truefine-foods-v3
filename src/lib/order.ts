import { contact, getProduct, shop } from "@/data/site";

export type CartLine = {
  slug: string;
  packSize: string;
  qty: number;
};

export type PaymentMethod = "Cash on delivery" | "Pay on WhatsApp (UPI)";

export type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type PricedLine = {
  slug: string;
  name: string;
  packSize: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
  accent: string;
};

export type Quote = {
  lines: PricedLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  shipping: number;
  total: number;
};

export type Order = Quote & {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  payment: PaymentMethod;
};

export const ORDER_STORAGE_KEY = "trufine-order";
export const ORDER_WHATSAPP_KEY = "trufine-order-wa";
export const INVOICE_EMAIL_KEY = "trufine-invoice-email";

const PAYMENTS: PaymentMethod[] = ["Cash on delivery", "Pay on WhatsApp (UPI)"];

export function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as CartLine;
  return (
    typeof line.slug === "string" &&
    typeof line.packSize === "string" &&
    typeof line.qty === "number" &&
    Number.isFinite(line.qty) &&
    line.qty > 0
  );
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function quoteCart(lines: CartLine[]): Quote {
  const priced: PricedLine[] = [];

  for (const line of lines) {
    const product = getProduct(line.slug);
    const pack = product?.packs?.find((item) => item.size === line.packSize);
    if (!product || !pack) continue;
    const qty = Math.max(1, Math.min(20, Math.floor(line.qty)));
    priced.push({
      slug: product.slug,
      name: product.name,
      packSize: pack.size,
      qty,
      unitPrice: pack.price,
      lineTotal: roundMoney(pack.price * qty),
      image: product.image,
      accent: product.accent,
    });
  }

  const itemCount = priced.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = roundMoney(priced.reduce((sum, line) => sum + line.lineTotal, 0));
  // const discount =
  //   itemCount >= shop.discountMinQty ? roundMoney(subtotal * shop.discountRate) : 0;
  const discount = 0;
  const shipping =
    subtotal === 0 || subtotal >= shop.freeShippingSubtotal ? 0 : shop.shippingFee;
  const total = roundMoney(subtotal - discount + shipping);

  return {
    lines: priced,
    itemCount,
    subtotal,
    discount,
    // discountCode: discount > 0 ? shop.discountCode : null,
    discountCode: null,
    shipping,
    total,
  };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatINRPlain(amount: number) {
  const rounded = roundMoney(amount);
  const hasFraction = Math.round(rounded * 100) % 100 !== 0;
  return `₹${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rounded)}`;
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

export function buildOrderMessage(order: Order) {
  const items = order.lines
    .map(
      (line, index) =>
        `${index + 1}. ${line.name} (${line.packSize}) — Qty: ${line.qty} × ${formatINRPlain(line.unitPrice)} = ${formatINRPlain(line.lineTotal)}`,
    )
    .join("\n");

  const summary = [`Subtotal: ${formatINRPlain(order.subtotal)}`];
  if (order.discount > 0 && order.discountCode) {
    summary.push(
      `Order discount (${order.discountCode}): -${formatINRPlain(order.discount)}`,
    );
  }
  summary.push(
    `Shipping: ${order.shipping === 0 ? "Free" : formatINRPlain(order.shipping)}`,
  );
  summary.push(`Total: ${formatINRPlain(order.total)}`);

  return [
    "Hello TRUFINE FOODS, I would like to place an order.",
    "",
    `Order ID: ${order.id}`,
    "Order Details",
    items,
    "",
    ...summary,
    "",
    "Customer Details",
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Address: ${order.customer.address}`,
    `Payment: ${order.payment}`,
  ].join("\n");
}

export function whatsappHref(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function smsHref(message: string) {
  const digits = contact.phone.replace(/\D/g, "");
  const body = encodeURIComponent(message);
  const iOS =
    typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return iOS ? `sms:+${digits}&body=${body}` : `sms:+${digits}?body=${body}`;
}

export function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const order = value as Order;
  return (
    typeof order.id === "string" &&
    typeof order.createdAt === "string" &&
    Array.isArray(order.lines) &&
    order.customer !== undefined &&
    typeof order.customer.name === "string"
  );
}

export function paymentMode(payment: PaymentMethod) {
  return payment === "Cash on delivery" ? "COD" : "PREPAID";
}

/** Rebuilds totals from the catalog so the emailed invoice cannot use client prices. */
export function acceptOrder(value: unknown): Order | null {
  if (!isOrder(value)) return null;
  if (!/^TF-\d{10,16}$/.test(value.id)) return null;
  if (Number.isNaN(Date.parse(value.createdAt))) return null;
  if (!PAYMENTS.includes(value.payment)) return null;

  const name = value.customer.name.trim();
  const email = value.customer.email.trim();
  const address = value.customer.address.trim().replace(/\s+/g, " ");
  const phone = normalizePhone(value.customer.phone);
  if (name.length < 2 || name.length > 80) return null;
  if (!phone) return null;
  if (address.length < 10 || address.length > 400) return null;
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const quote = quoteCart(
    value.lines.map((line) => ({
      slug: line.slug,
      packSize: line.packSize,
      qty: line.qty,
    })),
  );
  if (!quote.lines.length) return null;

  return {
    ...quote,
    id: value.id,
    createdAt: value.createdAt,
    customer: { name, phone, email, address },
    payment: value.payment,
  };
}
