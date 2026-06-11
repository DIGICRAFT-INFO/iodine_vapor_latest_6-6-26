'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, servicesApi, imgUrl } from '@/lib/api';

export default function ServicesPage() {
  const { data: slides   = [] } = useQuery({ queryKey: ['slides','services'], queryFn: () => slidesApi.get('services') });
  const { data: services = [] } = useQuery({ queryKey: ['services'],           queryFn: servicesApi.get });

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="services" defaultTitle="OUR SERVICES" defaultSub="Photography & Videography Excellence" />
      <main className="py-[100px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)' }}>
            {(services.length ? services : []).map((svc: any, i: number) => (
              <motion.div
                key={svc._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="service-card group p-8 relative overflow-hidden"
              >
                {/* Background Image */}
                {svc.imageUrl && (
                  <div className="absolute inset-0">
                    <img src={imgUrl(svc.imageUrl)} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.92) 100%)' }} />
                  </div>
                )}
                <div className="relative z-10">
                  <div className="font-display text-[3.5rem] leading-none mb-5" style={{ color: 'rgba(0,0,0,0.05)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="text-[1.6rem] mb-5">{svc.icon || '📸'}</div>
                  <h3 className="font-serif text-[1.35rem] text-cream-DEFAULT mb-3">{svc.name}</h3>
                  <p className="text-[0.8rem] leading-[1.8] mb-5" style={{ color: 'rgba(0,0,0,0.5)' }}>{svc.shortDesc}</p>
                  {svc.features?.length > 0 && (
                    <ul className="space-y-1.5 mb-6">
                      {svc.features.map((f: string) => (
                        <li key={f} className="flex items-center gap-2 text-[0.7rem] font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>
                          <span style={{ color: '#e91e8c' }}>•</span>{f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href="/contact" className="text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 font-semibold transition-all hover:gap-4" style={{ color: '#e91e8c' }}>
                    Enquire Now →
                  </Link>
                </div>
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
