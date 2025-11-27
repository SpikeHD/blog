import fs from 'fs';
import path from 'path';
import { Feed } from 'feed';
import removeMarkdown from "remove-markdown";
import { AVATAR_URL, SITE_DESCRIPTION, SITE_NAME } from '../constants';
import { Post } from './posts';

export function generateRss(posts: Post[]) {
  const url = process.env.NODE_ENV ? 'https://blog.spikehd.dev' : 'http://localhost:3000';

  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: url,
    link: url,
    image: AVATAR_URL,
    copyright: `All rights reserved ${new Date().getFullYear()}, SpikeHD`,
    generator: 'My mind-cube'
  })

  posts.forEach(post => {
    feed.addItem({
      title: post.metadata.title,
      id: `${url}/post/${post.slug}`,
      link: `${url}/post/${post.slug}`,
      description: removeMarkdown(post.content.slice(0, 160)).replace(/\n/g, ' ') + '...',
      date: new Date(post.metadata.date),
    });
  });

  feed.addCategory('Software');
  feed.addCategory('Hardware');
  feed.addCategory('Programming');
  feed.addCategory('Technology');
  feed.addCategory('Personal');

  const rss = feed.rss2();

  // Write the RSS output to a public file
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss);
}
