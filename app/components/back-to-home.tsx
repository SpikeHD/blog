import Link from "next/link";

export function BackToHome() {
  return (
    <div className="sticky bg-linear-to-b from-background to-transparent from-50% to-100% top-0 pb-6 z-10">
      <Link href="/" className="text-sm text-primary hover:underline">
        &lt; back to home
      </Link>
    </div>

  )
}
