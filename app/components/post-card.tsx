import Link from "next/link";
import { Post } from "../util/posts";

export default function PostCard({ post }: { post: Post}) {
  return (
    <Link href={`/post/${post.slug}`} className="text-xl font-bold">
      <div className="
        flex
        flex-col
        grow
        items-start
        text-foreground
        no-underline
        w-full
        mb-4
        p-4
        rounded-xl
        border
        border-foreground
        transition-all
        duration-200
        drop-shadow-[-10px_10px_0_#000]
        bg-background

        hover:bg-foreground
        hover:text-background
        hover:cursor-pointer
        hover:translate-x-1.5
        hover:-translate-y-1.5
        hover:drop-shadow-[-16px_16px_0_#000]
      ">
          {post.metadata.title}
        <p className="text-sm text-accent">{new Date(post.metadata.date).toLocaleDateString()}</p>
      </div>
    </Link>
  )
}
