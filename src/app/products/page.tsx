import { Suspense } from "react";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-center text-muted">Loading products…</p>}>
      <ProductGrid />
    </Suspense>
  );
}
