'use client';
// ── ABOUT PAGE ────────────────────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, settingsApi, testimonialsApi, imgUrl } from '@/lib/api';
import { useInView } from 'react-intersection-observer';

export default function AboutPage() {
  const { data: slides = [] }       = useQuery({ queryKey: ['slides','about'],     queryFn: () => slidesApi.get('about') });
  const { data: settings = {} }     = useQuery({ queryKey: ['settings'],           queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'],       queryFn: testimonialsApi.get });

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Client brands from settings API
  const clientBrands = settings?.client_brands;
  const clients: string[] = clientBrands
    ? (typeof clientBrands === 'string' ? clientBrands.split(',').map((c: string) => c.trim()).filter(Boolean) : Array.isArray(clientBrands) ? clientBrands : [])
    : [];

  // About text and image from settings
  const aboutText = settings?.about_text;
  const aboutImage = settings?.about_image;

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="about" defaultTitle="OUR STORY" defaultSub="12 Years of Visual Excellence" />

      <main>
        {/* About Content */}
        <section className="py-[120px] px-6 md:px-12" style={{ background: 'var(--c-bg2)' }}>
          <div className="max-w-[1400px] mx-auto">
            <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
              <div>
                <div className="flex items-center gap-3 mb-6 font-mono text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'var(--c-gold)' }}>
                  <span className="w-8 h-px" style={{ background: 'var(--c-gold)' }} />
                  About Us
                </div>
                <h2 className="font-display text-cream-DEFAULT leading-[0.9] mb-8" style={{ fontSize: 'clamp(2.8rem, 5vw, 6rem)' }}>
                  CRAFTING VISUALS<br />SINCE <span style={{ color: 'var(--c-gold)' }}>2013</span>
                </h2>
                {aboutText && (
                  <div className="space-y-4 max-w-[480px]" style={{ color: 'rgba(0,0,0,0.55)', fontSize: '0.9rem', lineHeight: '1.9' }}>
                    <p>{aboutText}</p>
                  </div>
                )}
              </div>
              {aboutImage && (
                <div>
                  <img src={imgUrl(aboutImage)} alt="Studio" className="w-full object-cover" style={{ aspectRatio: '4/5', filter: 'grayscale(15%)', borderRadius: '2px' }} />
                </div>
              )}
            </div>

            {/* Clients from settings */}
            {clients.length > 0 && (
              <div className="mt-20">
                <p className="font-mono text-[0.58rem] tracking-[0.3em] uppercase mb-6" style={{ color: 'rgba(0,0,0,0.2)' }}>Brands We've Worked With</p>
                <div className="flex flex-wrap gap-3">
                  {clients.map((c: string) => (
                    <span key={c} className="font-mono text-[0.6rem] tracking-[0.15em] uppercase px-4 py-2.5 border" style={{ borderColor: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.5)', borderRadius: '2px' }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-[100px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-center gap-3 mb-10 font-mono text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'var(--c-gold)' }}>
                <span className="w-8 h-px" style={{ background: 'var(--c-gold)' }} />
                What Clients Say
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t: any) => (
                  <motion.div key={t._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="p-6 border" style={{ background: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.07)', borderRadius: '2px' }}>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => <span key={i} style={{ color: 'var(--c-gold)', fontSize: '0.75rem' }}>★</span>)}
                    </div>
                    <p className="text-[0.85rem] leading-[1.8] mb-5" style={{ color: 'rgba(0,0,0,0.6)', fontStyle: 'italic' }}>"{t.content}"</p>
                    <div>
                      <p className="font-semibold text-[0.85rem] text-cream-DEFAULT">{t.name}</p>
                      <p className="font-mono text-[0.52rem] tracking-[0.12em] uppercase" style={{ color: 'var(--c-gold)' }}>{t.role}{t.company && `, ${t.company}`}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-[80px] px-6 md:px-12 text-center" style={{ background: 'var(--c-bg2)' }}>
          <h2 className="font-display text-cream-DEFAULT mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>READY TO START?</h2>
          <Link href="/contact" className="btn-primary inline-flex" data-hover><span>Get a Quote</span><span>→</span></Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
