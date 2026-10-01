import { BLOG_POSTS } from '../data/blogPosts';

export const blogService = {
  getAllPosts: () => {
    return BLOG_POSTS;
  },

  getPostBySlug: (slug) => {
    return BLOG_POSTS.find(p => p.slug === slug) || null;
  }
};
