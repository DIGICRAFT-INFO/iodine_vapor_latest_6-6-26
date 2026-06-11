'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, blogsApi, blogCatsApi, imgUrl } from '@/lib/api';
import { format } from 'date-fns';

export default function BlogPage() {
  const [page, setPage]   = useState(1);
  const [catFilter, setCat] = useState('');

  const { data: slides = [] } = useQuery({ queryKey: ['slides','blog'], queryFn: () => slidesApi.get('blog') });
  const { data: cats   = [] } = useQuery({ queryKey: ['blog-cats-pub'], queryFn: blogCatsApi.get });
  const { data }               = useQuery({ queryKey: ['blogs', { page, catFilter }], queryFn: () => blogsApi.get({ page, limit: 9, category: catFilter || undefined }) });

  const blogs      = data?.blogs || [];
  const totalPages = data?.pages || 1;
  const total      = data?.total || 0;

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="blog" defaultTitle="JOURNAL" defaultSub="Insights & Behind the Lens" />
      <main className="py-[80px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Category Filter */}
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button onClick={() => { setCat(''); setPage(1); }}
                className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase transition-all"
                style={{ borderRadius: '2px', background: !catFilter ? 'var(--c-gold)' : 'rgba(0,0,0,0.03)', color: !catFilter ? '#080808' : 'rgba(0,0,0,0.5)', border: `1px solid ${!catFilter ? 'var(--c-gold)' : 'rgba(0,0,0,0.08)'}` }}>
                All
              </button>
              {cats.map((cat: any) => (
                <button key={cat._id} onClick={() => { setCat(cat._id); setPage(1); }}
                  className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase transition-all"
                  style={{ borderRadius: '2px', background: catFilter === cat._id ? cat.color : 'rgba(0,0,0,0.03)', color: catFilter === cat._id ? '#080808' : 'rgba(0,0,0,0.5)', border: `1px solid ${catFilter === cat._id ? cat.color : 'rgba(0,0,0,0.08)'}` }}>
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {total > 0 && <p className="font-mono text-[0.5rem] tracking-[0.15em] uppercase mb-6" style={{ color: 'rgba(0,0,0,0.2)' }}>{total} {total === 1 ? 'article' : 'articles'}</p>}

          {blogs.length === 0 ? (
            <div className="text-center py-24 font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,0,0,0.2)' }}>No articles published yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {blogs.map((b: any, i: number) => (
                <motion.div key={b._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/blog/${b.slug}`}
                    className="group block border overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                    style={{ borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }}
                    data-hover>
                    <div className="overflow-hidden" style={{ height: '220px' }}>
                      {b.coverImage?.url ? (
                        <img src={imgUrl(b.coverImage.url)} alt={b.title} className="w-full h-full object-cover"
                          style={{ filter: 'grayscale(20%)', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s' }}
                          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'; }}
                          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; (e.target as HTMLImageElement).style.filter = 'grayscale(20%)'; }}
                        />
                      ) : <div className="w-full h-full" style={{ background: '#1a1a1a' }} />}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                        {b.category?.name && <span className="font-mono text-[0.5rem] tracking-[0.15em] uppercase" style={{ color: b.category.color || 'var(--c-gold)' }}>{b.category.name}</span>}
                        {b.publishedAt && <span className="font-mono text-[0.48rem]" style={{ color: 'rgba(0,0,0,0.25)' }}>{format(new Date(b.publishedAt), 'MMM d, yyyy')}</span>}
                      </div>
                      <h3 className="font-serif text-[1.05rem] text-cream-DEFAULT mb-2 leading-[1.35] group-hover:text-gold-DEFAULT transition-colors">{b.title}</h3>
                      {b.excerpt && <p className="text-[0.76rem] leading-[1.7] mb-3 line-clamp-2" style={{ color: 'rgba(0,0,0,0.45)' }}>{b.excerpt}</p>}
                      <span className="font-mono text-[0.52rem] tracking-[0.15em] uppercase flex items-center gap-1.5" style={{ color: 'var(--c-gold)' }}>
                        Read Article <span>→</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-5 py-2.5 font-mono text-[0.56rem] tracking-[0.15em] uppercase border transition-all disabled:opacity-30"
                style={{ borderColor: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.55)', borderRadius: '2px' }}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-10 h-10 font-mono text-[0.62rem] transition-all"
                  style={{ borderRadius: '2px', background: page === p ? 'var(--c-gold)' : 'rgba(0,0,0,0.03)', color: page === p ? '#080808' : 'rgba(0,0,0,0.5)', border: `1px solid ${page === p ? 'var(--c-gold)' : 'rgba(0,0,0,0.08)'}` }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className="px-5 py-2.5 font-mono text-[0.56rem] tracking-[0.15em] uppercase border transition-all disabled:opacity-30"
                style={{ borderColor: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.55)', borderRadius: '2px' }}>Next →</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
