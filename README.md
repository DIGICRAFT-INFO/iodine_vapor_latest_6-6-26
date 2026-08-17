# Iodine Vapor Photography — Fullstack Website

> **Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Express.js · MongoDB

---

## 🏗️ Project Structure

```
iodinevapor/
├── backend/                   ← Express.js REST API
│   ├── src/
│   │   ├── models/index.js    → 16 MongoDB models
│   │   ├── controllers/index.js → All API logic
│   │   ├── routes/            → Route files (auth, slides, products…)
│   │   ├── middleware/        → JWT auth, Multer upload
│   │   └── utils/seed.js      → DB seeder
│   └── public/uploads/        → All media files (images/videos/PDFs)
│
└── frontend/                  ← Next.js 14 App Router
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx           → Home (cinematic hero, all sections)
    │   │   ├── about/             → Our Story + testimonials
    │   │   ├── services/          → Services grid
    │   │   ├── portfolio/         → Portfolio masonry + lightbox
    │   │   ├── workshops/         → Workshops with registration
    │   │   ├── blog/              → Blog listing + detail
    │   │   ├── faq/               → FAQ accordion
    │   │   ├── contact/           → Contact form
    │   │   └── admin/             → Full CMS admin panel
    │   │       ├── login/
    │   │       ├── page.tsx (dashboard)
    │   │       ├── slides/        → CMS for all pages
    │   │       ├── products/      → Product CRUD
    │   │       ├── portfolio/     → Portfolio CRUD
    │   │       ├── services/      → Services CRUD
    │   │       ├── blogs/         → Blog CRUD
    │   │       ├── faqs/          → FAQ CRUD
    │   │       ├── workshops/     → Workshop CRUD
    │   │       ├── enquiries/     → Enquiry management
    │   │       ├── media/         → Media library
    │   │       ├── settings/      → Site settings + colors
    │   │       ├── seo/           → SEO manager
    │   │       └── users/         → Admin user management
    │   ├── components/
    │   │   ├── layout/            → Navbar, Footer
    │   │   ├── sections/          → HeroFromSlides
    │   │   └── admin/             → AdminComponents (reusable)
    │   └── lib/
    │       ├── api.ts             → All API calls
    │       └── auth.tsx           → Auth context
    └── tailwind.config.js
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend

# Setup env
cp .env.example .env
# Edit MONGODB_URI to your MongoDB connection string

# Install
npm install

# Create upload directories
mkdir -p public/uploads

# Seed database (creates both admin accounts + sample data)
npm run seed

# Start dev server (port 5000)
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Setup env
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
# NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000

# Install
npm install

# Start dev server (port 3000)
npm run dev
```

---

## 🔐 Admin Access

| Role        | Email                         | Password        |
|-------------|-------------------------------|-----------------|
| Superadmin  | superadmin@iodinevapor.com   | SuperAdmin@123  |
| Admin       | admin@iodinevapor.com        | Admin@123       |

Admin URL: **http://localhost:3000/admin**

---

## 🎨 Design Features

- **Cinematic dark aesthetic** — inspired by infocustemplate.framer.website
- **Custom magnetic cursor** with ring animation
- **Film noise overlay** + scanlines for depth
- **Bebas Neue + DM Serif Display + Syne + Space Mono** — editorial typography
- **Hero panels** — 4 split panels animate up on load
- **Drag-to-scroll reel** — horizontal portfolio scroll
- **Framer Motion** scroll reveals on all sections
- **Counter animations** — numbers count up on scroll into view
- **Marquee divider** — outlined giant typography
- **Masonry portfolio grid** with lightbox
- **Ticker** — scrolling service tags in hero

---

## 🛠️ Admin CMS Features

| Feature | Description |
|---------|-------------|
| **Slides / CMS** | CRUD slides for every page with rich text styling |
| **Text Style Editor** | Color, font-size, font-weight, font-family, align, italic, uppercase |
| **Position Picker** | 9-position visual grid (left, center, right, corners, top/bottom) |
| **Background Control** | Solid color + CSS gradient + overlay opacity |
| **Media Library** | Upload images/videos/PDFs, each gets unique UUID |
| **Color Manager** | Live preview of all brand colors |
| **SEO Manager** | Meta title, description, keywords, OG image per page + SERP preview |
| **Portfolio CRUD** | Category filter, featured flag, drag-to-reorder |
| **Products CRUD** | Multi-image, videos, PDFs, categories, specs, tags |
| **Blog CRUD** | Categories, rich content, publish toggle, featured flag |
| **Workshop CRUD** | Categories, registration system, date/price/location |
| **Services CRUD** | Icon, features list, order control |
| **Enquiries** | Status management (new/read/replied/closed), internal notes |
| **2 Admin Roles** | Superadmin + Admin with role-based access control |

---

## 📦 Models (MongoDB)

| Model | Description |
|-------|-------------|
| User | Admin + Superadmin with JWT auth |
| Slide | CMS content for all 11 pages with text styles + position |
| ProductCategory | Product categories with color |
| Product | Products with images, videos, PDFs, specs, tags |
| Service | Services with icon, features |
| BlogCategory | Blog categories with color |
| Blog | Blog posts with category, cover image, rich content |
| FAQ | FAQ with categories and ordering |
| WorkshopCategory | Workshop categories |
| Workshop | Workshops with registration system |
| Portfolio | Portfolio items with category filter |
| Enquiry | Contact/quote/workshop enquiries with status |
| Media | All uploaded files with unique IDs |
| Setting | Key-value site configuration |
| SEO | Per-page SEO settings |
| Testimonial | Client testimonials |

---

## 🌐 Pages

| Route | Page |
|-------|------|
| `/` | Home — cinematic hero, reel, about, services, portfolio, workshops, blog, contact |
| `/about` | Our Story + testimonials |
| `/services` | Services grid |
| `/portfolio` | Portfolio with category filter + lightbox |
| `/workshops` | Workshops listing + registration |
| `/workshops/[slug]` | Workshop detail |
| `/blog` | Blog listing with category filter |
| `/blog/[slug]` | Blog post detail |
| `/faq` | FAQ accordion |
| `/contact` | Contact form |

---
