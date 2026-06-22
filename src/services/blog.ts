import { blogPosts } from '../data/blog';
import { mockCall } from './api';
import type { BlogPost } from '../types';

export async function getBlogPosts(): Promise<BlogPost[]> {
  return mockCall(blogPosts);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return mockCall(blogPosts.find((p) => p.slug === slug));
}
