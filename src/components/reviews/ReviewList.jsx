import React from 'react';
import { motion } from 'framer-motion';
import { RatingStars } from '../common/RatingStars';
import { MessageSquare } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--color-text-muted)] text-sm glass-card p-6 flex flex-col items-center gap-2 border border-white/10">
        <MessageSquare className="w-8 h-8 opacity-40 text-[#A85F48]" />
        <p className="font-semibold">لا توجد تقييمات مسجلة بعد. كن أول من يشارك رأيه حول هذا المكان!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((rev, index) => (
        <motion.div
          key={rev.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="p-5 rounded-2xl glass-card border border-white/20 dark:border-white/10 flex flex-col gap-3 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar src={rev.userAvatar} name={rev.userName} className="w-10 h-10 rounded-full object-cover border-2 border-[#A85F48]" />
              <div>
                <h5 className="text-sm font-bold font-display text-[var(--color-text-primary)]">{rev.userName}</h5>
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                  {new Date(rev.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            <RatingStars rating={rev.rating} size="sm" />
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed pr-1 font-medium whitespace-pre-line">
            "{rev.comment}"
          </p>
        </motion.div>
      ))}
    </div>
  );
};
