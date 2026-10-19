import { NextResponse } from "next/server";
import { acceptOrder } from "@/lib/order";
import { appendOrderToSheet } from "@/lib/order-sheet";

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

  const sheet = await appendOrderToSheet(order);

  if (sheet === "skipped") {
    return NextResponse.json(
      { ok: false, error: "Order log is not configured yet.", sheet },
      { status: 503 },
    );
  }

  if (sheet === "failed") {
    return NextResponse.json(
      { ok: false, error: "Could not record the order.", sheet },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, sheet });
}
