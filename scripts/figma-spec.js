// Paste into the Figma MCP `use_figma` tool (file elT7RbG4bvfjAkS8SRtk6f) to dump the
// styling of a component set's variants, with Figma variable/style names instead of raw values.
// Set SET_ID and FILTER (substring match on the variant name, or '' for all) before running.
const SET_ID = '145:26649';
const FILTER = (name) => /State=Default/.test(name);
const MAX_VARIANTS = 24;
const MAX_DEPTH = 4;

const page = await figma.getNodeByIdAsync('1:33');
await figma.setCurrentPageAsync(page);
const set = await figma.getNodeByIdAsync(SET_ID);
const varName = async (id) => (await figma.variables.getVariableByIdAsync(id))?.name.split('/').pop();
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

async function paints(node, key) {
  const list = node[key];
  if (!Array.isArray(list) || !list.length) return undefined;
  const out = [];
  for (const p of list) {
    if (p.visible === false) continue;
    if (p.type !== 'SOLID') { out.push(p.type); continue; }
    const v = p.boundVariables?.color ? await varName(p.boundVariables.color.id) : null;
    out.push((v ? `$${v}` : hex(p.color)) + (p.opacity < 1 ? `@${Math.round(p.opacity * 100) / 100}` : ''));
  }
  return out.length ? out.join(',') : undefined;
}

async function describe(node, depth) {
  if (node.visible === false) return null;
  const d = { n: node.name, t: node.type, w: Math.round(node.width), h: Math.round(node.height) };
  const fill = await paints(node, 'fills'); if (fill) d.fill = fill;
  const stroke = await paints(node, 'strokes'); if (stroke) { d.stroke = stroke; d.sw = node.strokeWeight; }
  if ('cornerRadius' in node && node.cornerRadius) d.r = node.cornerRadius === figma.mixed ? [node.topLeftRadius, node.topRightRadius, node.bottomRightRadius, node.bottomLeftRadius] : node.cornerRadius;
  if ('layoutMode' in node && node.layoutMode !== 'NONE') {
    d.layout = `${node.layoutMode} gap${node.itemSpacing} pad${node.paddingTop},${node.paddingRight},${node.paddingBottom},${node.paddingLeft} ${node.primaryAxisAlignItems}/${node.counterAxisAlignItems}`;
  }
  if ('effects' in node && node.effects.length) {
    d.fx = node.effectStyleId ? (await figma.getStyleByIdAsync(node.effectStyleId))?.name : node.effects.map((e) => e.type).join(',');
  }
  if ('opacity' in node && node.opacity < 1) d.op = node.opacity;
  if (node.type === 'TEXT') {
    d.text = node.characters.slice(0, 40);
    const style = node.textStyleId && node.textStyleId !== figma.mixed ? (await figma.getStyleByIdAsync(node.textStyleId))?.name : null;
    d.font = style || (node.fontName !== figma.mixed ? `${node.fontName.family} ${node.fontName.style} ${String(node.fontSize)}` : 'mixed');
  }
  if (node.type === 'INSTANCE') {
    const main = await node.getMainComponentAsync();
    d.of = main ? (main.parent?.type === 'COMPONENT_SET' ? `${main.parent.name}[${main.name}]` : main.name) : '?';
    if (depth > 1) return d; // don't expand nested components beyond the first level
  }
  if ('children' in node && depth < MAX_DEPTH) {
    const kids = [];
    for (const c of node.children) { const k = await describe(c, depth + 1); if (k) kids.push(k); }
    if (kids.length) d.c = kids;
  }
  return d;
}

const variants = set.children.filter((c) => FILTER(c.name)).slice(0, MAX_VARIANTS);
const out = [];
for (const v of variants) out.push(await describe(v, 0));
return { set: set.name, total: set.children.length, shown: variants.length, variants: out };
