'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import EnquiryPopup from '@/components/sections/EnquiryPopup';
import { slidesApi, servicesApi, imgUrl } from '@/lib/api';
import { GiPhotoCamera } from 'react-icons/gi';
import { FaHospitalUser, FaBuilding, FaBagShopping, FaUserTie } from 'react-icons/fa6';
import { IoFastFoodOutline, IoStorefront } from 'react-icons/io5';
import { LiaIndustrySolid } from 'react-icons/lia';
import { MdOutlineCastForEducation } from 'react-icons/md';
import { SiInstructure, SiCinema4D } from 'react-icons/si';
import { TbCreativeCommonsBy, TbBuildingSkyscraper } from 'react-icons/tb';
import { BsBoxSeam, BsCamera, BsCameraVideo } from 'react-icons/bs';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

function SvcIcon({ iconKey, size = 28, color = '#e91e8c' }: { iconKey: string; size?: number; color?: string }) {
  const map: Record<string, React.ReactNode> = {
    camera:     <GiPhotoCamera size={size} color={color} />,
    hospital:   <FaHospitalUser size={size} color={color} />,
    food:       <IoFastFoodOutline size={size} color={color} />,
    industry:   <LiaIndustrySolid size={size} color={color} />,
    education:  <MdOutlineCastForEducation size={size} color={color} />,
    structure:  <SiInstructure size={size} color={color} />,
    creative:   <TbCreativeCommonsBy size={size} color={color} />,
    cinema:     <SiCinema4D size={size} color={color} />,
    building:   <FaBuilding size={size} color={color} />,
    skyscraper: <TbBuildingSkyscraper size={size} color={color} />,
    shopping:   <FaBagShopping size={size} color={color} />,
    portrait:   <FaUserTie size={size} color={color} />,
    storefront: <IoStorefront size={size} color={color} />,
    box:        <BsBoxSeam size={size} color={color} />,
    video:      <BsCameraVideo size={size} color={color} />,
    photo:      <BsCamera size={size} color={color} />,
    office:     <HiOutlineOfficeBuilding size={size} color={color} />,
  };
  return <>{map[iconKey] || <GiPhotoCamera size={size} color={color} />}</>;
}

// Category display icons
const CAT_ICONS: Record<string, React.ReactNode> = {
  'Spaces':           <TbBuildingSkyscraper size={36} color="#e91e8c" />,
  'Industries':       <LiaIndustrySolid size={36} color="#e91e8c" />,
  'Products':         <BsBoxSeam size={36} color="#e91e8c" />,
  'People':           <FaUserTie size={36} color="#e91e8c" />,
  'Special Projects': <GiPhotoCamera size={36} color="#e91e8c" />,
  'Other':            <GiPhotoCamera size={36} color="#e91e8c" />,
};

const CAT_DESC: Record<string, string> = {
  'Spaces':           'Stunning visuals for architectural spaces, interiors, and commercial environments.',
  'Industries':       'Industrial and educational institutions captured with precision and professionalism.',
  'Products':         'Product photography that converts — e-commerce, commercial, food & beverage.',
  'People':           'Corporate portraits and executive photography that build authority and trust.',
  'Special Projects': 'Tourism, destination, and unique photography projects across India.',
  'Other':            'Specialised photography services tailored to your unique needs.',
};

const CAT_ORDER = ['Spaces', 'Industries', 'Products', 'People', 'Special Projects', 'Other'];

export default function ServicesPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryService, setEnquiryService] = useState('');

  const openEnquiry = (svcName: string) => { setEnquiryService(svcName); setEnquiryOpen(true); };

  const { data: slides   = [] } = useQuery({ queryKey: ['slides', 'services'], queryFn: () => slidesApi.get('services') });
  const { data: services = [] } = useQuery({ queryKey: ['services'],            queryFn: servicesApi.get });

  // Group services by category
  const grouped = (services as any[]).reduce((acc: Record<string, any[]>, svc: any) => {
    const cat = svc.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {} as Record<string, any[]>);

  const orderedGroups = CAT_ORDER
    .filter(c => grouped[c]?.length > 0)
    .map(c => ({ name: c, items: grouped[c] }));

  return (
    <>
      <Navbar />
      <HeroFromSlides
        slides={slides}
        page="services"
        defaultTitle="OUR SERVICES"
        defaultSub="Photography & Videography Excellence"
      />

      <main style={{ background: '#ffffff' }}>

        {/* ── Intro ─────────────────────────────────────────────────────────── */}
        <section className="py-14 px-6 md:px-12 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />What We Offer
              </p>
              <h1 className="font-bold text-[#1a1a2e] leading-[1.05] mb-3" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                Commercial Photography Services
              </h1>
              <p className="text-[0.9rem] leading-[1.75] max-w-xl" style={{ color: 'rgba(0,0,0,0.5)' }}>
                Tailored photography solutions for every business need. Pan-India services with 14+ years of expertise.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {['Nikon NPS', 'GST Registered', 'MSME Certified'].map(b => (
                <span key={b} className="font-mono text-[0.5rem] tracking-[0.15em] uppercase px-3 py-1.5 border rounded"
                  style={{ borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.4)' }}>{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Grouped Services ──────────────────────────────────────────────── */}
        {orderedGroups.length > 0 ? (
          <div>
            {orderedGroups.map((group, gi) => {
              const desc = CAT_DESC[group.name] || CAT_DESC['Other'];
              return (
                <section key={group.name} className="py-16 px-6 md:px-12"
                  style={{ background: gi % 2 === 0 ? '#ffffff' : '#f8f8f8' }}>
                  <div className="max-w-[1400px] mx-auto">
                    {/* Group header */}
                    <div className="flex items-end gap-4 mb-10">
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl shrink-0"
                        style={{ background: 'rgba(233,30,140,0.08)' }}>
                        {CAT_ICONS[group.name] || CAT_ICONS['Other']}
                      </div>
                      <div>
                        <p className="font-mono text-[0.52rem] tracking-[0.25em] uppercase mb-1" style={{ color: '#e91e8c' }}>
                          {group.name}
                        </p>
                        <h2 className="font-bold text-[#1a1a2e]" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                          {group.name} Photography
                        </h2>
                        <p className="text-[0.82rem] mt-1" style={{ color: 'rgba(0,0,0,0.45)' }}>{desc}</p>
                      </div>
                    </div>
                    {/* Services grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {group.items.map((svc: any, i: number) => (
                        <motion.div
                          key={svc._id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className="group relative overflow-hidden rounded-sm border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                          style={{ borderColor: 'rgba(0,0,0,0.07)' }}
                        >
                          {svc.imageUrl && (
                            <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                              <img
                                src={imgUrl(svc.imageUrl)}
                                alt={svc.name}
                                className="w-full h-full object-cover transition-all duration-600 group-hover:scale-105"
                                style={{ filter: 'grayscale(20%)' }}
                                onMouseEnter={e => (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'}
                                onMouseLeave={e => (e.target as HTMLImageElement).style.filter = 'grayscale(20%)'}
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(233,30,140,0.08)' }}>
                                <SvcIcon iconKey={svc.icon} size={20} />
                              </div>
                              <h3 className="font-bold text-[1rem] text-[#1a1a2e] leading-[1.25]" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {svc.name}
                              </h3>
                            </div>
                            {svc.shortDesc && (
                              <p className="text-[0.8rem] leading-[1.75] mb-4" style={{ color: 'rgba(0,0,0,0.5)' }}>
                                {svc.shortDesc}
                              </p>
                            )}
                            {svc.features?.length > 0 && (
                              <ul className="space-y-1.5 mb-5">
                                {svc.features.map((f: string) => (
                                  <li key={f} className="flex items-center gap-2 text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.5)' }}>
                                    <span style={{ color: '#e91e8c', fontSize: '0.5rem' }}>✦</span>{f}
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="flex items-center gap-4 flex-wrap">
                              <button
                                onClick={() => openEnquiry(svc.name)}
                                className="inline-flex items-center gap-2 font-semibold text-[0.65rem] tracking-[0.1em] uppercase transition-all hover:gap-3"
                                style={{ color: '#e91e8c', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                Enquire Now →
                              </button>
                              {svc.slug && (
                                <Link href={`/services/${svc.slug}`}
                                  className="inline-flex items-center gap-1.5 font-mono text-[0.55rem] tracking-[0.15em] uppercase transition-colors"
                                  style={{ color: 'rgba(0,0,0,0.35)' }}
                                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1a1a2e'}
                                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.35)'}
                                >
                                  View Details
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                  </svg>
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Fallback static categories when no DB data */
          <section className="py-16 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(CAT_ICONS).filter(([k]) => k !== 'Other').map(([name, icon], i) => (
                  <motion.div key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="p-6 rounded-sm border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl mb-4"
                      style={{ background: 'rgba(233,30,140,0.08)' }}>
                      {icon}
                    </div>
                    <h3 className="font-bold text-[1.1rem] text-[#1a1a2e] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{name}</h3>
                    <p className="text-[0.8rem] leading-[1.75] mb-4" style={{ color: 'rgba(0,0,0,0.5)' }}>{CAT_DESC[name]}</p>
                    <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-[0.65rem] tracking-[0.1em] uppercase transition-all hover:gap-3" style={{ color: '#e91e8c' }}>
                      Enquire Now →
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-16 px-6 md:px-12 text-center" style={{ background: '#1a1a2e' }}>
          <div className="max-w-[700px] mx-auto">
            <h2 className="font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
              Ready to Elevate Your Brand Visuals?
            </h2>
            <p className="text-[0.88rem] mb-8 leading-[1.75]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Pan-India commercial photography services. GST & MSME registered. Nikon NPS member.
            </p>
            <Link href="/contact" className="btn-primary" data-hover>
              <span>Start a Project</span><span>→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} serviceName={enquiryService} />
    </>
  );
}
