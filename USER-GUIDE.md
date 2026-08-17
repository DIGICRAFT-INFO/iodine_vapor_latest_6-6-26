# Iodine Vapor — User & Client Guide

## For Website Visitors (Public Users)

### What You Can Do

| Action | Where | How |
|--------|-------|-----|
| View photography work | `/portfolio` | Browse by category, click to view full image |
| See services offered | `/services` | View all photography & videography services |
| Browse products | `/products` | Search, filter by category, view details |
| Read blog articles | `/blog` | Browse articles, filter by category |
| Check workshops | `/workshops` | See upcoming workshops with dates & pricing |
| Register for workshop | `/workshops/[name]` | Fill registration form on workshop detail page |
| Read FAQs | `/faq` | Expandable accordion with answers |
| Contact the studio | `/contact` | Fill enquiry form (name, email, service, message) |
| Get a quote | Click "GET A QUOTE" | Opens contact page with quote form |
| Watch video showcase | Click camera button (right side) | Flash effect → video player opens |

### Navigation

- **Desktop**: All pages listed in navbar (About, Services, Products, Portfolio, Workshops, Journal, FAQ)
- **Mobile**: Tap hamburger menu → dropdown with all pages
- **Footer**: Quick links + social media + contact info

---

## For Admin Users (Content Managers)

### Getting Started

1. Go to `yourdomain.com/admin`
2. Login with your email and password
3. You'll see the Dashboard with stats overview

### Admin Panel Navigation

```
Dashboard          → Overview stats & recent enquiries
├── Content
│   ├── Slides / CMS    → Hero sections for all pages
│   ├── Services        → Manage services (CRUD)
│   ├── Portfolio       → Manage portfolio items (CRUD)
│   ├── Products        → Manage products with pricing (CRUD)
│   ├── Blog            → Write & publish articles (CRUD)
│   ├── FAQs            → Manage frequently asked questions (CRUD)
│   ├── Workshops       → Manage workshops with registration (CRUD)
│   ├── Testimonials    → Client reviews & ratings (CRUD)
│   └── Showcase Videos → Video reel for homepage (CRUD)
├── Operations
│   ├── Enquiries       → View all form submissions
│   └── Media Library   → Upload & manage images/videos
└── Config
    ├── Site Settings   → Brand, About, Colors, Contact, Social, Stats, Footer
    └── SEO Manager     → Page-by-page search engine optimization
```

---

### Step-by-Step Workflows

#### 1. Update Homepage Hero

1. Go to **Slides / CMS**
2. Select **"home"** tab
3. Click **"+ Add New"** or edit existing slide
4. Fill in:
   - **Mini Title**: Small text above heading (e.g., "Pan-India Photography")
   - **Title**: Main heading (e.g., "VISUAL STORIES")
   - **Subtitle**: Secondary text
   - **Paragraph**: Description text
5. For each text field, customize:
   - Color (color picker)
   - Font Size (dropdown)
   - Font Weight (Light/Regular/Bold)
   - Font Family
   - Text Align (Left/Center/Right)
   - Italic & Uppercase toggles
6. Set **Content Position** (9-point grid)
7. Upload **Background Image** (Click "Pick" → Media Library)
8. Set **Overlay Opacity** (0 = no darkening, 1 = very dark)
9. Toggle **Active** on
10. Click **Save**

**Result**: Homepage hero updates instantly on the website.

#### 2. Add a New Service

1. Go to **Services**
2. Click **"+ Add Service"**
3. Fill in:
   - Name (e.g., "Aerial & Drone Photography")
   - Icon (select emoji or type custom)
   - Short Description (one-liner for cards)
   - Full Description (detailed info)
   - Features (click "Add" for each feature point)
   - Service Image (click "Pick" → upload photo)
   - Order number
4. Toggle Active
5. Click **Save**

**Result**: New service appears on homepage + services page.

#### 3. Add Portfolio Item

1. Go to **Portfolio**
2. Click **"+ Add New"**
3. Fill in:
   - Title, Category, Image
   - Client name, Year
   - Toggle "Featured" for homepage display
4. Click **Save**

**Result**: Portfolio item appears on homepage reel + portfolio page.

#### 4. Add a Product

1. Go to **Products**
2. Click **"+ Add New"**
3. Fill in:
   - Name, Category, Short/Full Description
   - Images (multiple), Price, MRP
   - SKU, Stock status
   - Tags, Specifications
   - Featured/Best Seller badges
4. Click **Save**

**Result**: Product appears on products page with pricing.

#### 5. Write a Blog Post

1. Go to **Blog**
2. Click **"+ Add New"**
3. Fill in:
   - Title, Category, Content
   - Cover Image, Excerpt
   - Tags, Author
4. Toggle **Published** to make it live
5. Click **Save**

**Result**: Blog appears on homepage blog section + blog page.

#### 6. Create a Workshop

1. Go to **Workshops**
2. Click **"+ Add New"**
3. Fill in:
   - Title, Description, Content
   - Cover Image
   - Date, Duration, Location
   - Seats available, Price (or mark as Free)
   - Online/Offline toggle
4. Toggle Active
5. Click **Save**

**Result**: Workshop appears on workshops page. Users can register via form.

#### 7. Upload a Showcase Video

1. Go to **Showcase Videos**
2. Click **"+ Add New"**
3. Fill in:
   - Title
   - Video File (click "Pick" → upload video from Media Library)
   - Thumbnail (optional)
   - Description
4. Toggle Active
5. Click **Save**

**Result**: Video plays when user clicks camera button on homepage.

#### 8. Update Contact Information

1. Go to **Site Settings**
2. Click **"Contact"** tab
3. Fill in:
   - Email, Phone, Address
4. Click **Save Changes**

**Result**: Contact page + homepage contact section update automatically.

#### 9. Update Company Stats

1. Go to **Site Settings**
2. Click **"Stats"** tab
3. Fill in:
   - Years Experience (e.g., "12+")
   - Projects Count (e.g., "500+")
   - Schools Count (e.g., "100+")
   - Cinemas Count (e.g., "32")
4. Click **Save Changes**

**Result**: Stats appear on homepage hero section.

#### 10. View & Manage Enquiries

1. Go to **Enquiries**
2. See all form submissions (contact, quote, workshop registrations)
3. Filter by type: Contact / Quote / Workshop
4. Update status: New → Read → Replied → Closed
5. Add internal notes
6. Delete if needed

#### 11. Manage SEO (Search Engine)

1. Go to **SEO Manager**
2. Select a page (Home, About, Services, etc.)
3. Fill in:
   - Meta Title (max 60 characters)
   - Meta Description (max 160 characters)
   - Keywords
   - OG Image (for social sharing)
4. Click **Save SEO**

**Result**: Page appears better in Google search results.

#### 12. Upload Media (Images/Videos)

1. Go to **Media Library**
2. Click upload button
3. Select file (supports: jpg, png, gif, webp, mp4, webm, mov, pdf — up to 250MB)
4. File gets saved with unique ID
5. Use "Pick" button anywhere in admin to select from library

---

### Content Goes Live Instantly

| Admin Action | Website Updates |
|-------------|----------------|
| Save a slide | Hero section changes on that page |
| Add/edit service | Homepage + services page update |
| Add portfolio item | Homepage reel + portfolio page update |
| Save settings | Contact, stats, footer, logo update everywhere |
| Publish blog | Blog section + blog page show new article |
| Add workshop | Workshops page shows new workshop |
| Upload video | Video showcase plays new video |

**No deployment needed** — all changes are instant via API.

---

### Roles & Permissions

| Role | Can Do |
|------|--------|
| **Admin** | Full CRUD on all content, media, enquiries, settings, SEO |
| **Superadmin** | Everything admin can + create/manage admin users |

---

### Tips

- Always set slides to **Active** for them to appear on website
- Use **Media Library** to organize and reuse uploaded files
- Set **Overlay Opacity** to 0.3-0.5 for readable text on hero images
- Use **Featured** flag to highlight items on homepage
- Check **Enquiries** daily for new leads
- Keep blog posts **Published** to make them visible
- Use **Order** field to control display sequence
