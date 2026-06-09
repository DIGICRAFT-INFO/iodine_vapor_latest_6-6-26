'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '@/lib/api';
import { AdminHeader, AddBtn, FormDrawer, Field, Toggle, ConfirmDelete, StatusBadge } from '@/components/admin/AdminComponents';
import toast from 'react-hot-toast';

const ICONS = ['📸', '🎬', '🏛️', '🎓', '🚁', '🎪', '💡', '🎯', '🖼️', '🎞️'];
const empty = () => ({ name: '', icon: '📸', shortDesc: '', description: '', features: [], order: 0, isActive: true });

export default function AdminServices() {
  const [form, setForm]         = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featInput, setFeatInput] = useState('');

  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ['services'] });

  const { data: services = [], isLoading } = useQuery({ queryKey: ['services'], queryFn: servicesApi.getAll });
  const save   = useMutation({ mutationFn: (d: any) => d._id ? servicesApi.update(d._id, d) : servicesApi.create(d), onSuccess: () => { inv(); toast.success('Saved!'); setShowForm(false); }, onError: () => toast.error('Failed') });
  const remove = useMutation({ mutationFn: servicesApi.delete, onSuccess: () => { inv(); toast.success('Deleted'); setDeleteId(null); } });

  const up = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const addFeat = () => { if (featInput.trim()) { up('features', [...(form.features||[]), featInput.trim()]); setFeatInput(''); } };

  return (
    <div>
      <AdminHeader title="Services" subtitle={`${services.length} services`} action={<AddBtn onClick={() => { setForm(empty()); setShowForm(true); }} label="Add Service" />} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? Array.from({length:6}).map((_,i) => <div key={i} className="h-36 shimmer" style={{ borderRadius: '2px' }} />) :
        services.length === 0 ? (
          <div className="col-span-3 p-16 text-center border" style={{ borderColor: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
            <p className="font-mono text-[0.58rem] tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(245,240,234,0.2)' }}>No services</p>
            <AddBtn onClick={() => { setForm(empty()); setShowForm(true); }} label="Add First Service" />
          </div>
        ) : services.map((svc: any) => (
          <div key={svc._id} className="group border p-5 transition-all duration-300 relative"
            style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.15)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}>
            <div className="flex items-start justify-between mb-3">
              <div className="text-[1.8rem]">{svc.icon}</div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setForm({ ...svc }); setShowForm(true); }} className="px-2.5 py-1 font-mono text-[0.44rem] border" style={{ borderColor: 'rgba(201,169,110,0.2)', color: 'var(--c-gold)', borderRadius: '2px' }}>Edit</button>
                <button onClick={() => setDeleteId(svc._id)} className="px-2.5 py-1 font-mono text-[0.44rem] border" style={{ borderColor: 'rgba(214,58,47,0.2)', color: '#d63a2f', borderRadius: '2px' }}>Del</button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-serif text-[1rem] text-cream-DEFAULT">{svc.name}</h3>
              <StatusBadge status={svc.isActive ? 'active' : 'inactive'} />
            </div>
            <p className="text-[0.75rem] leading-[1.6]" style={{ color: 'rgba(245,240,234,0.35)' }}>{svc.shortDesc}</p>
            {svc.features?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {svc.features.slice(0, 3).map((f: string) => <span key={f} className="font-mono text-[0.44rem] tracking-[0.1em] uppercase px-1.5 py-0.5" style={{ color: 'rgba(245,240,234,0.3)', background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }}>{f}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title={form?._id ? 'Edit Service' : 'Add Service'} onSave={() => save.mutate(form)} saving={save.isPending}>
        {form && (
          <>
            <Field label="Name *"><input required value={form.name} onChange={e => up('name', e.target.value)} className="input-field" placeholder="Service name…" /></Field>
            <Field label="Icon">
              <div className="flex flex-wrap gap-2">
                {ICONS.map(icon => (
                  <button key={icon} type="button" onClick={() => up('icon', icon)}
                    className="w-10 h-10 text-[1.4rem] flex items-center justify-center border transition-all"
                    style={{ borderColor: form.icon === icon ? 'var(--c-gold)' : 'rgba(255,255,255,0.08)', background: form.icon === icon ? 'rgba(201,169,110,0.1)' : 'transparent', borderRadius: '2px' }}>
                    {icon}
                  </button>
                ))}
                <input value={form.icon} onChange={e => up('icon', e.target.value)} className="input-field w-16 text-center text-[1.2rem]" placeholder="Or custom…" />
              </div>
            </Field>
            <Field label="Short Description"><input value={form.shortDesc || ''} onChange={e => up('shortDesc', e.target.value)} className="input-field" placeholder="One-liner…" /></Field>
            <Field label="Full Description"><textarea value={form.description || ''} onChange={e => up('description', e.target.value)} rows={3} className="input-field resize-none" placeholder="Detailed description…" /></Field>
            <div>
              <label className="block font-mono text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(245,240,234,0.4)' }}>Features</label>
              <div className="flex gap-2 mb-2">
                <input value={featInput} onChange={e => setFeatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeat())} placeholder="Add feature…" className="input-field flex-1 py-2 text-[0.8rem]" />
                <button type="button" onClick={addFeat} className="px-4 py-2 font-mono text-[0.55rem] border" style={{ borderColor: 'rgba(201,169,110,0.25)', color: 'var(--c-gold)', borderRadius: '2px' }}>Add</button>
              </div>
              <div className="space-y-1.5">
                {(form.features || []).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 text-[0.78rem]" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '2px' }}>
                    <span style={{ color: 'var(--c-gold)', fontSize: '0.5rem' }}>✦</span>
                    <span className="flex-1 text-cream-DEFAULT">{f}</span>
                    <button type="button" onClick={() => up('features', form.features.filter((_: any, j: number) => j !== i))} className="font-mono text-[0.5rem]" style={{ color: '#d63a2f' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Order"><input type="number" value={form.order || 0} onChange={e => up('order', +e.target.value)} className="input-field" /></Field>
            </div>
            <Toggle label="Active / Visible" checked={!!form.isActive} onChange={v => up('isActive', v)} />
          </>
        )}
      </FormDrawer>

      <ConfirmDelete open={!!deleteId} label="service" onConfirm={() => deleteId && remove.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
