# West Star Aviation design system

**Live:** [Storybook](https://makenaford.github.io/weststar-implementation/) · [Portal prototype](https://makenaford.github.io/weststar-implementation/prototype/). Both redeploy on every push to `main`.

The tokens and components for the West Star Aviation customer portal. They're built in plain HTML, CSS and vanilla JS from the Figma file [gs-weststar-implementation](https://www.figma.com/design/elT7RbG4bvfjAkS8SRtk6f/gs-weststar-implementation), which uses Liferay Clay components. Storybook documents every component and variant for developer handoff.

## Run it

```bash
npm install
npm run storybook        # http://localhost:6010
npm run tokens           # rebuild css/tokens.css after editing tokens/*.json
npm run build-storybook  # static build in storybook-static/
npm run build-site       # Storybook + prototype, as published to GitHub Pages
npm run dev              # portal prototype at http://localhost:6020/prototype/
```

## Use it in a page

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="css/index.css" />

<button class="ws-btn ws-btn--primary">Approve squawk</button>
<span class="ws-label ws-label--warning ws-label--outline">Pending approval</span>
<svg class="ws-icon"><use href="icons.svg#check"></use></svg>
```

Copy `assets/icons.svg` (and `assets/illustrations/` if you use empty states) next to your pages. Interactive components ship a small ES module in their folder, for example `import { initTabs } from './components/tabs/tabs.js'`.

## What's in it

**Foundations:** color (154 tokens), chart color (10 families), semantic color (Figma paint styles), type ramp (responsive: mobile, tablet, desktop), spacing, radius, shadows and 300+ Clay icons.

**Components (32):**

| Group | Components |
|---|---|
| Actions | button, link |
| Status | badge, label (status pill), progress bar, sticker (avatar) |
| Feedback and overlays | alert and toast, tooltip, popover, modal, empty state |
| Forms | input (text, text area, select, input group), checkbox, radio, toggle, search |
| Navigation | navigation bar, vertical nav, tabs, breadcrumb, pagination |
| Data | table, card (including the metrics stat tile), dropdown, stat, data point, project summary |
| Page layout | app header, page header, panel, activity item, segmented control |

Each component has its own folder in `components/`, with a CSS file, stories, and JS where it needs behavior. Every CSS file starts with a comment giving the Figma component and node ID it came from, and how the Figma props map to classes.

## Portal prototype

`prototype/` holds the portal screens, built only from the design system: plain HTML, one page-layout stylesheet (`prototype.css`) and a small script per page for mock data and behavior.

| Page | File | Figma |
|---|---|---|
| Home (customer landing page) | `prototype/index.html`, `home.js` | Customer Dashboard, 17986:1656 |

Run `npm run dev` and open http://localhost:6020/prototype/. The page needs a server because it loads component JS as ES modules.

## Colors differ from Figma

This system uses the **updated** palette worked out for the portal: primary is a real tint/shade scale of #1E293B, the status ramps are muted, and the chart ramps are rebalanced. The Figma variables still hold the original values. [docs/figma-variable-updates.md](docs/figma-variable-updates.md) lists the 128 variables to change so Figma matches, and the Storybook Foundations → Colors page shows the old value under each changed token.

## Figma issues

These are places where the Figma components are inconsistent or broken. The code doesn't copy them; each entry says what it does instead, and the same notes are in each component's CSS header. Items marked "needs a design decision" were kept as they are in Figma.

### Badge, label, sticker, link, progress bar
- **Label (small size):** it's inconsistent. Only the Neutral Outline and Translucent small labels are really small (22px, X-Small Semibold). The small Translucent status labels are 27px in Small Regular, and small Outline and Solid are the same as Large. In code, every small label follows the Neutral small spec.
- **Badge (translucent Success):** the text uses `success` where the other types use `<type>-d1`. Code uses `success-d1`.
- **Badge (translucent Primary, dark mode):** the `primary-l1` text has poor contrast. Code uses `primary-l2`.
- **Badge (solid Primary, dark mode):** it's navy on dark, nearly invisible on the nav bar. Kept as Figma has it, and needs a design decision.
- **Translucent badges:** Primary is 40% alpha but the status types are 4%, so status badges look almost unfilled. Kept as in the tokens.
- **Sticker:** square Image stickers have a 4px radius but Icon and Initial have 8px. Square stickers have no border, so they disappear on white. Kept as in Figma.
- **Link:** there's no focus state in Figma. Code adds the standard focus ring.
- **Progress bar:** the "Flexible" variant isn't built. The 0% variants have no auto-layout, and the check icon's vector uses an untokenized #6B6C7E (covered by the success fill).
### Tabs, navigation bar, vertical nav, breadcrumb, pagination
- **Nav bar (Inverted):** it's drawn for a black background. The gray-200 text and primary-d1 active pill would be invisible on the portal's primary-d1 bar. Code uses primary-l2 text, a `primary` active pill and a primary-d2 hover.
- **Nav bar (Bar style):** there's no hover state in Figma. Kept that way.
- **Nav bar (Default):** the items include a Badge, which the code leaves out. Add a `.ws-badge` inside the item if it's needed.
- **Vertical nav:** there are no Dark + Decorated item variants, so code adds them (a primary-l0 rail, primary-l2 when selected). Dark Selected fills with primary-d1, which disappears on dark, so code uses `primary`.
- **Vertical nav (Dark Level-2 Focus):** it has a stray black 1px stroke, and Level-2 Focus shows a chevron no other Level-2 state has. Neither is copied. Left icons are mixed 16px and 18px; code uses 16px.
- **Vertical nav (set's "Style" prop):** it's really Null/Primary (the gap between groups), not Transparent/Decorated, which live on the item.
- **Breadcrumb:** the separator icon is a raw #6B6C7E. Code uses gray-900.
- **Pagination:** "10 Items" is now "10 items" (sentence case).
### Input, checkbox, radio, toggle, search
- **Input and Search (focus):** the focus border uses "Focused Outline inputs" (#88ACFF), which isn't a variable in the collection. Code uses `focus-outer` plus the standard focus ring. The focused Input fill is a raw #FFFFFF.
- **Radio (focus):** the outer ring uses primary-l0 instead of Focus - Outer. Code uses the standard ring.
- **Toggle:** there's no focus variant. Search focus shows only a border change. Code adds the standard ring to both.
- **Radius:** it's inconsistent. Search Small/Auto is 4px while the others are 8px. Input-group addons and buttons have 4px outer corners but fields have 8px. Code uses 8px throughout.
- **Text area:** 93px tall at Regular, 96px at Small. Code uses 96px.
- **Required marker:** it's `warning` (orange) where Clay uses danger. Kept as in Figma, but needs a design decision.
- **Icons:** the vectors carry a raw #1C1B1F / #1F1F1F under the token fill layer.
### Table, card, dropdown
- **Table (row height):** body rows are 64px only when the checkbox column is on. Code uses 56px (40px condensed). Header cells have 20px padding inside a fixed 56px.
- **Table (header dividers):** variants with Border Column=No still show header dividers, which `_Row` doesn't. Code follows `_Row`.
- **Table (collapse icon):** `_Cell Body Title` uses angle-down for both collapsed and expanded. Code uses angle-right when collapsed.
- **Surface (Active):** the shadow is an unnamed effect (0 4px 4px 8%). Code uses `shadow-card-default`.
- **Metrics card:** it shows "$" and "%" together.
- **Card body padding:** it's 16/8/16/16. Code uses 16px all round. The Navigation icon has a raw #1C1B1F fill.
- **Dropdown:** the Drilldown bar and footer caption use the old Clay "secondary" colors and legacy "14/Semibold" text styles. Code uses gray-600/gray-200 and Paragraph/Small. The item focus ring is inset. Code uses the standard ring.
- **Icons:** there's no aircraft icon in the Clay sprite, so a portal-specific icon is worth adding.
### Alert, tooltip, popover, modal, empty state
- **Tooltip:** side arrows sit 8px from one corner and 6px from the other. Code uses 8px.
- **Modal:** the header and footer carry hidden borders and 4px radii that don't match the 16px modal. There's no shadow effect, so code adds `shadow-modal`. The overlay is gray-700 at 80% layer opacity.
- **Empty state:** "With Animation" has no motion defined, so code adds a subtle float (off for reduced motion). "Without Animation" exists only at the small size. Each illustration is about 40 masked fragments; they're exported as one SVG each.
- **Alert:** the close button is absolutely positioned in the Vertical variant. Code uses flexbox.

### Customer landing page (17986:1656)
- **Copy:** placeholder text ("Work Order #", "(Company Name)", "Status?", "This is an example of a line item") is replaced with realistic mock data, and headings are in sentence case. "Paid to date" shows $678,607 instead of the typo "$678,6078".
- **Top bar:** it's gray-900 in Figma. The prototype uses the portal's primary-d1 nav (Navigation Bar, Inverted). The nav items for pages that aren't built yet are shown disabled.
- **Filter:** the selected segmented item has a raw white fill, a raw black border and square corners on a rounded track. Code uses white, a gray-900 border and full rounding.
- **Discrepancy meter:** it uses success at 50% alpha and a raw #D9D9D9. Code uses `success-l1` and `gray-300`.
- **Icons:** the stat and alert icons are filled with original-palette hex values. Code colors them with tokens. `payments`, `draft` and `timelapse` aren't in the Clay sprite, so they're exported from Figma to `assets/icons-extra/` and drawn as masks.
- **Financial panel:** it uses a gray-300 border and 8px gap where the other panels use gray-200 and 16px. Code uses one panel style throughout.
- **Section titles:** they're 20px, which is off the type scale.

## Contributing

`CLAUDE.md` has the conventions: token names, class naming, states, how stories are structured, and how to pull specs from Figma.
