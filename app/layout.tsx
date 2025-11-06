import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Trends - Real-time Financial Data",
  description: "Track stocks, cryptocurrencies, forex, and market trends with real-time data from Alpha Vantage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
