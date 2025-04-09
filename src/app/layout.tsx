import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins", // Corrigido
  weight: ["400", "500", "600", "700"], // Peso útil
});

export const metadata: Metadata = {
  title: "Cobrato Web",
  description: "Sistema de gestão de cobranças",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="min-h-screen font-sans antialiased bg-white font-poppins">
        {children}
      </body>
    </html>
  );
}
