"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/site";

export function InquiryForm() {
  const params = useSearchParams();
  const [done, setDone] = useState(false);
  const preset =
    products.find((item) => item.slug === params.get("product"))?.name ?? "";
  const wantsSpec = params.get("intent") === "specification";
  const presetMessage = wantsSpec && preset
    ? `Please share the specification sheet for ${preset}.`
    : "";

  if (done) {
    return (
      <p className="border border-ink/10 bg-white p-8 text-lg">
        Thank you. Your requirement has been received. Our team will review the
        details and get back to you.
      </p>
    );
  }

  return (
    <form
      className="grid gap-4 border border-ink/10 bg-white p-4 sm:p-6 md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
    >
      <label className="text-sm">
        Name *
        <input required name="name" className="mt-1 h-11 w-full border border-ink/15 px-3" />
      </label>
      <label className="text-sm">
        Company *
        <input required name="company" className="mt-1 h-11 w-full border border-ink/15 px-3" />
      </label>
      <label className="text-sm">
        Business email *
        <input required type="email" name="email" className="mt-1 h-11 w-full border border-ink/15 px-3" />
      </label>
      <label className="text-sm">
        Product *
        <input
          required
          name="product"
          defaultValue={preset}
          className="mt-1 h-11 w-full border border-ink/15 px-3"
        />
      </label>
      <label className="text-sm">
        Quantity
        <input name="quantity" className="mt-1 h-11 w-full border border-ink/15 px-3" />
      </label>
      <label className="text-sm">
        Message
        <textarea
          name="message"
          rows={4}
          defaultValue={presetMessage}
          className="mt-1 w-full border border-ink/15 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        className="min-h-11 bg-maroon px-6 py-3 text-[12px] tracking-[0.14em] uppercase text-white"
      >
        Submit B2B inquiry
      </button>
    </form>
  );
}
