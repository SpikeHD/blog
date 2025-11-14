import PostList from "@/app/components/post-list";
import { getAllUniqueTags, getPostsWithTag } from "@/app/util/posts";
import Link from "next/link";

export function generateStaticParams() {
  const tags = getAllUniqueTags();
  return tags.map((tag) => ({ tag }));
}

export default async function ByTagPage({ params }: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params;
  const posts = getPostsWithTag(tag);

  return (
    <div>
      <Link href="/" className="text-sm text-primary hover:underline">
        &lt; back to home
      </Link>

      <div className="py-8">
        <p className="pb-4">
          Showing posts tagged with <b>{tag}</b>:
        </p>

        <PostList posts={posts} />
      </div>
    </div>
  );
}
