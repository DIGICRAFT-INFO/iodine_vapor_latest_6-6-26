'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, servicesApi } from '@/lib/api';

export default function ServicesPage() {
  const { data: slides   = [] } = useQuery({ queryKey: ['slides','services'], queryFn: () => slidesApi.get('services') });
  const { data: services = [] } = useQuery({ queryKey: ['services'],           queryFn: servicesApi.get });

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="services" defaultTitle="OUR SERVICES" defaultSub="Photography & Videography Excellence" />
      <main className="py-[100px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {(services.length ? services : []).map((svc: any, i: number) => (
              <motion.div
                key={svc._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="service-card group p-8"
                data-hover
              >
                <div className="font-display text-[3.5rem] leading-none mb-5" style={{ color: 'rgba(255,255,255,0.04)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="text-[1.6rem] mb-5">{svc.icon || '📸'}</div>
                <h3 className="font-serif text-[1.35rem] text-cream-DEFAULT mb-3">{svc.name}</h3>
                <p className="text-[0.8rem] leading-[1.8] mb-5" style={{ color: 'rgba(245,240,234,0.38)' }}>{svc.shortDesc}</p>
                {svc.features?.length > 0 && (
                  <ul className="space-y-1.5 mb-6">
                    {svc.features.map((f: string) => (
                      <li key={f} className="flex items-center gap-2 font-mono text-[0.56rem] tracking-[0.12em] uppercase" style={{ color: 'rgba(245,240,234,0.4)' }}>
                        <span style={{ color: 'var(--c-gold)', fontSize: '0.5rem' }}>✦</span>{f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href="/contact"
                  className="opacity-0 group-hover:opacity-100 font-mono text-[0.56rem] tracking-[0.18em] uppercase flex items-center gap-2 transition-all duration-300"
                  style={{ color: 'var(--c-gold)' }}
                  data-hover
                >
                  Enquire Now →
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href="/contact" className="btn-primary" data-hover>
              <span>Start a Project</span><span>→</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
