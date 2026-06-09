'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, workshopsApi, wsCatsApi, imgUrl } from '@/lib/api';
import { format } from 'date-fns';

export default function WorkshopsPage() {
  const [catFilter, setCat] = useState('');

  const { data: slides    = [] } = useQuery({ queryKey: ['slides','workshops'],   queryFn: () => slidesApi.get('workshops') });
  const { data: cats      = [] } = useQuery({ queryKey: ['ws-cats-pub'],          queryFn: wsCatsApi.get });
  const { data: workshops = [] } = useQuery({ queryKey: ['workshops', catFilter], queryFn: () => workshopsApi.get(catFilter ? { category: catFilter } : {}) });

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="workshops" defaultTitle="WORKSHOPS" defaultSub="Learn Photography from Experts" />
      <main className="py-[80px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Category Filter */}
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button onClick={() => setCat('')}
                className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase transition-all"
                style={{ borderRadius: '2px', background: !catFilter ? 'var(--c-gold)' : 'rgba(255,255,255,0.04)', color: !catFilter ? '#080808' : 'rgba(245,240,234,0.4)', border: `1px solid ${!catFilter ? 'var(--c-gold)' : 'rgba(255,255,255,0.08)'}` }}>
                All
              </button>
              {cats.map((cat: any) => (
                <button key={cat._id} onClick={() => setCat(cat._id)}
                  className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase capitalize transition-all"
                  style={{ borderRadius: '2px', background: catFilter === cat._id ? 'var(--c-gold)' : 'rgba(255,255,255,0.04)', color: catFilter === cat._id ? '#080808' : 'rgba(245,240,234,0.4)', border: `1px solid ${catFilter === cat._id ? 'var(--c-gold)' : 'rgba(255,255,255,0.08)'}` }}>
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {workshops.length === 0 ? (
            <div className="text-center py-24 font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.2)' }}>No workshops at the moment. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((w: any, i: number) => (
                <motion.div key={w._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/workshops/${w.slug}`}
                    className="group block border transition-all duration-400 hover:-translate-y-1.5"
                    style={{ borderColor: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}
                    data-hover>
                    {w.coverImage?.url && (
                      <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <img src={imgUrl(w.coverImage.url)} alt={w.title} className="w-full h-full object-cover"
                          style={{ filter: 'grayscale(25%)', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.4s' }}
                          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)'; (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'; }}
                          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; (e.target as HTMLImageElement).style.filter = 'grayscale(25%)'; }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {w.date && (
                          <span className="font-mono text-[0.56rem] tracking-[0.18em] uppercase flex items-center gap-2" style={{ color: 'var(--c-gold)' }}>
                            <span className="w-3 h-px inline-block" style={{ background: 'var(--c-gold)' }} />
                            {format(new Date(w.date), 'MMM d, yyyy')}
                          </span>
                        )}
                        {w.isOnline && <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5" style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.08)', borderRadius: '2px' }}>Online</span>}
                        {w.isFree   && <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', borderRadius: '2px' }}>Free</span>}
                      </div>
                      <h3 className="font-serif text-[1.2rem] text-cream-DEFAULT mb-2 leading-[1.3]">{w.title}</h3>
                      {w.description && <p className="text-[0.78rem] leading-[1.7] mb-4" style={{ color: 'rgba(245,240,234,0.38)' }}>{w.description.slice(0, 100)}{w.description.length > 100 ? '…' : ''}</p>}
                      <div className="flex items-center justify-between">
                        <span className="font-display text-[1.7rem] text-cream-DEFAULT">{w.isFree ? 'Free' : `₹${w.price}`}</span>
                        <span className="font-mono text-[0.54rem] tracking-[0.15em] uppercase px-4 py-2 border transition-all"
                          style={{ borderColor: 'rgba(201,169,110,0.3)', color: 'var(--c-gold)', borderRadius: '2px' }}>
                          Register →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
