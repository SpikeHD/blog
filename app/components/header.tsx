import Image from "next/image";
import Link from "next/link";
import { AVATAR_URL } from "../constants";

export function Header() {
  return (
    <div className="flex flex-row-reverse mt-4 lg:flex-col w-full justify-center items-center">
      <Link href="/" className="mr-4 lg:mr-0 hover:underline mx-4 lg:mx-0">
        <h1 className="text-xl lg:text-4xl font-bold text-center">SpikeHD&apos;s Evil Hell World</h1>
      </Link>

      <div className="shrink-0 w-12 h-12 lg:w-36 lg:h-36">
        <Image
          src={AVATAR_URL}
          alt="SpikeHD's Profile Picture"
          width={128}
          height={128}
          className="w-full h-full rounded-full aspect-square object-cover"
        />
      </div>
    </div>
  )
}
