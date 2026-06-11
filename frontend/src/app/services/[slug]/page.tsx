'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { servicesApi, imgUrl } from '@/lib/api';

export default function ServiceDetail() {
  const { slug } = useParams();

  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: servicesApi.get });

  const service = services.find((s: any) => s.slug === slug);
  const relatedServices = services.filter((s: any) => s.slug !== slug).slice(0, 3);

  if (!services.length) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--c-bg)' }}>
          <div className="shimmer w-16 h-16" style={{ borderRadius: '50%' }} />
        </div>
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: 'var(--c-bg)' }}>
          <h1 className="font-display text-[3rem]" style={{ color: '#1a1a2e' }}>404</h1>
          <p className="text-[0.8rem]" style={{ color: '#999' }}>Service not found</p>
          <Link href="/services" className="btn-ghost mt-4 text-[0.6rem]">← Back to Services</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 md:px-6 lg:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1100px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-[0.7rem] font-semibold" style={{ color: '#999' }}>
            <Link href="/services" className="hover:text-[#e91e8c] transition-colors">Services</Link>
            <span>→</span>
            <span style={{ color: '#1a1a2e' }}>{service.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              {service.imageUrl ? (
                <img src={imgUrl(service.imageUrl)} alt={service.name} className="w-full object-cover rounded-lg" style={{ aspectRatio: '4/3' }} />
              ) : (
                <div className="w-full flex items-center justify-center rounded-lg" style={{ aspectRatio: '4/3', background: '#f0f0f0' }}>
                  <span className="text-[3rem]">{service.icon}</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[2rem]">{service.icon}</span>
                <h1 className="font-display text-[2rem] lg:text-[2.5rem]" style={{ color: '#1a1a2e' }}>{service.name}</h1>
              </div>

              {service.shortDesc && (
                <p className="text-[1rem] leading-[1.8] mb-6 font-medium" style={{ color: '#e91e8c' }}>{service.shortDesc}</p>
              )}

              {service.description && (
                <div className="text-[0.9rem] leading-[1.9] mb-8" style={{ color: '#444' }}>
                  <p>{service.description}</p>
                </div>
              )}

              {/* Features */}
              {service.features?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#1a1a2e' }}>What We Offer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f8f8f8' }}>
                        <span style={{ color: '#e91e8c', fontSize: '1.2rem' }}>✓</span>
                        <span className="text-[0.82rem] font-medium" style={{ color: '#1a1a2e' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">
                  <span>Get a Quote</span><span>→</span>
                </Link>
                <Link href="/portfolio" className="btn-ghost">
                  <span>View Portfolio</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-[1.8rem] mb-8" style={{ color: '#1a1a2e' }}>Other Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedServices.map((rs: any) => (
                  <Link key={rs._id} href={`/services/${rs.slug}`}
                    className="group p-6 border rounded-lg transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    {rs.imageUrl && (
                      <img src={imgUrl(rs.imageUrl)} alt={rs.name} className="w-full h-32 object-cover rounded-md mb-4" />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[1.5rem]">{rs.icon}</span>
                      <h3 className="text-[1rem] font-bold group-hover:text-[#e91e8c] transition-colors" style={{ color: '#1a1a2e' }}>{rs.name}</h3>
                    </div>
                    <p className="text-[0.78rem]" style={{ color: '#666' }}>{rs.shortDesc}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
