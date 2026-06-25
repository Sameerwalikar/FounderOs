import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FounderOS AI",
  description: "AI-powered startup blueprint generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
