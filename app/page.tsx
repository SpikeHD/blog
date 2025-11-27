import Link from "next/link";
import PostList from "./components/post-list";
import { getSortedPosts } from "./util/posts";
import { generateRss } from "./util/rss";
import { Rss } from "lucide-react";

export default async function Home() {
  const posts = getSortedPosts();

  // Generate the RSS feed
  generateRss(posts);

  return (
    <div className="py-8">
      <div className="flex flex-row justify-between items-center">
        <h1>Recent Posts</h1>
        <Link className="mx-1" href="/rss.xml" target="_blank" rel="noopener noreferrer">
          <Rss />
        </Link>
      </div>

      <PostList posts={posts} />
    </div>
  )
}
