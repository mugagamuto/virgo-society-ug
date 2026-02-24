import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    images: [{ url: "/og.svg" }],
  },
  icons: {
    icon: "/brand/virgo-mark.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
