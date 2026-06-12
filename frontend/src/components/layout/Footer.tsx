'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';
import { FaInstagramSquare, FaYoutubeSquare } from 'react-icons/fa';
import { SlSocialBehance } from 'react-icons/sl';
import { CiLinkedin } from 'react-icons/ci';

const NAV = {
  'Navigate': [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Workshops', href: '/workshops' },
    { label: 'Journal', href: '/blog' },
  ],
  'Services': [
    { label: 'Commercial Photography', href: '/services' },
    { label: 'Brand Videography', href: '/services' },
    { label: 'Architecture & Interiors', href: '/services' },
    { label: 'School Shoots', href: '/services' },
    { label: 'Drone & Aerial', href: '/services' },
    { label: 'Event Coverage', href: '/services' },
  ],
  'Connect': [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Get a Quote', href: '/contact' },
    { label: 'Join Workshop', href: '/workshops' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Copyright', href: '/copyright' },
  ],
};

export default function Footer() {
  const { data: s } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get, staleTime: 300_000 });

  return (
    <footer className="relative pt-20 pb-8 px-4 md:px-6 lg:px-12" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0b1a 100%)' }}>
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 10%, #e91e8c 30%, #c4a0d4 50%, #3a7bd5 70%, transparent 90%)' }} />

      <div className="max-w-[1400px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-16">
          {/* Brand Column */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href="/" className="inline-block mb-5">
              <div className="inline-flex items-center justify-center p-4 rounded-xl" style={{ background: 'rgba(247, 249, 250, 0.96)' }}>
                <img src="/iodineLogo.png" alt="Iodine Vapor" className="h-16 md:h-30 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-[0.82rem] leading-[1.8] mb-6 max-w-[280px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {s?.site_tagline || '12+ years of visual storytelling across India. Nikon Professional Services member.'}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { key: 'social_instagram', icon: <FaInstagramSquare size={22} /> },
                { key: 'social_youtube', icon: <FaYoutubeSquare size={22} /> },
                { key: 'social_linkedin', icon: <CiLinkedin size={22} /> },
                { key: 'social_behance', icon: <SlSocialBehance size={22} /> },
              ].map(item => s?.[item.key] ? (
                <motion.a
                  key={item.key}
                  href={s[item.key]}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(233,30,140,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = '#e91e8c'; (e.currentTarget as HTMLElement).style.color = '#e91e8c'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  {item.icon}
                </motion.a>
              ) : null)}
            </div>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(NAV).map(([group, links], gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (gi + 1) * 0.1 }}
            >
              <h4 className="text-[0.7rem] font-bold tracking-[0.15em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>{group}</h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {links.map(l => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.82rem] font-medium transition-all duration-200 hover:text-[#e91e8c] hover:translate-x-1 inline-block"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <Link href="/copyright" className="text-[0.65rem] font-medium transition-colors hover:text-[#e91e8c]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {s?.footer_copy || `© 2025 Iodine Vapor Photography. All rights reserved.`}
          </Link>
          <div className="flex gap-2 flex-wrap justify-center">
            {['Nikon NPS', 'GST Registered', 'MSME Certified', 'Pan-India'].map(b => (
              <span key={b} className="text-[0.55rem] font-semibold tracking-[0.08em] uppercase px-3 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
