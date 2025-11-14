import PostList from "./components/post-list";
import { getSortedPosts } from "./util/posts";

export default async function Home() {
  const posts = getSortedPosts();
  return (
    <div className="py-8">
      <h1>Recent Posts</h1>

      <PostList posts={posts} />
    </div>
  )
}
