import { NextResponse } from "next/server";
import { contact } from "@/data/site";
import { buildInvoiceText } from "@/lib/invoice";
import { acceptOrder, type Order } from "@/lib/order";
import { appendOrderToSheet, type SheetLogResult } from "@/lib/order-sheet";

type ChannelResult = SheetLogResult;

async function sendOrderEmail(order: Order): Promise<ChannelResult> {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) return "skipped";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `TRUEFINE invoice ${order.id} — ${order.customer.name}`,
        from_name: "TRUEFINE FOODS",
        email: order.customer.email || contact.email,
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
    return response.ok && data.success !== false ? "logged" : "failed";
  } catch {
    return "failed";
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid order." }, { status: 400 });
  }

  const order = acceptOrder(body);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Invalid order." }, { status: 400 });
  }

  const [email, sheet] = await Promise.all([
    sendOrderEmail(order),
    appendOrderToSheet(order),
  ]);
  const attempted = [email, sheet].filter((result) => result !== "skipped");

  if (attempted.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Order inbox is not configured yet." },
      { status: 503 },
    );
  }

  if (attempted.every((result) => result === "failed")) {
    return NextResponse.json(
      { ok: false, error: "Could not record the order.", email, sheet },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, email, sheet });
}
