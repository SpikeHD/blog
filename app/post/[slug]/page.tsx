import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/app/util/posts";
import { Divider } from "@/app/components/divider";
import { Tag } from "@/app/components/tag";
import Link from "next/link";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string}>
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <div>
      <Link href="/" className="text-sm text-primary hover:underline">
        &lt; back to home
      </Link>

      <div className="py-8">
        <h1>{post.metadata.title}</h1>
        <p className="text-sm text-accent">{new Date(post.metadata.date).toLocaleDateString()}</p>

        <Divider />

        <div className="markdown">
          <Markdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </Markdown>
        </div>

        <Divider />

        <div className="text-sm text-accent flex flex-row">
          {post.metadata?.tags?.map((tag, idx) => (
            <Tag key={idx} name={tag} />
          ))}
        </div>
      </div>    </div>

  );
}
