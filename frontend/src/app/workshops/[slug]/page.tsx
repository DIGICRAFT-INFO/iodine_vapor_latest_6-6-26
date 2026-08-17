'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { workshopsApi, imgUrl } from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function WorkshopDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [registered, setRegistered] = useState(false);
  const [showReg, setShowReg] = useState(false);

  const { data: workshop, isLoading, error } = useQuery({
    queryKey: ['workshop', slug],
    queryFn:  () => workshopsApi.getOne(slug),
    enabled:  !!slug,
  });

  const registerMut = useMutation({
    mutationFn: () => workshopsApi.register(workshop!._id, regForm),
    onSuccess: () => { setRegistered(true); toast.success('Registered successfully!'); },
    onError:   () => toast.error('Registration failed. Please try again.'),
  });

  const handleReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) return toast.error('Name and email required');
    registerMut.mutate();
  };

  if (isLoading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center mt-16" style={{ background: 'var(--c-bg)' }}>
        <div className="w-10 h-10 border border-t-transparent animate-spin" style={{ borderColor: 'var(--c-gold)', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    </>
  );

  if (error || !workshop) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center mt-16 gap-6" style={{ background: 'var(--c-bg)' }}>
        <h1 className="font-display text-[3rem]" style={{ color: 'rgba(245,240,234,0.15)' }}>404</h1>
        <p className="font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.3)' }}>Workshop not found</p>
        <Link href="/workshops" className="btn-ghost text-[0.6rem]">← Back to Workshops</Link>
      </div>
    </>
  );

  const seatsLeft = workshop.seats - (workshop.registrations?.length || 0);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative mt-16 overflow-hidden" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #080808 0%, #141414 100%)' }}>
          {workshop.coverImage?.url && (
            <>
              <img src={imgUrl(workshop.coverImage.url)} alt={workshop.title} className="w-full h-full object-cover"
                style={{ opacity: 0.25, filter: 'grayscale(20%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,8,8,0.3), rgba(8,8,8,0.9))' }} />
            </>
          )}
        </div>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-8 py-20 flex flex-col justify-end" style={{ minHeight: '50vh' }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {workshop.category?.name && (
              <span className="font-mono text-[0.54rem] tracking-[0.18em] uppercase px-2.5 py-1 border"
                style={{ borderColor: (workshop.category.color || 'var(--c-gold)') + '40', color: workshop.category.color || 'var(--c-gold)', borderRadius: '2px' }}>
                {workshop.category.name}
              </span>
            )}
            {workshop.isFree && <span className="font-mono text-[0.5rem] tracking-[0.12em] uppercase px-2.5 py-1" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', borderRadius: '2px' }}>Free</span>}
            {workshop.isOnline && <span className="font-mono text-[0.5rem] tracking-[0.12em] uppercase px-2.5 py-1" style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.1)', borderRadius: '2px' }}>Online</span>}
          </div>
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream-DEFAULT leading-[0.92] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            {workshop.title}
          </motion.h1>
          {workshop.description && (
            <p className="text-[0.9rem] leading-[1.75] max-w-[540px]" style={{ color: 'rgba(245,240,234,0.5)' }}>
              {workshop.description}
            </p>
          )}
        </div>
      </section>

      <main className="py-[60px] px-6 md:px-8" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Content */}
            <div className="lg:col-span-2">
              {workshop.content && (
                <div className="mb-10">
                  <h2 className="font-display text-[1.8rem] tracking-[0.04em] text-cream-DEFAULT mb-5">About This Workshop</h2>
                  <div style={{ color: 'rgba(245,240,234,0.6)', fontSize: '0.93rem', lineHeight: '1.9' }}>
                    {workshop.content.split('\n\n').map((para: string, i: number) => (
                      para.trim() ? <p key={i} className="mb-4">{para.trim()}</p> : null
                    ))}
                  </div>
                </div>
              )}

              {/* Registration form inline */}
              {!registered ? (
                <div className="border p-6" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(201,169,110,0.15)', borderRadius: '2px' }}>
                  <h3 className="font-display text-[1.4rem] tracking-[0.04em] text-cream-DEFAULT mb-5">Register for this Workshop</h3>
                  <form onSubmit={handleReg} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[0.5rem] tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(245,240,234,0.35)' }}>Name *</label>
                        <input required value={regForm.name} onChange={e => setRegForm(f => ({...f, name: e.target.value}))} className="input-field" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block font-mono text-[0.5rem] tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(245,240,234,0.35)' }}>Phone</label>
                        <input value={regForm.phone} onChange={e => setRegForm(f => ({...f, phone: e.target.value}))} className="input-field" placeholder="+91 98765…" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(245,240,234,0.35)' }}>Email *</label>
                      <input required type="email" value={regForm.email} onChange={e => setRegForm(f => ({...f, email: e.target.value}))} className="input-field" placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className="block font-mono text-[0.5rem] tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(245,240,234,0.35)' }}>Message (optional)</label>
                      <textarea value={regForm.message} onChange={e => setRegForm(f => ({...f, message: e.target.value}))} rows={3} className="input-field resize-none" placeholder="Any questions or notes…" />
                    </div>
                    <button type="submit" disabled={registerMut.isPending} className="btn-primary w-full justify-center py-4" data-hover>
                      <span>{registerMut.isPending ? 'Registering…' : `Register ${workshop.isFree ? '— Free' : `— ₹${workshop.price}`}`}</span>
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border p-10 text-center"
                  style={{ background: 'rgba(74,222,128,0.04)', borderColor: 'rgba(74,222,128,0.2)', borderRadius: '2px' }}
                >
                  <div className="font-display text-[3rem] mb-2" style={{ color: '#4ade80' }}>✓</div>
                  <h3 className="font-serif text-[1.5rem] text-cream-DEFAULT mb-2">You're Registered!</h3>
                  <p className="text-[0.82rem]" style={{ color: 'rgba(245,240,234,0.45)' }}>We'll send you details via email. See you there!</p>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Details card */}
              <div className="border p-6" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}>
                <h3 className="font-mono text-[0.58rem] tracking-[0.22em] uppercase mb-5" style={{ color: 'rgba(245,240,234,0.3)' }}>Workshop Details</h3>
                <div className="space-y-4">
                  {[
                    { icon: '📅', label: 'Date',     val: workshop.date ? format(new Date(workshop.date), 'EEEE, MMMM d, yyyy') : 'TBA' },
                    { icon: '⏱️',  label: 'Duration',  val: workshop.duration || 'TBA' },
                    { icon: '📍', label: 'Location',  val: workshop.isOnline ? 'Online' : (workshop.location || 'TBA') },
                    { icon: '💺', label: 'Seats Left', val: seatsLeft > 0 ? `${seatsLeft} of ${workshop.seats}` : 'Full' },
                    { icon: '💰', label: 'Price',      val: workshop.isFree ? 'Free' : `₹${workshop.price}` },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-mono text-[0.48rem] tracking-[0.16em] uppercase" style={{ color: 'rgba(245,240,234,0.25)' }}>{item.label}</p>
                        <p className="text-[0.85rem] text-cream-DEFAULT mt-0.5">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seats warning */}
              {seatsLeft <= 5 && seatsLeft > 0 && (
                <div className="border p-4 text-center" style={{ borderColor: 'rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.05)', borderRadius: '2px' }}>
                  <p className="font-mono text-[0.54rem] tracking-[0.16em] uppercase" style={{ color: '#fbbf24' }}>
                    ⚠️ Only {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left!
                  </p>
                </div>
              )}

              <Link href="/workshops" className="btn-ghost w-full justify-center text-[0.58rem]" data-hover>
                ← All Workshops
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
