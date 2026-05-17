# Design System Inspired by Template.net

## 1. Visual Theme & Atmosphere

Template.net's design system embodies a modern, productivity-focused aesthetic built on clarity and precision. The interface prioritizes user focus through a predominantly light background with strategic use of deep navy and electric blue accents, creating visual hierarchy and directional guidance. The design balances minimalist restraint with purposeful affordances, leveraging spacious layouts, clean typography, and soft edges to convey approachability while maintaining professional credibility. This is a system optimized for AI-assisted content creation—where the interface recedes to let user creativity and generated assets shine. The color palette oscillates between neutral grays and blacks for foundational content, punctuated by bold electric blue for primary actions and interactive states, signaling energy and technological sophistication.

**Key Characteristics:**

- Clean, minimalist aesthetic with generous whitespace
- Electric blue (`#1E0DFF`) as primary accent for high-priority actions
- Deep navy (`#1F2124`) for text hierarchy and structural elements
- Soft, rounded corners for accessibility and modern feel
- Light neutral backgrounds (`#F2F5FD`, `#FFFFFF`) for content clarity
- Icon-forward navigation and feature discovery
- Emphasis on productivity and asset generation workflows

## 2. Color Palette & Roles

### Primary

- **Primary Brand Blue** (`#1E0DFF`): Primary call-to-action buttons, link states, interactive affordances, and brand emphasis
- **Deep Navy** (`#1F2124`): Primary text, headings, and dominant UI elements

### Accent Colors

- **Light Lavender** (`#D3CEFF`): Subtle background tints and accent highlights for secondary emphasis
- **Warm Yellow** (`#FFEEAA`): Highlight and attention-drawing elements, typically for promotional or feature banners
- **Secondary Blue** (`#1E5AE1`): Alternative interactive states and secondary actions

### Interactive

- **Navy Dark** (`#161720`): Dark interactive states and contrast-heavy elements
- **Gray Muted** (`#6B7280`): Disabled states, muted icons, secondary descriptive text
- **Deep Purple** (`#2B293F`): Input field text and form content emphasis

### Neutral Scale

- **Black** (`#000000`): High-contrast text, critical UI elements
- **Off-Black** (`#1F2124`): Primary body text and default heading color
- **Steel Gray** (`#CFD6DD`): Borders and dividing lines
- **Light Gray** (`#E1E4E8`): Subtle borders and background separation
- **Off-White** (`#F9FAFE`): Minimal contrast backgrounds
- **Soft Blue-White** (`#F2F5FD`): Primary light background, page surfaces
- **Pure White** (`#FFFFFF`): Card backgrounds, input fields, modal overlays

### Surface & Borders

- **Border Default** (`#CFD6DD`): Standard card and input borders
- **Border Light** (`#E1E4E8`): Lighter borders for less-prominent dividers

### Semantic / Status

- **Error Red** (`#B71C22`): Error messages, validation failures, danger actions
- **Success Green** (`#00A63E`): Success confirmations, positive validations

## 3. Typography Rules

### Font Family

- **Primary Font:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Secondary Font:** Inter (monospace fallback: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Courier New, monospace for code/data)

### Hierarchy

| Role               | Font  | Size | Weight | Line Height | Letter Spacing | Notes                            |
| ------------------ | ----- | ---- | ------ | ----------- | -------------- | -------------------------------- |
| Display / H1       | Inter | 40px | 600    | 60px        | 0px            | Hero headlines, page titles      |
| Heading 2 / H2     | Inter | 24px | 600    | 36px        | 0px            | Section headers, major divisions |
| Heading 3 / H3     | Inter | 16px | 600    | 19.2px      | 0px            | Subsection headers, card titles  |
| Body / Paragraph   | Inter | 16px | 400    | 24px        | 0px            | Primary body text, descriptions  |
| Button / Small     | Inter | 12px | 500    | 22px        | 0px            | Action buttons, compact labels   |
| Link / Small       | Inter | 14px | 500    | 21px        | 0px            | Hyperlinks, underlined text      |
| Caption / Tertiary | Inter | 12px | 400    | 18px        | 0px            | Helper text, metadata, labels    |
| Input Placeholder  | Inter | 14px | 400    | 21px        | 0px            | Form input hints                 |

### Principles

- **Hierarchy through weight:** Leverage 400 (regular) and 600 (semibold) weights for clear contrast between structural and supportive text
- **Generous line-height:** Maintain 1.5× base size minimum for readability across all text sizes
- **Consistent font stack:** All typography uses Inter as primary with system fallbacks for cross-platform rendering
- **Semantic sizing:** Establish distinct sizes to guide visual scanning—headings distinct from body, body distinct from interactive labels
- **Accessibility:** Minimum 16px for body text ensures readability; 12px reserved only for compact interface elements and captions

## 4. Component Stylings

### Buttons

#### Primary Button

- **Background:** `#1E0DFF`
- **Text Color:** `#FFFFFF`
- **Font:** Inter, 12px, weight 500, line-height 22px
- **Padding:** `8px 16px`
- **Border Radius:** `3355px` (pill-shaped, fully rounded)
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Height:** `40px`
- **Hover State:** Background `#1A0CC2` (10% darker)
- **Active State:** Background `#150A99` (20% darker)
- **Disabled State:** Background `#D3CEFF`, Text `#6B7280`, Cursor not-allowed

#### Secondary Button

- **Background:** `#FFFFFF`
- **Text Color:** `#1F2124`
- **Font:** Inter, 12px, weight 500, line-height 22px
- **Padding:** `8px 12px`
- **Border Radius:** `3355px`
- **Border:** `1px solid #CFD6DD`
- **Box Shadow:** `none`
- **Height:** `40px`
- **Hover State:** Background `#F9FAFE`, Border `#B5BCC5`
- **Active State:** Background `#F2F5FD`, Border `#9FA7B5`
- **Disabled State:** Background `#F9FAFE`, Text `#6B7280`, Border `#E1E4E8`

#### Ghost Button

- **Background:** `transparent`
- **Text Color:** `#1F2124`
- **Font:** Inter, 12px, weight 400, line-height 24px
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Height:** `24px`
- **Hover State:** Text Color `#1E0DFF`, Underline `1px solid #1E0DFF`
- **Active State:** Text Color `#1A0CC2`
- **Disabled State:** Text Color `#6B7280`, Cursor not-allowed

#### Icon Button

- **Background:** `#FFFFFF`
- **Icon Color:** `#6B7280`
- **Border Radius:** `50%`
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Height:** `32px`
- **Width:** `32px`
- **Hover State:** Background `#F2F5FD`, Icon Color `#1F2124`
- **Active State:** Background `#E1E4E8`, Icon Color `#1F2124`

#### Generate Button (Primary CTA)

- **Background:** Linear gradient from `#D3CEFF` to `#D3CEFF` with overlay effect
- **Text Color:** `#FFFFFF`
- **Font:** Inter, 14px, weight 600, line-height 21px
- **Padding:** `12px 24px`
- **Border Radius:** `24px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `0px 4px 12px rgba(30, 13, 255, 0.2)`
- **Height:** `48px`
- **Hover State:** Box Shadow `0px 6px 16px rgba(30, 13, 255, 0.3)`, Transform scale 1.02
- **Active State:** Box Shadow `0px 2px 8px rgba(30, 13, 255, 0.15)`, Transform scale 0.98

### Cards & Containers

#### Default Card

- **Background:** `#FFFFFF`
- **Text Color:** `#1F2124`
- **Font:** Inter, 14px, weight 400, line-height 21px
- **Padding:** `0px 0px 0px 0px` (content padding internal)
- **Border Radius:** `16px`
- **Border:** `1px solid #CFD6DD`
- **Box Shadow:** `none`
- **Hover State:** Border `#B5BCC5`, Box Shadow `0px 2px 8px rgba(0, 0, 0, 0.04)`
- **Typical Height:** `300px`

#### Inline Alert Card

- **Background:** `#FFFFFF`
- **Text Color:** `#1F2124`
- **Font:** Inter, 16px, weight 400, line-height 24px
- **Padding:** `8px 12px`
- **Border Radius:** `14px`
- **Border:** `1px solid #CFD6DD`
- **Box Shadow:** `none`
- **Height:** `116px` (or auto for content flow)
- **Interactive State:** Cursor pointer, Background `#F9FAFE` on hover

#### Template Card (Feature Card)

- **Background:** `#FFFFFF`
- **Icon Color:** `#1E0DFF`
- **Text Color:** `#1F2124`
- **Font:** Inter, 16px, weight 600 (title), 14px weight 400 (description)
- **Padding:** `24px`
- **Border Radius:** `16px`
- **Border:** `1px solid #CFD6DD`
- **Box Shadow:** `none`
- **Height:** `300px`
- **Hover State:** Border `#B5BCC5`, Box Shadow `0px 4px 12px rgba(0, 0, 0, 0.08)`, Transform translateY -2px
- **Icon Size:** `32px × 32px`, Centered above title

### Inputs & Forms

#### Main Text Input (Large)

- **Background:** `#FFFFFF`
- **Text Color:** `#2B293F`
- **Font:** Inter, 14px, weight 400, line-height 21px
- **Padding:** `0px 8px` (placeholder), content padding `16px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent` (underline only)
- **Box Shadow:** `none`
- **Height:** `58px`
- **Focus State:** Border-bottom `2px solid #1E0DFF`, Box Shadow `0px 2px 0px rgba(30, 13, 255, 0.1)`
- **Placeholder Color:** `#6B7280`
- **Full Width:** Responsive width, min `824px` on desktop

#### Search / Filter Input (Compact)

- **Background:** `#FFFFFF`
- **Text Color:** `#1F2124`
- **Font:** Inter, 12px, weight 500, line-height 18px
- **Padding:** `8px 12px 8px 34px` (left padding for icon)
- **Border Radius:** `3355px`
- **Border:** `1px solid #CFD6DD`
- **Box Shadow:** `none`
- **Height:** `36px`
- **Width:** `254px`
- **Focus State:** Border `1px solid #1E0DFF`, Box Shadow `0px 0px 0px 3px rgba(30, 13, 255, 0.1)`
- **Icon:** 16px × 16px, positioned 8px from left edge, color `#6B7280`
- **Placeholder Color:** `#9FA7B5`

#### Small Input / Field

- **Background:** `#FFFFFF`
- **Text Color:** `#1F2124`
- **Font:** Inter, 12px, weight 500, line-height 18px
- **Padding:** `8px 12px 8px 34px`
- **Border Radius:** `3355px`
- **Border:** `1px solid #CFD6DD`
- **Box Shadow:** `none`
- **Height:** `36px`
- **Width:** `48px` (auto-fit content)
- **Focus State:** Border `1px solid #1E0DFF`, Box Shadow `0px 0px 0px 3px rgba(30, 13, 255, 0.1)`

### Navigation

#### Sidebar Navigation

- **Background:** `transparent`
- **Text Color:** `#000000`
- **Font:** Inter, 16px, weight 400, line-height 24px
- **Padding:** `16px 0px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Width:** `68px`
- **Height:** `732px`
- **Icon Size:** `24px × 24px`
- **Active Item:** Text Color `#1E0DFF`, Icon Color `#1E0DFF`, Background `#F2F5FD`
- **Hover State:** Background `#F9FAFE`, Icon Color `#1F2124`
- **Item Spacing:** `16px vertical between items`

#### Horizontal Navigation (Top Bar)

- **Background:** `#FFFFFF`
- **Text Color:** `#1F2124`
- **Font:** Inter, 16px, weight 400, line-height 24px
- **Padding:** `0px 24px`
- **Border Radius:** `0px`
- **Border-bottom:** `1px solid #E1E4E8`
- **Box Shadow:** `none`
- **Height:** `64px`
- **Align:** flex, center vertically
- **Logo Font:** Inter, 16px, weight 700, color `#1E0DFF`
- **Item Spacing:** `24px horizontal`

### Links

#### Standard Link

- **Background:** `transparent`
- **Text Color:** `#1E0DFF`
- **Font:** Inter, 14px, weight 500, line-height 21px
- **Text Decoration:** `underline`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Hover State:** Text Color `#1A0CC2`, Text Decoration underline 2px
- **Active State:** Text Color `#150A99`
- **Visited State:** Text Color `#7C3AED`

#### Navigation Link

- **Background:** `transparent`
- **Text Color:** `#161720`
- **Font:** Inter, 16px, weight 400, line-height 24px
- **Text Decoration:** `none`
- **Padding:** `0px`
- **Border-bottom:** `0px solid transparent`
- **Box Shadow:** `none`
- **Height:** `22px`
- **Hover State:** Text Color `#1E0DFF`, Border-bottom `2px solid #1E0DFF`
- **Active State:** Text Color `#1E0DFF`, Border-bottom `2px solid #1E0DFF`

### Badges / Tags

#### Default Badge

- **Background:** `#F2F5FD`
- **Text Color:** `#1F2124`
- **Font:** Inter, 12px, weight 600, line-height 18px
- **Padding:** `4px 8px`
- **Border Radius:** `12px`
- **Border:** `1px solid #D3CEFF`
- **Box Shadow:** `none`

#### Primary Badge

- **Background:** `#E0E7FF`
- **Text Color:** `#1E0DFF`
- **Font:** Inter, 12px, weight 600, line-height 18px
- **Padding:** `4px 8px`
- **Border Radius:** `12px`
- **Border:** `1px solid #D3CEFF`

#### Status Badge (Success)

- **Background:** `#ECFDF5`
- **Text Color:** `#00A63E`
- **Font:** Inter, 12px, weight 600, line-height 18px
- **Padding:** `4px 8px`
- **Border Radius:** `12px`
- **Border:** `1px solid #C6F6D5`

#### Status Badge (Error)

- **Background:** `#FEF2F2`
- **Text Color:** `#B71C22`
- **Font:** Inter, 12px, weight 600, line-height 18px
- **Padding:** `4px 8px`
- **Border Radius:** `12px`
- **Border:** `1px solid #FECACA`

## 5. Layout Principles

### Spacing System

- **Base Unit:** `4px`
- **Spacing Scale:** `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 68px, 92px, 116px`
- **Usage Contexts:**
  - `4px, 8px`: Micro spacing within components (icon-to-text gaps, button padding adjustments)
  - `12px, 16px`: Primary spacing for component padding and small gaps
  - `20px, 24px`: Section spacing and moderate grouping
  - `32px, 40px`: Medium section dividers and layout spacing
  - `48px, 68px`: Large content section gaps, page-level spacing
  - `92px, 116px`: Hero sections and major layout divisions

### Grid & Container

- **Max Width:** `1440px` for primary content on desktop
- **Sidebar Layout:** Fixed left sidebar `68px` width + main content area, or collapsible at breakpoints
- **Column Strategy:** 12-column grid at desktop, collapsible to 6-column at tablet, 1-column at mobile
- **Horizontal Padding:** `24px` on desktop, `16px` on tablet, `12px` on mobile
- **Content Container:** Primary content area constrained to `1200px` with padding
- **Section Patterns:**
  - Header section: Full-width with `64px` height, centered logo/nav
  - Hero section: Full-width, `400px–600px` height with centered text
  - Feature grid: 4-column on desktop, 2-column on tablet, 1-column on mobile
  - Footer: Full-width, multi-column layout at desktop, stacked at mobile

### Whitespace Philosophy

- **Generous margins:** Embrace negative space to reduce cognitive load and allow focus on primary content
- **Breathing room:** Minimum `24px` spacing between distinct sections
- **Component breathing:** `16px` spacing between grouped items, `8px` between tightly related items
- **Vertical rhythm:** Maintain 1.5× multiplier for vertical spacing relative to text line-height
- **Edge breathing:** Page edges maintain minimum `24px` padding on desktop to prevent flush content

### Border Radius Scale

- **Sharp:** `0px` for structural elements (dividers, baseline inputs before focus)
- **Micro Radius:** `4px` for subtle image borders and minor UI elements
- **Small Radius:** `12px` for badges and compact components
- **Medium Radius:** `14px` for inline alerts and contained sections
- **Large Radius:** `16px` for cards, modals, and primary containers
- **Extra Large Radius:** `24px` for icon buttons and decorative elements
- **Pill / Fully Rounded:** `3355px` (or `50%` for circles) for buttons and heavily interactive elements

## 6. Depth & Elevation

| Level            | Treatment                                      | Use                                                         |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| Flat / Base (L0) | No shadow, `box-shadow: none`                  | Background surfaces, page base, neutral cards, input fields |
| Raised (L1)      | `box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04)`  | Card hover states, subtle elevation cues                    |
| Elevated (L2)    | `box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08)` | Hovered template cards, modals, dropdowns                   |
| Overlay (L3)     | `box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.12)` | Floating action buttons, expanded modals, popovers          |
| Deep (L4)        | `box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15)` | Heavy modals, full-page overlays, notifications             |

**Shadow Philosophy:** Template.net uses restrained shadows to maintain visual clarity while preserving depth hierarchy. Shadows employ dark gray opacity layers rather than black, ensuring legibility on light backgrounds. Primary elevation occurs through border and background color shifts; shadows serve as secondary depth cues. The Generate button (`#D3CEFF` base with `box-shadow: 0px 4px 12px rgba(30, 13, 255, 0.2)`) exemplifies accent-color shadow layering for prominent interactive states.

## 7. Do's and Don'ts

### Do

- **Use `#1E0DFF` consistently** for primary calls-to-action, links, and active states across the interface
- **Maintain generous whitespace** between major sections (minimum `24px` vertical gap) to reduce cognitive load
- **Apply pill-shaped buttons** (`border-radius: 3355px`) for all action buttons to reinforce consistent interaction affordance
- **Leverage Inter typography** exclusively with proper font-weight hierarchy (400 regular, 600 semibold) for clear content structure
- **Use cards with `border-radius: 16px`** and `border: 1px solid #CFD6DD`\*\* for grouped content and feature showcases
- **Implement rounded icon buttons** (`border-radius: 24px` or `50%`) for secondary UI controls and navigation icons
- **Add hover transitions** with subtle elevation (`0px 2px 8px rgba(0, 0, 0, 0.04)`) to indicate interactivity
- **Stack badges and status labels** using small padding (`4px 8px`) and compact font sizes (`12px`)
- **Ensure text contrast** by pairing `#FFFFFF` backgrounds with `#1F2124` text, or `#F2F5FD` with `#000000` / `#1F2124`
- **Use semantic colors** consistently: `#00A63E` for success, `#B71C22` for error, `#6B7280` for disabled/muted states

### Don't

- **Don't use pure black** (`#000000`) for body text; opt for `#1F2124` for slightly warmer, more readable typography
- **Don't mix border-radius values** arbitrarily; stick to the defined scale (`0px, 4px, 12px, 14px, 16px, 24px, 3355px`)
- **Don't apply box-shadows** to cards without a clear interaction state (hover/focus); default cards should remain flat
- **Don't exceed padding `24px`** on compact inputs or small buttons; oversized padding compromises visual density
- **Don't replace Inter** with system fonts for primary headings or body text; maintain brand typographic consistency
- **Don't use `#CFD6DD`** for text; reserve this color exclusively for borders and dividers
- **Don't apply multiple accent colors** in a single component; use either `#1E0DFF` or `#D3CEFF` for emphasis, never both
- **Don't set line-height below 1.4×** for body text; ensure readability across all font sizes
- **Don't use opacity-based transparency** on colored backgrounds without verifying accessibility contrast (WCAG AA minimum 4.5:1 for text)
- **Don't override button border-radius** for consistency; maintain pill-shape (`3355px`) as a recognizable affordance
- **Don't mix spacing units** within a layout; use only values from the defined spacing scale (`4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 68px, 92px, 116px`)

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width           | Key Changes                                                                                                             |
| --------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Mobile          | `320px–479px`   | Single-column layout, full-width cards, collapsed sidebar → hamburger menu, padding `12px`, font sizes reduced by 2–4px |
| Tablet (Small)  | `480px–767px`   | 2-column grid for features, sidebar visible but compact `48px`, padding `16px`, navigation horizontal                   |
| Tablet (Large)  | `768px–1023px`  | 2–3 column grid, sidebar `60px`, padding `20px`, main nav bar reduced spacing                                           |
| Desktop         | `1024px–1439px` | 4-column grid, sidebar full `68px`, padding `24px`, full horizontal navigation                                          |
| Ultra-Wide      | `1440px+`       | Content max-width `1440px`, centered layout, increased spacing `32px–40px`                                              |

### Touch Targets

- **Minimum interactive size:** `44px × 44px` for buttons and touch controls (mobile)
- **Comfortable target size:** `48px × 48px` for primary actions (mobile)
- **Icon buttons:** `32px × 32px` minimum (desktop), `44px × 44px` (mobile)
- **Input fields:** `36px–40px` height minimum for comfortable tap targets
- **Spacing between targets:** Minimum `8px` gap to prevent accidental selection

### Collapsing Strategy

- **Sidebar Navigation:** At `<768px`, collapse sidebar to hamburger menu with full-screen overlay
- **Feature Grid:** 4-column at desktop → 2-column at tablet → 1-column stacked at mobile
- **Horizontal Navigation:** At `<480px`, stack nav items vertically or hide into hamburger menu; keep logo and primary CTA visible
- **Padding Reduction:** Desktop `24px` → Tablet `16px` → Mobile `12px`
- **Card Width:** Full-width on mobile with `12px` padding, constrained width on tablet/desktop
- **Typography Scaling:** Desktop body `16px` → Tablet/Mobile `14px` for tighter layouts; headings reduce proportionally
- **Modal / Overlay:** Full viewport height on mobile, centered overlay `90vw` max-width with padding adjustment
- **Form Inputs:** Full-width on mobile (`100% - 24px` padding), fixed `254px` on desktop
- **Button Grouping:** Stack buttons vertically on mobile (`100%` width), horizontal at tablet/desktop

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Primary Brand Blue (`#1E0DFF`)
- **Secondary CTA:** Deep Navy (`#1F2124`)
- **Background (Light):** Soft Blue-White (`#F2F5FD`)
- **Background (Card):** Pure White (`#FFFFFF`)
- **Text (Primary):** Off-Black (`#1F2124`)
- **Text (Secondary):** Gray Muted (`#6B7280`)
- **Borders:** Steel Gray (`#CFD6DD`)
- **Success State:** Success Green (`#00A63E`)
- **Error State:** Error Red (`#B71C22`)
- **Accent Highlight:** Light Lavender (`#D3CEFF`)
- **Disabled:** Light Gray (`#E1E4E8`)

### Iteration Guide

1. **All buttons are pill-shaped** (`border-radius: 3355px`); only icon buttons use `24px` or circular `50%` radius. Primary buttons inherit `#1E0DFF` background with `#FFFFFF` text; secondary buttons use `#FFFFFF` background with `1px #CFD6DD` border.

2. **Typography uses Inter exclusively** with 3 core weights: `400` for body/secondary, `500` for buttons/captions, `600` for headings. Establish hierarchy via size (H1 `40px`, H2 `24px`, H3 `16px`, Body `16px`, Button `12px`) and weight, never via color alone.

3. **Spacing follows the 4px base scale:** Use only values from `[4, 8, 12, 16, 20, 24, 32, 40, 48, 68, 92, 116]px`. Padding on compact inputs is `8px 12px` or `8px 16px`; padding on cards and sections scales to `24px–48px`.

4. **Card corners are always `16px`** with `1px solid #CFD6DD` border; apply `0px` box-shadow by default, add `0px 2px 8px rgba(0, 0, 0, 0.04)` on hover. Template cards add small icon previews with `#1E0DFF` color.

5. **Input fields default to `#FFFFFF` background** with `border-radius: 3355px` for compact searches (`36px` height) or `0px` (underline only) for large text inputs (`58px` height). Focus states add `2px solid #1E0DFF` bottom border or outline.

6. **Navigation sidebar is fixed `68px` wide**, vertical icon layout with `16px` spacing between items. Active items toggle to `#1E0DFF` text/icon with `#F2F5FD` background. Collapse to hamburger at `<768px` breakpoint.

7. **Padding around sections is `24px` on desktop**, `16px` on tablet, `12px` on mobile. Hero and feature sections use `68px–92px` vertical padding. Small component internal padding is `8px–12px`; large sections use `32px–48px`.

8. **Elevation uses subtle shadows:** Flat (no shadow), Raised (`0px 2px 8px rgba(0, 0, 0, 0.04)`), Elevated (`0px 4px 12px rgba(0, 0, 0, 0.08)`), Deep (`0px 8px 24px rgba(0, 0, 0, 0.15)`). Never use pure black shadows; use dark gray opacity layers only.

9. **Links are `#1E0DFF` with underline** by default; on hover, darken to `#1A0CC2` and increase underline weight. Navigation links omit underline, add underline on hover/active. Visited links shift to `#7C3AED`.

10. **Semantic colors are non-negotiable:** Success (`#00A63E`), Error (`#B71C22`), Disabled text (`#6B7280`), Info/Accent (`#D3CEFF`). Map these to validation messages, status badges, and alert overlays without deviation.
