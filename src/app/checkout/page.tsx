import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place a TRUFINE order and send it on WhatsApp or SMS.",
};

export default function CheckoutPage() {
  return <CheckoutForm accessKey={process.env.WEB3FORMS_ACCESS_KEY ?? ""} />;
}
