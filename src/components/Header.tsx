"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About us" },
  { href: "/inquire", label: "Bulk inquiry" },
  { href: "/contact", label: "Contact us" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
    setSearchOpen(false);
    setOpen(false);
  }

  return (
    <>
      <header className="border-b border-maroon/10 bg-white">
        <div className="flex h-16 w-full items-center justify-between gap-2 px-3 md:h-[78px] md:px-4">
          <Link href="/" className="relative block h-11 w-[6.75rem] shrink-0 sm:h-14 sm:w-36 md:h-16 md:w-44">
            <Image
              src="/brand/logo.png"
              alt="TRUEFINE FOODS"
              fill
              sizes="(max-width: 640px) 108px, 176px"
              className="object-contain object-left"
              priority
            />
          </Link>
          <div className="flex shrink-0 items-center text-maroon sm:gap-1 md:gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
            >
              <Search size={22} strokeWidth={1.75} />
            </button>
            <Link
              href="/cart"
              aria-label={count ? `Cart, ${count} items` : "Cart"}
              className="relative inline-flex h-10 w-10 items-center justify-center"
            >
              <ShoppingBag size={22} strokeWidth={1.75} />
              {count > 0 ? (
                <span className="absolute top-1 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={26} strokeWidth={1.75} /> : <Menu size={26} strokeWidth={1.75} />}
            </button>
          </div>
        </div>
        {searchOpen ? (
          <form
            onSubmit={submitSearch}
            className="border-t border-maroon/10 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex w-full gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search powders"
                aria-label="Search"
                className="h-11 flex-1 rounded-[10px] border border-maroon/15 px-4 text-maroon outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-[10px] bg-pink px-5 text-sm font-bold text-white"
              >
                Search
              </button>
            </div>
          </form>
        ) : null}
      </header>
      {open ? (
        <div className="fixed inset-0 z-[70] flex justify-end" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-maroon/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id="site-menu"
            className="relative flex h-full w-full max-w-[20rem] flex-col bg-white px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-lg font-bold text-maroon">Menu</p>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center text-maroon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-maroon/10 py-4 text-lg font-semibold text-maroon"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="border-b border-maroon/10 py-4 text-lg font-semibold text-maroon"
            >
              Cart{count > 0 ? ` (${count})` : ""}
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
