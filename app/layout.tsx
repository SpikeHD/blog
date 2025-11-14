import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

const poppinsMono = Poppins({
  variable: "--font-poppins-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "SpikeHD's Evil Hell World",
  description: "A blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppinsMono.variable} antialiased`}
      >
        <div className="flex items-center justify-center">
          <div className="flex flex-col w-4xl">
            <Header />

            <main>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
