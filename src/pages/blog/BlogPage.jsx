import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../../components/common/Container';
import { responsiveImageSrcSet } from '../../utils/imageUtils';
import { blogService } from '../../services/blogService';
import { EmptyState } from '../../components/common/EmptyState';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 }
  })
};

export const BlogPage = () => {
  const posts = blogService.getAllPosts();

  return (
    <div className="py-8 flex flex-col gap-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-10"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-digital-blue-500)]">مدونة سفر سيناء</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--color-text-primary)] mt-1.5">
            قصص، ثقافة ودليل سفر
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
            اقرأ رؤى محلية عن شواطئ شمال سيناء المخفية، هجرة الطيور، طقوس الشاي البدوية، والتراث الغذائي.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.length ? posts.map((post, index) => (
            <motion.div key={post.id} variants={fadeInUp} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Link to={`/blog/${post.slug}`} className="glass-card p-0 overflow-hidden flex flex-col group h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={post.image} srcSet={responsiveImageSrcSet(post.image)} sizes="(max-width: 767px) 100vw, 33vw" alt={post.titleAr || post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-[var(--color-digital-blue-500)] text-white shadow-md">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[var(--color-digital-blue-500)]" /> {post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="font-display font-bold text-xl text-[var(--color-text-primary)] group-hover:text-[var(--color-digital-blue-500)] transition-colors line-clamp-2">
                      {post.titleAr || post.title}
                    </h2>

                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed mt-1">
                      {post.excerptAr || post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs font-bold text-[var(--color-digital-blue-500)]">
                    <span>بقلم {post.author}</span>
                    <span className="flex items-center gap-1 group-hover:-translate-x-1 transition-transform">اقرأ المزيد <ChevronLeft className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )) : <EmptyState className="md:col-span-3" title="لا توجد مقالات منشورة حاليًا." description="ستظهر المقالات هنا بعد نشر محتوى حقيقي." />}
        </div>
      </Container>
    </div>
  );
};
