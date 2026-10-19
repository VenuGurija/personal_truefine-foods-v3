export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-5 md:py-16">
      <p className="text-[11px] tracking-[0.22em] uppercase text-maroon">About</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Why TRUFINE?</h1>
      <p className="mt-6 text-lg">
        We believe people deserve true and finest products.
      </p>
      <p className="mt-4 text-muted">
        TRUFINE FOODS is our first step into food ingredients — connecting
        Indian produce with careful processing and dependable supply. We are
        building for the long term: one product, one relationship and one
        better process at a time.
      </p>
    </article>
  );
}
