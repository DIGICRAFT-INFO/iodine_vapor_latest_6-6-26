'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogsApi, imgUrl } from '@/lib/api';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn:  () => blogsApi.getOne(slug),
    enabled:  !!slug,
  });

  if (isLoading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center mt-16" style={{ background: 'var(--c-bg)' }}>
        <div className="w-10 h-10 border border-t-transparent animate-spin" style={{ borderColor: 'var(--c-gold)', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    </>
  );

  if (error || !blog) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center mt-16 gap-6" style={{ background: 'var(--c-bg)' }}>
        <h1 className="font-display text-[3rem]" style={{ color: 'rgba(245,240,234,0.15)' }}>404</h1>
        <p className="font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.3)' }}>Blog post not found</p>
        <Link href="/blog" className="btn-ghost text-[0.6rem]">← Back to Journal</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative mt-16 overflow-hidden" style={{ minHeight: '55vh' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #080808 0%, #141414 100%)' }}>
          {blog.coverImage?.url && (
            <>
              <img src={imgUrl(blog.coverImage.url)} alt={blog.title} className="w-full h-full object-cover"
                style={{ opacity: 0.25, filter: 'grayscale(20%) contrast(1.1)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.9) 100%)' }} />
            </>
          )}
        </div>

        <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-8 py-20 flex flex-col justify-end" style={{ minHeight: '55vh' }}>
          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 mb-5"
          >
            {blog.category?.name && (
              <span className="font-mono text-[0.56rem] tracking-[0.2em] uppercase"
                style={{ color: blog.category.color || 'var(--c-gold)' }}>
                {blog.category.name}
              </span>
            )}
            {blog.publishedAt && (
              <span className="font-mono text-[0.52rem]" style={{ color: 'rgba(245,240,234,0.35)' }}>
                {format(new Date(blog.publishedAt), 'MMMM d, yyyy')}
              </span>
            )}
            <span className="font-mono text-[0.52rem]" style={{ color: 'rgba(245,240,234,0.25)' }}>
              By {blog.author || 'Studio Jatin'}
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-cream-DEFAULT leading-[0.92]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              {blog.title}
            </motion.h1>
          </div>

          {blog.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-[0.95rem] leading-[1.8] max-w-[540px]"
              style={{ color: 'rgba(245,240,234,0.5)' }}
            >
              {blog.excerpt}
            </motion.p>
          )}
        </div>
      </section>

      {/* Content */}
      <main className="py-[80px] px-6 md:px-8" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[760px] mx-auto">
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {blog.tags.map((tag: string) => (
                <span key={tag} className="font-mono text-[0.5rem] tracking-[0.14em] uppercase px-3 py-1.5 border"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(245,240,234,0.4)', borderRadius: '2px' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Article body */}
          <article
            className="prose-iv"
            style={{
              color: 'rgba(245,240,234,0.65)',
              fontSize: '1rem',
              lineHeight: '1.9',
              fontFamily: 'Syne, sans-serif',
            }}
          >
            {/* Render content as formatted text */}
            {blog.content.split('\n\n').map((para: string, i: number) => (
              para.trim() ? (
                <p key={i} className="mb-5" style={{ color: 'rgba(245,240,234,0.6)' }}>
                  {para.trim()}
                </p>
              ) : null
            ))}
          </article>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t flex items-center justify-between flex-wrap gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div>
              <p className="font-mono text-[0.5rem] tracking-[0.18em] uppercase mb-1" style={{ color: 'rgba(245,240,234,0.25)' }}>Written by</p>
              <p className="font-serif text-[1.1rem] text-cream-DEFAULT">{blog.author || 'Studio Jatin'}</p>
            </div>
            <Link href="/blog" className="btn-ghost text-[0.6rem]">← Back to Journal</Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
