'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router    = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: '#0a0a0f', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
    >
      {/* ── Left Panel — Branding ─────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #0d0b1a 0%, #12101f 60%, #1a0d20 100%)' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,160,212,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />

        {/* Top logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-[2px]" style={{ background: '#e91e8c' }} />
            <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Admin Portal
            </span>
          </div>
          <h1
            className="font-display text-[2.8rem] leading-none tracking-wider"
            style={{ color: '#ffffff', fontFamily: "'Bebas Neue', sans-serif" }}
          >
            IODINE<span style={{ color: '#e91e8c' }}>.</span>VAPOR
          </h1>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <p
              className="font-bold leading-[1.1] mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontFamily: "'Syne', sans-serif", color: '#ffffff' }}
            >
              Manage Your<br />
              <span style={{ color: '#e91e8c' }}>Studio</span> CMS
            </p>
            <p className="text-[0.85rem] leading-[1.8] max-w-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Full control over your content — slides, services, portfolio, blogs, and more. All in one place.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {['Slides & Hero Banners', 'Portfolio & Services', 'Blogs & FAQs', 'Media Library', 'Enquiries & Leads'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#e91e8c' }} />
                <span className="text-[0.78rem] font-medium" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Helvetica Neue, Helvetica, sans-serif' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="font-mono text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Iodine Vapor · Pan-India Studio
          </p>
        </div>
      </div>

      {/* ── Right Panel — Login Form ──────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative"
        style={{ background: '#0f0f18' }}
      >
        {/* Mobile glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none lg:hidden" style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <h1
              className="font-display text-[2rem] tracking-wider mb-1"
              style={{ color: '#ffffff', fontFamily: "'Bebas Neue', sans-serif" }}
            >
              IODINE<span style={{ color: '#e91e8c' }}>.</span>VAPOR
            </h1>
            <p className="font-mono text-[0.52rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin Portal</p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p className="font-mono text-[0.52rem] tracking-[0.28em] uppercase mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
              <span className="w-5 h-px inline-block" style={{ background: '#e91e8c' }} />
              Secure Access
            </p>
            <h2 className="font-bold text-white mb-2" style={{ fontSize: '1.7rem', fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}>
              Sign in to<br />your dashboard
            </h2>
            <p className="text-[0.8rem]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block font-mono text-[0.5rem] tracking-[0.22em] uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="iodine.vapor"
                required
                autoComplete="email"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                  WebkitTextFillColor: '#ffffff',
                  caretColor: '#ffffff',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#e91e8c';
                  e.currentTarget.style.background = 'rgba(233,30,140,0.06)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block font-mono text-[0.5rem] tracking-[0.22em] uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 44px 14px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                    WebkitTextFillColor: '#ffffff',
                    caretColor: '#ffffff',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#e91e8c';
                    e.currentTarget.style.background = 'rgba(233,30,140,0.06)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 transition-colors"
                  style={{ color: show ? '#e91e8c' : 'rgba(255,255,255,0.3)' }}
                  tabIndex={-1}
                >
                  {show ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 font-semibold text-[0.8rem] tracking-[0.1em] uppercase transition-all duration-300"
              style={{
                background: loading ? 'rgba(233,30,140,0.5)' : 'linear-gradient(135deg, #e91e8c, #c4167a)',
                color: '#ffffff',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
                fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(233,30,140,0.3)',
                marginTop: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center font-mono text-[0.48rem] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Protected · Iodine Vapor Studio CMS
          </p>
        </motion.div>
      </div>

      {/* Autofill override */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 100px rgba(233,30,140,0.08) inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          border-color: rgba(233,30,140,0.4) !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
