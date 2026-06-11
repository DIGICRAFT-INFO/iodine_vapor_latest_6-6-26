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
              <p className="text-[0.88rem] leading-[1.8] mb-10 max-w-[380px]" style={{ color: 'rgba(0,0,0,0.5)' }}>
                Ready to create visuals that truly represent your brand? GST & MSME registered. Pan-India services. Nikon NPS member.
              </p>
              <div className="flex flex-col gap-5 mb-10">
                {[
                  settings?.contact_email ? { icon: 'email', label: 'Email', val: settings.contact_email, href: `mailto:${settings.contact_email}` } : null,
                  settings?.contact_phone ? { icon: 'phone', label: 'Phone', val: settings.contact_phone, href: `tel:${settings.contact_phone}` } : null,
                  settings?.contact_address ? { icon: 'location', label: 'Location', val: settings.contact_address, href: '#' } : null,
                  { icon: 'clock', label: 'Response', val: 'Within 24 hours', href: '#' },
                ].filter(Boolean).map((item: any) => (
                  <a key={item.label} href={item.href} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border rounded-lg transition-all group-hover:border-[#e91e8c] group-hover:bg-[rgba(233,30,140,0.05)]"
                      style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                      {item.icon === 'email' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>}
                      {item.icon === 'phone' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>}
                      {item.icon === 'location' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                      {item.icon === 'clock' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>}
                    </div>
                    <div>
                      <p className="font-mono text-[0.55rem] tracking-[0.15em] uppercase mb-0.5 font-semibold" style={{ color: '#999' }}>{item.label}</p>
                      <p className="text-[0.95rem] font-semibold" style={{ color: '#1a1a2e' }}>{item.val}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Credentials */}
              <div className="flex flex-wrap gap-3">
                {['Nikon NPS Member', 'GST Registered', 'MSME Certified', 'Pan-India'].map(b => (
                  <span key={b} className="font-mono text-[0.48rem] tracking-[0.15em] uppercase px-3 py-1.5 border"
                    style={{ borderColor: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.35)', borderRadius: '2px' }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="border p-8" style={{ background: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="font-display text-[3rem] mb-2" style={{ color: 'var(--c-gold)' }}>✦</div>
                  <h3 className="font-serif text-[1.8rem] text-cream-DEFAULT mb-3">Message Sent!</h3>
                  <p className="text-[0.82rem]" style={{ color: 'rgba(0,0,0,0.5)' }}>We'll respond within 24 hours.</p>
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
