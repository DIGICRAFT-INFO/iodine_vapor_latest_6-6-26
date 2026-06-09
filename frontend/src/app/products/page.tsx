'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroFromSlides from '@/components/sections/HeroFromSlides';
import { slidesApi, productsApi, prodCatsApi, imgUrl } from '@/lib/api';

export default function ProductsPage() {
  const [page, setPage]         = useState(1);
  const [catFilter, setCat]     = useState('');
  const [search, setSearch]     = useState('');

  const { data: slides = [] }   = useQuery({ queryKey: ['slides', 'portfolio'], queryFn: () => slidesApi.get('portfolio') });
  const { data: cats = [] }     = useQuery({ queryKey: ['prod-cats-pub'], queryFn: prodCatsApi.get });
  const { data, isLoading }     = useQuery({
    queryKey: ['products', { page, catFilter, search }],
    queryFn: () => productsApi.get({ page, limit: 12, category: catFilter || undefined, search: search || undefined }),
  });

  const products   = data?.products || [];
  const totalPages = data?.pages || 1;
  const total      = data?.total || 0;

  return (
    <>
      <Navbar />
      <HeroFromSlides slides={slides} page="portfolio" defaultTitle="PRODUCTS" defaultSub="Premium Photography Equipment & Prints" />

      <main className="py-[80px] px-4 md:px-6 lg:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Search + Filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products…"
              className="input-field w-full sm:w-64 py-2.5 text-[0.82rem]"
            />
            <button
              onClick={() => { setCat(''); setPage(1); }}
              className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase transition-all"
              style={{ borderRadius: '2px', background: !catFilter ? 'var(--c-gold)' : 'rgba(255,255,255,0.04)', color: !catFilter ? '#080808' : 'rgba(245,240,234,0.4)', border: `1px solid ${!catFilter ? 'var(--c-gold)' : 'rgba(255,255,255,0.08)'}` }}
            >
              All
            </button>
            {cats.map((cat: any) => (
              <button
                key={cat._id}
                onClick={() => { setCat(cat._id); setPage(1); }}
                className="px-4 py-2 font-mono text-[0.54rem] tracking-[0.15em] uppercase capitalize transition-all"
                style={{ borderRadius: '2px', background: catFilter === cat._id ? (cat.color || 'var(--c-gold)') : 'rgba(255,255,255,0.04)', color: catFilter === cat._id ? '#080808' : 'rgba(245,240,234,0.4)', border: `1px solid ${catFilter === cat._id ? (cat.color || 'var(--c-gold)') : 'rgba(255,255,255,0.08)'}` }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results count */}
          {total > 0 && (
            <p className="font-mono text-[0.5rem] tracking-[0.15em] uppercase mb-6" style={{ color: 'rgba(245,240,234,0.2)' }}>
              {total} {total === 1 ? 'product' : 'products'}
            </p>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="shimmer" style={{ height: '360px', borderRadius: '2px' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 font-mono text-[0.58rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.2)' }}>
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any, i: number) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block border overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                    style={{ borderColor: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}
                    data-hover
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      {product.images?.[0]?.url ? (
                        <img
                          src={imgUrl(product.images[0].url)}
                          alt={product.images[0].alt || product.name}
                          className="w-full h-full object-cover"
                          style={{ filter: 'grayscale(10%)', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.4s' }}
                          onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'; }}
                          onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; (e.target as HTMLImageElement).style.filter = 'grayscale(10%)'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#1a1a1a' }}>
                          <span className="font-mono text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(245,240,234,0.15)' }}>No Image</span>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.isFeatured && (
                          <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5" style={{ background: 'rgba(201,169,110,0.9)', color: '#080808', borderRadius: '2px' }}>Featured</span>
                        )}
                        {product.isBestSeller && (
                          <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5" style={{ background: 'rgba(74,222,128,0.9)', color: '#080808', borderRadius: '2px' }}>Best Seller</span>
                        )}
                        {!product.inStock && (
                          <span className="font-mono text-[0.46rem] tracking-[0.1em] uppercase px-2 py-0.5" style={{ background: 'rgba(214,58,47,0.9)', color: '#fff', borderRadius: '2px' }}>Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      {product.category?.name && (
                        <span className="font-mono text-[0.48rem] tracking-[0.15em] uppercase mb-1.5 block" style={{ color: product.category.color || 'var(--c-gold)' }}>
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="font-serif text-[1rem] text-cream-DEFAULT mb-2 leading-[1.3] group-hover:text-gold-DEFAULT transition-colors">
                        {product.name}
                      </h3>
                      {product.shortDesc && (
                        <p className="text-[0.75rem] leading-[1.6] mb-3 line-clamp-2" style={{ color: 'rgba(245,240,234,0.35)' }}>
                          {product.shortDesc}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        {product.price > 0 ? (
                          <>
                            <span className="font-display text-[1.3rem]" style={{ color: 'var(--c-cream)' }}>₹{product.price.toLocaleString()}</span>
                            {product.mrp > product.price && (
                              <span className="text-[0.75rem] line-through" style={{ color: 'rgba(245,240,234,0.25)' }}>₹{product.mrp.toLocaleString()}</span>
                            )}
                          </>
                        ) : (
                          <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase" style={{ color: 'var(--c-gold)' }}>Enquire</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-5 py-2.5 font-mono text-[0.56rem] tracking-[0.15em] uppercase border transition-all disabled:opacity-30"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(245,240,234,0.5)', borderRadius: '2px' }}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-10 h-10 font-mono text-[0.62rem] transition-all"
                  style={{ borderRadius: '2px', background: page === p ? 'var(--c-gold)' : 'rgba(255,255,255,0.04)', color: page === p ? '#080808' : 'rgba(245,240,234,0.4)', border: `1px solid ${page === p ? 'var(--c-gold)' : 'rgba(255,255,255,0.08)'}` }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-5 py-2.5 font-mono text-[0.56rem] tracking-[0.15em] uppercase border transition-all disabled:opacity-30"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(245,240,234,0.5)', borderRadius: '2px' }}>
                Next →
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
