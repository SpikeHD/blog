import PostList from "./components/post-list";
import { getSortedPosts } from "./util/posts";
import { generateRss } from "./util/rss";

export default async function Home() {
  const posts = getSortedPosts();

  // Generate the RSS feed
  generateRss(posts);

  return (
    <div className="py-8">
      <h1>Recent Posts</h1>

      <PostList posts={posts} />
    </div>
  )
}
