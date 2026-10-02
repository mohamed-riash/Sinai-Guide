import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Star, MessageSquareHeart, Sparkles } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { reviewService } from '../../services/reviewService';

const RATING_SENTIMENTS = [
  { score: 1, emoji: '😠', label: 'سيء جداً' },
  { score: 2, emoji: '😕', label: 'غير راضٍ' },
  { score: 3, emoji: '😐', label: 'مقبول' },
  { score: 4, emoji: '😊', label: 'ممتاز' },
  { score: 5, emoji: '😍', label: 'استثنائي!' },
];

export const ReviewForm = ({ placeId, onReviewAdded }) => {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(null);

  const activeSentiment = RATING_SENTIMENTS.find((s) => s.score === (hoveredRating || rating)) || RATING_SENTIMENTS[4];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toastError('يرجى كتابة رأيك وتجربتك في المكان قبل الإرسال.');
      return;
    }

    if (comment.trim().length < 5) {
      toastError('يرجى كتابة تعليق أكثر تفصيلاً (5 حروف على الأقل).');
      return;
    }

    setLoading(true);
    try {
      const newReview = reviewService.addReview({
        placeId,
        userName: user?.name || 'زائر ',
        userAvatar: user?.avatar,
        rating,
        comment: comment.trim(),
      });

      toastSuccess('شكراً لك! تم نشر تقييمك ورأيك بنجاح.');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded(newReview);
    } catch (err) {
      toastError(err.message || 'فشل في نشر التقييم. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="glass-panel p-6 sm:p-8 flex flex-col gap-6 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative ambient background accent */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-digital-blue-500)]/10 rounded-full filter blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[var(--color-digital-blue-500)]/15 text-[var(--color-digital-blue-500)]">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-black font-display text-[var(--color-text-primary)]">
              شاركنا تقييمك وتجربتك
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">
              رأيك يوجّه مسافري دليل سيناء ويساعد المنشآت على التطوير المستمر
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-digital-blue-500)]/15 text-[var(--color-digital-blue-500)] text-xs font-bold self-end sm:self-center">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{activeSentiment.label} ({hoveredRating || rating}/5)</span>
        </div>
      </div>

      {/* Sentiment Emoji & Star Rating Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          كيف كانت تجربتك الكلية في هذا المكان؟
        </label>

        {/* Emoji sentiment buttons row */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {RATING_SENTIMENTS.map((s) => {
            const isSelected = rating === s.score;
            return (
              <motion.button
                key={s.score}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRating(s.score)}
                onMouseEnter={() => setHoveredRating(s.score)}
                onMouseLeave={() => setHoveredRating(null)}
                aria-label={`تقييم ${s.label}`}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[var(--color-digital-blue-500)]/20 border-[var(--color-digital-blue-500)] text-[var(--color-text-primary)] shadow-md'
                    : 'glass-input border-transparent hover:border-[var(--color-digital-blue-500)]/40'
                }`}
              >
                <span className="text-2xl sm:text-3xl select-none">{s.emoji}</span>
                <span className="text-[10px] font-bold truncate max-w-full">{s.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Star Rating Bar */}
        <div className="flex items-center justify-between pt-1 px-1">
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">اختر عدد النجوم:</span>
          <RatingStars
            rating={hoveredRating || rating}
            size="md"
            showNumber={false}
            interactive
            onChange={(newRating) => setRating(newRating)}
          />
        </div>
      </div>

      {/* Textarea Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          رأيك بالتفصيل
        </label>
        <textarea
          rows="3"
          placeholder="اكتب تجربتك ورأيك في المكان (مثل جودة الخدمة، النظافة، والأجواء...)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-4 rounded-2xl text-sm glass-input text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-digital-blue-500)] transition-all resize-none"
          required
        />
        <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)] font-medium px-1">
          <span>اكتب بحرية لإفادة زوار دليل سيناء</span>
          <span>{comment.length} / 500 حرف</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={loading}
          icon={Send}
          className="px-6 py-3 font-bold text-sm shadow-xl"
        >
          إرسال التقييم
        </Button>
      </div>
    </motion.form>
  );
};
