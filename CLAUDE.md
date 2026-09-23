# West Star Aviation — Design System

The design system for the West Star Aviation (WSA) customer portal: tokens, plain HTML/CSS components, and a Storybook for developer handoff. The full portal prototype will be built from these components next. The source prototype is in the sibling repo `../wsa-portal-prototype`.

## Sources of truth

- **Figma:** file `elT7RbG4bvfjAkS8SRtk6f` ("gs-weststar-implementation"). The components are on the page **💠 Clay Components** (`1:33`), and the icons on **Icons** (`5902:2011`). The components are built on Liferay Clay/Lexicon.
- **Color:** `tokens/foundations.json`. It has the Figma variable names and IDs, but carries the **updated** palette from the portal prototype work (a true primary tint/shade scale, muted status ramps, and re-balanced chart ramps). Figma itself still has the original values, which are kept in `tokens/foundations.figma-original.json`. When Figma and `foundations.json` disagree on a color, `foundations.json` wins.
- **Everything else** (spacing, radius, type, shadows, component specs) comes from Figma.

## Stack

- Plain HTML, CSS and vanilla JS. There's no framework and no build step for consumers. Developers will re-implement the portal from this system rather than import its code.
- The token build is Style Dictionary v4: `npm run tokens` turns `tokens/*.json` into `css/tokens.css`. Never edit `css/tokens.css` by hand.
- Storybook 9 (`@storybook/html-vite`) runs with `npm run storybook` on port 6010.
- Icons come from the Clay/Lexicon sprite at `assets/icons.svg`. Its names match the Figma Icons page (`check`, `times`, `caret-bottom`, `angle-right`, and so on).

## Layout

```
tokens/         foundations.json (color, spacing, radius, opacity), typography.json, effects.json, semantic.json
scripts/        build-tokens.mjs, figma-spec.js (paste into use_figma to dump a component set's styling)
css/            tokens.css (generated), base.css (reset, type ramp, icons, focus ring), index.css (entry point)
components/<name>/<name>.css           one component per folder
components/<name>/<name>.stories.js    its Storybook stories
stories/        helpers.js (icon, cx, matrix, STATES), storybook.css (Storybook-only), docs pages
assets/         icons.svg, plus any images components need
```

## Token names (CSS custom properties)

| Figma | CSS | Example |
|---|---|---|
| Color/<group>/<name> | `--color-<name>` | `--color-primary-d1`, `--color-success-l2`, `--color-gray-600` |
| "…4%" alpha steps | `--color-<name>-4` | `--color-primary-d1-4` (primary is 0.4 alpha; status colors are 0.04) |
| Spacing | `--spacing-N` | `--spacing-3` = 8px (0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 96, 120) |
| Border Radius | `--rounded-*` | `--rounded-sm` 2, `-md` 4, `-lg` 8, `-xlg` 16, `-full` 999 |
| Opacity | `--translucent-N` | `--translucent-1` = 0.4 (used for disabled) |
| Shadow/* effect styles | `--shadow-*` | `--shadow-card-default`, `--shadow-dropdown`, `--shadow-modal` |
| Typography sizes (responsive) | `--font-size-*` | `--font-size-h1`, `--font-size-paragraph-small` |
| Font weights / line heights | `--font-weight-*`, `--font-line-height-*` | `--font-weight-semibold` (600) |
| Paint styles | `--<group>-<name>` | `--action-primary-hover`, `--table-stripe`, `--card-outline`, `--text-placeholder` |

These names match the portal prototype's `--color-*` variables exactly: all 154 were checked.

## Component conventions (follow `components/button/` as the reference)

- **Class names:** prefix `ws-`, BEM style. The block is `.ws-<name>`, elements are `.ws-<name>__<part>`, and modifiers are `.ws-<name>--<variant>`.
- **Mapping Figma props:** each variant property becomes modifier classes, and boolean props become optional child elements. Put a header comment in each CSS file giving the Figma component set name and node ID, and the props → classes mapping.
- **States:** use real pseudo-classes (`:hover`, `:focus-visible`, `:active`, `:disabled`, `:checked`). Also add the matching static classes `.is-hover`, `.is-focus`, `.is-active` and `.is-disabled`, so stories can show every state side by side.
- **Focus:** always `box-shadow: var(--ws-focus-ring)`.
- **Disabled:** use `opacity: var(--translucent-1)` unless Figma says otherwise.
- **Values:** use tokens only. Never raw hex. Use `--spacing-*` for spacing values on the scale; a literal px value is fine only when Figma uses an off-scale number (e.g. `9.5px`). Use `--font-*` tokens for type.
- **Local custom properties:** if a component has several color variants, define local properties such as `--btn-bg` on the block and override them per modifier (see button.css).
- **Interactive components** (modal, dropdown, tabs, tooltip, popover, toggle) need only minimal vanilla JS. Put it in `components/<name>/<name>.js` as small exported functions (e.g. `initTabs(root)`), and use it in the stories.
- **Stories** (CSF3, `@storybook/html`; see `button.stories.js`):
  - `title: 'Components/<Name>'`, `tags: ['autodocs']`, and a docs description that includes the Figma node ID.
  - Export a render function for the markup (e.g. `export const badge = (args) => ...`) so other stories and the prototype can reuse it. Name helpers in lowercase and set `excludeStories: /^[a-z]/` in the default export, so Storybook doesn't list them as stories.
  - A `Playground` story with controls for every Figma prop.
  - One or more "all variants" stories built with `matrix()` from `stories/helpers.js`, covering every variant × state that exists in Figma.
- **Copy:** sentence case, with realistic aviation MRO examples where copy is needed (tail numbers like N375MZ, squawks, AOG, work orders, invoices).

## Figma workflow

- Before any Figma MCP call, load the skills: `figma:figma-use` before `use_figma`, and `figma:figma-design-to-code` before `get_design_context`.
- The fastest way to get exact specs is `scripts/figma-spec.js` pasted into `use_figma`. Set `SET_ID` and `FILTER`. It returns fills, strokes, radius, auto-layout padding and gap, effects and text styles, with variable names (`$primary-d1`) instead of hex. Keep `MAX_VARIANTS` low; some sets have hundreds of variants.
- Use `get_screenshot` on a component set to see the visual target.
- Where a Figma color resolves to an original (pre-update) value, use the token by name. The name is what matters, because `foundations.json` holds the updated value.
- If Figma has an obvious mistake (an untokenized hex, unreadable contrast), don't copy it. Use the nearest correct token, note it in the CSS comment, and add it to the "Figma issues" list in README.md.

## Verify

- Run `npm run storybook`, open `http://localhost:6010/iframe.html?id=components-<name>--<story>`, and screenshot it. Compare against the Figma screenshot of the same variants.
- Every story must render without console errors.

## Next: the portal prototype

Build the portal pages and screens from these components. Use the existing prototype (`../wsa-portal-prototype/prototype/index.html` and its `CLAUDE.md`) as the reference for content, page structure and interactions: all projects, overview, quote, squawks, activity, finances, documents, messages, timeline and notifications. The Figma pages under PLANNING (Customer Landing Page, PM Dashboard, Project Specific Dashboard, Fleet Dashboard, Squawk Management, All Projects) and IN DESIGN (Profile, Theme, Communication Preferences) hold the newer screen designs. Compose pages from `ws-*` components. Add page-level layout CSS only where no component covers it, and add a new component (with stories) rather than one-off styles when a pattern repeats.
