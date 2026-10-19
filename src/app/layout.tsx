import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";
import { WhatsAppDock } from "@/components/WhatsAppDock";
import "./globals.css";

const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2c1238",
};

export const metadata: Metadata = {
  title: {
    default: "TRUFINE FOODS — Dehydrated Products from India",
    template: "%s | TRUFINE FOODS",
  },
  description:
    "Premium dehydrated food ingredients from India for food businesses. Vegetable, fruit and botanical powders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body className={`${sans.variable} font-sans antialiased`}>
        <CartProvider>
          <div className="sticky top-0 z-50 print:hidden">
            <Ticker />
            <Header />
          </div>
          <main>{children}</main>
          <Footer />
          <WhatsAppDock />
        </CartProvider>
      </body>
    </html>
  );
}
