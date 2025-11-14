import Link from "next/link";

export function Tag({ name }: { name: string }) {
  return (
    <Link href={`/by-tag/${encodeURIComponent(name)}`}>
      <div className="flex items-center justify-center rounded-xl border border-foreground px-4 mx-2 no-underline!">
        {name}
      </div>
    </Link>
  )
}
