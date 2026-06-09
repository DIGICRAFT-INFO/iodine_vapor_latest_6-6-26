const express = require('express');
const ctrl = require('../controllers');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ── AUTH ──────────────────────────────────────────────────────────────────────
const authRouter = express.Router();
authRouter.post('/login', ctrl.login);
authRouter.get('/me', protect, ctrl.getMe);
authRouter.put('/me', protect, ctrl.updateMe);
authRouter.put('/change-password', protect, ctrl.changePassword);
authRouter.get('/admins', protect, authorize('superadmin'), ctrl.getAdmins);
authRouter.post('/create-admin', protect, authorize('superadmin'), ctrl.createAdmin);
authRouter.put('/toggle/:id', protect, authorize('superadmin'), ctrl.toggleAdmin);
authRouter.get('/dashboard', protect, ctrl.getDashboard);
module.exports.authRouter = authRouter;

// ── SLIDES ────────────────────────────────────────────────────────────────────
const slideRouter = express.Router();
slideRouter.get('/', ctrl.getSlides);
slideRouter.get('/admin', protect, ctrl.getAllSlides);
slideRouter.post('/', protect, ctrl.createSlide);
slideRouter.put('/reorder', protect, ctrl.reorderSlides);
slideRouter.put('/:id', protect, ctrl.updateSlide);
slideRouter.delete('/:id', protect, ctrl.deleteSlide);
module.exports.slideRouter = slideRouter;

// ── PRODUCT CATEGORIES ────────────────────────────────────────────────────────
const prodCatRouter = express.Router();
prodCatRouter.get('/', ctrl.getProdCats);
prodCatRouter.get('/admin', protect, ctrl.getAllProdCats);
prodCatRouter.post('/', protect, ctrl.createProdCat);
prodCatRouter.put('/:id', protect, ctrl.updateProdCat);
prodCatRouter.delete('/:id', protect, ctrl.deleteProdCat);
module.exports.prodCatRouter = prodCatRouter;

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
const productRouter = express.Router();
productRouter.get('/', ctrl.getProducts);
productRouter.get('/admin', protect, ctrl.getAllProducts);
productRouter.get('/:slug', ctrl.getProduct);
productRouter.post('/', protect, ctrl.createProduct);
productRouter.put('/:id', protect, ctrl.updateProduct);
productRouter.delete('/:id', protect, ctrl.deleteProduct);
module.exports.productRouter = productRouter;

// ── SERVICES ──────────────────────────────────────────────────────────────────
const serviceRouter = express.Router();
serviceRouter.get('/', ctrl.getServices);
serviceRouter.get('/admin', protect, ctrl.getAllServices);
serviceRouter.post('/', protect, ctrl.createService);
serviceRouter.put('/:id', protect, ctrl.updateService);
serviceRouter.delete('/:id', protect, ctrl.deleteService);
module.exports.serviceRouter = serviceRouter;

// ── BLOG CATEGORIES ───────────────────────────────────────────────────────────
const blogCatRouter = express.Router();
blogCatRouter.get('/', ctrl.getBlogCats);
blogCatRouter.get('/admin', protect, ctrl.getAllBlogCats);
blogCatRouter.post('/', protect, ctrl.createBlogCat);
blogCatRouter.put('/:id', protect, ctrl.updateBlogCat);
blogCatRouter.delete('/:id', protect, ctrl.deleteBlogCat);
module.exports.blogCatRouter = blogCatRouter;

// ── BLOGS ─────────────────────────────────────────────────────────────────────
const blogRouter = express.Router();
blogRouter.get('/', ctrl.getBlogs);
blogRouter.get('/admin', protect, ctrl.getAllBlogs);
blogRouter.get('/:slug', ctrl.getBlog);
blogRouter.post('/', protect, ctrl.createBlog);
blogRouter.put('/:id', protect, ctrl.updateBlog);
blogRouter.delete('/:id', protect, ctrl.deleteBlog);
module.exports.blogRouter = blogRouter;

// ── FAQs ──────────────────────────────────────────────────────────────────────
const faqRouter = express.Router();
faqRouter.get('/', ctrl.getFAQs);
faqRouter.get('/admin', protect, ctrl.getAllFAQs);
faqRouter.post('/', protect, ctrl.createFAQ);
faqRouter.put('/:id', protect, ctrl.updateFAQ);
faqRouter.delete('/:id', protect, ctrl.deleteFAQ);
module.exports.faqRouter = faqRouter;

// ── WORKSHOP CATEGORIES ───────────────────────────────────────────────────────
const wsCatRouter = express.Router();
wsCatRouter.get('/', ctrl.getWsCats);
wsCatRouter.get('/admin', protect, ctrl.getAllWsCats);
wsCatRouter.post('/', protect, ctrl.createWsCat);
wsCatRouter.put('/:id', protect, ctrl.updateWsCat);
wsCatRouter.delete('/:id', protect, ctrl.deleteWsCat);
module.exports.wsCatRouter = wsCatRouter;

// ── WORKSHOPS ─────────────────────────────────────────────────────────────────
const workshopRouter = express.Router();
workshopRouter.get('/', ctrl.getWorkshops);
workshopRouter.get('/admin', protect, ctrl.getAllWorkshops);
workshopRouter.get('/:slug', ctrl.getWorkshop);
workshopRouter.post('/', protect, ctrl.createWorkshop);
workshopRouter.put('/:id', protect, ctrl.updateWorkshop);
workshopRouter.delete('/:id', protect, ctrl.deleteWorkshop);
workshopRouter.post('/:id/register', ctrl.wsRegister);
module.exports.workshopRouter = workshopRouter;

// ── PORTFOLIO ─────────────────────────────────────────────────────────────────
const portfolioRouter = express.Router();
portfolioRouter.get('/', ctrl.getPortfolio);
portfolioRouter.get('/admin', protect, ctrl.getAllPortfolio);
portfolioRouter.post('/', protect, ctrl.createPortfolio);
portfolioRouter.put('/:id', protect, ctrl.updatePortfolio);
portfolioRouter.delete('/:id', protect, ctrl.deletePortfolio);
module.exports.portfolioRouter = portfolioRouter;

// ── ENQUIRIES ─────────────────────────────────────────────────────────────────
const enquiryRouter = express.Router();
enquiryRouter.post('/', ctrl.createEnquiry);
enquiryRouter.get('/', protect, ctrl.getEnquiries);
enquiryRouter.put('/:id', protect, ctrl.updateEnquiry);
enquiryRouter.delete('/:id', protect, ctrl.deleteEnquiry);
module.exports.enquiryRouter = enquiryRouter;

// ── MEDIA ─────────────────────────────────────────────────────────────────────
const mediaRouter = express.Router();
mediaRouter.post('/upload', protect, upload.single('file'), ctrl.uploadMedia);
mediaRouter.get('/', protect, ctrl.getMedia);
mediaRouter.put('/:id', protect, ctrl.updateMedia);
mediaRouter.delete('/:id', protect, ctrl.deleteMedia);
module.exports.mediaRouter = mediaRouter;

// ── SETTINGS ──────────────────────────────────────────────────────────────────
const settingRouter = express.Router();
settingRouter.get('/', ctrl.getSettings);
settingRouter.post('/', protect, ctrl.upsertSetting);
settingRouter.post('/bulk', protect, ctrl.bulkSettings);
module.exports.settingRouter = settingRouter;

// ── SEO ───────────────────────────────────────────────────────────────────────
const seoRouter = express.Router();
seoRouter.get('/', protect, ctrl.getAllSEO);
seoRouter.get('/:page', ctrl.getSEO);
seoRouter.put('/:page', protect, ctrl.upsertSEO);
module.exports.seoRouter = seoRouter;

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
const testimonialRouter = express.Router();
testimonialRouter.get('/', ctrl.getTestimonials);
testimonialRouter.get('/admin', protect, ctrl.getAllTestimonials);
testimonialRouter.post('/', protect, ctrl.createTestimonial);
testimonialRouter.put('/:id', protect, ctrl.updateTestimonial);
testimonialRouter.delete('/:id', protect, ctrl.deleteTestimonial);
module.exports.testimonialRouter = testimonialRouter;

// ── SHOWCASE VIDEOS ───────────────────────────────────────────────────────────
const showcaseVideoRouter = express.Router();
showcaseVideoRouter.get('/', ctrl.getShowcaseVideos);
showcaseVideoRouter.get('/admin', protect, ctrl.getAllShowcaseVideos);
showcaseVideoRouter.post('/', protect, ctrl.createShowcaseVideo);
showcaseVideoRouter.put('/:id', protect, ctrl.updateShowcaseVideo);
showcaseVideoRouter.delete('/:id', protect, ctrl.deleteShowcaseVideo);
module.exports.showcaseVideoRouter = showcaseVideoRouter;
