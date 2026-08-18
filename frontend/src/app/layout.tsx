'use client';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';

const bebas     = { variable: '' };
const dmSerif   = { variable: '' };
const syne      = { variable: '' };
const spaceMono = { variable: '' };

function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rx = useRef(0); const ry = useRef(0);
  const mx = useRef(0); const my = useRef(0);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; if (dotRef.current) { dotRef.current.style.left = e.clientX + 'px'; dotRef.current.style.top  = e.clientY + 'px'; } };
    document.addEventListener('mousemove', move);
    let raf: number;
    const animate = () => {
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = rx.current + 'px'; ringRef.current.style.top = ry.current + 'px'; }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    const onEnter = () => ringRef.current?.classList.add('hover');
    const onLeave = () => ringRef.current?.classList.remove('hover');
    document.querySelectorAll('a,button,[data-hover]').forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => setPct(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="fixed top-0 left-0 h-[2px] z-[9997] transition-all duration-100" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #e91e8c, #c4167a)' }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }));

  return (
    <html lang="en" className={`${bebas.variable} ${dmSerif.variable} ${syne.variable} ${spaceMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <QueryClientProvider client={qc}>
          {/* Cinematic overlays */}
          <div className="noise-overlay" aria-hidden />
          <div className="scanlines fixed inset-0 z-[999] pointer-events-none opacity-40" aria-hidden />
          <Cursor />
          <ScrollProgress />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f0f1a',
                color: '#f5f0ea',
                border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: '6px',
                fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
                fontSize: '0.82rem',
                fontWeight: '500',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              },
              success: { iconTheme: { primary: '#c9a96e', secondary: '#0f0f1a' } },
              error:   { iconTheme: { primary: '#d63a2f', secondary: '#fff' } },
            }}
          />
        </QueryClientProvider>
      </body>
    </html>
  );
}
