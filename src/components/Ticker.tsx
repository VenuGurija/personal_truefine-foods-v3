"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { shop } from "@/data/site";

const messages = [
  // { href: "/products", text: "Dussehra · order today, 10% off your next order" },
  { href: "/products", text: "Retail packs ship across India" },
  {
    href: "/products",
    text: `Free shipping on orders above ₹${shop.freeShippingSubtotal.toLocaleString("en-IN")}`,
  },
];

export function Ticker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % messages.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  const message = messages[index];

  return (
    <div className="bg-maroon text-white">
      <Link
        href={message.href}
        className="flex min-h-11 w-full items-center justify-center gap-2 px-3 py-2 text-center text-[12px] leading-snug font-semibold tracking-wide uppercase sm:text-[13px] sm:tracking-[0.08em]"
      >
        <span>{message.text}</span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
