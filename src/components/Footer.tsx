"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { contact } from "@/data/site";

export function Footer() {
  const [email, setEmail] = useState("");

  function notify(event: FormEvent) {
    event.preventDefault();
    const address = email.trim();
    if (!address) return;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("TRUFINE updates")}&body=${encodeURIComponent(address)}`;
  }

  return (
    <footer className="border-t border-maroon/10 bg-white text-maroon print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-5 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:py-14">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">GET NOTIFIED</h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            Join TRUFINE FOODS for updates on new powders and bulk availability.
          </p>
          <form onSubmit={notify} className="mt-5 flex max-w-md flex-col gap-2 min-[420px]:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              aria-label="Email"
              className="h-11 w-full flex-1 rounded-[10px] border border-maroon/15 px-4"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-[10px] bg-pink px-4 text-sm font-bold text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div>
          <p className="text-sm font-bold">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <Link href="/products" className="hover:text-maroon">
                All products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-maroon">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/inquire" className="hover:text-maroon">
                Bulk inquiry
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-maroon">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-maroon">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${contact.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                {`instagram.com/${contact.instagram}`}
              </a>
            </li>
            <li>{contact.address}</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-maroon/10 px-4 py-4 pb-24 text-center text-xs text-muted">
        © {new Date().getFullYear()} TRUFINE FOODS
      </p>
    </footer>
  );
}
