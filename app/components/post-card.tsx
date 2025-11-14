import Link from "next/link";
import { Post } from "../util/posts";

export default function PostCard({ post }: { post: Post}) {
  return (
    <div className="border-b pb-4">
      <Link href={`/post/${post.slug}`} className="text-xl font-bold text-primary hover:underline">
        {post.metadata.title}
      </Link>
      <p className="text-sm text-accent">{new Date(post.metadata.date).toLocaleDateString()}</p>
    </div>
  )
}
