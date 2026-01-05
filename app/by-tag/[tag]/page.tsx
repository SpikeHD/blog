import { BackToHome } from "@/app/components/back-to-home";
import PostList from "@/app/components/post-list";
import { SITE_NAME } from "@/app/constants";
import { getAllUniqueTags, getPostsWithTag } from "@/app/util/posts";
import { Metadata } from "next";

export function generateStaticParams() {
  const tags = getAllUniqueTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `Tagged with "${tag}" - ${SITE_NAME}`,
    description: `List of all blog posts tagged with ${tag}.`
  };
}

export default async function ByTagPage({ params }: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params;
  const posts = getPostsWithTag(tag);

  return (
    <div>
      <BackToHome />

      <div className="py-8">
        <p className="pb-4">
          Showing posts tagged with <b>{tag}</b>:
        </p>

        <PostList posts={posts} />
      </div>
    </div>
  );
}
