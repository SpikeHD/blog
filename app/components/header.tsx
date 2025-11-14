import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center">
        <Image
          src="https://avatars.githubusercontent.com/u/25207995?v=4"
          alt="SpikeHD's Profile Picture"
          width={0}
          height={0}
          className="rounded-full mr-4 w-14 h-14"
        />
        <Link href="/" className="mr-4 hover:underline">
          <h1 className="text-4xl font-bold">SpikeHD&apos;s Evil Hell World</h1>
        </Link>
      </div>
    </div>
  )
}
