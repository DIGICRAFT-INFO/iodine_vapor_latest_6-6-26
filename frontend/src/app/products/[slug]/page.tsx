'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { productsApi, imgUrl } from '@/lib/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getOne(slug as string),
    enabled: !!slug,
  });

  if (isLoading) {
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

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: 'var(--c-bg)' }}>
          <h1 className="font-display text-[3rem] text-cream-DEFAULT">404</h1>
          <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.3)' }}>Product not found</p>
          <Link href="/products" className="btn-ghost mt-4 text-[0.6rem]" data-hover>← Back to Products</Link>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images || [];
  const currentImg = images[selectedImage];

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 md:px-6 lg:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 font-mono text-[0.52rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(245,240,234,0.3)' }}>
            <Link href="/products" className="transition-colors hover:text-gold-DEFAULT" data-hover>Products</Link>
            <span>→</span>
            {product.category?.name && (
              <>
                <span style={{ color: product.category.color || 'var(--c-gold)' }}>{product.category.name}</span>
                <span>→</span>
              </>
            )}
            <span style={{ color: 'var(--c-cream)' }}>{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '1/1', borderRadius: '2px', background: '#1a1a1a' }}>
                {currentImg?.url ? (
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={imgUrl(currentImg.url)}
                    alt={currentImg.alt || product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.15)' }}>No Image</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isFeatured && (
                    <span className="font-mono text-[0.5rem] tracking-[0.1em] uppercase px-2.5 py-1" style={{ background: 'rgba(201,169,110,0.9)', color: '#080808', borderRadius: '2px' }}>Featured</span>
                  )}
                  {product.isBestSeller && (
                    <span className="font-mono text-[0.5rem] tracking-[0.1em] uppercase px-2.5 py-1" style={{ background: 'rgba(74,222,128,0.9)', color: '#080808', borderRadius: '2px' }}>Best Seller</span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img: any, i: number) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className="flex-shrink-0 overflow-hidden transition-all"
                      style={{ width: '72px', height: '72px', borderRadius: '2px', border: `2px solid ${i === selectedImage ? 'var(--c-gold)' : 'rgba(255,255,255,0.07)'}`, opacity: i === selectedImage ? 1 : 0.6 }}>
                      <img src={imgUrl(img.url)} alt={img.alt || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.category?.name && (
                <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase mb-3 block" style={{ color: product.category.color || 'var(--c-gold)' }}>
                  {product.category.name}
                </span>
              )}

              <h1 className="font-display text-cream-DEFAULT leading-[0.92] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                {product.name}
              </h1>

              {product.shortDesc && (
                <p className="text-[0.9rem] leading-[1.8] mb-6" style={{ color: 'rgba(245,240,234,0.5)' }}>
                  {product.shortDesc}
                </p>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                {product.price > 0 ? (
                  <>
                    <span className="font-display text-[2.5rem]" style={{ color: 'var(--c-cream)' }}>₹{product.price.toLocaleString()}</span>
                    {product.mrp > product.price && (
                      <>
                        <span className="text-[1rem] line-through" style={{ color: 'rgba(245,240,234,0.25)' }}>₹{product.mrp.toLocaleString()}</span>
                        <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase px-2.5 py-1" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: '2px' }}>
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: 'var(--c-gold)' }}>Contact for Price</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full" style={{ background: product.inStock ? '#4ade80' : '#d63a2f' }} />
                <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase" style={{ color: product.inStock ? '#4ade80' : '#d63a2f' }}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.sku && (
                  <span className="font-mono text-[0.5rem] tracking-[0.1em]" style={{ color: 'rgba(245,240,234,0.2)' }}>SKU: {product.sku}</span>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/contact" className="btn-primary" data-hover>
                  <span>Enquire Now</span><span>→</span>
                </Link>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <h3 className="font-mono text-[0.58rem] tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(245,240,234,0.25)' }}>Description</h3>
                  <div className="text-[0.85rem] leading-[1.85]" style={{ color: 'rgba(245,240,234,0.5)' }}>
                    {product.description}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications?.length > 0 && (
                <div className="mb-8 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <h3 className="font-mono text-[0.58rem] tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(245,240,234,0.25)' }}>Specifications</h3>
                  <div className="space-y-2">
                    {product.specifications.map((spec: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <span className="text-[0.8rem]" style={{ color: 'rgba(245,240,234,0.4)' }}>{spec.key}</span>
                        <span className="text-[0.8rem] font-medium" style={{ color: 'var(--c-cream)' }}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span key={tag} className="font-mono text-[0.5rem] tracking-[0.12em] uppercase px-3 py-1.5 border" style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(245,240,234,0.35)', borderRadius: '2px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
