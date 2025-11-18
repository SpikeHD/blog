import { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import removeMarkdown from "remove-markdown";
import { getPostBySlug, getSortedPosts } from "@/app/util/posts";
import { Divider } from "@/app/components/divider";
import { Tag } from "@/app/components/tag";
import { BackToHome } from "@/app/components/back-to-home";

export function generateStaticParams() {
  const posts = getSortedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.metadata.title,
    description: removeMarkdown(post.content.slice(0, 160)).replace(/\n/g, ' '),
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
          <span>{new Date(post.metadata.date).toLocaleDateString()}</span>
          <a className="underline font-bold" href={`https://github.com/SpikeHD/blog/commits/main/posts/${slug}/content.md`}>View revision history</a>
        </p>

        <Divider />

        <div className="markdown">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </Markdown>
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
