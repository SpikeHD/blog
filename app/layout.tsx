import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Header } from "./components/header";

import "./globals.css";
import Link from "next/link";

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
        className={`${poppins.variable} ${poppinsMono.variable} antialiased w-screen h-screen`}
      >
        <div className="flex items-start justify-center w-full h-full">
          <div className="flex flex-col w-4xl h-full">
            <div className="flex flex-row h-full">
              <div className="flex flex-col justify-between w-1/4 h-full pr-8">
                <div>
                  <Header />

                  <p className="mt-4 text-center">
                    A blog about software, hardware, and also neither of those things sometimes.
                  </p>

                  <div className="mt-8 flex flex-row justify-center">
                    <Link href="https://github.com/SpikeHD" target="_blank" rel="noopener noreferrer">
                      <SiGithub />
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-center text-xs italic">
                    The written contents of this blog are not - in any way - written by generative AI.
                  </p>
                </div>
              </div>

              <div className="w-3/4 pl-8 pr-4 border-l border-accent border-dashed overflow-y-scroll">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
