'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, settingsApi, testimonialsApi, brandsApi, imgUrl } from '@/lib/api';
import { useInView } from 'react-intersection-observer';

export default function AboutPage() {
  const { data: slides = [] }       = useQuery({ queryKey: ['slides','about'],  queryFn: () => slidesApi.get('about') });
  const { data: s = {} }            = useQuery({ queryKey: ['settings'],         queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'],     queryFn: testimonialsApi.get });
  const { data: brands = [] }       = useQuery({ queryKey: ['brands'],           queryFn: brandsApi.get });

  const [secRef, secIn] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Build team from settings
  const team = [1, 2, 3].map(n => ({
    name: (s as any)[`team_member_${n}_name`],
    role: (s as any)[`team_member_${n}_role`],
    bio:  (s as any)[`team_member_${n}_bio`],
    img:  (s as any)[`team_member_${n}_img`],
  })).filter(m => m.name);

  const equipment = ((s as any).about_equipment || '').split('\n').filter(Boolean);
  const awards    = ((s as any).about_awards    || '').split('\n').filter(Boolean);

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="about" defaultTitle="ABOUT US" defaultSub="Our Story & Vision" />

      <main style={{ background: '#ffffff' }}>

        {/* ── 1. OUR STORY ──────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 px-6 md:px-12" style={{ background: '#ffffff' }}>
          <div className="max-w-[1400px] mx-auto">
            <div ref={secRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center reveal ${secIn ? 'visible' : ''}`}>
              <div>
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Our Story
                </p>
                <h2 className="font-bold text-[#1a1a2e] leading-[1.05] mb-6" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  Crafting Visuals Since{' '}
                  <span style={{ color: '#e91e8c' }}>{(s as any).about_founded || '2010'}</span>
                </h2>
                {(s as any).about_text && (
                  <p className="text-[0.9rem] leading-[1.85] mb-6" style={{ color: 'rgba(0,0,0,0.55)' }}>
                    {(s as any).about_text}
                  </p>
                )}
                {(s as any).about_why_us && (
                  <>
                    <p className="font-semibold text-[0.85rem] text-[#1a1a2e] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Why Studio Iodine Vapor?
                    </p>
                    <p className="text-[0.88rem] leading-[1.8]" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      {(s as any).about_why_us}
                    </p>
                  </>
                )}
              </div>
              {(s as any).about_image ? (
                <div className="overflow-hidden rounded-sm" style={{ aspectRatio: '4/5' }}>
                  <img src={imgUrl((s as any).about_image)} alt="Studio" className="w-full h-full object-cover" style={{ filter: 'grayscale(10%)' }} />
                </div>
              ) : (
                <div className="rounded-sm flex items-center justify-center" style={{ aspectRatio: '4/5', background: '#f0f0f0' }}>
                  <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: '4rem' }}>📷</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 2. MEET THE TEAM ──────────────────────────────────────────────── */}
        {team.length > 0 && (
          <section className="py-16 px-6 md:px-12" style={{ background: '#f8f8f8' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Our Team
              </p>
              <h2 className="font-bold text-[#1a1a2e] mb-10" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                Meet the Team
              </h2>
              <div className={`grid grid-cols-1 gap-8 ${team.length === 1 ? 'md:grid-cols-1 max-w-lg' : team.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {team.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-white rounded-sm border overflow-hidden"
                    style={{ borderColor: 'rgba(0,0,0,0.07)' }}
                  >
                    {member.img ? (
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                        <img src={imgUrl(member.img)} alt={member.name} className="w-full h-full object-cover" style={{ filter: 'grayscale(15%)' }} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center" style={{ aspectRatio: '4/3', background: '#1a1a2e' }}>
                        <span className="font-bold text-white" style={{ fontSize: '3rem', fontFamily: "'Syne', sans-serif" }}>
                          {member.name?.[0]}
                        </span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-bold text-[1.05rem] text-[#1a1a2e] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{member.name}</h3>
                      <p className="font-mono text-[0.52rem] tracking-[0.15em] uppercase mb-3" style={{ color: '#e91e8c' }}>{member.role}</p>
                      {member.bio && <p className="text-[0.8rem] leading-[1.75]" style={{ color: 'rgba(0,0,0,0.5)' }}>{member.bio}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 3. EQUIPMENT ──────────────────────────────────────────────────── */}
        {equipment.length > 0 && (
          <section className="py-14 px-6 md:px-12" style={{ background: '#ffffff' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Gear
              </p>
              <h2 className="font-bold text-[#1a1a2e] mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                Our Equipment
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {equipment.map((item: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="px-4 py-3 border rounded-sm text-center"
                    style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#f8f8f8' }}
                  >
                    <p className="font-semibold text-[0.8rem] text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif" }}>{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 4. CLIENTS (Brands from DB) ───────────────────────────────────── */}
        {brands.length > 0 && (
          <section className="py-14 px-6 md:px-12" style={{ background: '#f8f8f8' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-8 text-center flex items-center justify-center gap-3" style={{ color: 'rgba(0,0,0,0.35)' }}>
                <span className="w-8 h-px bg-black/20 inline-block" />Brands We've Worked With<span className="w-8 h-px bg-black/20 inline-block" />
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                {brands.map((brand: any, i: number) => (
                  <motion.div key={brand._id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    {brand.logoUrl ? (
                      <img src={imgUrl(brand.logoUrl)} alt={brand.name} className="object-contain" style={{ height: '44px', maxWidth: '110px', filter: 'grayscale(100%) opacity(40%)', transition: 'filter 0.3s' }}
                        onMouseEnter={e => (e.target as HTMLImageElement).style.filter = 'grayscale(0%) opacity(100%)'}
                        onMouseLeave={e => (e.target as HTMLImageElement).style.filter = 'grayscale(100%) opacity(40%)'} />
                    ) : (
                      <span className="font-display text-[1.2rem] tracking-widest uppercase" style={{ color: 'rgba(0,0,0,0.2)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c9a96e'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.2)'}>{brand.name}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 5. AWARDS & PUBLICATIONS ──────────────────────────────────────── */}
        {awards.length > 0 && (
          <section className="py-14 px-6 md:px-12" style={{ background: '#1a1a2e' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#c9a96e' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#c9a96e' }} />Recognition
              </p>
              <h2 className="font-bold text-white mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                Awards & Publications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {awards.map((award: string, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 px-5 py-4 border rounded-sm"
                    style={{ borderColor: 'rgba(201,169,110,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ color: '#c9a96e', fontSize: '0.7rem' }}>✦</span>
                    <span className="text-[0.85rem] font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{award}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. TESTIMONIALS ───────────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="py-14 px-6 md:px-12" style={{ background: '#ffffff' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />What Clients Say
              </p>
              <h2 className="font-bold text-[#1a1a2e] mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                Client Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonials.map((t: any, i: number) => (
                  <motion.div key={t._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="p-6 border rounded-sm" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                    <div className="flex gap-1 mb-3">{Array.from({ length: t.rating || 5 }).map((_, j) => <span key={j} style={{ color: '#e91e8c', fontSize: '0.75rem' }}>★</span>)}</div>
                    <p className="text-[0.85rem] leading-[1.8] mb-4 italic" style={{ color: 'rgba(0,0,0,0.6)' }}>"{t.content}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[0.75rem] font-bold shrink-0" style={{ background: '#e91e8c' }}>{t.name?.[0]}</div>
                      <div>
                        <p className="font-semibold text-[0.85rem] text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif" }}>{t.name}</p>
                        <p className="font-mono text-[0.52rem] tracking-[0.1em] uppercase" style={{ color: 'rgba(0,0,0,0.35)' }}>{t.role}{t.company ? `, ${t.company}` : ''}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-14 px-6 md:px-12 text-center" style={{ background: '#f8f8f8' }}>
          <div className="max-w-[600px] mx-auto">
            <h2 className="font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
              Let's Create Something Together
            </h2>
            <p className="text-[0.88rem] mb-7" style={{ color: 'rgba(0,0,0,0.5)' }}>
              Pan-India commercial photography. GST & MSME registered. Nikon NPS member.
            </p>
            <Link href="/contact" className="btn-primary" data-hover>
              <span>Get a Quote</span><span>→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
