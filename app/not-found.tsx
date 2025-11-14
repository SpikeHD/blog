import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full overflow-hidden">
      <Link href="/" className="text-sm text-primary hover:underline">
        &lt; back to home
      </Link>

      <div className="flex h-full w-full justify-center items-center">
        <Image src="https://http.cat/404" alt="404 Not Found" width={512} height={512} className="w-full" />
      </div>
    </div>
  )
}
