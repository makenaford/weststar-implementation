import foundations from '../tokens/foundations.json';
import original from '../tokens/foundations.figma-original.json';
import typography from '../tokens/typography.json';
import effects from '../tokens/effects.json';
import semantic from '../tokens/semantic.json';
import iconsSprite from '../assets/icons.svg?raw';
import { icon } from './helpers.js';

const slug = (s) => String(s).toLowerCase().replace(/%/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isToken = (o) => o && typeof o === 'object' && '$type' in o;
const hexOf = (t) => (t && typeof t.$value === 'object' ? t.$value.hex.toUpperCase() : null);
const alphaOf = (t) => (t && typeof t.$value === 'object' ? Math.round(t.$value.alpha * 100) / 100 : 1);

const style = `
<style>
  .fd { font-family: var(--font-family); color: var(--color-gray-900); }
  .fd h2 { font-size: 20px; font-weight: 600; margin: 32px 0 4px; }
  .fd h2:first-child { margin-top: 0; }
  .fd p.note { margin: 0 0 16px; font-size: 13px; color: var(--color-gray-600); max-width: 760px; }
  .fd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
  .fd-swatch { border: 1px solid var(--color-gray-200); border-radius: var(--rounded-lg); overflow: hidden; background: var(--color-white); }
  .fd-chip { height: 64px; background-image: linear-gradient(45deg, var(--color-gray-200) 25%, transparent 25%, transparent 75%, var(--color-gray-200) 75%), linear-gradient(45deg, var(--color-gray-200) 25%, transparent 25%, transparent 75%, var(--color-gray-200) 75%); background-size: 12px 12px; background-position: 0 0, 6px 6px; position: relative; }
  .fd-chip > span { position: absolute; inset: 0; }
  .fd-meta { padding: 8px 10px; font-size: 11px; line-height: 1.5; }
  .fd-meta b { display: block; font-size: 12px; font-weight: 600; }
  .fd-meta code { font-size: 11px; color: var(--color-gray-700); }
  .fd-meta s { color: var(--color-gray-500); }
  .fd-table { border-collapse: collapse; font-size: 13px; width: 100%; max-width: 960px; }
  .fd-table th, .fd-table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--color-gray-200); vertical-align: middle; }
  .fd-table th { font-size: 12px; font-weight: 600; color: var(--color-gray-600); }
  .fd-table code { font-size: 12px; }
  .fd-icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 8px; }
  .fd-icon { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 4px; border: 1px solid var(--color-gray-200); border-radius: var(--rounded-lg); font-size: 11px; color: var(--color-gray-700); text-align: center; word-break: break-all; }
  .fd-icon .ws-icon { width: 20px; height: 20px; color: var(--color-primary); }
  .fd-search { font: inherit; font-size: 14px; padding: 8px 12px; border: 1px solid var(--color-gray-400); border-radius: var(--rounded-md); width: 280px; margin-bottom: 16px; }
</style>`;

function swatch(name, token, origToken) {
  const cssVar = `--color-${slug(name)}`;
  const hex = hexOf(token);
  const a = alphaOf(token);
  const was = hexOf(origToken);
  const origRef = origToken?.$value;
  const wasLabel = typeof origRef === 'string' ? origRef.replace(/[{}]/g, '').split('.').pop() : was;
  const changed = wasLabel && wasLabel !== hex;
  return `<div class="fd-swatch">
    <div class="fd-chip"><span style="background: var(${cssVar})"></span></div>
    <div class="fd-meta"><b>${name}</b><code>${cssVar}</code><br>${hex}${a < 1 ? ` · ${a * 100}%` : ''}${changed ? `<br><s>Figma: ${wasLabel}</s>` : ''}</div>
  </div>`;
}

function colorGroup(group, tokens) {
  const entries = Object.entries(tokens).filter(([, t]) => isToken(t) && t.$type === 'color');
  return `<div class="fd-grid">${entries.map(([n, t]) => swatch(n, t, original.Color?.[group]?.[n])).join('')}</div>`;
}

export default {
  title: 'Foundations',
  parameters: { layout: 'padded', controls: { disable: true } },
};

export const Colors = {
  render: () => {
    const c = foundations.Color;
    const groups = ['Primary', 'Grays', 'Success', 'Info', 'Warning', 'Danger', 'Utility'];
    return `${style}<div class="fd">
      <p class="note">Values come from <code>tokens/foundations.json</code>, with the Figma variable names and the updated palette. A struck-through "Figma" value means the Figma file still holds the original value and needs updating.</p>
      ${groups.map((g) => `<h2>${g}</h2>${colorGroup(g, c[g])}`).join('')}
    </div>`;
  },
};

export const ChartColors = {
  name: 'Chart colors',
  render: () => {
    const charts = foundations.Color.Charts;
    const order = ['Blue', 'Orange', 'Teal', 'Pink', 'Yellow', 'Indigo', 'Green', 'Red', 'Cyan', 'Purple'];
    return `${style}<div class="fd">
      <p class="note">Ten families, each with nine steps (d4 to l4). For categorical series, use the family bases in this order: ${order.join(', ').toLowerCase()}. For sequential data, use one family from light to dark.</p>
      ${order.map((f) => `<h2>${f}</h2><div class="fd-grid" style="grid-template-columns: repeat(9, minmax(90px, 1fr))">${Object.entries(charts[f]).filter(([, t]) => isToken(t)).map(([n, t]) => swatch(n, t, original.Color.Charts?.[f]?.[n])).join('')}</div>`).join('')}
    </div>`;
  },
};

export const SemanticColors = {
  name: 'Semantic colors',
  render: () => {
    const rows = Object.entries(semantic)
      .filter(([k]) => !k.startsWith('$'))
      .flatMap(([group, tokens]) =>
        Object.entries(tokens).map(([name, t]) => {
          const cssVar = `--${slug(group)}-${slug(name)}`;
          const ref = t.$value.replace(/[{}]/g, '').split('.').pop();
          return `<tr><td><span style="display:inline-block;width:32px;height:20px;border-radius:4px;border:1px solid var(--color-gray-300);background:var(${cssVar})"></span></td><td>${group} / ${name}</td><td><code>${cssVar}</code></td><td><code>var(--color-${slug(ref)})</code></td></tr>`;
        }),
      );
    return `${style}<div class="fd"><p class="note">These are the Figma paint styles, output as aliases, so each one follows its foundation color.</p>
      <table class="fd-table"><thead><tr><th></th><th>Figma style</th><th>CSS variable</th><th>Resolves to</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  },
};

const TYPE = [
  ['Display large', 'ws-text-display-lg', 'display-large'],
  ['Display small', 'ws-text-display-sm', 'display-small'],
  ['H1', 'ws-text-h1', 'h1'],
  ['H2', 'ws-text-h2', 'h2'],
  ['H3', 'ws-text-h3', 'h3'],
  ['H4', 'ws-text-h4', 'h4'],
  ['H5', 'ws-text-h5', 'h5'],
  ['H6', 'ws-text-h6', 'h6'],
  ['Paragraph large', 'ws-text-lg', 'paragraph-large'],
  ['Paragraph base', 'ws-text-base', 'paragraph-base'],
  ['Paragraph small', 'ws-text-sm', 'paragraph-small'],
  ['Paragraph x-small', 'ws-text-xs', 'paragraph-x-small'],
  ['Small caps', 'ws-text-caps', 'paragraph-small'],
  ['Small caps (tiny)', 'ws-text-caps-xs', 'paragraph-x-small'],
];

export const Typography = {
  render: () => {
    const sizes = typography.Size;
    return `${style}<div class="fd">
      <p class="note">Montserrat 400/500/600/700. Sizes are responsive (mobile 0+, tablet 576+, desktop 1200+), taken from the Figma Typography collection. Add <code>.is-semibold</code>, <code>.is-bold</code> or <code>.is-underline</code> for the weight and underline variants. Figma "Semibold" headings are Medium (500); paragraph Semibold is 600.</p>
      <table class="fd-table"><thead><tr><th>Style</th><th>Class</th><th>Size (m / t / d)</th><th>Regular</th><th>Semibold</th><th>Bold</th></tr></thead><tbody>
      ${TYPE.map(([label, cls, size]) => {
        const s = sizes[size].$value;
        return `<tr><td>${label}</td><td><code>.${cls}</code></td><td>${s.mobile} / ${s.tablet} / ${s.desktop}</td>
          <td><span class="${cls}">Squawk</span></td><td><span class="${cls} is-semibold">Squawk</span></td><td><span class="${cls} is-bold">Squawk</span></td></tr>`;
      }).join('')}
      <tr><td>Action large / base / small</td><td><code>.ws-text-action-lg</code> <code>.ws-text-action</code> <code>.ws-text-action-sm</code></td><td>18 / 16 / 14</td>
        <td colspan="3"><span class="ws-text-action-lg">Approve</span> &nbsp; <span class="ws-text-action">Approve</span> &nbsp; <span class="ws-text-action-sm">Approve</span></td></tr>
      </tbody></table></div>`;
  },
};

export const SpacingRadiusShadow = {
  name: 'Spacing, radius & shadow',
  render: () => {
    const spacing = Object.entries(foundations.Spacing).filter(([, t]) => isToken(t));
    const radius = Object.entries(foundations['Border Radius']).filter(([, t]) => isToken(t));
    const shadows = Object.entries(effects.Shadow);
    return `${style}<div class="fd">
      <h2>Spacing</h2>
      <table class="fd-table"><tbody>${spacing.map(([n, t]) => `<tr><td style="width:160px"><code>--${n}</code></td><td style="width:60px">${t.$value}px</td><td><span style="display:inline-block;height:12px;width:var(--${n});background:var(--color-info-l1);border-radius:2px"></span></td></tr>`).join('')}</tbody></table>
      <h2>Border radius</h2>
      <div class="sb-row">${radius.map(([n, t]) => `<div style="text-align:center;font-size:12px"><div style="width:72px;height:72px;background:var(--color-primary-l3);border:1px solid var(--color-primary-l2);border-radius:var(--${n});margin-bottom:6px"></div><code>--${n}</code><br>${t.$value}px</div>`).join('')}</div>
      <h2>Shadows</h2>
      <div class="sb-row" style="gap:24px;padding:16px;background:var(--color-gray-100);border-radius:8px">${shadows.map(([n]) => `<div style="width:140px;height:88px;background:var(--color-white);border-radius:var(--rounded-lg);box-shadow:var(--shadow-${n});display:flex;align-items:center;justify-content:center;font-size:12px"><code>--shadow-${n}</code></div>`).join('')}</div>
      <h2>Opacity</h2>
      <p class="note"><code>--translucent-1</code> (0.4) is the disabled opacity. <code>--translucent-2</code> to <code>-4</code> (0.08, 0.06, 0.04) are subtle fills.</p>
    </div>`;
  },
};

export const Icons = {
  render: () => {
    const names = [...iconsSprite.matchAll(/<symbol[^>]*id="([^"]+)"/g)].map((m) => m[1]).sort();
    setTimeout(() => {
      const input = document.getElementById('fd-icon-search');
      input?.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        document.querySelectorAll('.fd-icon').forEach((el) => (el.style.display = el.dataset.name.includes(q) ? '' : 'none'));
      });
    });
    return `${style}<div class="fd">
      <p class="note">${names.length} icons from the Clay/Lexicon sprite (<code>assets/icons.svg</code>). The names match the Figma Icons page. Usage: <code>&lt;svg class="ws-icon"&gt;&lt;use href="icons.svg#check"&gt;&lt;/use&gt;&lt;/svg&gt;</code></p>
      <input id="fd-icon-search" class="fd-search" type="search" placeholder="Filter icons" />
      <div class="fd-icons">${names.map((n) => `<div class="fd-icon" data-name="${n}">${icon(n)}<span>${n}</span></div>`).join('')}</div>
    </div>`;
  },
};
