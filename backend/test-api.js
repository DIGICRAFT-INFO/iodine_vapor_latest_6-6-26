/**
 * Backend API Test Suite
 * Run: node test-api.js
 */
const http = require('http');

const BASE = 'http://localhost:5000/api/v1';
let TOKEN = '';
const results = [];
const bugs = [];

function req(method, path, body, headers = {}) {
  return new Promise((resolve) => {
    const url = path.startsWith('http') ? new URL(path) : new URL(BASE + path);
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        ...headers,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const r = http.request(opts, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(raw); } catch {}
        resolve({ status: res.statusCode, json, raw });
      });
    });
    r.on('error', (e) => resolve({ status: 0, json: null, raw: e.message }));
    if (data) r.write(data);
    r.end();
  });
}

async function test(label, method, path, body, expectStatus = 200, noAuth = false) {
  const savedToken = TOKEN;
  if (noAuth) TOKEN = '';
  const res = await req(method, path, body);
  if (noAuth) TOKEN = savedToken;
  const pass = res.status === expectStatus;
  results.push({ pass, label, got: res.status, expected: expectStatus });
  if (!pass) bugs.push({ label, got: res.status, expected: expectStatus });
  const icon = pass ? '✅' : '❌';
  console.log(`  ${icon} ${res.status} ${method} ${label}`);
  return res;
}

async function run() {
  console.log('\n════════════════════════════════════════════════');
  console.log('           IODINE VAPOR — BACKEND API TEST');
  console.log('════════════════════════════════════════════════\n');

  // ── HEALTH ──────────────────────────────────────────────────────────
  console.log('[ HEALTH ]');
  await test('GET /api/health', 'GET', 'http://localhost:5000/api/health');

  // ── AUTH ─────────────────────────────────────────────────────────────
  console.log('\n[ AUTH ]');
  const loginRes = await req('POST', '/auth/login', { email: 'superadmin@iodinevapor.com', password: 'SuperAdmin@123' });
  if (loginRes.status === 200 && loginRes.json?.token) {
    TOKEN = loginRes.json.token;
    console.log(`  ✅ 200 POST /auth/login | role=${loginRes.json.user?.role}`);
    results.push({ pass: true, label: 'POST /auth/login', got: 200, expected: 200 });
  } else {
    console.log(`  ❌ ${loginRes.status} POST /auth/login — CANNOT CONTINUE AUTH TESTS`);
    results.push({ pass: false, label: 'POST /auth/login', got: loginRes.status, expected: 200 });
    bugs.push({ label: 'POST /auth/login', got: loginRes.status, expected: 200 });
  }

  await test('POST /auth/login wrong-pw → 401', 'POST', '/auth/login', { email: 'superadmin@iodinevapor.com', password: 'WRONG' }, 401);
  await test('GET /auth/me', 'GET', '/auth/me');
  await test('GET /auth/me no-token → 401', 'GET', '/auth/me', null, 401, true);
  await test('GET /auth/dashboard', 'GET', '/auth/dashboard');
  await test('GET /auth/admins', 'GET', '/auth/admins');
  await test('PUT /auth/change-password (same pw)', 'PUT', '/auth/change-password', { currentPassword: 'SuperAdmin@123', newPassword: 'SuperAdmin@123' });

  // ── PUBLIC GET ENDPOINTS ─────────────────────────────────────────────
  console.log('\n[ PUBLIC GET ENDPOINTS ]');
  const publicGet = [
    ['/slides', 'GET /slides'],
    ['/slides?page=home', 'GET /slides?page=home'],
    ['/categories', 'GET /categories'],
    ['/products', 'GET /products'],
    ['/products?page=1&limit=5', 'GET /products (paginated)'],
    ['/services', 'GET /services'],
    ['/blogs', 'GET /blogs'],
    ['/blog-categories', 'GET /blog-categories'],
    ['/faqs', 'GET /faqs'],
    ['/workshops', 'GET /workshops'],
    ['/workshop-categories', 'GET /workshop-categories'],
    ['/portfolio', 'GET /portfolio'],
    ['/settings', 'GET /settings'],
    ['/seo/home', 'GET /seo/home'],
    ['/testimonials', 'GET /testimonials'],
    ['/showcase-videos', 'GET /showcase-videos'],
    ['/brands', 'GET /brands'],
  ];
  for (const [path, label] of publicGet) {
    await test(label, 'GET', path, null, 200, true);
  }

  // ── PROTECTED GET ENDPOINTS ──────────────────────────────────────────
  console.log('\n[ PROTECTED /admin GET ENDPOINTS ]');
  const adminGet = [
    '/slides/admin', '/categories/admin', '/products/admin',
    '/services/admin', '/blogs/admin', '/blog-categories/admin',
    '/faqs/admin', '/workshops/admin', '/workshop-categories/admin',
    '/portfolio/admin', '/enquiries', '/media',
    '/seo', '/testimonials/admin', '/showcase-videos/admin', '/brands/admin',
  ];
  for (const path of adminGet) {
    await test(`GET ${path}`, 'GET', path);
  }
  // Protected without token → 401
  await test('GET /enquiries no-token → 401', 'GET', '/enquiries', null, 401, true);
  await test('GET /media no-token → 401', 'GET', '/media', null, 401, true);

  // ── CRUD: SERVICES ────────────────────────────────────────────────────
  console.log('\n[ CRUD: SERVICES ]');
  let r = await test('POST /services', 'POST', '/services', { name: '__TestSvc__', category: 'Other', shortDesc: 'test', isActive: false }, 201);
  if (r.json?.service?._id) {
    const id = r.json.service._id;
    await test(`PUT /services/${id}`, 'PUT', `/services/${id}`, { shortDesc: 'updated' });
    await test(`DELETE /services/${id}`, 'DELETE', `/services/${id}`);
  }

  // ── CRUD: PRODUCT CATEGORIES ──────────────────────────────────────────
  console.log('\n[ CRUD: PRODUCT CATEGORIES ]');
  r = await test('POST /categories', 'POST', '/categories', { name: '__TestProdCat__', isActive: false }, 201);
  if (r.json?.category?._id) {
    const id = r.json.category._id;
    await test(`PUT /categories/${id}`, 'PUT', `/categories/${id}`, { name: '__TestProdCatUpd__' });
    await test(`DELETE /categories/${id}`, 'DELETE', `/categories/${id}`);
  }

  // ── CRUD: BLOG CATEGORIES ─────────────────────────────────────────────
  console.log('\n[ CRUD: BLOG CATEGORIES ]');
  r = await test('POST /blog-categories', 'POST', '/blog-categories', { name: '__TestBlogCat__', isActive: false }, 201);
  if (r.json?.category?._id) {
    const id = r.json.category._id;
    await test(`PUT /blog-categories/${id}`, 'PUT', `/blog-categories/${id}`, { name: '__TestBlogCatUpd__' });
    await test(`DELETE /blog-categories/${id}`, 'DELETE', `/blog-categories/${id}`);
  }

  // ── CRUD: BLOGS ───────────────────────────────────────────────────────
  console.log('\n[ CRUD: BLOGS ]');
  r = await test('POST /blogs', 'POST', '/blogs', { title: '__TestBlog__', content: 'test content', isPublished: false }, 201);
  if (r.json?.blog?._id) {
    const id = r.json.blog._id;
    await test(`PUT /blogs/${id}`, 'PUT', `/blogs/${id}`, { title: '__TestBlogUpd__' });
    // GET by slug (not published, so should 404 on public)
    const slug = r.json.blog.slug;
    await test(`GET /blogs/${slug} unpublished → 404`, 'GET', `/blogs/${slug}`, null, 404, true);
    await test(`DELETE /blogs/${id}`, 'DELETE', `/blogs/${id}`);
  }

  // ── CRUD: FAQs ────────────────────────────────────────────────────────
  console.log('\n[ CRUD: FAQs ]');
  r = await test('POST /faqs', 'POST', '/faqs', { question: 'Test Q?', answer: 'Test A', isActive: false }, 201);
  if (r.json?.faq?._id) {
    const id = r.json.faq._id;
    await test(`PUT /faqs/${id}`, 'PUT', `/faqs/${id}`, { answer: 'Updated A' });
    await test(`DELETE /faqs/${id}`, 'DELETE', `/faqs/${id}`);
  }

  // ── CRUD: WORKSHOP CATEGORIES ─────────────────────────────────────────
  console.log('\n[ CRUD: WORKSHOP CATEGORIES ]');
  r = await test('POST /workshop-categories', 'POST', '/workshop-categories', { name: '__TestWsCat__', isActive: false }, 201);
  if (r.json?.category?._id) {
    const id = r.json.category._id;
    await test(`PUT /workshop-categories/${id}`, 'PUT', `/workshop-categories/${id}`, { name: '__TestWsCatUpd__' });
    await test(`DELETE /workshop-categories/${id}`, 'DELETE', `/workshop-categories/${id}`);
  }

  // ── CRUD: WORKSHOPS ────────────────────────────────────────────────────
  console.log('\n[ CRUD: WORKSHOPS ]');
  r = await test('POST /workshops', 'POST', '/workshops', { title: '__TestWorkshop__', description: 'test', isActive: false }, 201);
  if (r.json?.workshop?._id) {
    const id = r.json.workshop._id;
    const slug = r.json.workshop.slug;
    await test(`PUT /workshops/${id}`, 'PUT', `/workshops/${id}`, { description: 'updated' });
    // GET by slug (inactive → 404)
    await test(`GET /workshops/${slug} inactive → 404`, 'GET', `/workshops/${slug}`, null, 404, true);
    await test(`DELETE /workshops/${id}`, 'DELETE', `/workshops/${id}`);
  }

  // ── CRUD: PORTFOLIO ────────────────────────────────────────────────────
  console.log('\n[ CRUD: PORTFOLIO ]');
  r = await test('POST /portfolio', 'POST', '/portfolio', { title: '__TestPort__', category: 'Test', imageUrl: '/test.jpg', isActive: false }, 201);
  if (r.json?.item?._id) {
    const id = r.json.item._id;
    await test(`PUT /portfolio/${id}`, 'PUT', `/portfolio/${id}`, { title: '__TestPortUpd__' });
    await test(`DELETE /portfolio/${id}`, 'DELETE', `/portfolio/${id}`);
  }

  // ── CRUD: TESTIMONIALS ─────────────────────────────────────────────────
  console.log('\n[ CRUD: TESTIMONIALS ]');
  r = await test('POST /testimonials', 'POST', '/testimonials', { name: '__TestTesti__', content: 'great', rating: 5 }, 201);
  if (r.json?.testimonial?._id) {
    const id = r.json.testimonial._id;
    await test(`PUT /testimonials/${id}`, 'PUT', `/testimonials/${id}`, { rating: 4 });
    await test(`DELETE /testimonials/${id}`, 'DELETE', `/testimonials/${id}`);
  }

  // ── CRUD: BRANDS ──────────────────────────────────────────────────────
  console.log('\n[ CRUD: BRANDS ]');
  r = await test('POST /brands', 'POST', '/brands', { name: '__TestBrand__', isActive: false }, 201);
  if (r.json?.brand?._id) {
    const id = r.json.brand._id;
    await test(`PUT /brands/${id}`, 'PUT', `/brands/${id}`, { name: '__TestBrandUpd__' });
    await test('PUT /brands/reorder', 'PUT', '/brands/reorder', { orders: [{ id, order: 5 }] });
    await test(`DELETE /brands/${id}`, 'DELETE', `/brands/${id}`);
  }

  // ── CRUD: SHOWCASE VIDEOS ─────────────────────────────────────────────
  console.log('\n[ CRUD: SHOWCASE VIDEOS ]');
  r = await test('POST /showcase-videos', 'POST', '/showcase-videos', { title: '__TestVid__', videoUrl: '/test.mp4', isActive: false }, 201);
  if (r.json?.video?._id) {
    const id = r.json.video._id;
    await test(`PUT /showcase-videos/${id}`, 'PUT', `/showcase-videos/${id}`, { title: '__TestVidUpd__' });
    await test(`DELETE /showcase-videos/${id}`, 'DELETE', `/showcase-videos/${id}`);
  }

  // ── CRUD: ENQUIRIES ───────────────────────────────────────────────────
  console.log('\n[ CRUD: ENQUIRIES ]');
  r = await test('POST /enquiries (public, no auth)', 'POST', '/enquiries', { name: 'Test User', email: 'test@test.com', message: 'API test', type: 'contact' }, 201, true);
  if (r.json?.enquiry?._id) {
    const id = r.json.enquiry._id;
    await test(`PUT /enquiries/${id} (status update)`, 'PUT', `/enquiries/${id}`, { status: 'read' });
    await test(`DELETE /enquiries/${id}`, 'DELETE', `/enquiries/${id}`);
  }

  // ── SETTINGS ──────────────────────────────────────────────────────────
  console.log('\n[ SETTINGS ]');
  await test('POST /settings (upsert)', 'POST', '/settings', { key: '__test_key__', value: 'test_val', group: 'general', label: 'Test' });
  await test('POST /settings/bulk', 'POST', '/settings/bulk', { settings: [{ key: '__test_k2__', value: 'v2', group: 'general', label: 'T2' }] });

  // ── SEO ───────────────────────────────────────────────────────────────
  console.log('\n[ SEO ]');
  await test('PUT /seo/home', 'PUT', '/seo/home', { metaTitle: 'Iodine Vapor | Commercial Photography India', metaDescription: 'Best commercial photography services across India.' });
  await test('GET /seo/home (public)', 'GET', '/seo/home', null, 200, true);

  // ── SLIDES REORDER ────────────────────────────────────────────────────
  console.log('\n[ SLIDES REORDER ]');
  const slidesRes = await req('GET', '/slides/admin');
  if (slidesRes.json?.slides?.length > 0) {
    const s = slidesRes.json.slides[0];
    await test('PUT /slides/reorder', 'PUT', '/slides/reorder', { orders: [{ id: s._id, order: s.order }] });
  } else {
    console.log('  ⏭  No slides to reorder');
  }

  // ── 404 ───────────────────────────────────────────────────────────────
  console.log('\n[ 404 HANDLING ]');
  await test('GET /nonexistent-route → 404', 'GET', '/nonexistent-xyz', null, 404, true);

  // ── SUMMARY ───────────────────────────────────────────────────────────
  const pass = results.filter((r) => r.pass).length;
  const fail = results.filter((r) => !r.pass).length;
  console.log('\n════════════════════════════════════════════════');
  console.log(`  TOTAL: ${pass + fail}   ✅ PASS: ${pass}   ❌ FAIL: ${fail}`);
  console.log('════════════════════════════════════════════════');

  if (bugs.length > 0) {
    console.log('\n  🐛 BUGS FOUND:');
    bugs.forEach((b) => console.log(`     ❌ ${b.label} — got ${b.got}, expected ${b.expected}`));
  } else {
    console.log('\n  🎉 All tests passed! No bugs found.');
  }
  console.log('');

  process.exit(fail > 0 ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });
