import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Solvens | Decentralized Credit Infrastructure",
  description: "Advanced credit protocol with under-collateralized loans and risk markets.",
};

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      </body>
    </html>
  );
}
