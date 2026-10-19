import { Suspense } from "react";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata = { title: "Request a Quote" };

export default function InquirePage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-5 md:grid-cols-2 md:gap-10 md:py-16">
      <div>
        <p className="text-[11px] tracking-[0.22em] uppercase text-maroon">
          Bulk orders
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Tell us what you’re sourcing.</h1>
        <p className="mt-4 text-muted">
          Share the ingredient and quantity. We review every requirement before
          we respond.
        </p>
      </div>
      <Suspense>
        <InquiryForm />
      </Suspense>
    </section>
  );
}
