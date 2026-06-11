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
          background: 'transparent',
          borderBottom: 'none',
        }}
      >
        <nav className="flex items-center justify-between max-w-[1600px] mx-auto lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-[910]" data-hover>
            {/* <img src="/Iodine-Logo.png" alt={siteName} className="h-10 lg:h-12 w-auto object-contain" /> */}
            <span className="font-display text-[1.1rem] lg:text-[1.4rem]  font-semibold tracking-[0.08em]" style={{ color: '#333333' }}>Iodine<span style={{ color: '#e91e8c' }}>Vapor</span></span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-2 list-none">
            {LINKS.map(link => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative text-[0.72rem] tracking-[0.08em] uppercase font-semibold transition-all duration-300 hover:text-[#e91e8c] hover:scale-105 hover:bg-[rgba(233,30,140,0.06)] px-3 py-1.5 rounded-md"
                    style={{ color: active ? '#e91e8c' : '#1a1a2e', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-[2px] transition-all duration-300"
                      style={{
                        background: '#e91e8c',
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
            style={{ width: '44px', height: '44px', borderRadius: '4px', background: mobileOpen ? 'rgba(233,30,140,0.1)' : 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className="block transition-all duration-300 ease-in-out"
                style={{
                  width: '20px',
                  height: '2px',
                  background: mobileOpen ? 'var(--c-gold)' : '#1a1a2e',
                  transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                  borderRadius: '1px',
                }}
              />
              <span
                className="block transition-all duration-300 ease-in-out"
                style={{
                  width: '20px',
                  height: '2px',
                  background: mobileOpen ? 'var(--c-gold)' : '#1a1a2e',
                  opacity: mobileOpen ? 0 : 1,
                  borderRadius: '1px',
                }}
              />
              <span
                className="block transition-all duration-300 ease-in-out"
                style={{
                  width: '20px',
                  height: '2px',
                  background: mobileOpen ? 'var(--c-gold)' : '#1a1a2e',
                  transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                  borderRadius: '1px',
                }}
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Backdrop + Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop - click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[840]"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              onClick={() => setMobile(false)}
            />
            {/* Dropdown menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-4 right-4 z-[850] flex flex-col items-center gap-2 py-6 px-4 rounded-xl"
              style={{ background: 'rgba(26,26,46,0.97)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            >
            {/* Nav links */}
            {[...LINKS, { href: '/contact', label: 'Get a Quote' }].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="w-full"
              >
                <Link
                  href={link.href}
                  onClick={() => setMobile(false)}
                  className="block text-[1rem] font-semibold tracking-[0.03em] transition-all duration-200 px-4 py-2.5 rounded-lg text-center"
                  style={{ 
                    color: pathname === link.href ? '#e91e8c' : 'rgba(255,255,255,0.75)',
                    background: pathname === link.href ? 'rgba(233,30,140,0.1)' : 'transparent',
                    fontFamily: 'Helvetica Neue, Helvetica, sans-serif'
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Contact info */}
            {(s?.contact_email || s?.contact_phone) && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {s?.contact_email && (
                  <a href={`mailto:${s.contact_email}`} className="text-[0.6rem] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {s.contact_email}
                  </a>
                )}
              </div>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
