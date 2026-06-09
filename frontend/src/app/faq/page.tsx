'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, faqsApi } from '@/lib/api';

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);
  const { data: slides = [] } = useQuery({ queryKey: ['slides','faq'],  queryFn: () => slidesApi.get('faq') });
  const { data: faqs   = [] } = useQuery({ queryKey: ['faqs'],           queryFn: faqsApi.get });

  const grouped = faqs.reduce((acc: any, faq: any) => {
    const cat = faq.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="faq" defaultTitle="FAQ" defaultSub="Frequently Asked Questions" />
      <main className="py-[100px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[760px] mx-auto">
          {faqs.length === 0 ? (
            <p className="text-center py-16 font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.2)' }}>No FAQs yet.</p>
          ) : (
            Object.entries(grouped).map(([category, items]: any) => (
              <div key={category} className="mb-10">
                {Object.keys(grouped).length > 1 && (
                  <p className="font-mono text-[0.56rem] tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--c-gold)' }}>{category}</p>
                )}
                <div className="space-y-2">
                  {items.map((faq: any) => (
                    <motion.div key={faq._id} layout
                      className="border overflow-hidden transition-all"
                      style={{ borderColor: open === faq._id ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.06)', borderRadius: '2px', background: 'rgba(255,255,255,0.015)' }}>
                      <button onClick={() => setOpen(open === faq._id ? null : faq._id)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left">
                        <span className={`text-[0.88rem] md:text-[0.95rem] font-medium pr-4 ${open === faq._id ? '' : ''}`}
                          style={{ color: open === faq._id ? 'var(--c-gold)' : 'var(--c-cream)' }}>
                          {faq.question}
                        </span>
                        <span className="flex-shrink-0 font-mono text-[0.8rem] transition-transform duration-300"
                          style={{ color: 'rgba(245,240,234,0.4)', transform: open === faq._id ? 'rotate(45deg)' : 'none' }}>+</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open === faq._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="px-6 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                              <p className="pt-4 text-[0.85rem] leading-[1.82]" style={{ color: 'rgba(245,240,234,0.5)' }}>{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
