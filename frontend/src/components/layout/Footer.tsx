'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';

const NAV = {
  'Navigate': [
    { label: 'Home',      href: '/' },
    { label: 'About Us',  href: '/about' },
    { label: 'Services',  href: '/services' },
    { label: 'Products',  href: '/products' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Workshops', href: '/workshops' },
    { label: 'Journal',   href: '/blog' },
  ],
  'Services': [
    { label: 'Commercial Photography', href: '/services' },
    { label: 'Brand Videography',      href: '/services' },
    { label: 'Architecture & Interiors',href: '/services' },
    { label: 'School Shoots',          href: '/services' },
    { label: 'Drone & Aerial',         href: '/services' },
    { label: 'Event Coverage',         href: '/services' },
  ],
  'Connect': [
    { label: 'Contact Us',    href: '/contact' },
    { label: 'Get a Quote',   href: '/contact' },
    { label: 'Join Workshop', href: '/workshops' },
    { label: 'FAQ',           href: '/faq' },
  ],
};

export default function Footer() {
  const { data: s } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get, staleTime: 300_000 });

  const siteName = s?.site_name || 'Iodine Vapor';

  return (
    <footer className="relative border-t pt-20 pb-10 px-6 md:px-12" style={{ background: '#080808', borderColor: 'rgba(255,255,255,0.05)' }}>
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--c-gold), transparent)' }} />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href="/" className="block mb-5">
              <div className="font-display text-[2rem] tracking-[0.1em] text-cream-DEFAULT">
                {siteName.split(' ')[0]}<span className="text-gold-DEFAULT">.</span>{siteName.split(' ').slice(1).join(' ')}
              </div>
            </Link>
            <p className="text-[0.8rem] leading-[1.8] mb-6 max-w-[280px]" style={{ color: 'rgba(245,240,234,0.35)' }}>
              {s?.site_tagline || '12+ years of visual storytelling across India. Nikon Professional Services member.'}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { key: 'social_instagram', label: 'IG' },
                { key: 'social_youtube',   label: 'YT' },
                { key: 'social_linkedin',  label: 'IN' },
                { key: 'social_behance',   label: 'BE' },
              ].map(item => s?.[item.key] ? (
                <a key={item.key} href={s[item.key]} target="_blank" rel="noreferrer" data-hover
                  className="w-9 h-9 flex items-center justify-center border transition-all duration-300 font-mono text-[0.55rem] tracking-wider"
                  style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(245,240,234,0.35)', borderRadius: '2px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--c-gold)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,234,0.35)'; }}
                >{item.label}</a>
              ) : null)}
            </div>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(NAV).map(([group, links], gi) => (
            <motion.div key={group} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (gi + 1) * 0.08 }}>
              <h4 className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-5" style={{ color: 'rgba(245,240,234,0.25)' }}>{group}</h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {links.map(l => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} data-hover className="text-[0.82rem] transition-colors duration-200" style={{ color: 'rgba(245,240,234,0.4)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--c-cream)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,234,0.4)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="font-mono text-[0.52rem] tracking-[0.15em]" style={{ color: 'rgba(245,240,234,0.2)' }}>
            {s?.footer_copy || `© 2025 Iodine Vapor Photography. All rights reserved.`}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {['Nikon NPS', 'GST Registered', 'MSME Certified', 'Pan-India'].map(b => (
              <span key={b} className="font-mono text-[0.48rem] tracking-[0.15em] uppercase px-2.5 py-1 border" style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(245,240,234,0.2)', borderRadius: '2px' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
