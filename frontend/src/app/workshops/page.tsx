'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import EnquiryPopup from '@/components/sections/EnquiryPopup';
import { slidesApi, workshopsApi, wsCatsApi, testimonialsApi, faqsApi, imgUrl } from '@/lib/api';
import { format } from 'date-fns';
// React Icons — consistent with rest of site
import { BsCamera, BsCameraVideo } from 'react-icons/bs';
import { FaUserTie, FaBuilding } from 'react-icons/fa6';
import { MdOutlineCastForEducation } from 'react-icons/md';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import { TbBrandZoom } from 'react-icons/tb';

const ACADEMY_FEATURES = [
  {
    icon: <BsCamera size={22} color="#e91e8c" />,
    title: 'Photography Workshops',
    desc: 'Hands-on workshops covering commercial, architecture, and product photography techniques.',
    href: '/contact?type=workshop&service=Photography+Workshops',
  },
  {
    icon: <FaUserTie size={22} color="#e91e8c" />,
    title: 'One-to-One Mentoring',
    desc: 'Personalised sessions tailored to your current skill level and career goals.',
    href: '/contact?type=workshop&service=One-to-One+Mentoring',
  },
  {
    icon: <FaBuilding size={22} color="#e91e8c" />,
    title: 'Corporate Training',
    desc: 'Team training programs for marketing departments and in-house photographers.',
    href: '/contact?type=workshop&service=Corporate+Training',
  },
  {
    icon: <TbBrandZoom size={22} color="#e91e8c" />,
    title: 'Online Courses',
    desc: 'Learn at your own pace with structured video modules and live Q&A sessions.',
    href: '/contact?type=workshop&service=Online+Courses',
  },
  {
    icon: <HiOutlineAcademicCap size={22} color="#e91e8c" />,
    title: 'Student Portfolio',
    desc: 'Build a professional portfolio with real-world project shoots and feedback.',
    href: '/contact?type=workshop&service=Student+Portfolio',
  },
];

export default function WorkshopsPage() {
  const [catFilter, setCat]     = useState('');
  const [openFaq, setOpenFaq]   = useState<string | null>(null);
  const [enquiryOpen, setEnquiry] = useState(false);
  const [enquiryService, setEnquiryService] = useState('');
  const [waitlistOpen, setWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);

  const openEnquiry = (svc: string) => { setEnquiryService(svc); setEnquiry(true); };

  const { data: slides      = [] } = useQuery({ queryKey: ['slides', 'workshops'], queryFn: () => slidesApi.get('workshops') });
  const { data: cats        = [] } = useQuery({ queryKey: ['ws-cats-pub'],          queryFn: wsCatsApi.get });
  const { data: workshops   = [] } = useQuery({ queryKey: ['workshops', catFilter], queryFn: () => workshopsApi.get(catFilter ? { category: catFilter } : {}) });
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'],        queryFn: () => testimonialsApi.get() });
  const { data: faqs        = [] } = useQuery({ queryKey: ['faqs'],                queryFn: () => faqsApi.get() });

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="workshops" defaultTitle="PHOTOGRAPHY ACADEMY" defaultSub="Learn, Create, Grow" />

      <main style={{ background: '#ffffff' }}>

        {/* ── Intro ──────────────────────────────────────────────────────────── */}
        <section className="py-14 px-6 md:px-12 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Photography Academy
              </p>
              <h1 className="font-bold text-[#1a1a2e] leading-[1.05] mb-3" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                Master Photography with<br />Industry Experts
              </h1>
              <p className="text-[0.9rem] leading-[1.75] max-w-xl" style={{ color: 'rgba(0,0,0,0.5)' }}>
                Practical training, real-world projects, and personal mentoring to help you master commercial photography.
              </p>
            </div>
            <button onClick={() => openEnquiry('Photography Academy')}
              className="btn-primary shrink-0">
              <span>Enquire Now</span><span>→</span>
            </button>
          </div>
        </section>

        {/* ── Academy Features — with React Icons ────────────────────────────── */}
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
                  className="bg-white rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md group overflow-hidden"
                  style={{ borderColor: 'rgba(0,0,0,0.07)' }}
                >
                  <div className="p-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ background: 'rgba(233,30,140,0.08)' }}>
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-[0.9rem] text-[#1a1a2e] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{f.title}</h3>
                    <p className="text-[0.75rem] leading-[1.65] mb-3" style={{ color: 'rgba(0,0,0,0.45)' }}>{f.desc}</p>
                    <button onClick={() => openEnquiry(f.title)}
                      className="inline-flex items-center gap-1 font-bold text-[0.62rem] tracking-[0.08em] uppercase transition-colors"
                      style={{ color: '#e91e8c', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = '6px'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = '4px'}>
                      Enquire Now
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                  {/* Bottom accent */}
                  <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: 'linear-gradient(90deg, #e91e8c, #c4167a)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Workshops Grid ──────────────────────────────────────────────────── */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-2 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Upcoming Programs
                </p>
                <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                  Workshops & Courses
                </h2>
              </div>
              {cats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setCat('')}
                    className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase transition-all rounded-lg"
                    style={{ background: !catFilter ? '#e91e8c' : 'rgba(0,0,0,0.04)', color: !catFilter ? '#fff' : 'rgba(0,0,0,0.5)', border: `1px solid ${!catFilter ? '#e91e8c' : 'rgba(0,0,0,0.08)'}` }}>
                    All
                  </button>
                  {cats.map((cat: any) => (
                    <button key={cat._id} onClick={() => setCat(cat._id)}
                      className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase capitalize transition-all rounded-lg"
                      style={{ background: catFilter === cat._id ? '#e91e8c' : 'rgba(0,0,0,0.04)', color: catFilter === cat._id ? '#fff' : 'rgba(0,0,0,0.5)', border: `1px solid ${catFilter === cat._id ? '#e91e8c' : 'rgba(0,0,0,0.08)'}` }}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Empty state — improved with waitlist */}
            {workshops.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: 'rgba(0,0,0,0.07)', background: '#f8f8f8' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Left — message */}
                  <div className="p-10 md:p-12 flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(233,30,140,0.08)' }}>
                      <MdOutlineCastForEducation size={28} color="#e91e8c" />
                    </div>
                    <h3 className="font-bold text-[#1a1a2e] text-[1.3rem] mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                      New Batches Coming Soon
                    </h3>
                    <p className="text-[0.85rem] leading-[1.75] mb-6" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      We're planning our next workshop batch. Join the waitlist to be first to know — or contact us for private mentoring or corporate training.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setWaitlist(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-[0.72rem] tracking-[0.08em] uppercase transition-all rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #e91e8c, #c4167a)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(233,30,140,0.3)' }}>
                        🔔 Join Waitlist
                      </button>
                      <button onClick={() => openEnquiry('Private Mentoring')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-[0.72rem] tracking-[0.08em] uppercase border transition-all rounded-lg"
                        style={{ borderColor: 'rgba(0,0,0,0.12)', color: '#1a1a2e', background: '#fff', cursor: 'pointer' }}>
                        Contact Us →
                      </button>
                    </div>
                  </div>

                  {/* Right — what to expect */}
                  <div className="p-10 md:p-12 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <p className="font-mono text-[0.5rem] tracking-[0.22em] uppercase mb-5 font-semibold" style={{ color: 'rgba(0,0,0,0.35)' }}>
                      What to Expect
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Hands-on shooting sessions with real clients',
                        'Post-processing and editing masterclasses',
                        'Business & pricing guidance',
                        'Certificate of completion',
                        'Lifetime alumni community access',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-[0.82rem]" style={{ color: 'rgba(0,0,0,0.6)' }}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[0.5rem]"
                            style={{ background: 'rgba(233,30,140,0.1)', color: '#e91e8c' }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.map((w: any, i: number) => (
                  <motion.div key={w._id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                  >
                    <Link href={`/workshops/${w.slug}`}
                      className="group block rounded-xl border bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                      style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                      {w.coverImage?.url && (
                        <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                          <img src={imgUrl(w.coverImage.url)} alt={w.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            style={{ filter: 'grayscale(15%)' }} />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {w.date && <span className="font-mono text-[0.54rem] tracking-[0.15em] uppercase" style={{ color: '#e91e8c' }}>{format(new Date(w.date), 'MMM d, yyyy')}</span>}
                          {w.isOnline && <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-md" style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.1)' }}>Online</span>}
                          {w.isFree && <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-md" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)' }}>Free</span>}
                        </div>
                        <h3 className="font-bold text-[1rem] text-[#1a1a2e] mb-2 leading-[1.3] group-hover:text-[#e91e8c] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>{w.title}</h3>
                        {w.description && <p className="text-[0.78rem] leading-[1.7] mb-4" style={{ color: 'rgba(0,0,0,0.45)' }}>{w.description.slice(0, 100)}{w.description.length > 100 ? '…' : ''}</p>}
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                          <span className="font-bold text-[1.3rem] text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {w.isFree ? 'Free' : `₹${w.price}`}
                          </span>
                          <span className="font-mono text-[0.54rem] tracking-[0.15em] uppercase px-4 py-2 border rounded-lg transition-all group-hover:bg-[#e91e8c] group-hover:text-white group-hover:border-[#e91e8c]"
                            style={{ borderColor: 'rgba(233,30,140,0.3)', color: '#e91e8c' }}>
                            Enroll →
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

        {/* ── Testimonials ────────────────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="py-14 px-6 md:px-12" style={{ background: '#f8f8f8' }}>
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-10">
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Student Feedback
                </p>
                <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Testimonials</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {testimonials.slice(0, 3).map((t: any, i: number) => (
                  <motion.div key={t._id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="bg-white p-6 rounded-xl border"
                    style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating || 5 }).map((_: any, j: number) => (
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
                        <p className="font-mono text-[0.52rem] tracking-[0.1em] uppercase" style={{ color: 'rgba(0,0,0,0.35)' }}>{t.role}{t.company ? `, ${t.company}` : ''}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQs ────────────────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="py-14 px-6 md:px-12">
            <div className="max-w-[800px] mx-auto">
              <div className="mb-10 text-center">
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3" style={{ color: '#e91e8c' }}>Common Questions</p>
                <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>FAQs</h2>
              </div>
              <div className="space-y-3">
                {faqs.slice(0, 8).map((faq: any) => (
                  <div key={faq._id} className="border rounded-xl overflow-hidden"
                    style={{ borderColor: openFaq === faq._id ? 'rgba(233,30,140,0.2)' : 'rgba(0,0,0,0.08)' }}>
                    <button onClick={() => setOpenFaq(openFaq === faq._id ? null : faq._id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                      style={{ background: openFaq === faq._id ? 'rgba(233,30,140,0.03)' : '#fff' }}>
                      <span className="font-semibold text-[0.9rem] text-[#1a1a2e] pr-4" style={{ fontFamily: "'Syne', sans-serif" }}>{faq.question}</span>
                      <span style={{ color: '#e91e8c', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{openFaq === faq._id ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence>
                      {openFaq === faq._id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          className="overflow-hidden">
                          <div className="px-5 pb-4" style={{ background: 'rgba(233,30,140,0.02)' }}>
                            <p className="text-[0.85rem] leading-[1.8]" style={{ color: 'rgba(0,0,0,0.55)' }}>{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
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
              <button onClick={() => openEnquiry('Photography Academy Enrollment')} className="btn-primary">
                <span>Enroll Now →</span>
              </button>
              <button onClick={() => openEnquiry('Workshop Enquiry')} className="btn-hero-ghost">
                <span>Ask a Question</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating enquire button */}
      <button onClick={() => openEnquiry('Photography Academy')}
        className="fixed z-[800] flex items-center gap-2 font-semibold text-[0.68rem] tracking-[0.08em] uppercase transition-all duration-300"
        style={{ bottom: '28px', right: '24px', padding: '12px 20px', background: 'linear-gradient(135deg, #e91e8c, #c4167a)', color: '#ffffff', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(233,30,140,0.45)', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
        Enquire Now
      </button>

      {/* Enquiry Popup */}
      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiry(false)} serviceName={enquiryService} />

      {/* Waitlist Modal */}
      <AnimatePresence>
        {waitlistOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[950] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
            onClick={e => { if (e.target === e.currentTarget) setWaitlist(false); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-8 rounded-2xl"
              style={{ background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}
              onClick={e => e.stopPropagation()}>
              {waitlistDone ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(233,30,140,0.1)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] text-[1.3rem] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>You're on the list!</h3>
                  <p className="text-[0.82rem] mb-5" style={{ color: 'rgba(0,0,0,0.45)' }}>We'll notify you as soon as the next batch opens.</p>
                  <button onClick={() => { setWaitlist(false); setWaitlistDone(false); }}
                    className="px-6 py-2.5 font-mono text-[0.55rem] tracking-[0.18em] uppercase border rounded-lg transition-all"
                    style={{ borderColor: '#e91e8c', color: '#e91e8c' }}>Close</button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-[#1a1a2e] text-[1.3rem]" style={{ fontFamily: "'Syne', sans-serif" }}>Join the Waitlist</h3>
                      <p className="text-[0.78rem] mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>Be first to know when the next batch opens</p>
                    </div>
                    <button onClick={() => setWaitlist(false)} style={{ color: 'rgba(0,0,0,0.35)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div className="flex gap-2">
                    <input type="email" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-3 rounded-lg text-[0.85rem] outline-none transition-all"
                      style={{ border: '1.5px solid #e8e8ef', color: '#1a1a2e' }}
                      onFocus={e => e.currentTarget.style.borderColor = '#e91e8c'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e8e8ef'} />
                    <button onClick={() => { if (waitlistEmail) setWaitlistDone(true); }}
                      className="px-5 py-3 font-semibold text-[0.72rem] tracking-[0.08em] uppercase rounded-lg transition-all"
                      style={{ background: '#e91e8c', color: '#fff', border: 'none', cursor: 'pointer' }}>
                      Notify Me
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
