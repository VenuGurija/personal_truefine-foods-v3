"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: "dussehra",
    caption: "Dussehra blessings.",
    offer: true,
  },
  {
    id: "abc",
    caption: "Amla, beetroot and carrot, blended into one bright everyday powder.",
    image: "/images/hero/abc-mix.jpg",
    alt: "TRUEFINE ABC mix powder with fresh amla, beetroot and carrots",
    href: "/products/abc-mix-powder",
  },
  {
    id: "moringa",
    caption: "Tender moringa leaves, milled into a fine green powder.",
    image: "/images/hero/moringa.jpg",
    alt: "TRUEFINE moringa powder with fresh moringa leaves and pods",
    href: "/products/moringa-leaf-powder",
  },
  {
    id: "carrot",
    caption: "Sun-sweet carrots, dried into a vivid powder full of colour.",
    image: "/images/hero/carrot-field.jpg",
    alt: "TRUEFINE carrot powder with fresh carrots",
    href: "/products/carrot-powder",
  },
  {
    id: "beetroot",
    caption: "Deep red beetroot, powdered for a rich earthy colour.",
    image: "/images/hero/beetroot.jpg",
    alt: "TRUEFINE beetroot powder with fresh beetroots",
    href: "/products/beetroot-powder",
  },
  {
    id: "amla",
    caption: "Tangy orchard amla, powdered for a bright, clean taste.",
    image: "/images/hero/amla.jpg",
    alt: "TRUEFINE amla powder with fresh amla fruit",
    href: "/products/amla-powder",
  },
] as const;

const sparks = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2;
  const distance = 28 + (i % 4) * 7;
  return {
    x: `${Math.cos(angle) * distance}vw`,
    y: `${Math.sin(angle) * distance}vh`,
    delay: `${(i % 6) * 35}ms`,
    color: i % 3 === 0 ? "#fff4c8" : i % 3 === 1 ? "#f0b429" : "#ff7a2f",
  };
});

function DussehraClip({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"blessing" | "blast" | "offer">("blessing");

  useEffect(() => {
    if (!active) {
      setPhase("blessing");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("offer");
      return;
    }
    setPhase("blessing");
    const blast = window.setTimeout(() => setPhase("blast"), 2400);
    const offer = window.setTimeout(() => setPhase("offer"), 3700);
    return () => {
      window.clearTimeout(blast);
      window.clearTimeout(offer);
    };
  }, [active]);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1a0b24]">
      <Image
        src="/images/hero/kanaka-durga.jpg"
        alt="Kanaka Durga with a hand raised in blessing"
        fill
        className={`object-cover ${phase === "blessing" ? "hero-kenburns" : ""} ${phase === "offer" ? "scale-105 brightness-[0.35]" : ""}`}
        sizes="100vw"
        priority
      />
      {phase === "blast" ? (
        <div className="absolute inset-0 z-10" aria-hidden="true">
          <div className="hero-flash absolute inset-0 bg-[#fff6df]" />
          <div className="hero-core absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-[#ffb347]" />
          <div className="hero-ring absolute top-1/2 left-1/2 h-56 w-56 rounded-full border-[6px] border-[#f0b429]" />
          <div
            className="hero-ring absolute top-1/2 left-1/2 h-72 w-72 rounded-full border-4 border-white"
            style={{ animationDelay: "80ms" }}
          />
          {sparks.map((spark) => (
            <span
              key={`${spark.x}-${spark.y}`}
              className="hero-spark absolute top-1/2 left-1/2 h-3 w-3 rounded-full"
              style={{
                background: spark.color,
                animationDelay: spark.delay,
                ["--x" as string]: spark.x,
                ["--y" as string]: spark.y,
              }}
            />
          ))}
        </div>
      ) : null}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white transition-opacity duration-700 ${phase === "offer" ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">Dussehra</p>
        <p className="mt-3 text-4xl font-bold sm:text-5xl md:text-7xl">10% off</p>
        <p className="mt-3 max-w-md text-base sm:text-lg md:text-2xl">
          On your next order, if you order today.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-bold text-maroon"
        >
          Shop powders
        </Link>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const delay = slides[index].id === "dussehra" ? 9000 : 5500;
    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [paused, index]);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  const slide = slides[index];

  return (
    <section
      className="w-full"
      aria-roledescription="carousel"
      aria-label="Product stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden bg-cream">
        <h1 className="sr-only">TRUEFINE dehydrated powders</h1>
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((item, itemIndex) => (
            <article key={item.id} className="w-full min-w-full shrink-0">
              <p className="flex min-h-[4.5rem] items-center justify-center px-4 py-2 text-center text-sm leading-snug font-semibold text-maroon md:min-h-20 md:px-16 md:text-xl">
                {item.caption}
              </p>
              {"image" in item ? (
                <Link href={item.href} className="relative block aspect-[16/9] w-full">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={item.id === "abc"}
                  />
                </Link>
              ) : (
                <DussehraClip active={itemIndex === index} />
              )}
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[4.5rem] bottom-0 md:top-20">
          <button
            type="button"
            className="pointer-events-auto absolute top-1/2 left-2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-maroon shadow md:left-3"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="pointer-events-auto absolute top-1/2 right-2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-maroon shadow md:right-3"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            <ChevronRight size={22} />
          </button>

          <div className="pointer-events-auto absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center rounded-full bg-white/80 px-1.5 py-1">
            {slides.map((item, dot) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show slide ${dot + 1}`}
                aria-current={dot === index ? "true" : undefined}
                onClick={() => go(dot)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <span
                  className={`h-2.5 rounded-full ${dot === index ? "w-6 bg-maroon" : "w-2.5 bg-maroon/30"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {slide.caption}
        </p>
      </div>
    </section>
  );
}
