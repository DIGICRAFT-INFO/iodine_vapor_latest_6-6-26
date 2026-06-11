'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { enquiriesApi } from '@/lib/api';
import { AdminHeader, ConfirmDelete, StatusBadge } from '@/components/admin/AdminComponents';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const STATUS_OPTS = ['new','read','replied','closed'];

export default function AdminEnquiries() {
  const [type,   setType]     = useState('');
  const [status, setStatus]   = useState('');
  const [page,   setPage]     = useState(1);
  const [selected, setSelected] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const qc = useQueryClient();
  const inv = () => { qc.invalidateQueries({ queryKey: ['enquiries'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); };

  const { data, isLoading } = useQuery({ queryKey: ['enquiries', { type, status, page }], queryFn: () => enquiriesApi.get({ type: type || undefined, status: status || undefined, page, limit: 20 }) });

  const updateMut = useMutation({ mutationFn: ({ id, d }: any) => enquiriesApi.update(id, d), onSuccess: () => inv() });
  const removeMut = useMutation({ mutationFn: enquiriesApi.delete, onSuccess: () => { inv(); toast.success('Deleted'); setDeleteId(null); setSelected(null); } });

  const enquiries  = data?.enquiries || [];
  const totalPages = data?.pages || 1;

  const open = (e: any) => {
    setSelected(e);
    if (e.status === 'new') updateMut.mutate({ id: e._id, d: { status: 'read' } });
  };

  return (
    <div>
      <AdminHeader title="Enquiries" subtitle={`${data?.total || 0} total`} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} className="input-field w-36 py-2 text-[0.78rem]">
          <option value="">All Types</option>
          {['contact','quote','workshop'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input-field w-36 py-2 text-[0.78rem]">
          <option value="">All Status</option>
          {STATUS_OPTS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="flex gap-5">
        {/* List */}
        <div className={`${selected ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          <div className="border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}>
            {isLoading ? (
              <div className="p-4 space-y-2">{Array.from({length:8}).map((_,i) => <div key={i} className="h-14 shimmer" style={{ borderRadius: '2px' }} />)}</div>
            ) : enquiries.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>No enquiries</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
                {enquiries.map((e: any) => (
                  <div key={e._id} onClick={() => open(e)}
                    className="p-4 flex items-start gap-3 cursor-pointer transition-colors"
                    style={{ background: selected?._id === e._id ? 'rgba(201,169,110,0.05)' : 'transparent' }}
                    onMouseEnter={ev => (ev.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)'}
                    onMouseLeave={ev => (ev.currentTarget as HTMLElement).style.background = selected?._id === e._id ? 'rgba(201,169,110,0.05)' : 'transparent'}>
                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center font-display text-[0.9rem]"
                      style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--c-gold)', borderRadius: '2px' }}>
                      {e.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-[0.8rem] ${e.status === 'new' ? 'font-semibold text-cream-DEFAULT' : 'text-cream-DEFAULT opacity-70'}`}>{e.name}</span>
                        <StatusBadge status={e.status} />
                        <span className="font-mono text-[0.46rem] tracking-[0.12em] uppercase px-1.5 py-0.5 capitalize" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '2px', color: 'rgba(255,255,255,0.4)' }}>{e.type}</span>
                        {e.status === 'new' && <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: 'var(--c-gold)' }} />}
                      </div>
                      <p className="text-[0.7rem] truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{e.subject || e.message?.slice(0, 60)}</p>
                      <p className="text-[0.62rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="font-mono text-[0.52rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>Page {page}/{totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 font-mono text-[0.52rem] border transition-all disabled:opacity-30" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', color: 'rgba(255,255,255,0.5)' }}>Prev</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 font-mono text-[0.52rem] border transition-all disabled:opacity-30" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', color: 'rgba(255,255,255,0.5)' }}>Next</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/2 p-6 border sticky top-6 self-start max-h-[calc(100vh-160px)] overflow-y-auto space-y-4"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(201,169,110,0.12)', borderRadius: '2px' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-[1.2rem] tracking-[0.06em] text-cream-DEFAULT">{selected.name}</h3>
                <p className="text-[0.75rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{selected.email}</p>
                {selected.phone && <p className="text-[0.75rem]" style={{ color: 'rgba(255,255,255,0.5)' }}>{selected.phone}</p>}
                {selected.company && <p className="text-[0.75rem]" style={{ color: 'rgba(255,255,255,0.5)' }}>{selected.company}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="font-mono text-[0.7rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>✕</button>
            </div>

            <div className="p-4 border" style={{ background: 'rgba(8,8,8,0.4)', borderColor: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}>
              {selected.subject && <p className="font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'var(--c-gold)' }}>{selected.subject}</p>}
              <p className="text-[0.82rem] leading-[1.7] whitespace-pre-wrap" style={{ color: 'rgba(245,240,234,0.65)' }}>{selected.message}</p>
            </div>

            {/* Status */}
            <div>
              <p className="font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTS.map(s => (
                  <button key={s} onClick={() => { updateMut.mutate({ id: selected._id, d: { status: s } }); setSelected({ ...selected, status: s }); }}
                    className="px-3 py-1.5 font-mono text-[0.5rem] tracking-[0.12em] uppercase border transition-all capitalize"
                    style={{ borderRadius: '2px', background: selected.status === s ? 'rgba(201,169,110,0.12)' : 'transparent', borderColor: selected.status === s ? 'rgba(201,169,110,0.3)' : 'rgba(0,0,0,0.08)', color: selected.status === s ? 'var(--c-gold)' : 'rgba(0,0,0,0.4)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="font-mono text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Internal Notes</p>
              <textarea defaultValue={selected.notes} onBlur={e => updateMut.mutate({ id: selected._id, d: { notes: e.target.value } })}
                rows={3} className="input-field resize-none text-[0.78rem]" placeholder="Add internal notes…" />
            </div>

            <button onClick={() => setDeleteId(selected._id)}
              className="w-full py-3 flex items-center justify-center gap-2 border font-mono text-[0.55rem] tracking-[0.15em] uppercase transition-all"
              style={{ borderColor: 'rgba(214,58,47,0.2)', color: '#d63a2f', borderRadius: '2px' }} data-hover>
              ✕ Delete Enquiry
            </button>
          </motion.div>
        )}
      </div>

      <ConfirmDelete open={!!deleteId} label="enquiry" onConfirm={() => deleteId && removeMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

