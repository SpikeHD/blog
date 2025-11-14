import { Divider } from "./components/divider";
import PostList from "./components/post-list";
import { getSortedPosts } from "./util/posts";

export default async function Home() {
  const posts = getSortedPosts();

  return (
    <div>
      <div className="mb-8">
        <h2>About</h2>

        <p>
          Hello! I&apos;m SpikeHD, I am from Canda and I&apos;ve been a software developer for more than 6 years.
        </p>
      </div>

      <Divider />

      <h1>Recent Posts</h1>

      <div className="space-y-8">
        <PostList posts={posts} />
      </div>
    </div>
  )
}
