import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place a TRUEFINE order and send it on WhatsApp or SMS.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
