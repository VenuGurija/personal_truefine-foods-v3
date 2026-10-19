import { contact, seller } from "@/data/site";
import { formatINR, paymentMode, roundMoney, type Order } from "@/lib/order";

const BELOW_TWENTY = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function twoDigits(value: number) {
  if (value < 20) return BELOW_TWENTY[value];
  const ten = Math.floor(value / 10);
  const one = value % 10;
  return one ? `${TENS[ten]}-${BELOW_TWENTY[one]}` : TENS[ten];
}

function threeDigits(value: number) {
  const hundred = Math.floor(value / 100);
  const rest = value % 100;
  const parts: string[] = [];
  if (hundred) parts.push(`${BELOW_TWENTY[hundred]} hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(" ");
}

function indianNumber(value: number) {
  if (value === 0) return "zero";
  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const rest = value % 1000;
  const parts: string[] = [];
  if (crore) parts.push(`${threeDigits(crore)} crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} thousand`);
  if (rest) parts.push(threeDigits(rest));
  return parts.join(" ");
}

function titleWords(value: string) {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

export function amountInWords(amount: number) {
  const rounded = roundMoney(amount);
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);
  const rupeeWords = titleWords(indianNumber(rupees));
  if (!paise) return `Indian Rupees ${rupeeWords} Only`;
  return `Indian Rupees ${rupeeWords} and ${titleWords(twoDigits(paise))} Paise Only`;
}

export function formatInvoiceDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function sellerLines() {
  const lines = [
    seller.legalName,
    contact.address,
    `Phone: ${contact.phone}`,
    `Email: ${contact.email}`,
  ];
  if (seller.gstin) lines.push(`GSTIN: ${seller.gstin}`);
  return lines;
}

export function buildInvoiceText(order: Order) {
  const items = order.lines.flatMap((line, index) => [
    `${index + 1}. ${line.name} | ${line.packSize}`,
    `   Qty ${line.qty}  ×  ${formatINR(line.unitPrice)}  =  ${formatINR(line.lineTotal)}`,
  ]);

  const totals = [`Subtotal: ${formatINR(order.subtotal)}`];
  if (order.discount > 0) {
    totals.push(
      `Discount${order.discountCode ? ` (${order.discountCode})` : ""}: -${formatINR(order.discount)}`,
    );
  }
  totals.push(
    `Shipping: ${order.shipping === 0 ? "Free" : formatINR(order.shipping)}`,
  );
  totals.push(`Total quantity: ${order.itemCount}`);
  totals.push(`Total amount: ${formatINR(order.total)}`);

  return [
    seller.legalName,
    "TAX INVOICE",
    "",
    `Invoice no: ${order.id}`,
    `Order ID: ${order.id}`,
    `Date: ${formatInvoiceDate(order.createdAt)}`,
    `Payment mode: ${paymentMode(order.payment)} (${order.payment})`,
    "",
    "Bill to",
    order.customer.name,
    order.customer.address,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    "",
    "Sold by",
    ...sellerLines(),
    "",
    "Items",
    ...items,
    "",
    ...totals,
    "",
    `Amount in words: ${amountInWords(order.total)}`,
    "",
    "Prices are inclusive of applicable taxes.",
    "This is an auto-generated invoice and does not need a signature.",
  ].join("\n");
}
