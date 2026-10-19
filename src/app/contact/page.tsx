import { contact } from "@/data/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-5 md:py-16">
      <h1 className="font-serif text-4xl md:text-5xl">Contact</h1>
      <ul className="mt-8 space-y-3 text-muted">
        <li>{contact.email}</li>
        <li>{contact.phone}</li>
        <li>{contact.address}</li>
      </ul>
    </section>
  );
}
