'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EnquiryPopup from '@/components/sections/EnquiryPopup';
import { portfolioApi, imgUrl } from '@/lib/api';

const CATS = ['all', 'architecture', 'product', 'brand', 'event', 'aerial', 'portrait', 'education'];

export default function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [filterCat, setFilterCat]     = useState('all');
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // Fetch the specific portfolio item
  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['portfolio-all'],
    queryFn:  () => portfolioApi.get({}),
  });

  const item = (allItems as any[]).find((i: any) => i.slug === slug);

  // Related items — same category, exclude current
  const related = (allItems as any[])
    .filter((i: any) => i.slug !== slug && (filterCat === 'all' || i.category === filterCat))
    .slice(0, 12);

  // All images for this item (main + extras if any)
  const images = item
    ? [item.imageUrl, ...(item.extraImages || [])].filter(Boolean)
    : [];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#ffffff' }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#e91e8c', borderTopColor: 'transparent' }} />
      </div>
      <Footer />
    </>
  );

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!item && !isLoading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6" style={{ background: '#ffffff' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: '#e91e8c' }}>404</p>
        <h1 className="font-bold text-[2rem]" style={{ fontFamily: "'Syne', sans-serif", color: '#1a1a2e' }}>Portfolio Item Not Found</h1>
        <Link href="/portfolio" className="btn-primary mt-2"><span>← Back to Portfolio</span></Link>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />

      <main className="pt-20" style={{ background: '#ffffff' }}>
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="px-6 md:px-12 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 font-mono text-[0.55rem] tracking-[0.15em] uppercase">
            <Link href="/" className="transition-colors" style={{ color: 'rgba(0,0,0,0.35)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.35)'}>Home</Link>
            <span style={{ color: 'rgba(0,0,0,0.2)' }}>›</span>
            <Link href="/portfolio" className="transition-colors" style={{ color: 'rgba(0,0,0,0.35)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.35)'}>Portfolio</Link>
            <span style={{ color: 'rgba(0,0,0,0.2)' }}>›</span>
            <span style={{ color: '#1a1a2e' }}>{item?.title}</span>
          </div>
        </div>

        {/* ── Main Layout ────────────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left — Item Detail ──────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Title + meta */}
              <div className="mb-6">
                {item?.category && (
                  <span className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full font-mono text-[0.5rem] tracking-[0.2em] uppercase"
                    style={{ background: 'rgba(233,30,140,0.08)', color: '#e91e8c', border: '1px solid rgba(233,30,140,0.2)' }}>
                    {item.category}
                  </span>
                )}
                <h1 className="font-bold text-[#1a1a2e] leading-[1.1] mb-3"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
                  {item?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[0.78rem]" style={{ color: 'rgba(0,0,0,0.45)' }}>
                  {item?.client && (
                    <span className="flex items-center gap-1.5">
                      <span style={{ color: '#e91e8c', fontSize: '0.5rem' }}>●</span>
                      {item.client}
                    </span>
                  )}
                  {item?.year && (
                    <span className="flex items-center gap-1.5">
                      <span style={{ color: '#e91e8c', fontSize: '0.5rem' }}>●</span>
                      {item.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Main image */}
              <div
                className="overflow-hidden mb-4 cursor-zoom-in"
                style={{ borderRadius: '8px', aspectRatio: '16/10', background: '#f0f0f0' }}
                onClick={() => setLightboxIdx(0)}
              >
                <img
                  src={imgUrl(item?.imageUrl)}
                  alt={item?.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                  style={{ transform: 'scale(1)', transition: 'transform 0.5s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                />
              </div>

              {/* Extra images grid (if any) */}
              {images.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {images.slice(1).map((img: string, i: number) => (
                    <div key={i} className="overflow-hidden cursor-zoom-in"
                      style={{ borderRadius: '6px', aspectRatio: '4/3', background: '#f0f0f0' }}
                      onClick={() => setLightboxIdx(i + 1)}>
                      <img src={imgUrl(img)} alt={`${item?.title} ${i + 2}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {item?.description && (
                <div className="mt-6 p-5 rounded-lg" style={{ background: '#f8f8f8', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="font-mono text-[0.52rem] tracking-[0.22em] uppercase mb-2" style={{ color: '#e91e8c' }}>About This Project</p>
                  <p className="text-[0.88rem] leading-[1.8]" style={{ color: 'rgba(0,0,0,0.6)' }}>{item.description}</p>
                </div>
              )}

              {/* Linked services tags */}
              {item?.linkedServices?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="font-mono text-[0.5rem] tracking-[0.18em] uppercase mr-1" style={{ color: 'rgba(0,0,0,0.35)' }}>Services:</span>
                  {item.linkedServices.map((svc: any) => (
                    <Link key={svc._id || svc}
                      href={`/services/${svc.slug || ''}`}
                      className="font-mono text-[0.5rem] tracking-[0.12em] uppercase px-2.5 py-1 transition-all"
                      style={{ background: 'rgba(233,30,140,0.08)', color: '#e91e8c', borderRadius: '4px', border: '1px solid rgba(233,30,140,0.2)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(233,30,140,0.15)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(233,30,140,0.08)'}
                    >
                      {svc.name || svc}
                    </Link>
                  ))}
                </div>
              )}

              {/* Enquire CTA below content */}
              <div className="mt-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, #0d0b1a, #1a0d20)', border: '1px solid rgba(233,30,140,0.2)' }}>
                <p className="font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem' }}>
                  Like this work?
                </p>
                <p className="text-[0.8rem] mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Get similar photography for your brand. Let's discuss your project.
                </p>
                <button onClick={() => setEnquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[0.75rem] tracking-[0.08em] uppercase transition-all"
                  style={{ background: 'linear-gradient(135deg, #e91e8c, #c4167a)', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(233,30,140,0.35)' }}>
                  <span>Enquire Now</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Right Sidebar — Filter + Related ───────────────────────── */}
            <div className="lg:w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-24">

                {/* Category Filter */}
                <div className="mb-6 p-5 rounded-xl border" style={{ background: '#f8f8f8', borderColor: 'rgba(0,0,0,0.07)' }}>
                  <p className="font-mono text-[0.5rem] tracking-[0.22em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                    <span className="w-4 h-px inline-block" style={{ background: '#e91e8c' }} />
                    Filter by Category
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {CATS.map(cat => (
                      <button key={cat} onClick={() => setFilterCat(cat)}
                        className="flex items-center justify-between px-3 py-2 text-left font-mono text-[0.55rem] tracking-[0.12em] uppercase capitalize transition-all"
                        style={{
                          borderRadius: '6px',
                          background: filterCat === cat ? '#e91e8c' : 'transparent',
                          color: filterCat === cat ? '#ffffff' : 'rgba(0,0,0,0.5)',
                        }}>
                        <span>{cat === 'all' ? 'All Categories' : cat}</span>
                        {filterCat === cat && (
                          <span style={{ fontSize: '0.5rem' }}>●</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item meta card */}
                <div className="mb-6 p-5 rounded-xl border" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.07)' }}>
                  <p className="font-mono text-[0.5rem] tracking-[0.22em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                    <span className="w-4 h-px inline-block" style={{ background: '#e91e8c' }} />
                    Project Details
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: 'Category', value: item?.category },
                      { label: 'Client',   value: item?.client },
                      { label: 'Year',     value: item?.year },
                    ].filter(r => r.value).map(row => (
                      <div key={row.label} className="flex items-start justify-between gap-3">
                        <span className="font-mono text-[0.48rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(0,0,0,0.3)' }}>{row.label}</span>
                        <span className="text-[0.78rem] font-medium text-right" style={{ color: '#1a1a2e' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related items */}
                {related.length > 0 && (
                  <div>
                    <p className="font-mono text-[0.5rem] tracking-[0.22em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                      <span className="w-4 h-px inline-block" style={{ background: '#e91e8c' }} />
                      More Work
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {related.slice(0, 6).map((rel: any) => (
                        <Link key={rel._id} href={`/portfolio/${rel.slug}`}
                          className="group relative overflow-hidden"
                          style={{ borderRadius: '6px', aspectRatio: '1' }}>
                          <img src={imgUrl(rel.imageUrl)} alt={rel.title}
                            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                            style={{ filter: 'grayscale(20%)' }} />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
                            style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 60%)' }}>
                            <p className="text-white font-semibold text-[0.6rem] leading-tight">{rel.title}</p>
                          </div>
                          <span className="absolute top-1.5 left-1.5 font-mono text-[0.38rem] tracking-[0.1em] uppercase px-1.5 py-0.5"
                            style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.8)', borderRadius: '3px', backdropFilter: 'blur(4px)' }}>
                            {rel.category}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/portfolio" className="mt-4 flex items-center justify-center gap-2 py-2.5 font-mono text-[0.52rem] tracking-[0.15em] uppercase border transition-colors"
                      style={{ borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.4)', borderRadius: '6px' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e91e8c'; (e.currentTarget as HTMLElement).style.color = '#e91e8c'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'; }}>
                      View All Portfolio →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Floating Enquire Now Button ───────────────────────────────────── */}
      <button
        onClick={() => setEnquiryOpen(true)}
        className="fixed z-[800] flex items-center gap-2 font-semibold text-[0.68rem] tracking-[0.08em] uppercase transition-all duration-300"
        style={{
          bottom: '28px',
          right: '24px',
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #e91e8c, #c4167a)',
          color: '#ffffff',
          borderRadius: '50px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(233,30,140,0.45)',
          fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(233,30,140,0.55)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(233,30,140,0.45)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
        Enquire Now
      </button>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close */}
            <button onClick={() => setLightboxIdx(null)}
              className="absolute top-5 right-6 flex items-center gap-2 font-mono text-[0.55rem] tracking-[0.2em] uppercase transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ffffff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>
              Close ✕
            </button>

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); setLightboxIdx(idx => ((idx ?? 0) - 1 + images.length) % images.length); }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
                  ‹
                </button>
                <button onClick={e => { e.stopPropagation(); setLightboxIdx(idx => ((idx ?? 0) + 1) % images.length); }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
                  ›
                </button>
              </>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={imgUrl(images[lightboxIdx ?? 0])}
              alt={item?.title}
              className="max-w-[88vw] max-h-[82vh] object-contain"
              style={{ borderRadius: '6px' }}
              onClick={e => e.stopPropagation()}
            />

            {/* Caption */}
            <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
              <div>
                <h3 className="font-bold text-white text-[1.1rem]" style={{ fontFamily: "'Syne', sans-serif" }}>{item?.title}</h3>
                <span className="font-mono text-[0.52rem] tracking-[0.18em] uppercase" style={{ color: '#e91e8c' }}>
                  {item?.category}{item?.client && ` · ${item.client}`}{item?.year && ` · ${item.year}`}
                </span>
              </div>
              {images.length > 1 && (
                <span className="font-mono text-[0.52rem] tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {(lightboxIdx ?? 0) + 1} / {images.length}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
