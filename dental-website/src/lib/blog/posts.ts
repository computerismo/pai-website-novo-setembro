import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;

  tags: string[];
  image: string;
  featured: boolean;
  readingTime: string;
}

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;

  tags: string[];
  image: string;
  featured: boolean;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => name.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content,
      date: data.date,
      author: data.author,

      tags: data.tags || [],
      image: data.image,
      featured: data.featured || false,
      readingTime: stats.text,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter(post => post.featured);
}



export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post =>
    post.tags.some(postTag =>
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts().filter(post => post.slug !== currentSlug);

  // Score posts based on shared tags and category
  const scoredPosts = allPosts.map(post => {
    let score = 0;



    // Shared tags get points
    const sharedTags = post.tags.filter(tag =>
      currentPost.tags.includes(tag)
    ).length;
    score += sharedTags;

    return { post, score };
  });

  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}



export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)));
  return tags.sort();
}

export function getPostsWithPagination(
  page: number = 1,
  pageSize: number = 6
): {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}