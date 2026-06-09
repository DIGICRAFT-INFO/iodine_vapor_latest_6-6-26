'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { settingsApi, imgUrl } from '@/lib/api';

const LINKS = [
  { href: '/about',     label: 'About' },
  { href: '/services',  label: 'Services' },
  { href: '/products',  label: 'Products' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/blog',      label: 'Journal' },
  { href: '/faq',       label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobile] = useState(false);
  const pathname = usePathname();

  const { data: s } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get, staleTime: 300_000 });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMobile(false); }, [pathname]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const siteName = s?.site_name || 'Iodine Vapor';

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[900] transition-all duration-500"
        style={{
          padding: scrolled ? '12px 16px' : '20px 16px',
          background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <nav className="flex items-center justify-between max-w-[1600px] mx-auto lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-[910]" data-hover>
            {s?.site_logo ? (
              <img src={imgUrl(s.site_logo)} alt={siteName} className="h-8 lg:h-9 w-auto object-contain" />
            ) : (
              <div className="font-display text-[1.3rem] lg:text-[1.6rem] tracking-[0.12em]" style={{ color: '#f5f0ea' }}>
                {siteName.split(' ').map((w: string, i: number) => (
                  <span key={i}>{i > 0 && <span style={{ color: 'var(--c-gold)' }}>.</span>}{w}</span>
                ))}
              </div>
            )}
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8 list-none">
            {LINKS.map(link => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-hover
                    className="relative font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors duration-300"
                    style={{ color: active ? 'var(--c-cream)' : 'rgba(245,240,234,0.45)' }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                      style={{
                        background: 'var(--c-gold)',
                        width: active ? '100%' : '0%',
                      }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/contact" data-hover className="btn-ghost py-2.5 px-5 text-[0.6rem]">
              Get a Quote
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="lg:hidden relative z-[910] flex items-center justify-center"
            onClick={() => setMobile(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ width: '44px', height: '44px', borderRadius: '4px', background: mobileOpen ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className="block transition-all duration-300 ease-in-out"
                style={{
                  width: '20px',
                  height: '2px',
                  background: mobileOpen ? 'var(--c-gold)' : '#f5f0ea',
                  transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                  borderRadius: '1px',
                }}
              />
              <span
                className="block transition-all duration-300 ease-in-out"
                style={{
                  width: '20px',
                  height: '2px',
                  background: mobileOpen ? 'var(--c-gold)' : '#f5f0ea',
                  opacity: mobileOpen ? 0 : 1,
                  borderRadius: '1px',
                }}
              />
              <span
                className="block transition-all duration-300 ease-in-out"
                style={{
                  width: '20px',
                  height: '2px',
                  background: mobileOpen ? 'var(--c-gold)' : '#f5f0ea',
                  transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                  borderRadius: '1px',
                }}
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[850] flex flex-col items-center justify-center gap-6"
            style={{ background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(20px)' }}
          >
            {/* Nav links */}
            {[...LINKS, { href: '/contact', label: 'Get a Quote' }].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobile(false)}
                  className="block font-display text-[1.8rem] tracking-[0.06em] transition-colors duration-300"
                  style={{ color: pathname === link.href ? 'var(--c-gold)' : 'rgba(245,240,234,0.35)' }}
                >
                  {link.label.toUpperCase()}
                </Link>
              </motion.div>
            ))}

            {/* Social / Contact info at bottom */}
            {(s?.contact_email || s?.contact_phone) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 flex flex-col items-center gap-2"
              >
                {s?.contact_email && (
                  <a href={`mailto:${s.contact_email}`} className="font-mono text-[0.6rem] tracking-[0.15em]" style={{ color: 'rgba(245,240,234,0.3)' }}>
                    {s.contact_email}
                  </a>
                )}
                {s?.contact_phone && (
                  <a href={`tel:${s.contact_phone}`} className="font-mono text-[0.6rem] tracking-[0.15em]" style={{ color: 'rgba(245,240,234,0.3)' }}>
                    {s.contact_phone}
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
