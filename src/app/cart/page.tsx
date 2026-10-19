import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your TRUFINE retail packs before checkout.",
};

export default function CartPage() {
  return <CartView />;
}
