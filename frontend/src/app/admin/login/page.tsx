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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#080808' }}>
      {/* Ambient */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10 animate-float" style={{ background: 'radial-gradient(#c9a96e, transparent)' }} />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: 'radial-gradient(#d63a2f, transparent)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="p-10 border" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', borderColor: 'rgba(201,169,110,0.15)', borderRadius: '2px' }}>
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="font-display text-[2.4rem] tracking-[0.12em] text-cream-DEFAULT mb-2">
              Iodine<span style={{ color: 'var(--c-gold)' }}>.</span>Admin
            </div>
            <p className="font-mono text-[0.58rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(245,240,234,0.3)' }}>
              Secure Access Portal
            </p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="admin@iodinevapor.com" required />
            </div>
            <div>
              <label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-muted)' }}>Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPass(e.target.value)} className="input-field pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.6rem]" style={{ color: 'var(--c-muted)' }}>{show ? '○' : '●'}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary justify-center py-4 mt-2 w-full" data-hover>
              <span>{loading ? 'Signing in…' : 'Sign In ✦'}</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
