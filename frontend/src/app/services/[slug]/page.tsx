'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EnquiryPopup from '@/components/sections/EnquiryPopup';
import { servicesApi, imgUrl } from '@/lib/api';
import { format } from 'date-fns';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['service-detail', slug],
    queryFn: () => servicesApi.getOne(slug),
    enabled: !!slug,
  });

  const service          = data?.service;
  const relatedPortfolio = data?.relatedPortfolio || [];
  const relatedBlogs     = data?.relatedBlogs     || [];
  const relatedProducts  = data?.relatedProducts  || [];

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#ffffff' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#e91e8c', borderTopColor: 'transparent' }} />
          <p className="font-mono text-[0.55rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(0,0,0,0.35)' }}>Loading…</p>
        </div>
      </div>
      <Footer />
    </>
  );

  // ── 404 ──────────────────────────────────────────────────────────────────
  if (!service) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6" style={{ background: '#ffffff' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: '#e91e8c' }}>404</p>
        <h1 className="font-bold text-[2rem] text-center" style={{ fontFamily: "'Syne', sans-serif", color: '#1a1a2e' }}>Service Not Found</h1>
        <Link href="/services" className="btn-primary mt-2"><span>← All Services</span></Link>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0b1a 0%, #1a0d20 100%)' }}
      >
        {/* bg image faded */}
        {service.imageUrl && (
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12 }}>
            <img src={imgUrl(service.imageUrl)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(233,30,140,0.12), transparent 70%)' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-[0.65rem] font-mono tracking-[0.15em] uppercase">
            <Link href="/" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
            <Link href="/services" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}>Services</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{service.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              {/* Category tag */}
              {service.category && (
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full" style={{ background: 'rgba(233,30,140,0.15)', border: '1px solid rgba(233,30,140,0.25)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#e91e8c' }} />
                  <span className="font-mono text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: '#e91e8c' }}>{service.category}</span>
                </div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-bold text-white leading-[1.05] mb-4"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                {service.name}
              </motion.h1>

              {service.shortDesc && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-[1rem] leading-[1.8] max-w-2xl mb-8"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {service.shortDesc}
                </motion.p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  relatedPortfolio.length > 0 && { n: relatedPortfolio.length, label: 'Portfolio Items' },
                  relatedBlogs.length > 0     && { n: relatedBlogs.length,     label: 'Related Articles' },
                  relatedProducts.length > 0  && { n: relatedProducts.length,  label: 'Related Products' },
                ].filter(Boolean).map((stat: any) => (
                  <div key={stat.label}>
                    <span className="font-bold text-white text-[1.4rem]" style={{ fontFamily: "'Syne', sans-serif" }}>{stat.n}</span>
                    <p className="font-mono text-[0.48rem] tracking-[0.18em] uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setEnquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[0.75rem] tracking-[0.08em] uppercase transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #e91e8c, #c4167a)', color: '#ffffff', borderRadius: '6px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(233,30,140,0.35)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}
                >
                  <span>Enquire Now</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
                <Link href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[0.75rem] tracking-[0.08em] uppercase transition-all duration-300"
                  style={{ background: 'transparent', color: 'rgba(255,255,255,0.75)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            {/* Service image card */}
            {service.imageUrl && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="hidden lg:block w-72 xl:w-80 flex-shrink-0"
              >
                <img src={imgUrl(service.imageUrl)} alt={service.name}
                  className="w-full object-cover"
                  style={{ aspectRatio: '3/4', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <main style={{ background: '#ffffff' }}>

        {/* ── Description + Features ──────────────────────────────────────── */}
        {(service.description || service.features?.length > 0) && (
          <section className="py-14 md:py-20 px-6 md:px-12 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
              {service.description && (
                <div>
                  <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                    <span className="w-5 h-px inline-block" style={{ background: '#e91e8c' }} />About This Service
                  </p>
                  <p className="text-[0.95rem] leading-[1.9]" style={{ color: 'rgba(0,0,0,0.6)' }}>{service.description}</p>
                </div>
              )}

              {service.features?.length > 0 && (
                <div>
                  <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                    <span className="w-5 h-px inline-block" style={{ background: '#e91e8c' }} />What We Cover
                  </p>
                  <ul className="space-y-2.5">
                    {service.features.map((f: string, i: number) => (
                      <motion.li key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        className="flex items-center gap-3 text-[0.85rem]"
                        style={{ color: 'rgba(0,0,0,0.65)' }}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[0.5rem]"
                          style={{ background: 'rgba(233,30,140,0.1)', color: '#e91e8c' }}>✓</span>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Related Portfolio ────────────────────────────────────────────── */}
        {relatedPortfolio.length > 0 && (
          <section className="py-14 md:py-20 px-6 md:px-12 border-b" style={{ background: '#f8f8f8', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase mb-2 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                    <span className="w-5 h-px inline-block" style={{ background: '#e91e8c' }} />Related Work
                  </p>
                  <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    Portfolio — {service.name}
                  </h2>
                </div>
                <Link href="/portfolio" className="hidden md:inline-flex items-center gap-2 font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors" style={{ color: 'rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'}>
                  All Portfolio →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedPortfolio.map((item: any, i: number) => (
                  <motion.div key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="group relative overflow-hidden"
                    style={{ borderRadius: '6px', aspectRatio: '1' }}
                  >
                    <Link href={`/portfolio/${item.slug}`}>
                      <img src={imgUrl(item.imageUrl)} alt={item.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        style={{ filter: 'grayscale(15%)' }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
                        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.05) 55%)' }}>
                        <p className="font-semibold text-[0.82rem] text-white leading-tight mb-0.5">{item.title}</p>
                        {item.client && <p className="font-mono text-[0.48rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.client}</p>}
                      </div>
                      {item.category && (
                        <span className="absolute top-2 left-2 font-mono text-[0.44rem] tracking-[0.12em] uppercase px-2 py-1"
                          style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.8)', borderRadius: '4px', backdropFilter: 'blur(6px)' }}>
                          {item.category}
                        </span>
                      )}
                      {/* Click indicator */}
                      <div className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(233,30,140,0.9)', borderRadius: '50%' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related Products ─────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="py-14 md:py-20 px-6 md:px-12 border-b" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase mb-2 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                    <span className="w-5 h-px inline-block" style={{ background: '#e91e8c' }} />Related Products
                  </p>
                  <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    Products for This Service
                  </h2>
                </div>
                <Link href="/products" className="hidden md:inline-flex items-center gap-2 font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors" style={{ color: 'rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'}>
                  All Products →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {relatedProducts.map((prod: any, i: number) => (
                  <motion.div key={prod._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="group border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ borderColor: 'rgba(0,0,0,0.07)', borderRadius: '6px', overflow: 'hidden' }}
                  >
                    <Link href={`/products/${prod.slug}`}>
                      {prod.images?.[0]?.url ? (
                        <div className="overflow-hidden" style={{ aspectRatio: '1' }}>
                          <img src={imgUrl(prod.images[0].url)} alt={prod.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center" style={{ aspectRatio: '1', background: '#f8f8f8' }}>
                          <span style={{ fontSize: '2rem' }}>📦</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="font-semibold text-[0.85rem] text-[#1a1a2e] leading-tight mb-1 group-hover:text-[#e91e8c] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>{prod.name}</h3>
                        {prod.shortDesc && <p className="text-[0.72rem]" style={{ color: 'rgba(0,0,0,0.45)' }}>{prod.shortDesc.slice(0, 60)}…</p>}
                        <p className="mt-2 font-mono text-[0.5rem] tracking-[0.1em] uppercase flex items-center gap-1" style={{ color: '#e91e8c' }}>
                          View Details
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related Blogs ────────────────────────────────────────────────── */}
        {relatedBlogs.length > 0 && (
          <section className="py-14 md:py-20 px-6 md:px-12 border-b" style={{ background: '#f8f8f8', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase mb-2 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                    <span className="w-5 h-px inline-block" style={{ background: '#e91e8c' }} />Related Articles
                  </p>
                  <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    Insights & Tips
                  </h2>
                </div>
                <Link href="/blog" className="hidden md:inline-flex items-center gap-2 font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors" style={{ color: 'rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'}>
                  All Articles →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((blog: any, i: number) => (
                  <motion.div key={blog._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <Link href={`/blog/${blog.slug}`}
                      className="group block border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      style={{ borderColor: 'rgba(0,0,0,0.07)', borderRadius: '8px', overflow: 'hidden' }}
                    >
                      {blog.coverImage?.url && (
                        <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                          <img src={imgUrl(blog.coverImage.url)} alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ filter: 'grayscale(10%)' }} />
                        </div>
                      )}
                      <div className="p-5">
                        {blog.category?.name && (
                          <span className="font-mono text-[0.48rem] tracking-[0.18em] uppercase px-2 py-1 mb-3 inline-block"
                            style={{ color: '#e91e8c', background: 'rgba(233,30,140,0.08)', borderRadius: '4px' }}>
                            {blog.category.name}
                          </span>
                        )}
                        <h3 className="font-bold text-[0.95rem] leading-[1.4] mb-2 group-hover:text-[#e91e8c] transition-colors" style={{ color: '#1a1a2e', fontFamily: "'Syne', sans-serif" }}>
                          {blog.title}
                        </h3>
                        {blog.excerpt && <p className="text-[0.75rem] leading-[1.65] mb-3" style={{ color: 'rgba(0,0,0,0.5)' }}>{blog.excerpt.slice(0, 100)}…</p>}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[0.48rem] tracking-[0.12em] uppercase" style={{ color: 'rgba(0,0,0,0.3)' }}>
                            {blog.publishedAt ? format(new Date(blog.publishedAt), 'MMM d, yyyy') : ''}
                          </span>
                          <span className="font-mono text-[0.5rem] tracking-[0.1em] uppercase" style={{ color: '#e91e8c' }}>Read →</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 px-6 md:px-12 text-center" style={{ background: '#1a1a2e' }}>
          <div className="max-w-[640px] mx-auto">
            <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase mb-4" style={{ color: '#e91e8c' }}>Start a Project</p>
            <h2 className="font-bold text-white mb-4 leading-[1.1]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
              Ready for {service.name}?
            </h2>
            <p className="text-[0.88rem] mb-8 leading-[1.75]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Pan-India services · GST Registered · MSME Certified · Nikon NPS Member
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => setEnquiryOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-[0.75rem] tracking-[0.1em] uppercase transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #e91e8c, #c4167a)', color: '#ffffff', borderRadius: '6px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(233,30,140,0.35)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}
              >
                <span>Get a Free Quote</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <Link href="/services"
                className="inline-flex items-center gap-2 font-mono text-[0.55rem] tracking-[0.18em] uppercase transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ffffff'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}
              >
                ← All Services
              </Link>
            </div>
          </div>
        </section>
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

      {/* Enquiry Popup */}
      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} serviceName={service.name} />
    </>
  );
}
