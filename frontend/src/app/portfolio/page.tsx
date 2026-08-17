'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, portfolioApi, imgUrl } from '@/lib/api';

const CATS = ['all', 'architecture', 'product', 'brand', 'event', 'aerial', 'portrait', 'education'];

export default function PortfolioPage() {
  const [filter, setFilter] = useState('all');

  const { data: slides = [] }  = useQuery({ queryKey: ['slides','portfolio'], queryFn: () => slidesApi.get('portfolio') });
  const { data: items = [] }   = useQuery({ queryKey: ['portfolio', filter], queryFn: () => portfolioApi.get(filter !== 'all' ? { category: filter } : {}) });

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="portfolio" defaultTitle="PORTFOLIO" defaultSub="Visual Excellence Across India" />
      <main className="py-[80px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} data-hover
                className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase capitalize transition-all"
                style={{ borderRadius: '2px', background: filter === cat ? 'var(--c-gold)' : 'rgba(0,0,0,0.03)', color: filter === cat ? '#080808' : 'rgba(0,0,0,0.5)', border: `1px solid ${filter === cat ? 'var(--c-gold)' : 'rgba(0,0,0,0.08)'}` }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          {items.length === 0 ? (
            <div className="text-center py-24 font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,0,0,0.2)' }}>No items in this category</div>
          ) : (
            <div style={{ columns: 'auto 3', columnGap: '16px' }}>
              {items.map((item: any) => (
                <div key={item._id} className="work-item mb-4 break-inside-avoid group relative">
                  <Link href={`/portfolio/${item.slug}`}>
                    <img src={imgUrl(item.imageUrl)} alt={item.title} loading="lazy" style={{ width: '100%', display: 'block', filter: 'grayscale(20%) contrast(1.05)', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s' }}
                      onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)'; (e.target as HTMLImageElement).style.filter = 'grayscale(0%) contrast(1.08)'; }}
                      onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; (e.target as HTMLImageElement).style.filter = 'grayscale(20%) contrast(1.05)'; }}
                    />
                    <div className="work-overlay" />
                    <div className="work-info">
                      <h3 className="font-serif text-[0.95rem] text-cream-DEFAULT mb-1">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.52rem] tracking-[0.15em] uppercase" style={{ color: 'var(--c-gold)' }}>{item.category}</span>
                        {item.client && <span className="font-mono text-[0.48rem]" style={{ color: 'rgba(255,255,255,0.5)' }}>· {item.client}</span>}
                      </div>
                    </div>
                    {/* Arrow indicator on hover */}
                    <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(233,30,140,0.9)', borderRadius: '50%' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
