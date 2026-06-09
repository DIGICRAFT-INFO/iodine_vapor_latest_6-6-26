# Implementation Plan

## Overview

This task list implements the bugfix for the Iodine Vapor frontend which displays hardcoded/placeholder content instead of rendering exclusively from backend APIs. The fix follows the exploratory bugfix workflow: first surface the bug with tests, then preserve existing behavior, then implement the fix across Hero, Reel, About, Services, Contact sections and the About page, and finally validate everything passes.

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Hardcoded Fallback Content Rendered
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate hardcoded/fallback content is rendered instead of API data
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases:
    - Hero renders Unsplash URLs from `PANEL_IMGS` array regardless of slide data
    - Hero renders hardcoded text "THAT" and "CONVERT" regardless of slide title
    - Reel renders 6 dummy portfolio items with Unsplash URLs when portfolio is empty
    - Services renders 6 dummy service items when services array is empty
    - AboutSection renders hardcoded paragraph text and Unsplash image URL
    - ContactSection renders hardcoded email/phone/address fallbacks
  - **Test Implementation**:
    - Create test file `frontend/src/__tests__/bug-condition.test.tsx`
    - Render Hero component with a valid slide (title: "MY TITLE"), assert "THAT" and "CONVERT" hardcoded text does NOT appear in DOM (test will FAIL on unfixed code — confirms bug)
    - Render Hero with empty slides, assert no Unsplash URLs appear (test will FAIL — confirms hardcoded images)
    - Render Reel with empty portfolio array, assert no dummy items with Unsplash URLs appear (test will FAIL — confirms fallback array)
    - Render Services with empty services array, assert no dummy service names appear (test will FAIL — confirms fallback array)
    - Render AboutSection, assert no hardcoded "At Iodine Vapor, we bring 12+ years" text appears (test will FAIL — confirms hardcoded content)
    - Render ContactSection with empty settings, assert no hardcoded 'hello@iodinevapor.com' or '+91 98765 43210' appears (test will FAIL — confirms hardcoded fallbacks)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists in each component)
  - Document counterexamples found: which specific hardcoded strings appear in each component's render output
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Dynamic Rendering Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - **Observe behavior on UNFIXED code for non-buggy components/pages**:
    - Observe: FAQ page renders FAQ items from API data using useQuery hook
    - Observe: Workshops page renders workshop cards from API data
    - Observe: Services listing page (/services) renders service cards from API
    - Observe: HeroFromSlides component on about/contact pages renders slide data correctly
    - Observe: imgUrl() helper constructs correct image URLs (e.g., `imgUrl("/uploads/img.jpg")` returns full backend URL)
    - Observe: API client functions (slidesApi, settingsApi, servicesApi, etc.) make correct requests
    - Observe: framer-motion animations are applied (motion.div with animate/transition props)
  - **Write property-based tests capturing observed behavior**:
    - Create test file `frontend/src/__tests__/preservation.test.tsx`
    - Property test: For all valid FAQ data arrays, FAQ page renders each item's question and answer text from the data
    - Property test: For all valid workshop data arrays, Workshops page renders each item's title and description from the data
    - Property test: For all valid image paths, imgUrl() produces `${BACKEND_URL}${path}` consistently
    - Property test: For all valid slide configurations passed to HeroFromSlides, the component renders slide title, subtitle, and imageUrl from props
    - Property test: API client infrastructure preserves request patterns (correct endpoints, auth headers)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 3. Fix for hardcoded content — Hero section refactor

  - [ ] 3.1 Replace Hero 4-panel layout with single-slide full-screen design
    - Remove the `PANEL_IMGS` hardcoded array entirely
    - Remove the 4-panel flex div layout
    - Replace with a single full-viewport background image sourced from active slide's `imageUrl` via `imgUrl()`
    - Apply overlay using slide's `overlayOpacity` field
    - Apply `bgColor`/`bgGradient` from slide data
    - If no slides exist, hide Hero section or show minimal admin-prompt CTA
    - _Bug_Condition: component.rendersInlineHardcodedImages() OR component.uses4PanelLayoutInsteadOfSingleSlide()_
    - _Expected_Behavior: Hero displays single full-screen slide image from API, no Unsplash URLs_
    - _Preservation: Maintain framer-motion animations, dark luxury design aesthetic_
    - _Requirements: 2.1, 1.1_

  - [ ] 3.2 Render Hero text exclusively from slide data with textStyleSchema
    - Remove hardcoded "VISUAL", "STORIES", "THAT", "CONVERT" text
    - Render `slide.title.text`, `slide.subtitle.text`, `slide.miniTitle.text`, `slide.paragraph.text`
    - Apply textStyleSchema properties: color, fontSize, fontWeight, fontFamily, textAlign, italic, uppercase
    - Use `clamp()` for fluid font sizing with minimum readable sizes on 320px viewport
    - _Bug_Condition: component.rendersHardcodedText(ignoring: settingsLookups)_
    - _Expected_Behavior: All visible text sourced from slide textStyleSchema fields_
    - _Preservation: Maintain existing motion animations on text elements_
    - _Requirements: 2.1, 1.1_

  - [ ] 3.3 Add slide position support and carousel
    - Use slide's `position` field to align content (left/center/right/top-left/top-right/bottom-left/bottom-right)
    - Reuse the `posClass` mapping pattern from `HeroFromSlides.tsx`
    - If multiple active slides exist, implement auto-advance carousel with dot indicators
    - With a single slide, display statically without dots
    - _Bug_Condition: component.uses4PanelLayoutInsteadOfSingleSlide()_
    - _Expected_Behavior: Content positioned per slide.position, carousel for multiple slides_
    - _Preservation: AnimatePresence pattern from HeroFromSlides reused_
    - _Requirements: 2.1_

  - [ ] 3.4 Stats bar from settings API only
    - Remove inline fallback stat values ('12+', '500+', '100+', '32')
    - Fetch stats from settings keys: `years_experience`, `projects_count`, `schools_count`, `cinemas_count`
    - Render only stats that have corresponding settings keys with truthy values
    - If no stat settings exist, hide the stats bar entirely
    - _Bug_Condition: component.rendersHardcodedStats(ignoring: settingsLookups)_
    - _Expected_Behavior: Stats rendered exclusively from settings API, hidden when absent_
    - _Preservation: Counter animation patterns unchanged_
    - _Requirements: 2.1, 1.1_

  - [ ] 3.5 Replace hardcoded ticker with API data
    - Remove hardcoded `TICKER_ITEMS` array
    - Source ticker text from service names via services API or from a settings key
    - If no data available, hide ticker or show nothing
    - _Bug_Condition: component.rendersStaticFallbackArrayWhenApiEmpty()_
    - _Expected_Behavior: Ticker sourced from services API or settings_
    - _Requirements: 2.1_

  - [ ] 3.6 Hero responsive design
    - Single full-screen image fills viewport naturally on all breakpoints
    - Text uses `clamp()` with minimum sizes readable on 320px width
    - Padding: `px-4` mobile, `px-6` md, `px-12` lg
    - Stats bar wraps properly on mobile (flex-wrap)
    - Dot indicators (if carousel) are tappable (min 44×44px)
    - _Requirements: 2.1_

- [ ] 4. Fix for hardcoded content — Reel section

  - [ ] 4.1 Remove Reel inline fallback array
    - Delete the 6-item dummy array with Unsplash URLs and fake titles
    - When `portfolio` prop is empty, return null (hide entire section)
    - Render portfolio items exclusively from the `portfolio` prop passed from parent query
    - _Bug_Condition: component.rendersStaticFallbackArrayWhenApiEmpty()_
    - _Expected_Behavior: Section hidden when empty, API data only when populated_
    - _Preservation: Portfolio card layout and animations unchanged when data is present_
    - _Requirements: 2.2, 1.2_

- [ ] 5. Fix for hardcoded content — AboutSection

  - [ ] 5.1 Replace AboutSection hardcoded content with settings API data
    - Replace hardcoded paragraph text with `settings.about_text`
    - Replace hardcoded Unsplash image URL with `settings.about_image` via `imgUrl()`
    - Replace hardcoded stats array `[12, 500, 32, 100]` with settings-derived values
    - Replace hardcoded `clients` array with `settings.client_brands` (parsed as JSON array or comma-separated)
    - If any settings key doesn't exist, hide that sub-section rather than showing hardcoded content
    - _Bug_Condition: component.rendersHardcodedText() OR component.rendersInlineHardcodedImages()_
    - _Expected_Behavior: All about content from settings API, sub-sections hidden when keys absent_
    - _Preservation: Section layout, animations, and styling patterns unchanged_
    - _Requirements: 2.3, 1.3_

- [ ] 6. Fix for hardcoded content — Services section

  - [ ] 6.1 Remove Services inline fallback array
    - Delete the `ICONS.map(...)` dummy services array
    - When `services` prop is empty, return null (hide section) or show minimal admin prompt
    - Render services exclusively from the `services` prop
    - _Bug_Condition: component.rendersStaticFallbackArrayWhenApiEmpty()_
    - _Expected_Behavior: Section hidden when empty, API data only when populated_
    - _Preservation: Service card design and animations unchanged when data is present_
    - _Requirements: 2.4, 1.4_

- [ ] 7. Fix for hardcoded content — ContactSection

  - [ ] 7.1 Remove ContactSection hardcoded fallbacks
    - Remove hardcoded `'hello@iodinevapor.com'`, `'+91 98765 43210'`, `'Pan-India'` fallbacks
    - Render contact fields only where corresponding settings keys have truthy values
    - Replace hardcoded service dropdown options with service names from services API
    - If no contact settings exist, hide contact info section (form can still display)
    - _Bug_Condition: component.rendersHardcodedText(ignoring: settingsLookups)_
    - _Expected_Behavior: Contact info exclusively from settings API, items hidden when absent_
    - _Preservation: Enquiry form submission and validation logic unchanged_
    - _Requirements: 2.6, 1.6_

- [ ] 8. Fix for hardcoded content — About page (/about)

  - [ ] 8.1 Replace About page hardcoded content with API data
    - Replace hardcoded "At Iodine Vapor..." paragraphs with `settings.about_text` or about slide content
    - Replace hardcoded Unsplash studio image with `settings.about_image` via `imgUrl()`
    - Replace hardcoded client brands array with `settings.client_brands`
    - If settings keys don't exist, hide sub-sections rather than showing hardcoded content
    - _Bug_Condition: component.rendersHardcodedText() OR component.rendersInlineHardcodedImages()_
    - _Expected_Behavior: All about page content from settings/slides API_
    - _Preservation: HeroFromSlides component behavior on about page unchanged_
    - _Requirements: 2.7, 1.7_

- [ ] 9. Fix for Navbar responsive improvements

  - [ ] 9.1 Navbar responsive padding and mobile menu
    - Change `padding: '28px 48px'` to responsive values: `16px 16px` on mobile, `28px 48px` on lg
    - Ensure hamburger trigger area is min 44×44px tap target
    - Scale mobile menu link text to `text-[2rem]` or `text-[1.6rem]` instead of `text-[2.8rem]`
    - Add body scroll lock when mobile menu is open (overflow: hidden on body)
    - _Preservation: Desktop Navbar appearance unchanged, animation transitions preserved_
    - _Requirements: 2.1_

- [ ] 10. Verify bug condition exploration test now passes

  - [ ] 10.1 Re-run bug condition exploration test
    - **Property 1: Expected Behavior** - No Hardcoded Fallback Content Rendered
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior (no hardcoded content appears)
    - When this test passes, it confirms the expected behavior is satisfied for all components
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed — no more hardcoded content)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ] 10.2 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Dynamic Rendering Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions to FAQ, Workshops, Services listing, HeroFromSlides, imgUrl, API client)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 11. Checkpoint - Ensure all tests pass
  - Run full test suite to confirm all bug condition and preservation tests pass
  - Verify no TypeScript compilation errors across modified files
  - Verify no ESLint errors in modified components
  - Ensure all sections render correctly with populated API data
  - Ensure all sections hide gracefully with empty API data
  - Ask the user if questions arise

## Task Dependency Graph

```json
{
  "waves": [
    ["1", "2"],
    ["3", "4", "5", "6", "7", "8", "9"],
    ["10"],
    ["11"]
  ]
}
```

## Notes

- Tasks 1 and 2 MUST be completed before any implementation tasks (3-9)
- Tasks 3-9 can be implemented in parallel as they target independent components
- Task 10 re-runs the same tests from tasks 1 and 2 — no new tests should be written
- The `HeroFromSlides.tsx` component on sub-pages should NOT be modified (preservation requirement)
- All settings keys referenced (about_text, about_image, client_brands, years_experience, etc.) must be populated via the admin panel for sections to display content
- The testing framework should use the existing project setup (likely Jest/Vitest with React Testing Library)
