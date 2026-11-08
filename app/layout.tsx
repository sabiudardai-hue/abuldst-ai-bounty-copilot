import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abuldst AI Bounty Copilot",
  description: "Analyze Web3 opportunities and create better bounty submissions with AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
