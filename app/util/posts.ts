import fs from 'fs';
import { notFound } from 'next/navigation';
import path from 'path';

type PostMetadata = {
  [key: string]: string | string[] | undefined;
  title: string;
  date: string;
  tags?: string[];
}

export type Post = {
  slug: string;
  metadata: PostMetadata;
  content: string;
};

const postsDir = path.join(process.cwd(), 'posts');
const publicPostsDir = path.join(process.cwd(), 'public/posts');

function parsePost(contents: string): { metadata: PostMetadata; content: string } {
  const [header, ...contentParts] = contents.split('---\n').slice(1);
  const content = contentParts.join('---\n').trim();
  const metadataLines = header.split('\n').filter(line => line.trim() !== '');
  const metadata: PostMetadata = {
    title: "N/A",
    date: "N/A",
  };
  metadataLines.forEach(line => {
    const [key, ...rest] = line.split(':');

    if (key === "tags") {
      metadata[key.trim()] = rest.join(':').split(',').map(tag => tag.trim());
      return;
    }

    metadata[key.trim()] = rest.join(':').trim();
  });

  return { metadata, content };
}

export function getPostSlugs() {
  return fs.readdirSync(postsDir);
}

export function getSortedPosts(): Post[] {
  try {
    const slugs = getPostSlugs();
    const posts = slugs.map(slug => {
      const fullPath = path.join(postsDir, `${slug}/content.md`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { metadata, content } = parsePost(fileContents);
      const processedContent = processPostImages(slug, content);

      return {
        slug,
        content: processedContent,
        metadata,
      };
    });

    return posts.sort((a, b) => {
      const dateA = new Date(a.metadata.date);
      const dateB = new Date(b.metadata.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch(_) {
    return [];
  }
}

export function getPostBySlug(slug: string): Post {
  try {
    const fullPath = path.join(postsDir, `${slug}/content.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { metadata, content } = parsePost(fileContents);
    const processedContent = processPostImages(slug, content);

    return {
      slug,
      content: processedContent,
      metadata,
    };
  } catch(_) {
    notFound();
  }
}

export function getPostsWithTag(tag: string): Post[] {
  const allPosts = getSortedPosts();
  return allPosts.filter(post => post.metadata.tags?.includes(tag));
}

export function getAllUniqueTags(): string[] {
  const allPosts = getSortedPosts();
  const tagSet: Set<string> = new Set();

  allPosts.forEach(post => {
    post.metadata.tags?.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet);
}

export function processPostImages(slug: string, content: string): string {
  const postDir = path.join(postsDir, slug);
  const publicPostDir = path.join(publicPostsDir, slug);

  if (!fs.existsSync(publicPostDir)) {
    fs.mkdirSync(publicPostDir, { recursive: true });
  }

  const postFiles: string[] = fs.readdirSync(postDir);

  postFiles.forEach(file => {
    if (file === 'content.md') return;

    const filePath = path.join(postDir, file);
    const publicFilePath = path.join(publicPostDir, file);

    fs.copyFileSync(filePath, publicFilePath);
  });

  // Process markdown content to update relative image paths
  return content.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, (match, alt, imagePath) => {
    return `![${alt}](/posts/${slug}/${imagePath})`;
  });
}
