import type { Order } from "@/lib/order";

export type SheetLogResult = "skipped" | "logged" | "failed";

function orderItems(order: Order) {
  return order.lines
    .map((line) => `${line.name} (${line.packSize}) × ${line.qty}`)
    .join("; ");
}

async function readScriptResult(response: Response) {
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) return false;
    const followed = await fetch(location, { cache: "no-store" });
    const data = (await followed.json()) as { ok?: boolean };
    return data.ok === true;
  }

  if (!response.ok) return false;
  const data = (await response.json()) as { ok?: boolean };
  return data.ok === true;
}

export async function appendOrderToSheet(order: Order): Promise<SheetLogResult> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_SECRET;
  if (!url || !secret) return "skipped";

  try {
    const response = await fetch(url, {
      method: "POST",
      redirect: "manual",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        id: order.id,
        createdAt: order.createdAt,
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        address: order.customer.address,
        payment: order.payment,
        items: orderItems(order),
        itemCount: order.itemCount,
        subtotal: order.subtotal,
        discount: order.discount,
        discountCode: order.discountCode ?? "",
        shipping: order.shipping,
        total: order.total,
      }),
    });

    return (await readScriptResult(response)) ? "logged" : "failed";
  } catch {
    return "failed";
  }
}
