'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { enquiriesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface EnquiryPopupProps {
  open: boolean;
  onClose: () => void;
  serviceName?: string;
}

export default function EnquiryPopup({ open, onClose, serviceName }: EnquiryPopupProps) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    subject: serviceName ? `${serviceName} Enquiry` : '',
    message: '', service: serviceName || '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync subject when serviceName changes
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await enquiriesApi.submit({
        ...form,
        type: serviceName ? 'service' : 'contact',
        file: file || undefined,
      });
      toast.success('Enquiry sent! We\'ll get back to you soon.');
      onClose();
      setForm({ name: '', email: '', phone: '', subject: '', message: '', service: '' });
      setFile(null);
    } catch {
      toast.error('Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '6px', color: '#ffffff', fontSize: '0.85rem',
    fontFamily: 'Helvetica Neue, Helvetica, sans-serif', outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  };

  const focusStyle = (e: React.FocusEvent<any>) => {
    e.currentTarget.style.borderColor = '#e91e8c';
    e.currentTarget.style.background = 'rgba(233,30,140,0.06)';
  };
  const blurStyle = (e: React.FocusEvent<any>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[950] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{ background: '#0f0f18', border: '1px solid rgba(233,30,140,0.2)', borderRadius: '12px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div>
                <p className="font-mono text-[0.5rem] tracking-[0.28em] uppercase mb-1 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                  <span className="w-4 h-px inline-block" style={{ background: '#e91e8c' }} />
                  Get in Touch
                </p>
                <h2 className="font-bold text-white" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', lineHeight: 1.1 }}>
                  {serviceName ? `Enquire — ${serviceName}` : 'Send an Enquiry'}
                </h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center transition-colors" style={{ color: 'rgba(255,255,255,0.4)', borderRadius: '6px' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ffffff'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1l12 12M13 1L1 13"/>
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[0.48rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Full Name <span style={{ color: '#e91e8c' }}>*</span>
                  </label>
                  <input
                    type="text" value={form.name} onChange={e => up('name', e.target.value)}
                    placeholder="Your name" required style={inputStyle}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.48rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Phone <span style={{ color: '#e91e8c' }}>*</span>
                  </label>
                  <input
                    type="tel" value={form.phone} onChange={e => up('phone', e.target.value)}
                    placeholder="+91 98765 43210" required style={inputStyle}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono text-[0.48rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Email <span style={{ color: '#e91e8c' }}>*</span>
                </label>
                <input
                  type="email" value={form.email} onChange={e => up('email', e.target.value)}
                  placeholder="you@company.com" required style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block font-mono text-[0.48rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Subject</label>
                <input
                  type="text" value={form.subject} onChange={e => up('subject', e.target.value)}
                  placeholder="How can we help?" style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-mono text-[0.48rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Message <span style={{ color: '#e91e8c' }}>*</span>
                </label>
                <textarea
                  value={form.message} onChange={e => up('message', e.target.value)}
                  placeholder="Tell us about your project, timeline, requirements…" required rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block font-mono text-[0.48rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Attach File <span style={{ color: 'rgba(255,255,255,0.25)' }}>(PDF, JPG, PNG — optional)</span>
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '6px' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(233,30,140,0.4)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <span className="text-[0.78rem]" style={{ color: file ? '#e91e8c' : 'rgba(255,255,255,0.4)' }}>
                    {file ? file.name : 'Click to upload brief / reference'}
                  </span>
                  {file && (
                    <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="ml-auto font-mono text-[0.5rem]" style={{ color: '#d63a2f' }}>✕</button>
                  )}
                </div>
                <input ref={fileRef} type="file" className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                  onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 font-semibold text-[0.78rem] tracking-[0.1em] uppercase transition-all duration-300"
                style={{
                  background: loading ? 'rgba(233,30,140,0.5)' : 'linear-gradient(135deg, #e91e8c, #c4167a)',
                  color: '#ffffff', borderRadius: '8px', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(233,30,140,0.3)',
                  marginTop: '4px',
                }}>
                {loading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <span>Send Enquiry</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center font-mono text-[0.46rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Your data is safe · We respond within 24 hours
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
