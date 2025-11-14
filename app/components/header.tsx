import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex flex-col w-full">
      <Link href="/" className="mr-4 hover:underline">
        <h1 className="text-4xl font-bold text-center">SpikeHD&apos;s Evil Hell World</h1>
      </Link>

      <Image
        src="https://avatars.githubusercontent.com/u/25207995?v=4"
        alt="SpikeHD's Profile Picture"
        width={128}
        height={128}
        className="w-full rounded-full"
      />
    </div>
  )
}
