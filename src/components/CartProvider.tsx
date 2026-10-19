"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isCartLine, type CartLine } from "@/lib/order";

const STORAGE_KEY = "trufine-cart";

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  add: (slug: string, packSize: string, qty?: number) => void;
  setQty: (slug: string, packSize: string, qty: number) => void;
  remove: (slug: string, packSize: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(qty: number) {
  return Math.max(1, Math.min(20, Math.floor(qty)));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const dirtyRef = useRef(false);

  const commit = (recipe: (current: CartLine[]) => CartLine[]) => {
    dirtyRef.current = true;
    setLines((current) => {
      const next = recipe(current);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (!dirtyRef.current) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (Array.isArray(parsed)) setLines(parsed.filter(isCartLine));
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      ready,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      add(slug, packSize, qty = 1) {
        const nextQty = clampQty(qty);
        commit((current) => {
          const index = current.findIndex(
            (line) => line.slug === slug && line.packSize === packSize,
          );
          if (index === -1) return [...current, { slug, packSize, qty: nextQty }];
          return current.map((line, itemIndex) =>
            itemIndex === index
              ? { ...line, qty: Math.min(20, line.qty + nextQty) }
              : line,
          );
        });
      },
      setQty(slug, packSize, qty) {
        commit((current) => {
          if (qty < 1) {
            return current.filter(
              (line) => !(line.slug === slug && line.packSize === packSize),
            );
          }
          return current.map((line) =>
            line.slug === slug && line.packSize === packSize
              ? { ...line, qty: clampQty(qty) }
              : line,
          );
        });
      },
      remove(slug, packSize) {
        commit((current) =>
          current.filter((line) => !(line.slug === slug && line.packSize === packSize)),
        );
      },
      clear() {
        commit(() => []);
      },
    }),
    [lines, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
