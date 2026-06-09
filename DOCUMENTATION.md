# Iodine Vapor — Complete Website Documentation

## Overview

Iodine Vapor is a full-stack photography & videography business website with a powerful CMS (Content Management System). Every piece of content on the public website is controlled from the Admin Panel — no code changes needed.

---

## 🔑 FOR CEO / BUSINESS OWNER

### What You Can Control

| What | Where to Change | Result |
|------|----------------|--------|
| Hero images & text on every page | Admin → Slides/CMS | Website hero sections update instantly |
| Company stats (12+ years, 500+ projects) | Admin → Site Settings → Stats | Homepage & about page stats update |
| Contact info (email, phone, address) | Admin → Site Settings → Contact | Contact page & homepage update |
| About us text & image | Admin → Site Settings → About | About sections on all pages update |
| Client brand list | Admin → Site Settings → About → Client Brands | Brand tags on about sections |
| Social media links | Admin → Site Settings → Social | Footer social icons update |
| Logo & site name | Admin → Site Settings → Brand | Navbar & footer update |
| SEO (Google search appearance) | Admin → SEO Manager | Per-page meta titles & descriptions |

### Key Business Pages

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | First impression — hero, services, portfolio, testimonials |
| About | `/about` | Company story, client brands, testimonials |
| Services | `/services` | What you offer — from Services CRUD |
| Products | `/products` | Equipment/prints for sale — from Products CRUD |
| Portfolio | `/portfolio` | Visual showcase — from Portfolio CRUD |
| Workshops | `/workshops` | Photography workshops — from Workshops CRUD |
| Blog | `/blog` | Articles & insights — from Blog CRUD |
| FAQ | `/faq` | Common questions — from FAQs CRUD |
| Contact | `/contact` | Enquiry form + contact details |

### How Content Gets Updated

1. Login to Admin Panel (`/admin`)
2. Go to the relevant section (e.g., Portfolio)
3. Add/Edit/Delete items
4. Changes appear on the website immediately (no deploy needed)

---

## 👤 FOR ADMIN USER (Content Manager)

### Admin Panel Access

- URL: `http://yourdomain.com/admin`
- Login with email + password
- Roles: `admin` (content management) / `superadmin` (full access + user management)

### Content Management Sections

#### 1. Slides / CMS (Page Heroes)
Controls the hero section on every page of the website.

**Pages available:** home, about, services, portfolio, workshops, blog, faq, contact, quote, navbar, footer

**Per slide you can set:**
- **Mini Title** — small eyebrow text (e.g., "Pan-India Photography")
- **Title** — big heading text
- **Subtitle** — secondary heading
- **Paragraph** — description text
- **Each text field has:** color, font size, font weight, font family, text align, italic, uppercase
- **Content Position** — 9-point grid (top-left, center, bottom-right, etc.)
- **Background Image** — upload or pick from media library
- **BG Color / BG Gradient** — solid color or CSS gradient
- **Overlay Opacity** — 0 to 1 (darkens image for text readability)
- **Link URL + Link Text** — optional CTA button
- **Order** — display order when multiple slides exist
- **Active** — toggle visibility

**Desktop behavior:** Multiple slides for same page = side-by-side panels
**Mobile behavior:** Single slide visible, auto-advances every 5 sec, swipeable

#### 2. Services
- Name, Icon (emoji), Short Description, Full Description
- Image, Features list
- Order & Active status
- Shows on: Homepage services section, Services page, Contact form dropdown

#### 3. Portfolio
- Title, Category, Image, Description
- Client name, Year, Featured flag
- Shows on: Homepage reel, Portfolio page (with category filter + lightbox)

#### 4. Products
- Name, Category, Short/Full Description
- Multiple images, Price/MRP, SKU
- In Stock, Featured, Best Seller flags
- Tags, Specifications (key-value pairs)
- SEO fields (meta title, meta description)
- Shows on: Products page (grid + search + filter), Product detail page

#### 5. Blog
- Title, Category, Content (full article)
- Cover Image, Excerpt, Author
- Tags, Published/Draft status
- Featured flag, SEO fields
- Shows on: Homepage blog section, Blog page (grid + pagination), Blog detail page

#### 6. FAQs
- Question, Answer, Category
- Order & Active status
- Shows on: FAQ page (accordion grouped by category)

#### 7. Workshops
- Title, Description, Content
- Cover Image, Date, Duration, Location
- Seats, Price (or Free), Online flag
- Featured, Active, Category
- Registration (users can register)
- Shows on: Homepage workshops section, Workshops page

#### 8. Testimonials
- Name, Company, Role, Content
- Rating (1-5 stars), Image
- Featured, Active, Order
- Shows on: About page testimonials section

#### 9. Enquiries
- View all form submissions (contact, quote, workshop registrations)
- Update status: new → read → replied → closed
- Add notes
- Delete enquiries

#### 10. Media Library
- Upload images/videos/PDFs
- Organize by folder
- Used across: Slides, Products, Portfolio, Blogs, Settings

#### 11. Site Settings
Groups: Brand, About, Colors, Contact, Social, Stats, Footer

| Key | Purpose |
|-----|---------|
| `site_name` | Website name in navbar/footer |
| `site_tagline` | Footer subtitle |
| `site_logo` | Navbar logo image |
| `hero_eyebrow` | Default hero eyebrow text |
| `about_text` | About section paragraph |
| `about_image` | About section image |
| `client_brands` | Comma-separated client names |
| `contact_email` | Email shown on contact page |
| `contact_phone` | Phone shown on contact page |
| `contact_address` | Address shown on contact page |
| `social_instagram/youtube/linkedin/behance` | Social links in footer |
| `years_experience` | Stat: "12+" |
| `projects_count` | Stat: "500+" |
| `schools_count` | Stat: "100+" |
| `cinemas_count` | Stat: "32" |
| `footer_copy` | Footer copyright text |
| `primary/secondary/accent/bg/text_color` | Theme colors |

#### 12. SEO Manager
- Per-page meta configuration
- Meta Title, Meta Description, Keywords
- OG Image, Canonical URL

#### 13. Admin Users (Superadmin only)
- Create new admins
- Toggle active/inactive
- View all admin accounts

---

## 🛠️ FOR DEVELOPER / CLIENT (Technical)

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS, CSS Custom Properties, Framer Motion |
| State/Data | @tanstack/react-query, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (HttpOnly cookies + localStorage) |
| File Upload | Multer → local disk storage |
| Security | Helmet, CORS, Rate Limiting, Mongo Sanitize |

### Project Structure

```
iodinevapor-fixed/
├── backend/
│   ├── src/
│   │   ├── controllers/index.js    # All controller logic
│   │   ├── models/index.js         # All Mongoose schemas
│   │   ├── routes/index.js         # All Express routes
│   │   ├── middleware/auth.js      # JWT auth + role authorization
│   │   ├── middleware/upload.js    # Multer file upload
│   │   ├── utils/seed.js           # Database seeder
│   │   └── server.js               # Express app + MongoDB connect
│   ├── public/uploads/             # Uploaded media files
│   ├── .env                        # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── products/page.tsx   # Product listing
│   │   │   ├── products/[slug]/    # Product detail
│   │   │   ├── portfolio/page.tsx
│   │   │   ├── workshops/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/[slug]/        # Blog detail
│   │   │   ├── faq/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── admin/              # Admin panel (all CRUD pages)
│   │   ├── components/
│   │   │   ├── layout/Navbar.tsx   # Responsive navbar
│   │   │   ├── layout/Footer.tsx   # Dynamic footer
│   │   │   ├── sections/HeroFromSlides.tsx  # Reusable hero
│   │   │   └── admin/AdminComponents.tsx    # Shared admin UI
│   │   └── lib/
│   │       ├── api.ts              # All API client functions
│   │       └── auth.tsx            # Auth context provider
│   ├── .env.local                  # Frontend env (API URL)
│   └── package.json
└── DOCUMENTATION.md                # This file
```

### API Endpoints

**Public (no auth):**
- `GET /api/v1/slides?page=home` — Active slides for a page
- `GET /api/v1/services` — Active services
- `GET /api/v1/products` — Products (pagination, search, category filter)
- `GET /api/v1/products/:slug` — Single product detail
- `GET /api/v1/portfolio` — Active portfolio items
- `GET /api/v1/blogs` — Published blogs (pagination, category)
- `GET /api/v1/blogs/:slug` — Single blog
- `GET /api/v1/faqs` — Active FAQs
- `GET /api/v1/workshops` — Active workshops
- `GET /api/v1/testimonials` — Active testimonials
- `GET /api/v1/settings` — All settings as key-value map
- `GET /api/v1/categories` — Active product categories
- `GET /api/v1/seo/:page` — SEO data for a page
- `POST /api/v1/enquiries` — Submit enquiry form

**Admin (JWT required):**
- All `/admin` variants return all items (including inactive)
- Full CRUD: POST (create), PUT/:id (update), DELETE/:id (delete)
- `POST /api/v1/media/upload` — File upload
- `POST /api/v1/settings/bulk` — Bulk save settings
- `PUT /api/v1/seo/:page` — Upsert SEO data

### Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iodinevapor
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000
```

### Running the Project

```bash
# Backend
cd backend
npm install
npm run dev     # nodemon

# Frontend
cd frontend
npm install
npm run dev     # next dev on port 3000
```

### Key Design Decisions

1. **No hardcoded content** — All public page content comes from API
2. **Slides as universal hero** — Every page's hero is controlled from Slides/CMS
3. **textStyleSchema** — Rich text styling (color, size, weight, family, align, italic, uppercase) per text field
4. **Position system** — 9-point grid for content placement within heroes
5. **Multi-panel desktop** — Multiple slides = side-by-side image panels on desktop
6. **Mobile carousel** — Single slide with touch swipe + auto-advance on mobile
7. **Settings as key-value** — Flexible site configuration without schema changes
8. **React Query** — Client-side caching with 5-min stale time for settings
9. **Image handling** — `imgUrl()` helper handles both absolute URLs and relative upload paths

### Authorization Model

| Role | Can Do |
|------|--------|
| `admin` | Full CRUD on all content, media, enquiries |
| `superadmin` | Everything admin can + manage admin users (create, toggle, view) |

### Delete Fix Applied
Previously, Products/Portfolio/Enquiries/Product Categories required `superadmin` role to delete. Now any authenticated admin can delete content items. Only user management remains superadmin-only.

---

## Quick Reference

### Admin URL: `/admin`
### Frontend URL: `/`

### To add content to any page:
1. Admin → Slides/CMS → Select page tab → + Add New
2. Fill title, subtitle, image, position → Save
3. Refresh frontend page — content appears

### To update site info:
1. Admin → Site Settings → Select group (Brand/Contact/Stats/About)
2. Fill fields → Save Changes
3. All pages using that data update automatically


---

## 🎬 VIDEO SHOWCASE FEATURE (3D Camera + Video Reel)

### Overview

A premium interactive section on the homepage featuring a 3D rotating camera model (Three.js/WebGL) with a shutter button that triggers a flash effect, then reveals a video showcase with vertical sliding animations.

### How It Works

1. **User sees**: 3D camera rotating on right side + "OUR REEL" heading on left
2. **User clicks**: Shutter button (circular gold button, right corner)
3. **Flash fires**: Full-screen white flash (0.5 seconds)
4. **Videos appear**: Auto-playing video reel with titles, vertical swipe navigation

### Admin Management

**Location**: Admin Panel → Sidebar → "Showcase Videos"

**Fields per video:**
| Field | Description |
|-------|-------------|
| Title | Display name (e.g., "Brand Film — Asian Paints") |
| Video File | Upload or pick from Media Library |
| Thumbnail | Optional preview image for admin list |
| Description | Short text shown below video on frontend |
| Order | Display order (lower = first) |
| Active | Toggle visibility |

**Operations**: Create, Edit, Delete, Toggle Active/Inactive

### Frontend Behavior

| View | Behavior |
|------|----------|
| **Desktop** | Camera on right (400px), text on left, shutter button top-right |
| **Mobile** | Compact layout, camera below text, shutter button bottom-right |
| **Videos (Desktop)** | 16:9 aspect ratio, auto-play muted loop, vertical dots navigation |
| **Videos (Mobile)** | Same + touch swipe up/down to change video |
| **Auto-advance** | Videos change every 8 seconds |
| **No videos** | Section hidden entirely (returns null) |

### Technical Details

| Component | Technology |
|-----------|-----------|
| 3D Camera | Three.js + @react-three/fiber + @react-three/drei |
| Rendering | WebGL via Canvas (client-side only, dynamic import with ssr:false) |
| Animations | Framer Motion (flash, video transitions) |
| Touch | Native touch events (vertical swipe detection) |
| Model | Procedural geometry (no .glb file needed) |

### 3D Camera Model Components
- Camera body (dark metallic box)
- Viewfinder prism (top)
- Lens barrel (cylinder, front)
- Lens glass (transparent blue)
- Gold accent ring (torus)
- Shutter button (gold cylinder, top-right)
- Grip (right side)

### API Endpoint

```
GET  /api/v1/showcase-videos          — Public (active videos, sorted by order)
GET  /api/v1/showcase-videos/admin    — Admin (all videos)
POST /api/v1/showcase-videos          — Create
PUT  /api/v1/showcase-videos/:id      — Update
DELETE /api/v1/showcase-videos/:id     — Delete
```

### Database Schema (ShowcaseVideo)

```javascript
{
  title:       String (required),
  videoUrl:    String (required),
  videoId:     String,
  thumbnail:   String,
  description: String,
  order:       Number (default: 0),
  isActive:    Boolean (default: true),
  createdAt:   Date (auto),
  updatedAt:   Date (auto),
}
```

---

## 🛍️ PRODUCTS PAGE

### Overview

A complete product catalog with listing page, detail page, search, category filter, and pagination.

### Pages

| URL | Purpose |
|-----|---------|
| `/products` | Product listing with grid, search, filter, pagination |
| `/products/[slug]` | Product detail with gallery, specs, price, CTA |

### Product Listing Features
- Hero section (from Slides/CMS)
- Text search
- Category filter (from Product Categories)
- 4-column responsive grid (1→2→3→4)
- Product cards with: image, badges (Featured/Best Seller/Out of Stock), category, name, short description, price/MRP
- Pagination

### Product Detail Features
- Breadcrumb navigation
- Image gallery with thumbnail selection
- Category badge
- Name + short description
- Price with MRP strikethrough + discount percentage
- Stock status indicator
- "Enquire Now" CTA button
- Full description
- Specifications table (key-value)
- Tags

### Admin Management

**Location**: Admin Panel → Products

**Fields**: Name, Category, Short/Full Description, Multiple Images, Price/MRP, SKU, In Stock, Featured, Best Seller, Tags, Specifications, SEO, Active

---

## 🔧 DELETE FIX

### Issue
Products, Portfolio, Product Categories, and Enquiries required `superadmin` role to delete. Regular `admin` users could not delete these items.

### Fix Applied
Removed `authorize('superadmin')` middleware from delete routes for:
- `DELETE /api/v1/products/:id`
- `DELETE /api/v1/portfolio/:id`
- `DELETE /api/v1/categories/:id` (product categories)
- `DELETE /api/v1/enquiries/:id`

Now any authenticated admin can delete content. Only user management (create/toggle admins) remains superadmin-only.

---

## 📋 COMPLETE FEATURE LIST

| # | Feature | Admin | Frontend |
|---|---------|-------|----------|
| 1 | Slides/CMS (per-page heroes) | ✅ Full CRUD | ✅ Multi-panel + carousel |
| 2 | Services | ✅ Full CRUD | ✅ Cards on homepage + listing |
| 3 | Products | ✅ Full CRUD | ✅ Grid + detail page |
| 4 | Portfolio | ✅ Full CRUD | ✅ Masonry + lightbox |
| 5 | Blog | ✅ Full CRUD | ✅ Grid + detail + pagination |
| 6 | FAQs | ✅ Full CRUD | ✅ Accordion grouped |
| 7 | Workshops | ✅ Full CRUD | ✅ Cards + registration |
| 8 | Testimonials | ✅ Full CRUD | ✅ About page |
| 9 | Showcase Videos | ✅ Full CRUD | ✅ 3D camera + video reel |
| 10 | Enquiries | ✅ View + manage | ✅ Contact form submission |
| 11 | Media Library | ✅ Upload + organize | ✅ Used everywhere |
| 12 | Site Settings | ✅ Key-value config | ✅ Brand, contact, stats, about |
| 13 | SEO Manager | ✅ Per-page meta | ✅ Head tags |
| 14 | Admin Users | ✅ Superadmin only | — |
| 15 | Responsive Navbar | — | ✅ Mobile hamburger + scroll lock |
| 16 | Dynamic Footer | — | ✅ Settings-based content + socials |
