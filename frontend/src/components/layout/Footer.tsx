'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { settingsApi, servicesApi } from '@/lib/api';
import { FaInstagramSquare, FaYoutubeSquare } from 'react-icons/fa';
import { SlSocialBehance } from 'react-icons/sl';
import { CiLinkedin } from 'react-icons/ci';
import { ImLocation2 } from 'react-icons/im';

const STATIC_NAV = {
  'Quick Links': [
    { label: 'Home',               href: '/' },
    { label: 'About Us',           href: '/about' },
    { label: 'Portfolio',          href: '/portfolio' },
    { label: 'Photography Academy',href: '/workshops' },
    { label: 'Blog',               href: '/blog' },
    { label: 'Contact Us',         href: '/contact' },
  ],
  'Resources': [
    { label: 'Get a Quote',         href: '/contact' },
    { label: 'FAQ',                 href: '/faq' },
    { label: 'Products',            href: '/products' },
    { label: 'Privacy Policy',      href: '/copyright' },
    { label: 'Terms & Conditions',  href: '/copyright' },
  ],
};

export default function Footer() {
  const { data: s } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: servicesApi.get, staleTime: 300_000 });

  const topServices = (services as any[]).slice(0, 6);

  return (
    <footer className="relative pt-16 pb-8 px-4 md:px-6 lg:px-12" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0b1a 100%)' }}>
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 5%, #e91e8c 30%, #c4a0d4 50%, #3a7bd5 70%, transparent 95%)' }} />

      <div className="max-w-[1400px] mx-auto">

        {/* ── Main Grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 mb-14">

          {/* Brand Column — 2 cols wide on lg */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            {/* Logo */}
            <Link href="/" className="inline-block mb-5">
              <div className="inline-flex items-center justify-center p-3 rounded-xl"
                style={{ background: 'rgba(247,249,250,0.96)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                <img src="/iodineLogo.png" alt="Iodine Vapor"
                  className="object-contain"
                  style={{ height: '52px', width: 'auto' }} />
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-[0.82rem] leading-[1.8] mb-5 max-w-[280px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {(s as any)?.site_tagline || 'Visual Stories That Convert — 14+ years of commercial photography across India.'}
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              {(s as any)?.contact_phone && (
                <a href={`tel:${(s as any).contact_phone}`}
                  className="flex items-center gap-2 text-[0.78rem] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>
                  <span style={{ color: '#e91e8c', fontSize: '0.7rem' }}>☎</span>
                  {(s as any).contact_phone}
                </a>
              )}
              {(s as any)?.contact_email && (
                <a href={`mailto:${(s as any).contact_email}`}
                  className="flex items-center gap-2 text-[0.78rem] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>
                  <span style={{ color: '#e91e8c', fontSize: '0.7rem' }}>✉</span>
                  {(s as any).contact_email}
                </a>
              )}
              {(s as any)?.contact_address && (
                <p className="flex items-start gap-2 text-[0.78rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <ImLocation2 size={13} color="#e91e8c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {(s as any).contact_address}
                </p>
              )}
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { key: 'social_instagram', icon: <FaInstagramSquare size={20} />, label: 'Instagram' },
                { key: 'social_youtube',   icon: <FaYoutubeSquare size={20} />,   label: 'YouTube' },
                { key: 'social_linkedin',  icon: <CiLinkedin size={20} />,         label: 'LinkedIn' },
                { key: 'social_behance',   icon: <SlSocialBehance size={18} />,    label: 'Behance' },
              ].map(item => (s as any)?.[item.key] ? (
                <motion.a
                  key={item.key}
                  href={(s as any)[item.key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(233,30,140,0.15)';
                    (e.currentTarget as HTMLElement).style.borderColor = '#e91e8c';
                    (e.currentTarget as HTMLElement).style.color = '#e91e8c';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                  }}
                >
                  {item.icon}
                </motion.a>
              ) : null)}
            </div>
          </motion.div>

          {/* Services Column — dynamic from DB */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-[0.62rem] font-bold tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Services
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {topServices.length > 0 ? (
                <>
                  {topServices.map((svc: any) => (
                    <li key={svc._id}>
                      <Link
                        href={`/services/${svc.slug || ''}`}
                        className="text-[0.78rem] font-medium transition-all duration-200 inline-flex items-center gap-1.5 group"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e91e8c'; (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                      >
                        <span style={{ color: '#e91e8c', fontSize: '0.4rem', opacity: 0.7 }}>●</span>
                        {svc.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/services"
                      className="text-[0.72rem] font-semibold transition-all duration-200"
                      style={{ color: '#e91e8c' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
                      View All Services →
                    </Link>
                  </li>
                </>
              ) : (
                ['Architecture Photography', 'Interior Photography', 'Product Photography', 'Food Photography', 'Industrial Photography', 'More Services'].map(l => (
                  <li key={l}>
                    <Link href="/services"
                      className="text-[0.78rem] font-medium transition-all duration-200"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#e91e8c'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>
                      {l}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </motion.div>

          {/* Quick Links + Resources */}
          {Object.entries(STATIC_NAV).map(([group, links], gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (gi + 2) * 0.1 }}
            >
              <h4 className="text-[0.62rem] font-bold tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {links.map(l => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.78rem] font-medium transition-all duration-200 inline-block"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e91e8c'; (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom Bar ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <p className="text-[0.65rem] font-medium" style={{ color: 'rgba(255,255,255,0.28)' }}>
            {(s as any)?.footer_copy || `© ${new Date().getFullYear()} Iodine Vapor Photography. All rights reserved.`}
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {['Nikon NPS', 'GST Registered', 'MSME Certified', 'Pan-India'].map(b => (
              <span key={b} className="text-[0.48rem] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(233,30,140,0.08)', color: 'rgba(233,30,140,0.6)', border: '1px solid rgba(233,30,140,0.15)' }}>
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
