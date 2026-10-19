import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your TRUEFINE order confirmation, ready to send on WhatsApp or SMS.",
};

export default function OrderConfirmationPage() {
  return <OrderConfirmation />;
}
