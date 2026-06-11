'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CopyrightPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 md:px-12" style={{ background: 'var(--c-bg)' }}>
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-display text-cream-DEFAULT mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Copyright & Legal
          </h1>

          <div className="space-y-8 text-[0.9rem] leading-[1.9]" style={{ color: 'rgba(0,0,0,0.6)' }}>
            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Copyright Notice</h2>
              <p>© {new Date().getFullYear()} Iodine Vapor Photography. All rights reserved.</p>
              <p className="mt-2">All content on this website, including but not limited to photographs, videos, graphics, text, logos, and design elements, are the intellectual property of Iodine Vapor Photography and are protected under Indian Copyright Act, 1957 and international copyright laws.</p>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Ownership of Content</h2>
              <p>Unless otherwise stated, all visual content (photographs, videos, brand films) displayed on this website remains the exclusive property of Iodine Vapor Photography. Client work showcased in the portfolio section has been published with explicit consent from respective clients.</p>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Prohibited Use</h2>
              <p>You may NOT, without prior written permission from Iodine Vapor Photography:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Reproduce, distribute, or republish any content from this website</li>
                <li>Use any photographs or videos for commercial purposes</li>
                <li>Modify, adapt, or create derivative works from our content</li>
                <li>Download, scrape, or extract content using automated tools</li>
                <li>Use our brand name, logo, or visual identity without authorization</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Trademark</h2>
              <p>"Iodine Vapor", the Iodine Vapor logo, and associated brand elements are trademarks of Iodine Vapor Photography. Unauthorized use of these marks is strictly prohibited.</p>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Client Work & Portfolio</h2>
              <p>Photographs and videos displayed in our portfolio are showcased for promotional purposes. The intellectual property of commissioned work is subject to the terms agreed upon in individual client contracts. Unless a full copyright transfer is agreed, Iodine Vapor retains the right to use client work for self-promotion and portfolio display.</p>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">DMCA & Takedown Requests</h2>
              <p>If you believe any content on this website infringes upon your copyright, please contact us with:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Identification of the copyrighted work</li>
                <li>URL of the infringing content on our website</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief</li>
              </ul>
              <p className="mt-3">Send takedown requests to: <strong style={{ color: 'var(--c-cream)' }}>legal@iodinevapor.com</strong></p>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Licensing</h2>
              <p>For licensing inquiries regarding our photographs, videos, or any creative content, please contact us directly. We offer various licensing options including:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Single-use editorial license</li>
                <li>Commercial use license</li>
                <li>Exclusive rights transfer</li>
                <li>Extended digital usage rights</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Website Terms</h2>
              <p>This website is built and maintained by Iodine Vapor. The website design, code, and structure are proprietary. Use of this website constitutes acceptance of these terms.</p>
            </section>

            <section>
              <h2 className="font-display text-[1.5rem] text-cream-DEFAULT mb-3">Business Registration</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="p-4 border" style={{ borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }}>
                  <p className="font-mono text-[0.55rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--c-gold)' }}>GST Registered</p>
                  <p className="text-[0.85rem]" style={{ color: 'var(--c-cream)' }}>Certified business entity</p>
                </div>
                <div className="p-4 border" style={{ borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }}>
                  <p className="font-mono text-[0.55rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--c-gold)' }}>MSME Certified</p>
                  <p className="text-[0.85rem]" style={{ color: 'var(--c-cream)' }}>Registered micro enterprise</p>
                </div>
                <div className="p-4 border" style={{ borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }}>
                  <p className="font-mono text-[0.55rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--c-gold)' }}>Nikon NPS Member</p>
                  <p className="text-[0.85rem]" style={{ color: 'var(--c-cream)' }}>Professional Services member 5+ years</p>
                </div>
                <div className="p-4 border" style={{ borderColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }}>
                  <p className="font-mono text-[0.55rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--c-gold)' }}>Pan-India</p>
                  <p className="text-[0.85rem]" style={{ color: 'var(--c-cream)' }}>Services across all states</p>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <p className="text-[0.8rem]" style={{ color: 'rgba(0,0,0,0.4)' }}>
                Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
