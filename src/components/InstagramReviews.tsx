"use client";

import { contact } from "@/data/site";

const instagramUrl = `https://instagram.com/${contact.instagram}`;

const posts = [
  {
    src: "/images/instagram/abc.jpg",
    handle: "@kitchenwithkavya",
    caption: "ABC mix in tonight’s smoothie bowl",
    kind: "Reel",
  },
  {
    src: "/images/instagram/beetroot.jpg",
    handle: "@homeplate.hyd",
    caption: "Beetroot raita, powder from the pack",
    kind: "Post",
  },
  {
    src: "/images/instagram/carrot.jpg",
    handle: "@ammas.table",
    caption: "Carrot juice for Sunday breakfast",
    kind: "Reel",
  },
  {
    src: "/images/instagram/moringa.jpg",
    handle: "@dal.and.stories",
    caption: "A pinch of moringa in the dal",
    kind: "Reel",
  },
  {
    src: "/images/instagram/amla.jpg",
    handle: "@sipsoftly",
    caption: "Amla drink after a long walk",
    kind: "Post",
  },
] as const;

export function InstagramReviews() {
  return (
    <section className="overflow-hidden border-y border-maroon/10 bg-[#fff7ea] py-7" aria-label="Instagram promotions">
      <p className="mb-5 px-4 text-center text-sm font-semibold tracking-[0.14em] text-maroon uppercase">
        From our customers on Instagram
      </p>
      <div className="insta-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-4 pr-4">
            {posts.map((post) => (
              <a
                key={`${copy}-${post.handle}`}
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-[68vw] max-w-[220px] shrink-0 overflow-hidden rounded-[16px] bg-white shadow-[0_6px_16px_rgba(44,18,56,0.08)] sm:w-[220px]"
              >
                <span className="relative block aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.src} alt="" className="h-full w-full object-cover" />
                  <span className="absolute top-2 left-2 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                    {post.kind}
                  </span>
                </span>
                <span className="block px-3 py-2">
                  <span className="block truncate text-sm font-bold text-maroon">{post.handle}</span>
                  <span className="block truncate text-xs text-muted">{post.caption}</span>
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
