import { Suspense } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { InstagramReviews } from "@/components/InstagramReviews";
import { ProductGrid } from "@/components/ProductGrid";

const highlights = [
  {
    title: "Real produce",
    text: "Indian fruits and vegetables selected for the powder they become.",
  },
  {
    title: "Made in Telangana",
    text: "TRUFINE FOODS works from Chityala, Nalgonda, with a direct line for bulk orders.",
  },
  {
    title: "Retail and bulk",
    text: "Order a jar online, or inquire when you need commercial quantities.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <Suspense fallback={<p className="px-5 py-16 text-center text-muted">Loading products…</p>}>
        <ProductGrid />
      </Suspense>

      <InstagramReviews />

      <section className="bg-cream pb-8">
        <ul className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-5 md:grid-cols-3 md:py-14">
          {highlights.map((item) => (
            <li key={item.title}>
              <h2 className="text-xl font-bold text-maroon">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
