'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, settingsApi, enquiriesApi, servicesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  return (
    <Suspense>
      <ContactPageInner />
    </Suspense>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '', type: 'contact' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const svc = searchParams.get('service');
    if (svc) setForm(f => ({ ...f, service: svc }));
  }, [searchParams]);

  const { data: slides   = [] } = useQuery({ queryKey: ['slides','contact'], queryFn: () => slidesApi.get('contact') });
  const { data: s        = {} } = useQuery({ queryKey: ['settings'],          queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: services = [] } = useQuery({ queryKey: ['services'],          queryFn: servicesApi.get });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Fill required fields');
    setLoading(true);
    try { await enquiriesApi.submit(form); setSent(true); }
    catch { toast.error('Failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const whatsapp = (s as any).contact_whatsapp;
  const mapEmbed = (s as any).contact_map_embed;
  const hours    = ((s as any).contact_hours || '').split('\n').filter(Boolean);
  const phone2   = (s as any).contact_phone2;

  const contactCards = [
    (s as any).contact_email    && { icon: '✉️', label: 'Email Us',      val: (s as any).contact_email,   href: `mailto:${(s as any).contact_email}` },
    (s as any).contact_phone    && { icon: '📞', label: 'Call Us',       val: (s as any).contact_phone,   href: `tel:${(s as any).contact_phone}` },
    phone2                       && { icon: '📱', label: 'Alternate',     val: phone2,                      href: `tel:${phone2}` },
    (s as any).contact_address  && { icon: '📍', label: 'Our Location',   val: (s as any).contact_address, href: '#map' },
    hours.length > 0             && { icon: '🕐', label: 'Business Hours', val: hours[0] + (hours.length > 1 ? ' …' : ''), href: '#map', extra: hours },
  ].filter(Boolean) as any[];

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="contact" defaultTitle="CONTACT US" defaultSub="Let's Create Together" />

      <main style={{ background: '#ffffff' }}>

        {/* ── Contact Cards + Form ─────────────────────────────────────────── */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12">

              {/* Left — info */}
              <div>
                <p className="font-mono text-[0.58rem] tracking-[0.28em] uppercase mb-4 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-6 h-px inline-block" style={{ background: '#e91e8c' }} />Get in Touch
                </p>
                <h2 className="font-bold text-[#1a1a2e] leading-[1.05] mb-3" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  Start Your Project Today
                </h2>
                <p className="text-[0.9rem] leading-[1.75] mb-8 max-w-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
                  Ready to create visuals that represent your brand? GST & MSME registered. Pan-India services.
                </p>

                {/* Contact Cards */}
                <div className="space-y-3 mb-8">
                  {contactCards.map((card: any, i: number) => (
                    <motion.a
                      key={i}
                      href={card.href}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      className="flex items-start gap-4 p-4 border rounded-lg group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#f9f9f9', textDecoration: 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(233,30,140,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(233,30,140,0.02)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.background = '#f9f9f9'; }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[1.2rem] shrink-0 transition-all group-hover:scale-110"
                        style={{ background: 'rgba(233,30,140,0.08)' }}>
                        {card.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[0.5rem] tracking-[0.15em] uppercase mb-0.5 font-semibold" style={{ color: '#e91e8c' }}>{card.label}</p>
                        <p className="font-semibold text-[0.88rem] text-[#1a1a2e] truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{card.val}</p>
                        {card.extra && card.extra.length > 1 && (
                          <div className="mt-1 space-y-0.5">
                            {card.extra.map((h: string, j: number) => (
                              <p key={j} className="text-[0.75rem]" style={{ color: 'rgba(0,0,0,0.45)' }}>{h}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20your%20photography%20services.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-[0.78rem] transition-all hover:scale-105 hover:shadow-lg"
                    style={{ background: '#25D366', color: '#ffffff', fontFamily: "'Syne', sans-serif" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                )}

                {/* Credentials */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {['Nikon NPS', 'GST Registered', 'MSME Certified', 'Pan-India'].map(b => (
                    <span key={b} className="font-mono text-[0.48rem] tracking-[0.15em] uppercase px-3 py-1.5 border"
                      style={{ borderColor: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.35)', borderRadius: '4px' }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* Right — Form */}
              <div className="border p-8 rounded-lg" style={{ background: '#f9f9f9', borderColor: 'rgba(0,0,0,0.08)' }}>
                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-[2rem] mb-4" style={{ background: 'rgba(233,30,140,0.1)' }}>✦</div>
                    <h3 className="font-bold text-[1.4rem] text-[#1a1a2e] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Message Sent!</h3>
                    <p className="text-[0.85rem] mb-6" style={{ color: 'rgba(0,0,0,0.5)' }}>We'll respond within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="btn-outline-sm" data-hover>Send Another</button>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} className="flex flex-col gap-5">
                    <div>
                      <h3 className="font-bold text-[1.3rem] text-[#1a1a2e] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Send Us a Message</h3>
                      <p className="text-[0.8rem]" style={{ color: 'rgba(0,0,0,0.4)' }}>We'll get back to you within 24 hours</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: '#999' }}>Name *</label>
                        <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input-field" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: '#999' }}>Phone</label>
                        <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="input-field" placeholder="+91…" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: '#999' }}>Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input-field" placeholder="you@company.com" />
                    </div>
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: '#999' }}>Company</label>
                      <input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="input-field" placeholder="Your company name" />
                    </div>
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: '#999' }}>Service</label>
                      <select value={form.service} onChange={e => setForm(f => ({...f, service: e.target.value}))} className="input-field">
                        <option value="">Select a service…</option>
                        {(services as any[]).map((svc: any) => <option key={svc._id} value={svc.name}>{svc.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: '#999' }}>Message *</label>
                      <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={4} className="input-field resize-none" placeholder="Tell us about your project…" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary justify-center py-4 w-full" data-hover>
                      <span>{loading ? 'Sending…' : 'Send Enquiry ✦'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Google Map ────────────────────────────────────────────────────── */}
        <section id="map" className="w-full border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <iframe
            src={mapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.499396588847!2d81.61317347577216!3d21.212036580483492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dc31eca06d0b%3A0xd811c1523e35b6e5!2zU3R1ZGlvIGlvZGluZSB2YXBvciB8IOCkhuCkr-Cli-CkoeClgOCkqCDgpLXgpYfgpKrgpLA!5e0!3m2!1sen!2sin!4v1786694327215!5m2!1sen!2sin"}
            width="100%"
            height="480"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Studio Iodine Vapor Location"
          />
          {/* Map action buttons */}
          <div className="flex items-center gap-3 px-6 py-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)', background: '#f9f9f9' }}>
            <span className="font-mono text-[0.52rem] tracking-[0.18em] uppercase mr-2" style={{ color: 'rgba(0,0,0,0.35)' }}>Studio Iodine Vapor — Raipur, CG</span>
            <div className="ml-auto flex gap-2">
              {/* Open in Maps */}
              <a
                href="https://maps.app.goo.gl/wbfSBbEb4mRcVymQ9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[0.7rem] font-semibold transition-all hover:scale-105"
                style={{ background: '#1a1a2e', color: '#ffffff', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Open in Maps
              </a>
              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Studio Iodine Vapor', text: 'Find us on Google Maps', url: 'https://maps.app.goo.gl/wbfSBbEb4mRcVymQ9' });
                  } else {
                    navigator.clipboard.writeText('https://maps.app.goo.gl/wbfSBbEb4mRcVymQ9');
                    toast.success('Link copied!');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[0.7rem] font-semibold transition-all hover:scale-105 border"
                style={{ background: 'transparent', color: '#1a1a2e', borderColor: 'rgba(0,0,0,0.15)', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
              {/* Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://maps.app.goo.gl/wbfSBbEb4mRcVymQ9');
                  toast.success('Map link copied!');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[0.7rem] font-semibold transition-all hover:scale-105 border"
                style={{ background: 'transparent', color: '#e91e8c', borderColor: 'rgba(233,30,140,0.25)', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
