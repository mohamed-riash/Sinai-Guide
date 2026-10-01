import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Tag } from 'lucide-react';
import { Container } from '../../components/common/Container';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { blogService } from '../../services/blogService';
import { useToast } from '../../hooks/useToast';
import { NotFoundPage } from '../NotFoundPage';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogService.getPostBySlug(slug);
  const { toastSuccess } = useToast();

  if (!post) {
    return <NotFoundPage />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toastSuccess('تم نسخ رابط المقال بنجاح!');
  };

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container className="max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-terracotta)] hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" /> العودة للمدونة
        </Link>

        {/* Post Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Badge variant="primary" className="uppercase tracking-widest text-[10px]">
              {post.category}
            </Badge>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">{post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[var(--color-text-primary)] leading-tight">
            {post.titleAr || post.title}
          </h1>

          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] pt-2 border-b border-[var(--color-border-subtle)] pb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-semibold text-[var(--color-text-primary)]">
                <User className="w-3.5 h-3.5 text-[var(--color-terracotta)]" /> {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-teal-soft)]" /> {post.date}
              </span>
            </div>

            <Button variant="ghost" size="sm" icon={Share2} onClick={handleShare}>
              مشاركة
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden glass-card border border-white/20 dark:border-white/10 mb-8 shadow-2xl">
          <img src={post.image} alt={post.titleAr || post.title} className="w-full h-full object-cover" />
        </div>

        {/* Body Content */}
        <article className="glass-card p-8 sm:p-10 border border-white/20 dark:border-white/10 text-[var(--color-text-primary)] leading-relaxed space-y-6 text-base font-normal shadow-xl">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-2xl font-bold font-display text-[var(--color-text-primary)] mt-6 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="leading-relaxed text-[var(--color-text-secondary)]">
                {paragraph}
              </p>
            );
          })}

          {/* Tags */}
          {post.tags && (
            <div className="pt-6 border-t border-[var(--color-border-subtle)] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[var(--color-terracotta)]" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/10 border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </Container>
    </div>
  );
};

