require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const {
  User, ProductCategory, Product, Service, BlogCategory, Blog,
  FAQ, WorkshopCategory, Workshop, Portfolio, Setting, SEO, Testimonial, Slide,
} = require('../models');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  // ── USERS ──────────────────────────────────────────────────────────────────
  if (!await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL })) {
    await User.create({ name: 'Super Admin', email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@iodinevapor.com', password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123', role: 'superadmin' });
    console.log('✅ Superadmin created');
  }
  if (!await User.findOne({ email: process.env.ADMIN_EMAIL })) {
    await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL || 'admin@iodinevapor.com', password: process.env.ADMIN_PASSWORD || 'Admin@123', role: 'admin' });
    console.log('✅ Admin created');
  }

  // ── SETTINGS ───────────────────────────────────────────────────────────────
  const defaults = [
    { key: 'site_name',         value: 'Iodine Vapor',                          group: 'brand',   label: 'Site Name' },
    { key: 'site_tagline',      value: 'Visual Stories That Convert',            group: 'brand',   label: 'Tagline' },
    { key: 'site_logo',         value: '',                                       group: 'brand',   label: 'Logo URL' },
    { key: 'primary_color',     value: '#c9a96e',                                group: 'colors',  label: 'Primary (Gold)' },
    { key: 'secondary_color',   value: '#d63a2f',                                group: 'colors',  label: 'Secondary (Red)' },
    { key: 'accent_color',      value: '#8b5cf6',                                group: 'colors',  label: 'Accent (Purple)' },
    { key: 'bg_color',          value: '#080808',                                group: 'colors',  label: 'Background' },
    { key: 'text_color',        value: '#f5f0ea',                                group: 'colors',  label: 'Text Color' },
    { key: 'contact_email',     value: 'hello@iodinevapor.com',                  group: 'contact', label: 'Email' },
    { key: 'contact_phone',     value: '+91 98765 43210',                        group: 'contact', label: 'Phone' },
    { key: 'contact_address',   value: 'Pan-India Operations, Based in India',   group: 'contact', label: 'Address' },
    { key: 'social_instagram',  value: 'https://instagram.com/iodinevapor',      group: 'social',  label: 'Instagram' },
    { key: 'social_youtube',    value: '',                                        group: 'social',  label: 'YouTube' },
    { key: 'social_linkedin',   value: '',                                        group: 'social',  label: 'LinkedIn' },
    { key: 'social_behance',    value: '',                                        group: 'social',  label: 'Behance' },
    { key: 'footer_copy',       value: '© 2025 Iodine Vapor Photography. All rights reserved.', group: 'footer', label: 'Copyright' },
    { key: 'hero_eyebrow',      value: 'Pan-India Commercial Photography & Videography', group: 'hero', label: 'Hero Eyebrow Text' },
    { key: 'years_experience',  value: '12+',                                    group: 'stats',   label: 'Years Experience' },
    { key: 'projects_count',    value: '500+',                                   group: 'stats',   label: 'Projects' },
    { key: 'schools_count',     value: '100+',                                   group: 'stats',   label: 'Schools' },
    { key: 'cinemas_count',     value: '32',                                     group: 'stats',   label: 'INOX-PVR Cinemas' },
  ];
  for (const s of defaults) await Setting.findOneAndUpdate({ key: s.key }, s, { upsert: true });
  console.log('✅ Settings seeded');

  // ── SEO ────────────────────────────────────────────────────────────────────
  const seoPages = ['home','about','services','portfolio','workshops','blog','faq','contact','quote'];
  for (const page of seoPages) {
    await SEO.findOneAndUpdate({ page }, {
      metaTitle: `Iodine Vapor | ${page.charAt(0).toUpperCase() + page.slice(1)}`,
      metaDescription: 'Iodine Vapor — 12+ years of commercial photography and videography across India. Trusted by Asian Paints, Tanishq, Pepperfry, and more.',
      keywords: ['photography', 'videography', 'commercial photography India', 'brand films', 'iodine vapor'],
    }, { upsert: true });
  }
  console.log('✅ SEO seeded');

  // ── HOME SLIDES ────────────────────────────────────────────────────────────
  if (!await Slide.findOne({ page: 'home' })) {
    await Slide.insertMany([
      {
        page: 'home', order: 1, isActive: true, position: 'left',
        title:     { text: 'VISUAL STORIES THAT CONVERT', color: '#f5f0ea', fontSize: '7rem', fontWeight: '400', fontFamily: 'Bebas Neue', textAlign: 'left' },
        miniTitle: { text: 'Pan-India Commercial Photography', color: '#c9a96e', fontSize: '0.65rem', fontWeight: '400', textAlign: 'left', uppercase: true },
        subtitle:  { text: 'THAT CONVERT', color: '#c9a96e', fontSize: '7rem', fontWeight: '400', fontFamily: 'Bebas Neue', textAlign: 'left', italic: false },
        paragraph: { text: '12+ years of expertise in commercial photography and videography across India.', color: 'rgba(245,240,234,0.6)', fontSize: '1rem', fontWeight: '400', textAlign: 'left' },
        bgGradient: 'linear-gradient(135deg, #080808 0%, #141414 100%)',
        linkUrl: '/portfolio', linkText: 'View Portfolio',
      },
    ]);
    console.log('✅ Home slides seeded');
  }

  // ── PRODUCT CATEGORIES ─────────────────────────────────────────────────────
  if (!await ProductCategory.countDocuments()) {
    await ProductCategory.insertMany([
      { name: 'Commercial Photography', slug: 'commercial-photography', order: 1, color: '#c9a96e', isActive: true },
      { name: 'Videography',            slug: 'videography',            order: 2, color: '#d63a2f', isActive: true },
      { name: 'Architecture',           slug: 'architecture',           order: 3, color: '#8b5cf6', isActive: true },
      { name: 'Product Photography',    slug: 'product-photography',    order: 4, color: '#4ade80', isActive: true },
    ]);
    console.log('✅ Product categories seeded');
  }

  // ── SERVICES ───────────────────────────────────────────────────────────────
  if (!await Service.countDocuments()) {
    await Service.insertMany([
      { name: 'Commercial Photography', slug: 'commercial-photography', icon: '📸', order: 1, isActive: true, shortDesc: 'High-impact brand and product photography that stops the scroll.', features: ['Product Shoots', 'Brand Identity', 'Editorial'] },
      { name: 'Videography & Brand Films', slug: 'videography', icon: '🎬', order: 2, isActive: true, shortDesc: 'Cinematic brand films from concept to delivery.', features: ['Brand Films', 'Social Media Videos', 'Corporate Films'] },
      { name: 'Architecture & Interiors', slug: 'architecture', icon: '🏛️', order: 3, isActive: true, shortDesc: 'Precision architectural shoots for developers and architects.', features: ['Exteriors', 'Interiors', 'Real Estate'] },
      { name: 'School & Education', slug: 'school-education', icon: '🎓', order: 4, isActive: true, shortDesc: '100+ schools covered — annual days, campus documentation.', features: ['Annual Days', 'Campus Shoots', 'Admissions Brochures'] },
      { name: 'Aerial & Drone', slug: 'aerial-drone', icon: '🚁', order: 5, isActive: true, shortDesc: 'Licensed drone operations for real estate and events.', features: ['Real Estate', 'Events', 'Infrastructure'] },
      { name: 'Events & Corporate', slug: 'events-corporate', icon: '🎪', order: 6, isActive: true, shortDesc: 'Complete documentation for conferences, launches, award nights.', features: ['Conferences', 'Product Launches', 'Award Nights'] },
    ]);
    console.log('✅ Services seeded');
  }

  // ── BLOG CATEGORIES ────────────────────────────────────────────────────────
  if (!await BlogCategory.countDocuments()) {
    await BlogCategory.insertMany([
      { name: 'Lighting Tips',  slug: 'lighting-tips',  color: '#c9a96e', order: 1 },
      { name: 'Behind the Lens',slug: 'behind-the-lens',color: '#d63a2f', order: 2 },
      { name: 'Architecture',   slug: 'architecture',   color: '#8b5cf6', order: 3 },
      { name: 'Videography',    slug: 'videography',    color: '#4ade80', order: 4 },
      { name: 'Client Stories', slug: 'client-stories', color: '#60a5fa', order: 5 },
    ]);
    console.log('✅ Blog categories seeded');
  }

  // ── FAQs ───────────────────────────────────────────────────────────────────
  if (!await FAQ.countDocuments()) {
    await FAQ.insertMany([
      { question: 'Do you work pan-India?', answer: 'Yes! We operate across all major cities and states. Travel and logistics are factored into our project quotes.', order: 1 },
      { question: 'Are you GST and MSME registered?', answer: 'Yes, Iodine Vapor is GST registered and MSME certified. We provide proper invoices for all projects.', order: 2 },
      { question: 'What is your typical turnaround time?', answer: 'Standard photography deliveries take 5-7 business days. Video productions typically take 10-15 business days depending on complexity.', order: 3 },
      { question: 'Do you offer RAW files?', answer: 'We deliver professionally edited files. RAW files are available as an add-on service — please discuss during the quote stage.', order: 4 },
      { question: 'How do we get started?', answer: 'Fill in our Get a Quote form with your project details. We\'ll respond within 24 hours with a tailored proposal.', order: 5 },
      { question: 'What brands have you worked with?', answer: 'We\'ve partnered with Asian Paints, Tanishq, Toni & Guy, Pepperfry, INOX Air Products, SIAM Ply, and many more across verticals.', order: 6 },
    ]);
    console.log('✅ FAQs seeded');
  }

  // ── WORKSHOP CATEGORIES ────────────────────────────────────────────────────
  if (!await WorkshopCategory.countDocuments()) {
    await WorkshopCategory.insertMany([
      { name: 'Photography',  slug: 'photography',  color: '#c9a96e', order: 1 },
      { name: 'Videography',  slug: 'videography',  color: '#d63a2f', order: 2 },
      { name: 'Post-Processing', slug: 'post-processing', color: '#8b5cf6', order: 3 },
      { name: 'Business',     slug: 'business',     color: '#4ade80', order: 4 },
    ]);
    console.log('✅ Workshop categories seeded');
  }

  // ── PORTFOLIO ──────────────────────────────────────────────────────────────
  if (!await Portfolio.countDocuments()) {
    await Portfolio.insertMany([
      { title: 'Luxury Skyline, SIAM Ply', slug: 'siam-ply-skyline', category: 'architecture', imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600', client: 'SIAM Ply', year: '2024', isFeatured: true, order: 1, isActive: true },
      { title: 'Product Range, Asian Paints', slug: 'asian-paints', category: 'product', imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', client: 'Asian Paints', year: '2024', isFeatured: true, order: 2, isActive: true },
      { title: 'PVR Priya Cinema', slug: 'pvr-priya', category: 'architecture', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600', client: 'PVR INOX', year: '2023', isFeatured: true, order: 3, isActive: true },
      { title: 'Heritage Collection, Tanishq', slug: 'tanishq-heritage', category: 'product', imageUrl: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600', client: 'Tanishq', year: '2024', isFeatured: false, order: 4, isActive: true },
      { title: 'Brand Portrait, Toni & Guy', slug: 'toni-guy', category: 'brand', imageUrl: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?w=600', client: 'Toni & Guy', year: '2023', isFeatured: false, order: 5, isActive: true },
      { title: 'Annual Day, School Campaign', slug: 'school-annual', category: 'event', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600', client: 'Multiple Schools', year: '2024', isFeatured: false, order: 6, isActive: true },
    ]);
    console.log('✅ Portfolio seeded');
  }

  // ── TESTIMONIALS ───────────────────────────────────────────────────────────
  if (!await Testimonial.countDocuments()) {
    await Testimonial.insertMany([
      { name: 'Priya Sharma', company: 'Asian Paints', role: 'Marketing Head', content: 'Iodine Vapor completely transformed how we present our products. The attention to detail is extraordinary.', rating: 5, isActive: true, isFeatured: true, order: 1 },
      { name: 'Rahul Mehra', company: 'SIAM Ply', role: 'Brand Manager', content: 'Professional, creative, and always delivered on time. Our architectural shoots have never looked better.', rating: 5, isActive: true, isFeatured: true, order: 2 },
      { name: 'Anjali Nair', company: 'Pepperfry', role: 'Content Director', content: 'Working with Studio Jatin is always a pleasure. They understand our brand vision and execute it flawlessly.', rating: 5, isActive: true, isFeatured: true, order: 3 },
    ]);
    console.log('✅ Testimonials seeded');
  }

  console.log('\n🎉 Seed complete!');
  console.log('📧 Superadmin:', process.env.SUPER_ADMIN_EMAIL || 'superadmin@iodinevapor.com');
  console.log('🔑 Password:', process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
