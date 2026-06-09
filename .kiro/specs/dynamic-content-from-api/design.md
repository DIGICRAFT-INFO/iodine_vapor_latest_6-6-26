# Dynamic Content From API — Bugfix Design

## Overview

The Iodine Vapor frontend displays hardcoded/placeholder content (stock images, static text, dummy data) instead of rendering exclusively from backend APIs. The fix involves replacing all inline hardcoded fallback data across the homepage (Hero, Reel, About, Services, Blog, Contact sections) and sub-pages (About, Contact) with data fetched from the slides, settings, services, portfolio, blogs, and testimonials APIs. The Hero section must be refactored from a 4-panel static layout to a single-slide full-screen approach driven by the Slides API. The entire site must be fully responsive, especially the Hero and Navbar on mobile.

## Glossary

- **Bug_Condition (C)**: The condition where a frontend component renders hardcoded/fallback content instead of exclusively using API data — specifically when inline static arrays, Unsplash URLs, or placeholder text strings are present in the render output
- **Property (P)**: The desired behavior — all visible text, images, stats, and styling are sourced exclusively from API responses (slides, settings, services, portfolio, blogs, testimonials); sections with no API data are hidden or show a minimal admin-prompt CTA
- **Preservation**: The existing patterns that must remain unchanged — @tanstack/react-query data fetching, imgUrl() helper, framer-motion animations, dark luxury design aesthetic, admin panel functionality
- **Hero**: The full-viewport landing section on the homepage at `frontend/src/app/page.tsx`
- **HeroFromSlides**: The existing reusable hero component at `frontend/src/components/sections/HeroFromSlides.tsx` used by sub-pages (about, contact)
- **Slide**: A backend model with page, title/subtitle/miniTitle/paragraph (textStyleSchema), imageUrl, position, bgColor/bgGradient, overlayOpacity, order, isActive
- **Settings**: Backend key-value store for site-wide configuration (contact info, stats, branding, client list)
- **textStyleSchema**: Shared schema for styled text fields: { text, color, fontSize, fontWeight, fontFamily, textAlign, italic, uppercase }

## Bug Details

### Bug Condition

The bug manifests when any public-facing component renders content from inline hardcoded arrays, static string literals, or fallback Unsplash URLs instead of exclusively rendering data fetched from the backend APIs. The components either contain inline fallback arrays that display when API data is empty, or they directly embed hardcoded text/URLs regardless of API data.

**Formal Specification:**
```
FUNCTION isBugCondition(component)
  INPUT: component of type ReactComponent
  OUTPUT: boolean
  
  RETURN component.rendersInlineHardcodedImages()
         OR component.rendersStaticFallbackArrayWhenApiEmpty()
         OR component.rendersHardcodedText(ignoring: settingsLookups)
         OR component.rendersHardcodedStats(ignoring: settingsLookups)
         OR component.uses4PanelLayoutInsteadOfSingleSlide()
END FUNCTION
```

### Examples

- **Hero Section**: Renders 4 hardcoded `PANEL_IMGS` from Unsplash even when slide data exists; renders "VISUAL STORIES THAT CONVERT" text split across multiple h1 elements with hardcoded words "THAT" and "CONVERT"; renders hardcoded stats fallback values '12+', '500+', '100+', '32'
- **Reel Section**: When `portfolio` array is empty, renders 6 dummy items from an inline array with Unsplash URLs and fake titles like "Architecture, SIAM Ply"
- **About Section**: Always renders a hardcoded Unsplash image URL, hardcoded paragraph text "At Iodine Vapor, we bring 12+ years...", hardcoded stats array `[12, 500, 32, 100]`, and hardcoded clients array
- **Services Section**: When `services` array is empty, renders 6 dummy service items from an inline `ICONS.map(...)` array
- **Contact Section**: Falls back to hardcoded 'hello@iodinevapor.com', '+91 98765 43210', 'Pan-India' when settings don't have keys
- **About Page**: Always renders hardcoded "At Iodine Vapor..." paragraphs and Unsplash studio image regardless of API data
- **Hero on mobile**: The 4-panel flex layout doesn't collapse properly — images overflow or shrink to unusable sizes

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- @tanstack/react-query useQuery hooks for data fetching with existing queryKey patterns
- The `imgUrl()` helper for constructing image URLs from backend paths
- framer-motion animations (motion.div, AnimatePresence, useScroll, useTransform)
- The dark-theme luxury design language (CSS custom properties --c-bg, --c-gold, --c-cream, --c-muted)
- Admin panel CRUD functionality for all content types
- The existing `HeroFromSlides` component behavior on sub-pages (about, contact)
- API client infrastructure (`api.ts` with axios interceptors, all *Api objects)
- The existing FAQ, Workshops, and Services listing pages that already render from API data
- Footer component functionality

**Scope:**
All inputs that do NOT involve frontend rendering of public page content should be completely unaffected by this fix. This includes:
- Backend API endpoints and their response shapes
- Admin panel pages and their data management UI
- Authentication flow and token handling
- Image upload and media management
- Build configuration and environment variables

## Hypothesized Root Cause

Based on the bug analysis, the root causes are:

1. **Inline Fallback Arrays in Component Bodies**: The `Hero`, `Reel`, `AboutSection`, `Services`, and `ContactSection` components contain hardcoded arrays directly in their function bodies (e.g., `PANEL_IMGS`, the dummy portfolio items in Reel, the dummy services in Services). These render when API data is empty AND they persist as partial content even when API data exists (e.g., Hero always uses `PANEL_IMGS` for the 4-panel layout).

2. **Hero Design Incompatible with Slide Model**: The Hero is designed as a 4-panel image grid, which cannot map cleanly to the Slide model (which represents a single slide with one image, title, subtitle, etc.). The component only extracts `firstSlide?.imageUrl` and uses it identically across all 4 panels, and renders hardcoded text ("STORIES", "THAT", "CONVERT") instead of using the slide's title/subtitle fields.

3. **Missing Settings-Based Content for About Section**: The About section body text, studio image, client list, and stats are embedded as string literals and arrays rather than being fetched from the Settings API where an admin could store them.

4. **No Responsive Breakpoints for Hero Layout**: The 4-panel flex layout (`flex-1` children) has no responsive breakpoints; on mobile, panels become too narrow to display images effectively.

## Correctness Properties

Property 1: Bug Condition - No Hardcoded Fallback Content Rendered

_For any_ public page render where the bug condition holds (component contains inline hardcoded images, text, or fallback arrays), the fixed component SHALL render exclusively from API data — displaying the content from slides/settings/services/portfolio/blogs APIs. When API returns no data for a section, the section SHALL either be hidden entirely or display a minimal "Add content via admin" indicator with no stock imagery or dummy text.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

Property 2: Preservation - Existing Dynamic Rendering Unchanged

_For any_ page or component that already correctly renders from API data (FAQ page, Workshops page, Services listing page, admin panel, HeroFromSlides on sub-pages), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing dynamic rendering, react-query patterns, and API interaction.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `frontend/src/app/page.tsx`

**Component**: `Hero`

**Specific Changes**:
1. **Replace 4-panel layout with single-slide full-screen**: Remove the `PANEL_IMGS` array and the 4-panel flex div. Replace with a single full-viewport background image sourced from the active slide's `imageUrl`. Apply overlay using `overlayOpacity` from the slide.
2. **Render all text from slide data**: Remove hardcoded "VISUAL", "STORIES", "THAT", "CONVERT" text. Render `slide.title.text`, `slide.subtitle.text`, `slide.miniTitle.text`, and `slide.paragraph.text` with their associated textStyleSchema properties (color, fontSize, fontWeight, fontFamily, textAlign, italic, uppercase).
3. **Support slide position**: Use the slide's `position` field to align content (left/center/right/top-left/etc.), reusing the `posClass` pattern from `HeroFromSlides`.
4. **Add carousel support**: If multiple slides exist, implement auto-advance with dot indicators (reusing the pattern from `HeroFromSlides`). With a single slide, display it statically.
5. **Stats from settings only**: Remove inline fallback values. Render stats only if the corresponding settings keys exist (`years_experience`, `projects_count`, `schools_count`, `cinemas_count`). If no stats settings exist, hide the stats bar.
6. **Responsive design**: Single image fills viewport on all breakpoints. Text sizes use `clamp()` for fluid scaling. Adjust padding for mobile (`px-4` on mobile, `px-6` on md, `px-12` on lg).
7. **Ticker from services or settings**: Replace hardcoded `TICKER_ITEMS` array with service names fetched from the API, or from a settings key.

**Component**: `Reel`

**Specific Changes**:
1. **Remove inline fallback array**: Delete the 6-item dummy array with Unsplash URLs. When `portfolio` prop is empty, hide the entire section (return null) or show "No portfolio items yet" with a subtle admin prompt.
2. **Portfolio items only from API**: Render exclusively from the `portfolio` prop passed from the parent query.

**Component**: `AboutSection`

**Specific Changes**:
1. **Body text from settings**: Replace hardcoded paragraph with `settings.about_text` or a slide with `page: 'home'` designated for the about section.
2. **Image from settings/slides**: Replace Unsplash URL with `settings.about_image` or a dedicated about slide image.
3. **Stats from settings**: Replace hardcoded `[12, 500, 32, 100]` array with settings-derived values. Only render stats that have corresponding settings keys.
4. **Clients from settings**: Replace hardcoded `clients` array with `settings.client_brands` (stored as comma-separated or JSON array in settings).
5. **Fallback behavior**: If settings keys don't exist, hide the respective sub-sections rather than showing hardcoded content.

**Component**: `Services`

**Specific Changes**:
1. **Remove inline fallback array**: Delete the `ICONS.map(...)` dummy services. When `services` prop is empty, hide the section or show minimal admin prompt.

**Component**: `ContactSection`

**Specific Changes**:
1. **Remove inline fallback values**: Remove hardcoded `'hello@iodinevapor.com'`, `'+91 98765 43210'`, `'Pan-India'` fallbacks. Only render contact items where the corresponding settings key has a truthy value.
2. **Service options from API**: Replace hardcoded service dropdown options with actual service names from the services API.

**File**: `frontend/src/app/about/page.tsx`

**Specific Changes**:
1. **Body text from settings/slides**: Replace hardcoded paragraphs with `settings.about_text` or slide paragraph content.
2. **Studio image from settings**: Replace Unsplash URL with `settings.about_image` or slide imageUrl.
3. **Client brands from settings**: Replace hardcoded `clients` array with `settings.client_brands`.

**File**: `frontend/src/components/layout/Navbar.tsx`

**Specific Changes**:
1. **Responsive padding**: Change `padding: '28px 48px'` to responsive values — smaller on mobile (e.g., `16px 16px` on mobile, `28px 48px` on lg).
2. **Mobile menu improvements**: Ensure the hamburger trigger area is large enough (min 44×44px tap target). Scale mobile menu link text for smaller screens (`text-[2rem]` or `text-[1.6rem]` instead of `text-[2.8rem]`).
3. **Body scroll lock**: When mobile menu is open, prevent background scrolling.

**File**: `frontend/src/app/page.tsx` (Homepage responsive)

**Specific Changes**:
1. **Hero responsive**: Single full-screen image scales naturally. Text uses `clamp()` already but ensure minimum sizes are readable on 320px width. Stats wrap properly on mobile.
2. **Sections responsive**: Ensure all section padding, grid columns, and font sizes degrade gracefully. Most already use Tailwind responsive prefixes, but verify Hero and About sections.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that render homepage components with empty API data and verify they output hardcoded content. Also render with valid API data and verify hardcoded content still appears in the DOM (e.g., Hero still renders "THAT" and "CONVERT" text, Reel still renders dummy items when portfolio is empty).

**Test Cases**:
1. **Hero Hardcoded Images Test**: Render Hero with empty slides array, assert Unsplash URLs appear in rendered output (will fail — demonstrates hardcoded content is present on unfixed code)
2. **Hero Hardcoded Text Test**: Render Hero with a slide that has title "MY TITLE", assert "THAT" and "CONVERT" still appear in DOM (demonstrates text is hardcoded regardless of API data)
3. **Reel Fallback Test**: Render Reel with empty portfolio array, assert dummy items with Unsplash URLs are rendered (demonstrates fallback array bug)
4. **Services Fallback Test**: Render Services with empty services array, assert "Commercial Photography" dummy items appear
5. **About Hardcoded Content Test**: Render AboutSection, assert Unsplash image URL and hardcoded paragraph text are in DOM

**Expected Counterexamples**:
- Hero always renders Unsplash panel images regardless of slide data
- Hero always renders "THAT" and "CONVERT" text regardless of slide title
- Reel renders 6 dummy items when portfolio is empty
- Services renders 6 dummy items when services is empty
- AboutSection always renders hardcoded text and images

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL component WHERE isBugCondition(component) DO
  result := renderFixed(component, apiData)
  IF apiData IS EMPTY THEN
    ASSERT noHardcodedContent(result)
    ASSERT sectionHiddenOrMinimalPrompt(result)
  ELSE
    ASSERT allContentFromApiData(result, apiData)
    ASSERT noUnsplashUrls(result)
    ASSERT noHardcodedFallbackText(result)
  END IF
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL component WHERE NOT isBugCondition(component) DO
  ASSERT renderOriginal(component, apiData) = renderFixed(component, apiData)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (various API data shapes, empty vs populated, different settings combinations)
- It catches edge cases that manual unit tests might miss (e.g., settings with empty string values vs undefined)
- It provides strong guarantees that behavior is unchanged for all non-buggy components

**Test Plan**: Observe behavior on UNFIXED code first for pages that already work correctly (FAQ page, Workshops page, Services listing page), then write property-based tests capturing that behavior.

**Test Cases**:
1. **FAQ Page Preservation**: Verify FAQ page continues to render from API data identically before and after fix
2. **Workshops Page Preservation**: Verify workshops page continues to render from API data identically
3. **HeroFromSlides Preservation**: Verify the existing HeroFromSlides component on about/contact pages renders identically
4. **API Client Preservation**: Verify all API functions continue to make correct requests with same parameters
5. **imgUrl Helper Preservation**: Verify imgUrl() helper produces same URLs for same inputs

### Unit Tests

- Test Hero component renders slide title/subtitle/miniTitle/paragraph from API data
- Test Hero component applies textStyleSchema properties (color, fontSize, fontWeight, etc.)
- Test Hero component respects slide position field for content alignment
- Test Hero component carousel advances between multiple slides
- Test Hero component with single slide renders without carousel dots
- Test Reel component hides section when portfolio is empty
- Test AboutSection renders settings-based text, image, stats, clients
- Test Services component hides section when services array is empty
- Test ContactSection renders settings-based contact info, hides missing items
- Test Navbar responsive padding at different viewport widths
- Test Navbar mobile menu body scroll lock behavior

### Property-Based Tests

- Generate random slide configurations (various textStyleSchema values, position values, overlay opacities) and verify Hero renders all fields correctly without hardcoded content
- Generate random settings objects and verify stat/contact/about sections render only existing keys with no fallback values
- Generate random portfolio/services arrays and verify sections are hidden when empty, render API data when populated
- Generate random viewport sizes and verify Hero and Navbar respond with appropriate responsive classes

### Integration Tests

- Test full homepage render with populated API data — verify no Unsplash URLs in final DOM
- Test full homepage render with empty API data — verify no hardcoded fallback content, sections appropriately hidden
- Test mobile viewport rendering — verify Hero displays single image, Navbar collapses to hamburger, all sections are readable
- Test slide carousel auto-advance on homepage with multiple slides
- Test About page renders all content from settings API
- Test Contact page renders contact info from settings API
