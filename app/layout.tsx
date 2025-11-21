import type { Metadata } from "next";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Globe } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Header } from "./components/header";

import "./globals.css";

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
  description: "A blog about software, hardware, and also neither of those things sometimes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppinsMono.variable} antialiased w-screen h-screen overflow-hidden`}
      >
        <div className="flex items-start justify-center w-full h-full">
          <div className="flex flex-col w-full max-w-4xl h-full">
            <div className="flex flex-col lg:flex-row h-full min-h-0">
              <div className="flex flex-col justify-between w-full lg:w-1/4 lg:h-full px-4 lg:pr-8 pb-4 lg:pb-0 flex-shrink-0">
                <div>
                  <Header />

                  <p className="mt-4 text-center text-sm lg:text-base">
                    A blog about software, hardware, and also neither of those things sometimes.
                  </p>

                  <div className="mt-4 lg:mt-8 flex flex-row justify-center">
                    <Link className="mx-1" href="https://github.com/SpikeHD" target="_blank" rel="noopener noreferrer">
                      <SiGithub />
                    </Link>

                    <Link className="mx-1" href="https://spikehd.dev" target="_blank" rel="noopener noreferrer">
                      <Globe />
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="my-4 text-center text-xs italic hidden lg:block">
                    The written contents of this blog are not - in any way - created using generative AI. Thoughts are my own etc. etc.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-3/4 px-4 lg:pl-8 lg:pr-4 lg:border-l border-accent border-dashed overflow-y-auto flex-1 min-h-0">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
