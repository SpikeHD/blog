import { Post } from "../util/posts";
import PostCard from "./post-card";

export default function PostList({ posts }: { posts?: Post[] }) {
  return (
    <div className="flex flex-col space-y-4">
      {posts?.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
