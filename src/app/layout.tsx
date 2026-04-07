import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solvens | Decentralized Credit Infrastructure",
  description: "Advanced credit protocol with under-collateralized loans and risk markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
