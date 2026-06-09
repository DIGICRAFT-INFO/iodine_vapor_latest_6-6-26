# Bugfix Requirements Document

## Introduction

The Iodine Vapor website frontend displays hardcoded/placeholder content and stock images on all pages instead of fetching and rendering real data from the backend APIs. The admin panel allows saving content (slides, services, portfolio items, testimonials, settings, blogs, workshops, FAQs) and the backend API endpoints exist and function correctly, but the frontend pages use inline hardcoded fallback content instead of the API data. All content on the public website — including text, images, layout colors, fonts, and positions — must be driven entirely by the backend APIs and manageable via the admin panel. The website should never display empty/blank sections; instead it should display the admin-saved content at all times.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the homepage Hero section renders THEN the system displays hardcoded Unsplash panel images (4 static URLs), hardcoded title text ("VISUAL STORIES THAT CONVERT"), and hardcoded stat values ('12+', '500+', '100+', '32') instead of exclusively using slide and settings data from the API

1.2 WHEN the homepage Reel/Featured Work section renders AND the portfolio API returns empty data THEN the system displays 6 hardcoded dummy portfolio items with Unsplash URLs and fake titles/categories instead of only showing API data

1.3 WHEN the homepage About section renders THEN the system displays hardcoded Unsplash images, hardcoded body text ("At Iodine Vapor, we bring 12+ years..."), a hardcoded client list, and hardcoded stat counters regardless of settings data from the backend

1.4 WHEN the homepage Services section renders AND services API returns empty data THEN the system displays 6 hardcoded dummy service items with placeholder names and descriptions

1.5 WHEN the homepage Blog section renders AND blogs API returns empty data THEN the system displays hardcoded blog entries with Unsplash images and placeholder text

1.6 WHEN the homepage Contact section renders THEN the system displays hardcoded contact details (phone, email, address) instead of using settings API data

1.7 WHEN the About page (/about) renders THEN the system displays hardcoded body paragraphs, a hardcoded Unsplash studio image, and a hardcoded client brand list instead of fetching all text, images, and brand data from the backend

1.8 WHEN any frontend page renders content with styling (colors, fonts, layout positioning) THEN the system uses only CSS-hardcoded values instead of allowing customization through settings saved via the admin panel

### Expected Behavior (Correct)

2.1 WHEN the homepage Hero section renders THEN the system SHALL display images, title text, subtitle, eyebrow text, background styling, and stat values exclusively from the slides and settings APIs — with no inline hardcoded fallback content

2.2 WHEN the homepage Reel/Featured Work section renders THEN the system SHALL display only portfolio items retrieved from the API; if the API has no items saved yet, the section SHALL be hidden or show a minimal CTA to add content via admin

2.3 WHEN the homepage About section renders THEN the system SHALL fetch and display all about content (body text, images, client brands, stat numbers) from the backend settings/content API

2.4 WHEN the homepage Services section renders THEN the system SHALL display only services retrieved from the API; if no services exist, the section SHALL be hidden or show a minimal placeholder indicating content can be added via admin

2.5 WHEN the homepage Blog section renders THEN the system SHALL display only blog posts retrieved from the API; if no blogs exist, the section SHALL be hidden

2.6 WHEN the homepage Contact section renders THEN the system SHALL display phone, email, address, and social links exclusively from the settings API

2.7 WHEN the About page (/about) renders THEN the system SHALL fetch and display all page content (heading, body text, images, client brands) from the backend settings/content API with no hardcoded text or stock images

2.8 WHEN the admin panel saves styling settings (theme colors, font preferences, section ordering/visibility) THEN the system SHALL apply those styles on the public website so that layout appearance is controlled from the admin panel

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the Services page (/services) fetches services from the API THEN the system SHALL CONTINUE TO render service cards dynamically from API data using the existing useQuery and react-query pattern

3.2 WHEN the FAQ page (/faq) fetches FAQs from the API THEN the system SHALL CONTINUE TO render FAQ items dynamically from API data with the accordion interaction

3.3 WHEN the Workshops page fetches workshops from the API THEN the system SHALL CONTINUE TO render workshop cards dynamically from API data

3.4 WHEN the admin panel saves content through the backend APIs THEN the system SHALL CONTINUE TO successfully persist data without any changes to admin panel functionality

3.5 WHEN the frontend uses the existing `@tanstack/react-query` hooks and `api.ts` utility functions THEN the system SHALL CONTINUE TO use the same API client infrastructure without replacing the data-fetching library

3.6 WHEN images are served from the backend uploads directory THEN the system SHALL CONTINUE TO use the `imgUrl()` helper to construct correct image URLs

3.7 WHEN the overall site design aesthetic (dark theme, luxury brand feel, animations, layout grid) is rendered THEN the system SHALL CONTINUE TO maintain the same visual design language and motion patterns
