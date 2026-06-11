'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VideoShowcase from '@/components/sections/VideoShowcase';
import {
  slidesApi, servicesApi, portfolioApi, workshopsApi, blogsApi,
  settingsApi, testimonialsApi, imgUrl,
} from '@/lib/api';
import { useInView } from 'react-intersection-observer';

// ── Reveal Hook ──────────────────────────────────────────────────────────────
const useReveal = (threshold = 0.1) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold });
  return { ref, inView };
};

// ── Counter ──────────────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useReveal(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1500;
    const step = (t: number, s: number) => {
      const p = Math.min((t - s) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(t2 => step(t2, s));
    };
    requestAnimationFrame(t => step(t, t));
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Text Style Helper ────────────────────────────────────────────────────────
const tStyle = (s: any): React.CSSProperties => ({
  color:         s?.color || undefined,
  fontSize:      s?.fontSize || undefined,
  fontWeight:    s?.fontWeight || undefined,
  fontFamily:    s?.fontFamily || undefined,
  textAlign:     (s?.textAlign || undefined) as any,
  fontStyle:     s?.italic ? 'italic' : undefined,
  textTransform: s?.uppercase ? 'uppercase' : undefined,
});

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ slides, settings, services }: { slides: any[]; settings: any; services: any[] }) {
  const [current, setCurrent] = useState(0);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 180]);

  // Auto-advance carousel (5 seconds)
  useEffect(() => {
    if (!slides?.length || slides.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  // Touch swipe support for mobile
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!slides?.length || slides.length <= 1) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    // Use vertical swipe on mobile or horizontal
    const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
    const delta = isVertical ? deltaY : deltaX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        // Swipe up/left → next
        setCurrent(c => (c + 1) % slides.length);
      } else {
        // Swipe down/right → prev
        setCurrent(c => (c - 1 + slides.length) % slides.length);
      }
    }
  };

  const slide = slides?.[current];

  // If no slides exist, don't render hero
  if (!slides?.length) return null;

  // Ticker items from services API
  const tickerItems = services?.length
    ? services.map((s: any) => s.name)
    : null;

  // Position mapping — uses absolute positioning within the hero for reliable placement
  const getPositionStyle = (pos: string): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', zIndex: 10, maxWidth: '600px', width: '100%' };
    switch (pos) {
      case 'top-left':      return { ...base, top: '100px', left: '24px' };
      case 'top-center':    return { ...base, top: '100px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':     return { ...base, top: '100px', right: '24px' };
      case 'left':          return { ...base, top: '50%', left: '24px', transform: 'translateY(-50%)' };
      case 'center':        return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'right':         return { ...base, top: '50%', right: '24px', transform: 'translateY(-50%)' };
      case 'bottom-left':   return { ...base, bottom: '80px', left: '24px' };
      case 'bottom-center': return { ...base, bottom: '80px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':  return { ...base, bottom: '80px', right: '24px' };
      default:              return { ...base, bottom: '80px', left: '24px' };
    }
  };

  // Text alignment from position
  const getTextAlign = (pos: string) => {
    if (pos === 'center' || pos === 'top-center' || pos === 'bottom-center') return 'text-center';
    if (pos?.includes('right')) return 'text-right';
    return 'text-left';
  };

  return (
    <section
      className="relative w-full overflow-hidden px-4 md:px-6 lg:px-12"
      style={{ height: '100vh', minHeight: '700px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* BG - Desktop: side-by-side panels (max 3) with vertical auto-slide | Mobile: single carousel */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* Desktop: Max 3 panels, extra slides cycle vertically within panels */}
        <div className="hidden md:flex absolute inset-0">
          {Array.from({ length: Math.min(slides.length, 3) }).map((_, panelIdx) => {
            // Distribute slides across panels (panel 0 gets slide 0,3,6... panel 1 gets 1,4,7... etc.)
            const panelSlides = slides.filter((_: any, si: number) => si % Math.min(slides.length, 3) === panelIdx);
            const activeSlideIdx = Math.floor(current / Math.min(slides.length, 3)) % panelSlides.length;
            const s = panelSlides[slides.length <= 3 ? 0 : activeSlideIdx];
            return (
              <div
                key={panelIdx}
                className="flex-1 relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={s?._id || panelIdx}
                    initial={slides.length > 3 ? { opacity: 0, y: 20 } : { opacity: 1 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={slides.length > 3 ? { opacity: 0, y: -20 } : undefined}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    {s?.imageUrl ? (
                      <img
                        src={imgUrl(s.imageUrl)}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ filter: 'grayscale(20%) contrast(1.05)', transition: 'transform 0.8s, filter 0.8s' }}
                        onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; (e.target as HTMLImageElement).style.filter = 'grayscale(0%) contrast(1.1)'; }}
                        onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; (e.target as HTMLImageElement).style.filter = 'grayscale(20%) contrast(1.05)'; }}
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: s?.bgGradient || s?.bgColor || '#f5f5f5' }} />
                    )}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(0,0,0,${s?.overlayOpacity ?? 0.3}) 0%, rgba(0,0,0,${Math.min((s?.overlayOpacity ?? 0.3) + 0.4, 0.9)}) 100%)` }} />
                  </motion.div>
                </AnimatePresence>
                <span className="absolute top-6 left-4 font-mono text-[0.6rem] tracking-[0.15em] z-10" style={{ color: 'rgba(255,255,255,0.5)' }}>0{panelIdx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Mobile: Single slide carousel */}
        <div className="md:hidden absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
              style={{ background: slide?.bgGradient || slide?.bgColor || 'linear-gradient(135deg, #080808 0%, #f5f5f5 100%)' }}
            >
              {slide?.imageUrl && (
                <>
                  <img
                    src={imgUrl(slide.imageUrl)}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                  />
                  <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${slide.overlayOpacity ?? 0.5})` }} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scan lines */}
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 2px)', pointerEvents: 'none' }} />
      </motion.div>

      {/* Hero Content - positioned per slide.position */}
      <div
        className={`px-4 md:px-6 lg:px-12 ${getTextAlign(slide?.position || 'left')}`}
        style={getPositionStyle(slide?.position || 'bottom-left')}
      >
        {/* Mini Title / Eyebrow */}
        {slide?.miniTitle?.text && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex items-center gap-3 mb-4 font-mono tracking-[0.35em]"
            style={{ ...tStyle(slide.miniTitle), fontSize: slide.miniTitle.fontSize || '0.62rem', color: slide.miniTitle.color || 'var(--c-gold)', textTransform: 'uppercase' }}
          >
            <span className="w-8 h-px" style={{ background: slide.miniTitle.color || 'var(--c-gold)' }} />
            {slide.miniTitle.text}
          </motion.div>
        )}

        {/* Title */}
        {slide?.title?.text && (
          <div className="overflow-hidden mb-2">
            <motion.h1
              key={`title-${current}`}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="leading-[0.88]"
              style={{
                ...tStyle(slide.title),
                fontSize: slide.title.fontSize || 'clamp(2.5rem, 7vw, 5rem)',
                fontFamily: slide.title.fontFamily || 'Bebas Neue, sans-serif',
                color: slide.title.color || '#1a1a2e',
              }}
            >
              {slide.title.text}
            </motion.h1>
          </div>
        )}

        {/* Subtitle */}
        {slide?.subtitle?.text && (
          <div className="overflow-hidden mb-2">
            <motion.h2
              key={`sub-${current}`}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 1.65, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="leading-[0.88]"
              style={{
                ...tStyle(slide.subtitle),
                fontSize: slide.subtitle.fontSize || 'clamp(1.5rem, 4vw, 3.5rem)',
                fontFamily: slide.subtitle.fontFamily || 'Bebas Neue, sans-serif',
                color: slide.subtitle.color || 'var(--c-gold)',
              }}
            >
              {slide.subtitle.text}
            </motion.h2>
          </div>
        )}

        {/* Paragraph */}
        {slide?.paragraph?.text && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="mb-6 max-w-lg"
            style={{ ...tStyle(slide.paragraph), fontSize: slide.paragraph.fontSize || '0.9rem', color: slide.paragraph.color || 'rgba(0,0,0,0.55)' }}
          >
            {slide.paragraph.text}
          </motion.p>
        )}

        {/* Link button */}
        {slide?.linkUrl && slide?.linkText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
            <Link href={slide.linkUrl} className="btn-primary" data-hover>
              <span>{slide.linkText}</span><span>→</span>
            </Link>
          </motion.div>
        )}

        {/* Stats from settings only */}
        {(settings?.years_experience || settings?.projects_count || settings?.schools_count || settings?.cinemas_count) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="flex flex-wrap items-center gap-6 md:gap-10 mt-8"
          >
            {settings?.years_experience && (
              <div className="flex flex-col gap-1">
                <span className="font-display text-[1.5rem] md:text-[2rem] leading-none" style={{ color: '#e91e8c' }}>{settings.years_experience}</span>
                <span className="text-[0.65rem] md:text-[0.72rem] font-semibold tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Experience</span>
              </div>
            )}
            {settings?.projects_count && (
              <div className="flex flex-col gap-1">
                <span className="font-display text-[1.5rem] md:text-[2rem] leading-none" style={{ color: '#e91e8c' }}>{settings.projects_count}</span>
                <span className="text-[0.65rem] md:text-[0.72rem] font-semibold tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Projects</span>
              </div>
            )}
            {settings?.schools_count && (
              <div className="flex flex-col gap-1">
                <span className="font-display text-[1.5rem] md:text-[2rem] leading-none" style={{ color: '#e91e8c' }}>{settings.schools_count}</span>
                <span className="text-[0.65rem] md:text-[0.72rem] font-semibold tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Schools</span>
              </div>
            )}
            {settings?.cinemas_count && (
              <div className="flex flex-col gap-1">
                <span className="font-display text-[1.5rem] md:text-[2rem] leading-none" style={{ color: '#e91e8c' }}>{settings.cinemas_count}</span>
                <span className="text-[0.65rem] md:text-[0.72rem] font-semibold tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Cinemas</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Slide dots - mobile only (desktop shows all panels) */}
      {slides?.length > 1 && (
        <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="transition-all duration-300"
              style={{ width: i === current ? '24px' : '8px', height: '8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}
            >
              <span style={{ width: i === current ? '24px' : '6px', height: '6px', borderRadius: '3px', background: i === current ? 'var(--c-gold)' : 'rgba(0,0,0,0.35)', display: 'block' }} />
            </button>
          ))}
        </div>
      )}

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute right-4 md:right-12 bottom-20 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[0.52rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(0,0,0,0.4)', writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-16" style={{ background: 'linear-gradient(180deg, var(--c-gold), transparent)', animation: 'lineGrow 2s ease-in-out infinite' }} />
      </motion.div>

      {/* Ticker from services API */}
      {tickerItems && tickerItems.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t py-3" style={{ background: 'linear-gradient(90deg, #1a1a2e, #3a2067, #e91e8c, #3a7bd5, #1a1a2e)', borderColor: 'transparent' }}>
          <div className="ticker-track flex gap-0 whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-6 px-8 font-mono text-[0.58rem] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {item}<span style={{ color: '#ffffff' }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── REEL ─────────────────────────────────────────────────────────────────────
function Reel({ portfolio }: { portfolio: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { ref, inView } = useReveal();

  // If no portfolio items from API, hide section entirely
  if (!portfolio?.length) return null;

  const SIZES = ['tall', 'wide', 'sq', 'tall', 'wide', 'sq'];
  const sizeStyles: Record<string, { width: string; height: string }> = {
    tall: { width: '300px', height: '440px' },
    wide: { width: '460px', height: '300px' },
    sq:   { width: '340px', height: '340px' },
  };

  const items = portfolio.slice(0, 6);

  return (
    <section className="py-[120px]" style={{ background: 'var(--c-bg)' }}>
      <div ref={ref} className={`px-6 md:px-12 mb-14 flex items-end justify-between reveal ${inView ? 'visible' : ''}`}>
        <div>
          <div className="section-label">Featured Work</div>
          <h2 className="font-display text-cream-DEFAULT leading-[0.9]" style={{ fontSize: 'clamp(3.5rem, 7vw, 8rem)' }}>
            <span className="word-motion">SELECTED</span><br /><em className="font-serif not-italic word-motion" style={{ color: 'var(--c-gold)' }}>PROJECTS</em>
          </h2>
        </div>
        <div className="hidden md:block">
          <p className="text-[0.82rem] leading-[1.7] mb-4 max-w-[260px]" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Crafted visuals for India's most recognisable brands.
          </p>
          <Link href="/portfolio" className="btn-ghost py-3 px-6 text-[0.6rem]" data-hover>View All Works →</Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto px-6 md:px-12 pb-8 select-none"
        style={{ cursor: isDown ? 'grabbing' : 'grab', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={e => { setIsDown(true); setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0)); setScrollLeft(scrollRef.current?.scrollLeft || 0); }}
        onMouseLeave={() => setIsDown(false)}
        onMouseUp={() => setIsDown(false)}
        onMouseMove={e => { if (!isDown || !scrollRef.current) return; e.preventDefault(); const x = e.pageX - scrollRef.current.offsetLeft; scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5; }}
      >
        <div className="flex gap-5 w-max">
          {items.map((item: any, i: number) => {
            const size = SIZES[i % SIZES.length];
            const s = sizeStyles[size];
            return (
              <div key={item._id}
                className="relative overflow-hidden flex-shrink-0 group"
                style={{ width: s.width, height: s.height, borderRadius: '2px', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                onClick={() => item.slug && (window.location.href = `/portfolio`)}
              >
                <span className="absolute top-4 left-4 z-10 font-mono text-[0.52rem] tracking-[0.18em] uppercase px-2.5 py-1" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.6)', borderRadius: '2px' }}>
                  {item.category}
                </span>
                <img src={imgUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover" style={{ filter: 'grayscale(25%) contrast(1.05)', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.5s' }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; (e.target as HTMLImageElement).style.filter = 'grayscale(0%) contrast(1.1)'; }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; (e.target as HTMLImageElement).style.filter = 'grayscale(25%) contrast(1.05)'; }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.08) 60%)' }} />
                <div className="absolute bottom-6 left-6 right-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="font-serif text-[1.1rem] text-cream-DEFAULT mb-1">{item.title}</h3>
                  <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: 'var(--c-gold)' }}>{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── ABOUT SECTION ─────────────────────────────────────────────────────────────
function AboutSection({ settings }: { settings: any }) {
  const { ref: leftRef, inView: leftIn }   = useReveal();
  const { ref: rightRef, inView: rightIn } = useReveal();

  // All content from settings API
  const aboutText = settings?.about_text;
  const aboutImage = settings?.about_image;
  const clientBrands = settings?.client_brands;
  const clients: string[] = clientBrands
    ? (typeof clientBrands === 'string' ? clientBrands.split(',').map((c: string) => c.trim()).filter(Boolean) : Array.isArray(clientBrands) ? clientBrands : [])
    : [];

  // Stats from settings only
  const stats = [
    settings?.years_experience ? { num: parseInt(settings.years_experience), suffix: '+', label: 'Years Active' } : null,
    settings?.projects_count ? { num: parseInt(settings.projects_count), suffix: '+', label: 'Projects' } : null,
    settings?.cinemas_count ? { num: parseInt(settings.cinemas_count), suffix: '', label: 'INOX-PVR' } : null,
    settings?.schools_count ? { num: parseInt(settings.schools_count), suffix: '+', label: 'Schools' } : null,
  ].filter(Boolean);

  // If nothing to show from settings, hide section
  if (!aboutText && !aboutImage && !clients.length && !stats.length) return null;

  return (
    <section className="py-[140px] px-4 md:px-6 lg:px-12" style={{ background: 'var(--c-bg2)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Visual */}
          {aboutImage && (
            <div ref={leftRef} className={`relative reveal-left ${leftIn ? 'visible' : ''}`}>
              <div className="relative">
                <img
                  src={imgUrl(aboutImage)}
                  alt="Studio"
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/5', filter: 'grayscale(15%) contrast(1.1)', borderRadius: '2px' }}
                />
                {/* Rotating badge */}
                {settings?.years_experience && (
                  <div className="absolute top-8 left-[-32px] w-24 h-24 hidden md:block" style={{ animation: 'spin 20s linear infinite' }}>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path id="badgeCircle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                      <text style={{ fontSize: '9px', fontFamily: 'Space Mono, monospace', letterSpacing: '3px', fill: '#080808' }}>
                        <textPath href="#badgeCircle">NPS MEMBER · GST REGISTERED · MSME ·</textPath>
                      </text>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ background: 'var(--c-gold)' }}>
                      <span className="font-display text-[1.5rem]" style={{ color: 'var(--c-bg)' }}>{settings.years_experience}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div ref={rightRef} className={`reveal-right ${rightIn ? 'visible' : ''}`}>
            <div className="section-label">Our Story</div>
            <h2 className="font-display text-cream-DEFAULT leading-[0.92] mb-8" style={{ fontSize: 'clamp(3rem, 5vw, 6rem)' }}>
              <span className="word-motion">WE</span> <span className="word-motion">MAKE</span><br />
              <span className="word-motion" style={{ color: '#e91e8c' }}>BRANDS</span><br />
              <span className="word-motion">VISIBLE.</span>
            </h2>

            {aboutText && (
              <p className="text-[0.93rem] leading-[1.88] mb-8 max-w-[420px]" style={{ color: 'rgba(0,0,0,0.55)' }}>
                {aboutText}
              </p>
            )}

            {/* Stats from settings */}
            {stats.length > 0 && (
              <div className="flex flex-wrap gap-10 mb-8">
                {stats.map((s: any) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="font-display text-[2.6rem] leading-none" style={{ color: 'var(--c-gold)' }}>
                      <Counter target={s.num} suffix={s.suffix} />
                    </span>
                    <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase" style={{ color: 'var(--c-muted)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Client tags from settings */}
            {clients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {clients.map((c: string) => (
                  <span key={c} className="font-mono text-[0.55rem] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all duration-300" style={{ borderColor: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.4)', borderRadius: '2px', cursor: 'default' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--c-gold)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.4)'; }}
                  >{c}</span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Link href="/portfolio" className="btn-primary" data-hover><span>View Portfolio</span><span>→</span></Link>
              <Link href="/contact"   className="btn-ghost"   data-hover><span>Start a Project</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────────────────────
function Marquee({ services }: { services: any[] }) {
  // Use service names from API for marquee words
  const words = services?.length
    ? services.map((s: any) => s.name)
    : null;

  if (!words || words.length === 0) return null;

  return (
    <div className="py-6 overflow-hidden" style={{ background: 'linear-gradient(90deg, #1a1a2e, #3a2067, #e91e8c, #3a7bd5, #1a1a2e)' }}>
      <div className="marquee-track flex gap-0 whitespace-nowrap">
        {[...words, ...words].map((w: string, i: number) => (
          <span key={i} className="inline-flex items-center gap-8 px-8">
            <span className="font-display text-[2.2rem] tracking-[0.05em] uppercase" style={{ color: 'rgba(255,255,255,0.9)' }}>{w}</span>
            {i !== words.length * 2 - 1 && <span style={{ color: '#ffffff', fontSize: '0.8rem' }}>✦</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── SERVICES ─────────────────────────────────────────────────────────────────
function Services({ services }: { services: any[] }) {
  const { ref, inView } = useReveal();

  // If no services from API, hide section
  if (!services?.length) return null;

  return (
    <section className="py-[140px] px-4 md:px-6 lg:px-12" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div ref={ref} className={`mb-16 reveal ${inView ? 'visible' : ''}`}>
          <div className="section-label">What We Do</div>
          <h2 className="font-display text-cream-DEFAULT leading-[0.88]" style={{ fontSize: 'clamp(4rem, 8vw, 10rem)' }}>
            <span className="word-motion">OUR</span><br /><span className="outline-text word-motion">SERVICES</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)' }}>
          {services.map((svc: any, i: number) => (
            <div key={svc._id} className="service-card group relative overflow-hidden" data-hover>
              {/* Background Image - always visible */}
              {svc.imageUrl && (
                <div className="absolute inset-0">
                  <img src={imgUrl(svc.imageUrl)} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.92) 100%)' }} />
                </div>
              )}
              <div className="relative z-10">
                <div className="font-display text-[4rem] leading-none mb-6" style={{ color: 'rgba(0,0,0,0.05)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-11 h-11 mb-6 flex items-center justify-center border text-[1.2rem] transition-all duration-300" style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '2px' }}>
                  {svc.icon || '📷'}
                </div>
                <h3 className="font-serif text-[1.4rem] text-cream-DEFAULT mb-3">{svc.name}</h3>
                <p className="text-[0.8rem] leading-[1.8] mb-4" style={{ color: 'rgba(0,0,0,0.45)' }}>{svc.shortDesc}</p>
                {svc.features?.length > 0 && (
                  <ul className="mb-4 space-y-1">
                    {svc.features.slice(0, 3).map((f: string, fi: number) => (
                      <li key={fi} className="text-[0.72rem] flex items-center gap-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        <span style={{ color: '#e91e8c' }}>•</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/contact" className="text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-2 font-semibold transition-all hover:gap-4" style={{ color: '#e91e8c' }}>
                  Enquire Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PORTFOLIO GRID ────────────────────────────────────────────────────────────
function PortfolioGrid({ portfolio }: { portfolio: any[] }) {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<any | null>(null);
  const { ref, inView } = useReveal();

  if (!portfolio?.length) return null;

  const CATS = ['all', ...Array.from(new Set(portfolio.map((p: any) => p.category).filter(Boolean)))];
  const filtered = filter === 'all' ? portfolio : portfolio.filter((p: any) => p.category === filter);

  return (
    <section className="py-[140px] px-4 md:px-6 lg:px-12" style={{ background: 'rgba(230, 120, 180, 0.3)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div ref={ref} className={`mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 reveal ${inView ? 'visible' : ''}`}>
          <h2 className="font-display text-cream-DEFAULT leading-[0.88] uppercase" style={{ fontSize: 'clamp(3rem, 6vw, 7rem)' }}>OUR<br />PORTFOLIO</h2>
          <div className="flex flex-wrap gap-2">
            {CATS.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} data-hover
                className="font-mono text-[0.56rem] tracking-[0.18em] uppercase px-4 py-2 border transition-all duration-200"
                style={{ borderColor: filter === cat ? 'var(--c-gold)' : 'rgba(0, 0, 0, 0.91)', color: filter === cat ? 'var(--c-gold)' : 'rgba(0,0,0,0.4)', background: filter === cat ? 'rgba(23, 19, 13, 0.06)' : 'transparent', borderRadius: '2px' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ columns: 'auto 3', columnGap: '16px' }}>
          {filtered.map((item: any) => (
            <div key={item._id} className="work-item mb-4 break-inside-avoid" onClick={() => setLightbox(item)}>
              <img src={imgUrl(item.imageUrl)} alt={item.title} loading="lazy" />
              <div className="work-overlay" />
              <div className="work-info">
                <h3 className="font-serif text-[1rem] text-cream-DEFAULT mb-1">{item.title}</h3>
                <span className="font-mono text-[0.52rem] tracking-[0.18em] uppercase" style={{ color: 'var(--c-gold)' }}>{item.category}</span>
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: 'rgba(245,240,234,0.1)', border: '1px solid rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)' }}>⊕</div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-10" style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(30px)' }} onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-8 font-mono text-[0.62rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,0,0,0.5)' }} onClick={() => setLightbox(null)}>Close ✕</button>
            <img src={imgUrl(lightbox.imageUrl)} alt={lightbox.title} className="max-w-[90vw] max-h-[85vh] object-contain" style={{ borderRadius: '2px' }} onClick={e => e.stopPropagation()} />
            <div className="absolute bottom-8 left-10">
              <h3 className="font-serif text-[1.3rem] text-cream-DEFAULT">{lightbox.title}</h3>
              <span className="font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'var(--c-gold)' }}>{lightbox.category}</span>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/portfolio" className="btn-primary" data-hover><span>View All Works</span><span>→</span></Link>
        </div>
      </div>
    </section>
  );
}

// ── WORKSHOPS ─────────────────────────────────────────────────────────────────
function WorkshopsSection({ workshops }: { workshops: any[] }) {
  const { ref, inView } = useReveal();

  if (!workshops?.length) return null;

  return (
    <section className="py-[140px] px-4 md:px-6 lg:px-12" style={{ background: '#f5f5f5' }}>
      <div className="max-w-[1400px] mx-auto">
        <div ref={ref} className={`mb-12 reveal ${inView ? 'visible' : ''}`}>
          <div className="section-label">Learn & Grow</div>
          <h2 className="font-display text-cream-DEFAULT leading-[0.9]" style={{ fontSize: 'clamp(3rem, 5vw, 6.5rem)' }}>
            Photography<br /><em className="font-serif not-italic" style={{ color: 'var(--c-gold)' }}>Workshops</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.slice(0, 3).map((w: any) => (
            <Link key={w._id} href={`/workshops/${w.slug}`} className="group border transition-all duration-400 hover:-translate-y-1.5" style={{ borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }} data-hover>
              {w.coverImage?.url && (
                <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img src={imgUrl(w.coverImage.url)} alt={w.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04]" style={{ filter: 'grayscale(25%)', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.4s' }}
                    onMouseEnter={e => (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'}
                    onMouseLeave={e => (e.target as HTMLImageElement).style.filter = 'grayscale(25%)'}
                  />
                </div>
              )}
              <div className="p-6">
                {w.date && <div className="font-mono text-[0.58rem] tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: 'var(--c-gold)' }}><span className="w-4 h-px bg-gold-DEFAULT inline-block" />{new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                <h3 className="font-serif text-[1.2rem] text-cream-DEFAULT mb-2 leading-[1.3]">{w.title}</h3>
                <p className="text-[0.78rem] leading-[1.7] mb-5" style={{ color: 'rgba(0,0,0,0.45)' }}>{w.description?.slice(0, 100)}...</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[1.7rem] text-cream-DEFAULT">{w.isFree ? 'Free' : `₹${w.price}`}</span>
                  <span className="font-mono text-[0.56rem] tracking-[0.18em] uppercase px-4 py-2 border transition-all duration-200" style={{ borderColor: 'rgba(201,169,110,0.3)', color: 'var(--c-gold)', borderRadius: '2px' }}>Register →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/workshops" className="btn-ghost" data-hover><span>All Workshops</span><span>→</span></Link>
        </div>
      </div>
    </section>
  );
}

// ── BLOG ──────────────────────────────────────────────────────────────────────
function BlogSection({ blogs }: { blogs: any[] }) {
  const { ref, inView } = useReveal();

  if (!blogs?.length) return null;

  return (
    <section className="py-[140px] px-4 md:px-6 lg:px-12" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div ref={ref} className={`mb-12 flex items-end justify-between reveal ${inView ? 'visible' : ''}`}>
          <h2 className="font-display text-cream-DEFAULT leading-[0.9]" style={{ fontSize: 'clamp(3rem, 5vw, 6rem)' }}>Visual<br />Journal</h2>
          <Link href="/blog" className="btn-ghost hidden md:flex py-3 px-5 text-[0.6rem]" data-hover>All Articles →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((b: any, i: number) => (
            <Link key={b._id} href={`/blog/${b.slug}`} className={`group border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${i === 0 ? 'md:col-span-2' : ''}`} style={{ borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }} data-hover>
              <div className="overflow-hidden" style={{ height: i === 0 ? '320px' : '210px' }}>
                {b.coverImage?.url ? (
                  <img src={imgUrl(b.coverImage.url)} alt={b.title} className="w-full h-full object-cover" style={{ filter: 'grayscale(20%)', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s' }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)'; (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; (e.target as HTMLImageElement).style.filter = 'grayscale(20%)'; }}
                  />
                ) : <div className="w-full h-full" style={{ background: 'var(--c-bg3)' }} />}
              </div>
              <div className="p-5">
                <div className="font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-gold)' }}>{b.category?.name || 'Photography'}</div>
                <h3 className="font-serif text-cream-DEFAULT mb-2 leading-[1.35]" style={{ fontSize: i === 0 ? '1.3rem' : '1rem' }}>{b.title}</h3>
                {i === 0 && b.excerpt && <p className="text-[0.78rem] leading-[1.7] mb-3" style={{ color: 'rgba(0,0,0,0.45)' }}>{b.excerpt}</p>}
                <span className="font-mono text-[0.52rem] tracking-[0.15em] uppercase" style={{ color: 'var(--c-gold)' }}>Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT SECTION ───────────────────────────────────────────────────────────
function ContactSection({ settings, services }: { settings: any; services: any[] }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      const { enquiriesApi } = await import('@/lib/api');
      await enquiriesApi.submit({ ...form, type: 'quote' });
      setSent(true);
    } catch { setSent(true); }
    finally { setLoading(false); }
  };

  // Contact info items — only show items that have values in settings
  const contactItems = [
    settings?.contact_email ? { icon: '📧', label: 'Email', val: settings.contact_email, href: `mailto:${settings.contact_email}` } : null,
    settings?.contact_phone ? { icon: '📞', label: 'Phone', val: settings.contact_phone, href: `tel:${settings.contact_phone}` } : null,
    settings?.contact_address ? { icon: '📍', label: 'Location', val: settings.contact_address, href: '#' } : null,
  ].filter(Boolean);

  // Service options from API
  const serviceOptions = services?.length ? services.map((s: any) => s.name) : [];

  return (
    <section className="py-[140px] px-4 md:px-6 lg:px-12" style={{ background: 'var(--c-bg2)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start reveal ${inView ? 'visible' : ''}`}>
          {/* Info */}
          <div>
            <div className="section-label">Let's Connect</div>
            <h2 className="font-display text-cream-DEFAULT leading-[0.88] mb-8" style={{ fontSize: 'clamp(3rem, 5vw, 6rem)' }}>
              START YOUR<br /><span style={{ color: 'var(--c-gold)' }}>PROJECT</span><br />TODAY.
            </h2>
            <p className="text-[0.88rem] leading-[1.8] mb-10 max-w-[380px]" style={{ color: 'rgba(0,0,0,0.5)' }}>
              Ready to create visuals that truly represent your brand? GST & MSME registered. Pan-India services.
            </p>
            {contactItems.length > 0 && (
              <div className="flex flex-col gap-5">
                {contactItems.map((item: any) => (
                  <a key={item.label} href={item.href} className="flex items-start gap-4" data-hover>
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border text-base transition-all" style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '2px' }}>{item.icon}</div>
                    <div>
                      <div className="font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-0.5" style={{ color: 'var(--c-muted)' }}>{item.label}</div>
                      <div className="text-[0.88rem]" style={{ color: 'var(--c-cream)' }}>{item.val}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <div className="glass-card p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="font-serif text-[1.8rem] mb-3" style={{ color: 'var(--c-gold)' }}>Thank You ✦</div>
                <p className="text-[0.85rem]" style={{ color: 'rgba(0,0,0,0.5)' }}>We'll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Name *</label><input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input-field" placeholder="Your name" /></div>
                  <div><label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Phone</label><input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="input-field" placeholder="+91 98765…" /></div>
                </div>
                <div><label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Email *</label><input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input-field" placeholder="you@company.com" /></div>
                <div><label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Company</label><input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="input-field" placeholder="Your company" /></div>
                <div><label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Service</label>
                  <select value={form.service} onChange={e => setForm(f => ({...f, service: e.target.value}))} className="input-field">
                    <option value="">Select a service…</option>
                    {serviceOptions.map((o: string) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div><label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Message *</label><textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className="input-field resize-none" rows={4} placeholder="Tell us about your project…" /></div>
                <button type="submit" disabled={loading} className="btn-primary justify-center py-4 w-full" data-hover>
                  <span>{loading ? 'Sending…' : 'Send Enquiry ✦'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MAIN HOME PAGE ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: slides = [] }     = useQuery({ queryKey: ['slides', 'home'],      queryFn: () => slidesApi.get('home') });
  const { data: settings = {} }   = useQuery({ queryKey: ['settings'],             queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: services = [] }   = useQuery({ queryKey: ['services'],             queryFn: servicesApi.get });
  const { data: portfolio = [] }  = useQuery({ queryKey: ['portfolio'],            queryFn: () => portfolioApi.get({ featured: 'true' }) });
  const { data: workshops = [] }  = useQuery({ queryKey: ['workshops'],            queryFn: workshopsApi.get });
  const { data: blogData }        = useQuery({ queryKey: ['blogs', 'home'],        queryFn: () => blogsApi.get({ limit: 3, featured: 'true' }) });

  const blogs = blogData?.blogs || [];

  return (
    <>
      <Navbar />
      <VideoShowcase />
      <Hero slides={slides} settings={settings} services={services} />
      <Reel portfolio={portfolio} />
      <AboutSection settings={settings} />
      <Marquee services={services} />
      <Services services={services} />
      <PortfolioGrid portfolio={portfolio} />
      <WorkshopsSection workshops={workshops} />
      <BlogSection blogs={blogs} />
      <ContactSection settings={settings} services={services} />
      <Footer />
    </>
  );
}
