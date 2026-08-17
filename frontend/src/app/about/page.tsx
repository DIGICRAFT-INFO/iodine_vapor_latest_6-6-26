'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import EnquiryPopup from '@/components/sections/EnquiryPopup';
import { slidesApi, settingsApi, testimonialsApi, brandsApi, imgUrl } from '@/lib/api';
import { BsCamera } from 'react-icons/bs';

// ── Brand colors for text-only brand names ───────────────────────────────────
const BRAND_COLORS = ['#e91e8c','#1a1a2e','#7c3aed','#0ea5e9','#059669','#d97706','#dc2626'];

export default function AboutPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const { data: slides       = [] } = useQuery({ queryKey: ['slides','about'],  queryFn: () => slidesApi.get('about') });
  const { data: s            = {} } = useQuery({ queryKey: ['settings'],         queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'],     queryFn: () => testimonialsApi.get() });
  const { data: brands       = [] } = useQuery({ queryKey: ['brands'],           queryFn: () => brandsApi.get() });

  const team = [1, 2, 3].map(n => ({
    name: (s as any)[`team_member_${n}_name`],
    role: (s as any)[`team_member_${n}_role`],
    bio:  (s as any)[`team_member_${n}_bio`],
    img:  (s as any)[`team_member_${n}_img`],
  })).filter(m => m.name);

  const equipment = ((s as any).about_equipment || '').split('\n').filter(Boolean);
  const awards    = ((s as any).about_awards    || '').split('\n').filter(Boolean);
  const founded   = (s as any).about_founded || '2010';

  const stats = [
    { n: `${founded}`,  l: 'Founded', sub: 'Year of excellence' },
    { n: (s as any).years_experience   ? `${(s as any).years_experience}+`  : '14+',   l: 'Years',    sub: 'Industry experience' },
    { n: (s as any).projects_count     ? `${(s as any).projects_count}+`    : '2000+', l: 'Projects', sub: 'Delivered across India' },
    { n: (s as any).schools_count      ? `${(s as any).schools_count}+`     : '500+',  l: 'Clients',  sub: 'Happy & returning' },
  ];

  // Doubled brands for infinite scroll
  const doubled = brands.length ? [...brands as any[], ...brands as any[]] : [];

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="about" defaultTitle="ABOUT US" defaultSub="Our Story & Vision" />

      <main style={{ background: '#ffffff' }}>

        {/* ── 1. OUR STORY ──────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 px-6 md:px-12 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Our Story
                </p>
                <h2 className="font-bold text-[#1a1a2e] leading-[1.05] mb-6" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  Crafting Visuals Since{' '}
                  <span style={{ color: '#e91e8c' }}>{founded}</span>
                </h2>
                {(s as any).about_text && (
                  <p className="text-[0.9rem] leading-[1.85] mb-6" style={{ color: 'rgba(0,0,0,0.55)' }}>
                    {(s as any).about_text}
                  </p>
                )}
                {(s as any).about_why_us && (
                  <div className="p-5 rounded-xl border" style={{ background: 'rgba(233,30,140,0.03)', borderColor: 'rgba(233,30,140,0.12)' }}>
                    <p className="font-semibold text-[0.85rem] text-[#1a1a2e] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Why Studio Iodine Vapor?
                    </p>
                    <p className="text-[0.85rem] leading-[1.8]" style={{ color: 'rgba(0,0,0,0.55)' }}>
                      {(s as any).about_why_us}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-6">
                  {['Nikon NPS', 'GST Registered', 'MSME Certified', 'Pan-India'].map(b => (
                    <span key={b} className="font-mono text-[0.46rem] tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(233,30,140,0.07)', border: '1px solid rgba(233,30,140,0.15)', color: '#e91e8c' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Right — image or illustrated placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {(s as any).about_image ? (
                  <div className="overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: '4/5' }}>
                    <img src={imgUrl((s as any).about_image)} alt="Studio Iodine Vapor"
                      className="w-full h-full object-cover" style={{ filter: 'grayscale(10%)' }} />
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '4/5', background: 'linear-gradient(135deg, #1a1a2e 0%, #0d0b1a 100%)' }}>
                    {/* Decorative grid */}
                    <div className="absolute inset-0 opacity-5"
                      style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    {/* Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                      style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.2), transparent 70%)', filter: 'blur(30px)' }} />
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(233,30,140,0.15)', border: '1px solid rgba(233,30,140,0.3)' }}>
                        <BsCamera size={36} color="#e91e8c" />
                      </div>
                      <p className="font-bold text-white text-center text-[1.1rem]" style={{ fontFamily: "'Syne', sans-serif" }}>Studio Iodine Vapor</p>
                      <p className="font-mono text-[0.5rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Raipur, Chhattisgarh</p>
                    </div>
                    {/* Stats overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 grid grid-cols-2 gap-3"
                      style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.8), transparent)' }}>
                      {[{ n: '14+', l: 'Years' }, { n: '2000+', l: 'Projects' }].map(st => (
                        <div key={st.l} className="text-center">
                          <p className="font-bold text-white text-[1.4rem]" style={{ fontFamily: "'Syne', sans-serif" }}>{st.n}</p>
                          <p className="font-mono text-[0.46rem] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{st.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 2. STATS ─────────────────────────────────────────────────────── */}
        <section className="py-12 px-6 md:px-12 border-b" style={{ background: '#f8f8f8', borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div key={stat.l}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="text-center p-6 rounded-2xl bg-white border"
                  style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                  <p className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#e91e8c' }}>
                    {stat.n}
                  </p>
                  <p className="font-bold text-[0.9rem] text-[#1a1a2e] mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>{stat.l}</p>
                  <p className="font-mono text-[0.48rem] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(0,0,0,0.35)' }}>{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. TEAM ──────────────────────────────────────────────────────── */}
        {team.length > 0 && (
          <section className="py-16 px-6 md:px-12 border-b" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Our Team
              </p>
              <h2 className="font-bold text-[#1a1a2e] mb-10" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                Meet the Team
              </h2>
              <div className={`grid grid-cols-1 gap-8 ${team.length === 1 ? 'md:grid-cols-1 max-w-lg' : team.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {team.map((member, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl border overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                    style={{ borderColor: 'rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    {member.img ? (
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                        <img src={imgUrl(member.img)} alt={member.name} className="w-full h-full object-cover" style={{ filter: 'grayscale(15%)' }} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center" style={{ aspectRatio: '4/3', background: '#1a1a2e' }}>
                        <span className="font-bold text-white" style={{ fontSize: '3rem', fontFamily: "'Syne', sans-serif" }}>{member.name?.[0]}</span>
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

        {/* ── 4. BRANDS ────────────────────────────────────────────────────── */}
        <section className="py-14 border-b overflow-hidden" style={{ background: '#f8f8f8', borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="px-6 md:px-12 mb-8">
            <div className="max-w-[1400px] mx-auto flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.12))' }} />
                <p className="font-mono text-[0.52rem] tracking-[0.3em] uppercase flex items-center gap-2" style={{ color: 'rgba(0,0,0,0.35)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#e91e8c' }} />
                  Brands We've Worked With
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#e91e8c' }} />
                </p>
                <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.12), transparent)' }} />
              </div>
            </div>
          </div>

          {brands.length > 0 ? (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #f8f8f8, transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #f8f8f8, transparent)' }} />
              <div className="flex gap-4 w-max"
                style={{ animation: 'aboutBrandScroll 25s linear infinite' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.animationPlayState = 'running'}>
                {doubled.map((brand: any, i: number) => {
                  const color = BRAND_COLORS[i % BRAND_COLORS.length];
                  return (
                    <div key={`${brand._id}-${i}`}
                      className="flex-shrink-0 flex items-center justify-center px-6"
                      style={{ height: '64px', minWidth: '140px', background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '10px', transition: 'all 0.25s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                      {brand.logoUrl ? (
                        <img src={imgUrl(brand.logoUrl)} alt={brand.name}
                          className="max-h-[36px] w-auto object-contain"
                          style={{ filter: 'grayscale(50%) opacity(60%)', transition: 'filter 0.3s' }}
                          onMouseEnter={e => (e.target as HTMLImageElement).style.filter = 'grayscale(0%) opacity(100%)'}
                          onMouseLeave={e => (e.target as HTMLImageElement).style.filter = 'grayscale(50%) opacity(60%)'}
                          onError={e => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const p = (e.target as HTMLImageElement).parentElement;
                            if (p) p.innerHTML = `<span style="font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;color:${color}">${brand.name}</span>`;
                          }}
                        />
                      ) : (
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color }}>{brand.name}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <style>{`@keyframes aboutBrandScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
            </div>
          ) : (
            <div className="px-6 md:px-12">
              <div className="max-w-[1400px] mx-auto text-center py-10 rounded-2xl border" style={{ borderColor: 'rgba(0,0,0,0.07)', background: '#ffffff' }}>
                <p className="text-[0.82rem] mb-3" style={{ color: 'rgba(0,0,0,0.4)' }}>Client brand logos coming soon</p>
                <p className="font-mono text-[0.48rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>Add brands from Admin → Trusted Brands</p>
              </div>
            </div>
          )}
        </section>

        {/* ── 5. EQUIPMENT ─────────────────────────────────────────────────── */}
        {equipment.length > 0 && (
          <section className="py-14 px-6 md:px-12 border-b" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Our Gear
              </p>
              <h2 className="font-bold text-[#1a1a2e] mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Equipment</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {equipment.map((item: string, i: number) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="px-4 py-3 border rounded-xl text-center transition-all hover:-translate-y-0.5 hover:shadow-sm"
                    style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#f8f8f8' }}>
                    <p className="font-semibold text-[0.8rem] text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif" }}>{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. AWARDS ────────────────────────────────────────────────────── */}
        {awards.length > 0 && (
          <section className="py-14 px-6 md:px-12 border-b" style={{ background: '#f8f8f8', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="max-w-[1400px] mx-auto">
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Recognition
              </p>
              <h2 className="font-bold text-[#1a1a2e] mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Awards & Publications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {awards.map((award: string, i: number) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 px-5 py-4 border rounded-xl bg-white"
                    style={{ borderColor: 'rgba(233,30,140,0.12)' }}>
                    <span style={{ color: '#e91e8c', fontSize: '0.7rem', flexShrink: 0 }}>✦</span>
                    <span className="text-[0.85rem] font-medium text-[#1a1a2e]">{award}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 7. TESTIMONIALS ──────────────────────────────────────────────── */}
        <section className="py-14 px-6 md:px-12 border-b" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
              <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />What Clients Say
            </p>
            <h2 className="font-bold text-[#1a1a2e] mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
              Client Testimonials
            </h2>
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(testimonials as any[]).map((t: any, i: number) => (
                  <motion.div key={t._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ delay: i * 0.06 }}
                    className="p-6 border rounded-2xl bg-white hover:-translate-y-1 transition-transform duration-300"
                    style={{ borderColor: 'rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating || 5 }).map((_: any, j: number) => (
                        <span key={j} style={{ color: '#e91e8c', fontSize: '0.75rem' }}>★</span>
                      ))}
                    </div>
                    <p className="text-[0.85rem] leading-[1.8] mb-4 italic" style={{ color: 'rgba(0,0,0,0.6)' }}>"{t.content}"</p>
                    <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[0.75rem] font-bold shrink-0" style={{ background: '#e91e8c' }}>
                        {t.name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[0.85rem] text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif" }}>{t.name}</p>
                        <p className="font-mono text-[0.52rem] tracking-[0.1em] uppercase" style={{ color: 'rgba(0,0,0,0.35)' }}>
                          {t.role}{t.company ? `, ${t.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border" style={{ borderColor: 'rgba(0,0,0,0.07)', background: '#f8f8f8' }}>
                <p className="text-[0.82rem] mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>Client testimonials coming soon</p>
                <p className="font-mono text-[0.48rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,0,0,0.25)' }}>Add from Admin → Testimonials</p>
              </div>
            )}
          </div>
        </section>

        {/* ── 8. CTA ─────────────────────────────────────────────────────────── */}
        <section className="py-16 px-6 md:px-12" style={{ background: '#f8f8f8' }}>
          <div className="max-w-[700px] mx-auto">
            <div className="rounded-2xl p-10 md:p-14 text-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0d0b1a 100%)', position: 'relative', overflow: 'hidden' }}>
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(233,30,140,0.15), transparent 70%)', filter: 'blur(20px)' }} />
              <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase mb-3 relative" style={{ color: '#e91e8c' }}>Start a Project</p>
              <h2 className="font-bold text-white mb-4 relative" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)' }}>
                Let's Create Something Together
              </h2>
              <p className="text-[0.88rem] mb-8 relative" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Pan-India commercial photography. GST & MSME registered. Nikon NPS member.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 relative">
                <button onClick={() => setEnquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-[0.75rem] tracking-[0.1em] uppercase transition-all"
                  style={{ background: 'linear-gradient(135deg, #e91e8c, #c4167a)', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(233,30,140,0.35)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'none'}>
                  Get a Quote →
                </button>
                <Link href="/portfolio"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-[0.75rem] tracking-[0.08em] uppercase transition-all"
                  style={{ background: 'transparent', color: 'rgba(255,255,255,0.75)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}>
                  View Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Enquire Now */}
      <button onClick={() => setEnquiryOpen(true)}
        className="fixed z-[800] flex items-center gap-2 font-semibold text-[0.68rem] tracking-[0.08em] uppercase transition-all duration-300"
        style={{ bottom: '28px', right: '24px', padding: '12px 20px', background: 'linear-gradient(135deg, #e91e8c, #c4167a)', color: '#ffffff', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(233,30,140,0.45)', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
        Enquire Now
      </button>

      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
