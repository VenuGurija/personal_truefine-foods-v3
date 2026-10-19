"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AddToCartButton } from "@/components/BuyBox";
import { categoryLabels, products, type Category, type Product } from "@/data/site";
import { formatINR } from "@/lib/order";

const categories: Category[] = ["mix", "vegetable", "fruit", "botanical"];

type SortKey = "featured" | "az" | "za" | "price-asc" | "price-desc";

function lowestPrice(product: Product) {
  if (!product.packs?.length) return null;
  return Math.min(...product.packs.map((pack) => pack.price));
}

export function ProductGrid() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const [selected, setSelected] = useState<Category[]>([]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  const counts = useMemo(() => {
    return Object.fromEntries(
      categories.map((category) => [
        category,
        products.filter((product) => product.category === category).length,
      ]),
    ) as Record<Category, number>;
  }, []);

  const list = useMemo(() => {
    let next = products.filter((product) => {
      const matchesCategory = selected.length === 0 || selected.includes(product.category);
      const haystack = `${product.name} ${product.description}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesCategory && matchesQuery;
    });

    next = [...next].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      if (sort === "price-asc" || sort === "price-desc") {
        const left = lowestPrice(a);
        const right = lowestPrice(b);
        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;
        return sort === "price-asc" ? left - right : right - left;
      }
      return 0;
    });

    return next;
  }, [query, selected, sort]);

  function toggle(category: Category) {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-14">
      <h2 className="text-center text-[1.65rem] leading-tight font-bold text-maroon sm:text-3xl md:text-4xl">
        {query ? `Results for “${params.get("q")?.trim()}”` : "Powders for everyday nutrition"}
      </h2>
      <svg
        viewBox="0 0 180 18"
        className="mx-auto mt-2 h-4 w-44 text-gold"
        aria-hidden
      >
        <path
          d="M6 11c28-8 58-8 88 0s52 7 80-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M14 15c26-6 54-5 82 1s48 5 70-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-8 flex flex-col gap-1 text-maroon sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
        <div className="relative">
          <button
            type="button"
            className="flex min-h-11 items-center gap-3"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((value) => !value)}
          >
            <span className="font-bold">Filter:</span>
            <span className="text-maroon/80">
              Product type{selected.length ? ` (${selected.length})` : ""}
            </span>
            <ChevronDown size={16} />
          </button>
          {filterOpen ? (
            <div className="absolute top-full left-0 z-20 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-[10px] border border-maroon/10 bg-white p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-bold">Product type</span>
                <button
                  type="button"
                  className="text-muted"
                  onClick={() => setSelected([])}
                >
                  Reset
                </button>
              </div>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selected.includes(category)}
                        onChange={() => toggle(category)}
                        className="accent-maroon"
                      />
                      <span>
                        {categoryLabels[category]} ({counts[category]})
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <label className="flex min-h-11 items-center gap-3">
          <span className="font-bold">Sort by:</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="min-h-11 bg-transparent text-maroon/80"
            aria-label="Sort by"
          >
            <option value="featured">Featured</option>
            <option value="az">Alphabetically, A-Z</option>
            <option value="za">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </label>

        <p className="text-maroon/80 md:ml-auto">
          {list.length} {list.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4">
        {list.map((product) => {
          const pack = product.packs?.[0];
          const title = pack ? `${product.name} | ${pack.size}` : product.name;
          return (
            <article key={product.slug} className="flex h-full flex-col">
              <Link href={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-[10px] bg-white">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ backgroundColor: product.accent }} />
                  )}
                </div>
                <h3 className="mt-3 text-sm leading-snug font-bold text-maroon sm:text-[15px]">
                  {title}
                </h3>
              </Link>
              <p className="mt-2 text-sm text-maroon">
                {pack ? formatINR(pack.price) : product.available ? "Price on request" : "On request"}
              </p>
              <div className="mt-auto pt-3">
                {pack ? (
                  <AddToCartButton
                    slug={product.slug}
                    packSize={pack.size}
                    className="w-full rounded-[10px] bg-pink px-3 py-3 text-sm font-bold text-white sm:px-4 sm:text-[15px]"
                  />
                ) : (
                  <Link
                    href={`/inquire?product=${product.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-[10px] border border-pink px-3 py-3 text-sm font-bold text-pink sm:px-4 sm:text-[15px]"
                  >
                    Enquire
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {list.length === 0 ? (
        <p className="mt-10 text-center text-muted">No products match that search.</p>
      ) : null}
    </section>
  );
}
