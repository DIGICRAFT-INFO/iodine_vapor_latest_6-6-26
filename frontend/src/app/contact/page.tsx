'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, settingsApi, enquiriesApi, servicesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', company: '', service: '', message: '', type: 'contact' });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: slides   = [] } = useQuery({ queryKey: ['slides','contact'], queryFn: () => slidesApi.get('contact') });
  const { data: settings = {} } = useQuery({ queryKey: ['settings'],          queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: services = [] } = useQuery({ queryKey: ['services'],          queryFn: servicesApi.get });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Fill required fields');
    setLoading(true);
    try {
      await enquiriesApi.submit(form);
      setSent(true);
    } catch { toast.error('Failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="contact" defaultTitle="CONTACT" defaultSub="Let's Create Together" />
      <main className="py-[100px] px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'var(--c-gold)' }}>
                <span className="w-8 h-px" style={{ background: 'var(--c-gold)' }} />Get in Touch
              </div>
              <h2 className="font-display text-cream-DEFAULT leading-[0.88] mb-8" style={{ fontSize: 'clamp(3rem, 5vw, 6rem)' }}>
                START YOUR<br /><span style={{ color: 'var(--c-gold)' }}>PROJECT</span><br />TODAY.
              </h2>
              <p className="text-[0.88rem] leading-[1.8] mb-10 max-w-[380px]" style={{ color: 'rgba(245,240,234,0.42)' }}>
                Ready to create visuals that truly represent your brand? GST & MSME registered. Pan-India services. Nikon NPS member.
              </p>
              <div className="flex flex-col gap-5 mb-10">
                {[
                  settings?.contact_email ? { icon: '📧', label: 'Email', val: settings.contact_email, href: `mailto:${settings.contact_email}` } : null,
                  settings?.contact_phone ? { icon: '📞', label: 'Phone', val: settings.contact_phone, href: `tel:${settings.contact_phone}` } : null,
                  settings?.contact_address ? { icon: '📍', label: 'Location', val: settings.contact_address, href: '#' } : null,
                  { icon: '🕐', label: 'Response', val: 'Within 24 hours', href: '#' },
                ].filter(Boolean).map((item: any) => (
                  <a key={item.label} href={item.href} className="flex items-start gap-4 group" data-hover>
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border text-base transition-all"
                      style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-gold)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-0.5" style={{ color: 'var(--c-muted)' }}>{item.label}</p>
                      <p className="text-[0.88rem]" style={{ color: 'var(--c-cream)' }}>{item.val}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Credentials */}
              <div className="flex flex-wrap gap-3">
                {['Nikon NPS Member', 'GST Registered', 'MSME Certified', 'Pan-India'].map(b => (
                  <span key={b} className="font-mono text-[0.48rem] tracking-[0.15em] uppercase px-3 py-1.5 border"
                    style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(245,240,234,0.3)', borderRadius: '2px' }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="border p-8" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="font-display text-[3rem] mb-2" style={{ color: 'var(--c-gold)' }}>✦</div>
                  <h3 className="font-serif text-[1.8rem] text-cream-DEFAULT mb-3">Message Sent!</h3>
                  <p className="text-[0.82rem]" style={{ color: 'rgba(245,240,234,0.45)' }}>We'll respond within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-ghost mt-8 text-[0.6rem]" data-hover>Send Another</button>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-5">
                  <h3 className="font-display text-[1.5rem] tracking-[0.06em] text-cream-DEFAULT mb-2">Send Us a Message</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Phone</label>
                      <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="input-field" placeholder="+91…" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input-field" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Company</label>
                    <input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="input-field" placeholder="Your company name" />
                  </div>
                  <div>
                    <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Service</label>
                    <select value={form.service} onChange={e => setForm(f => ({...f, service: e.target.value}))} className="input-field">
                      <option value="">Select a service…</option>
                      {services.map((svc: any) => <option key={svc._id} value={svc.name}>{svc.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Message *</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={4} className="input-field resize-none" placeholder="Tell us about your project — location, timeline, vision…" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary justify-center py-4 w-full text-[0.65rem]" data-hover>
                    <span>{loading ? 'Sending…' : 'Send Enquiry ✦'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
