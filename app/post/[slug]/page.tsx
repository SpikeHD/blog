import { Metadata } from "next";
import removeMarkdown from "remove-markdown";
import { getPostBySlug, getSortedPosts } from "@/app/util/posts";
import { Divider } from "@/app/components/divider";
import { Tag } from "@/app/components/tag";
import { BackToHome } from "@/app/components/back-to-home";
import { SITE_NAME } from "@/app/constants";
import { PostDate } from "@/app/components/post-date";
import { MarkdownWithCode } from "@/app/components/markdown-with-code";
import { ViewCount } from "@/app/components/view-count";
import ReadAloud from "@/app/components/read-aloud";

export function generateStaticParams() {
  const posts = getSortedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: `${post.metadata.title} - ${SITE_NAME}`,
    description: removeMarkdown(post.content.slice(0, 160)).replace(/\n/g, ' ') + '...',
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string}>
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <div>
      <BackToHome />

      <div className="py-8">
        <h1>{post.metadata.title}</h1>
        <p className="flex flex-row justify-between text-sm text-accent">
          <PostDate dateString={post.metadata.date} />
          <a className="underline font-bold" href={`https://github.com/SpikeHD/blog/commits/main/posts/${slug}/content.md`}>View revision history</a>
        </p>

        <div className="py-1">
          <ViewCount countmyclick={post.metadata.countmyclick} />
        </div>

        <Divider />

        <div className="text-sm text-accent">
          <ReadAloud />
        </div>

        <div className="markdown">
          <MarkdownWithCode>
            {post.content}
          </MarkdownWithCode>
        </div>

        <Divider />

        <div className="text-sm text-accent flex flex-row">
          {post.metadata?.tags?.map((tag, idx) => (
            <Tag key={idx} name={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
