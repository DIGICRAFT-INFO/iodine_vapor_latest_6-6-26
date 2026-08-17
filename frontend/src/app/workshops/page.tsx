'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, workshopsApi, wsCatsApi, testimonialsApi, faqsApi, imgUrl } from '@/lib/api';
import { format } from 'date-fns';

const ACADEMY_FEATURES = [
  { icon: '📸', title: 'Photography Workshops', desc: 'Hands-on workshops covering commercial, architecture, and product photography techniques.' },
  { icon: '🎯', title: 'One-to-One Mentoring', desc: 'Personalised sessions tailored to your current skill level and career goals.' },
  { icon: '🏢', title: 'Corporate Training', desc: 'Team training programs for marketing departments and in-house photographers.' },
  { icon: '💻', title: 'Online Courses', desc: 'Learn at your own pace with structured video modules and live Q&A sessions.' },
  { icon: '🗂️', title: 'Student Portfolio', desc: 'Build a professional portfolio with real-world project shoots and feedback.' },
];

export default function WorkshopsPage() {
  const [catFilter, setCat] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const { data: slides    = [] } = useQuery({ queryKey: ['slides', 'workshops'],  queryFn: () => slidesApi.get('workshops') });
  const { data: cats      = [] } = useQuery({ queryKey: ['ws-cats-pub'],           queryFn: wsCatsApi.get });
  const { data: workshops = [] } = useQuery({ queryKey: ['workshops', catFilter],  queryFn: () => workshopsApi.get(catFilter ? { category: catFilter } : {}) });
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'],       queryFn: testimonialsApi.get });
  const { data: faqs      = [] } = useQuery({ queryKey: ['faqs'],                 queryFn: faqsApi.get });

  return (
    <>
      <Navbar />
      <HeroFromSlides
        slides={slides}
        page="workshops"
        defaultTitle="PHOTOGRAPHY ACADEMY"
        defaultSub="Learn, Create, Grow"
      />

      <main style={{ background: '#ffffff' }}>

        {/* ── Academy Intro ─────────────────────────────────────────────────── */}
        <section className="py-14 px-6 md:px-12 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />
                Photography Academy
              </p>
              <h1 className="font-bold text-[#1a1a2e] leading-[1.05] mb-3" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                Master Photography with<br />Industry Experts
              </h1>
              <p className="text-[0.9rem] leading-[1.75] max-w-xl" style={{ color: 'rgba(0,0,0,0.5)' }}>
                Practical training, real-world projects, and personal mentoring to help you master commercial photography.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              <span>Enquire Now</span><span>→</span>
            </Link>
          </div>
        </section>

        {/* ── Academy Features ──────────────────────────────────────────────── */}
        <section className="py-14 px-6 md:px-12" style={{ background: '#f8f8f8' }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {ACADEMY_FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="bg-white p-5 rounded-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{ borderColor: 'rgba(0,0,0,0.07)' }}
                >
                  <span className="text-[1.8rem] block mb-3">{f.icon}</span>
                  <h3 className="font-bold text-[0.9rem] text-[#1a1a2e] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{f.title}</h3>
                  <p className="text-[0.75rem] leading-[1.65]" style={{ color: 'rgba(0,0,0,0.45)' }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Workshops Grid ─────────────────────────────────────────────────── */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-2 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />
                  Upcoming Programs
                </p>
                <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                  Workshops & Courses
                </h2>
              </div>
              {/* Category Filter */}
              {cats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCat('')}
                    className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase transition-all rounded"
                    style={{
                      background: !catFilter ? '#e91e8c' : 'rgba(0,0,0,0.04)',
                      color: !catFilter ? '#fff' : 'rgba(0,0,0,0.5)',
                      border: `1px solid ${!catFilter ? '#e91e8c' : 'rgba(0,0,0,0.08)'}`,
                    }}
                  >
                    All
                  </button>
                  {cats.map((cat: any) => (
                    <button
                      key={cat._id}
                      onClick={() => setCat(cat._id)}
                      className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase capitalize transition-all rounded"
                      style={{
                        background: catFilter === cat._id ? '#e91e8c' : 'rgba(0,0,0,0.04)',
                        color: catFilter === cat._id ? '#fff' : 'rgba(0,0,0,0.5)',
                        border: `1px solid ${catFilter === cat._id ? '#e91e8c' : 'rgba(0,0,0,0.08)'}`,
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {workshops.length === 0 ? (
              <div className="text-center py-20 rounded-sm border" style={{ borderColor: 'rgba(0,0,0,0.07)', background: '#f8f8f8' }}>
                <p className="font-mono text-[0.58rem] tracking-[0.22em] uppercase mb-3" style={{ color: 'rgba(0,0,0,0.25)' }}>
                  No workshops currently scheduled
                </p>
                <p className="text-[0.85rem] mb-6" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  Contact us for private mentoring or custom corporate training.
                </p>
                <Link href="/contact" className="btn-primary" data-hover>
                  <span>Contact Us</span><span>→</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.map((w: any, i: number) => (
                  <motion.div
                    key={w._id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                  >
                    <Link
                      href={`/workshops/${w.slug}`}
                      className="group block rounded-sm border bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                      style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                    >
                      {w.coverImage?.url && (
                        <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                          <img
                            src={imgUrl(w.coverImage.url)}
                            alt={w.title}
                            className="w-full h-full object-cover transition-all duration-600 group-hover:scale-105"
                            style={{ filter: 'grayscale(15%)' }}
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {w.date && (
                            <span className="font-mono text-[0.54rem] tracking-[0.15em] uppercase" style={{ color: '#e91e8c' }}>
                              {format(new Date(w.date), 'MMM d, yyyy')}
                            </span>
                          )}
                          {w.isOnline && (
                            <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded" style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.1)' }}>Online</span>
                          )}
                          {w.isFree && (
                            <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)' }}>Free</span>
                          )}
                        </div>
                        <h3 className="font-bold text-[1rem] text-[#1a1a2e] mb-2 leading-[1.3]" style={{ fontFamily: "'Syne', sans-serif" }}>
                          {w.title}
                        </h3>
                        {w.description && (
                          <p className="text-[0.78rem] leading-[1.7] mb-4" style={{ color: 'rgba(0,0,0,0.45)' }}>
                            {w.description.slice(0, 100)}{w.description.length > 100 ? '…' : ''}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                          <span className="font-bold text-[1.4rem] text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {w.isFree ? 'Free' : `₹${w.price}`}
                          </span>
                          <span className="font-mono text-[0.54rem] tracking-[0.15em] uppercase px-4 py-2 border rounded transition-all group-hover:bg-[#e91e8c] group-hover:text-white group-hover:border-[#e91e8c]"
                            style={{ borderColor: 'rgba(233,30,140,0.3)', color: '#e91e8c' }}>
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
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="py-14 px-6 md:px-12" style={{ background: '#f8f8f8' }}>
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-10">
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />
                  Student Feedback
                </p>
                <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                  Testimonials
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.slice(0, 3).map((t: any, i: number) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="bg-white p-6 rounded-sm border"
                    style={{ borderColor: 'rgba(0,0,0,0.07)' }}
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating || 5 }).map((_, j) => (
                        <span key={j} style={{ color: '#e91e8c', fontSize: '0.75rem' }}>★</span>
                      ))}
                    </div>
                    <p className="text-[0.85rem] leading-[1.8] mb-4 italic" style={{ color: 'rgba(0,0,0,0.6)' }}>"{t.content}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.7rem] font-bold shrink-0" style={{ background: '#e91e8c' }}>
                        {t.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[0.82rem] text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif" }}>{t.name}</p>
                        <p className="font-mono text-[0.52rem] tracking-[0.1em] uppercase" style={{ color: 'rgba(0,0,0,0.35)' }}>
                          {t.role}{t.company ? `, ${t.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQs ──────────────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="py-14 px-6 md:px-12">
            <div className="max-w-[800px] mx-auto">
              <div className="mb-10 text-center">
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3" style={{ color: '#e91e8c' }}>
                  Common Questions
                </p>
                <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                  FAQs
                </h2>
              </div>
              <div className="space-y-3">
                {faqs.slice(0, 8).map((faq: any) => (
                  <div
                    key={faq._id}
                    className="border rounded-sm overflow-hidden"
                    style={{ borderColor: openFaq === faq._id ? 'rgba(233,30,140,0.2)' : 'rgba(0,0,0,0.08)' }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === faq._id ? null : faq._id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                      style={{ background: openFaq === faq._id ? 'rgba(233,30,140,0.03)' : '#fff' }}
                    >
                      <span className="font-semibold text-[0.9rem] text-[#1a1a2e] pr-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {faq.question}
                      </span>
                      <span style={{ color: '#e91e8c', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>
                        {openFaq === faq._id ? '−' : '+'}
                      </span>
                    </button>
                    {openFaq === faq._id && (
                      <div className="px-5 pb-4" style={{ background: 'rgba(233,30,140,0.02)' }}>
                        <p className="text-[0.85rem] leading-[1.8]" style={{ color: 'rgba(0,0,0,0.55)' }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-14 px-6 md:px-12 text-center" style={{ background: '#1a1a2e' }}>
          <div className="max-w-[600px] mx-auto">
            <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3" style={{ color: '#e91e8c' }}>Ready to Learn?</p>
            <h2 className="font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
              Start Your Photography Journey
            </h2>
            <p className="text-[0.88rem] mb-7" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Enroll in a workshop or contact us for a personalised mentoring session.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                <span>Enroll Now</span><span>→</span>
              </Link>
              <Link href="/contact" className="btn-hero-ghost">
                <span>Ask a Question</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
