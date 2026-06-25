import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "FounderOS AI — Your AI Co-Founder",
  description:
    "Submit your startup idea in one sentence and get a complete blueprint with market research, business strategy, technical architecture, and more.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
