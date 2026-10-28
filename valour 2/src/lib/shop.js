// Shop listing rules: category groups, filter options and matching. Pure, no React.

const TYPE_NAMES = { watch: 'Watches', strap: 'Straps', custom: 'Custom' };

/**
 * Category tabs from the database categories: top-level categories that have products
 * (their own or a sub-category's), each with its sub-categories that have products.
 * With no usable categories yet, products are grouped by type (Watches, Straps).
 */
export function buildGroups(categories, products) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const children = new Map();
  for (const c of categories) {
    const parent = c.parentId && byId.has(c.parentId) ? c.parentId : null;
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent).push(c);
  }
  // Category ids under (and including) `id`; the seen set also stops bad data loops.
  const subtree = (id, seen = new Set()) => {
    if (seen.has(id)) return seen;
    seen.add(id);
    for (const c of children.get(id) ?? []) subtree(c.id, seen);
    return seen;
  };
  const toGroup = (c, depth) => {
    const ids = subtree(c.id);
    const match = (p) => ids.has(p.categoryId);
    return {
      slug: c.slug, name: c.name, match,
      count: products.filter(match).length,
      children: depth === 0 ? (children.get(c.id) ?? []).map((k) => toGroup(k, 1)).filter((g) => g.count) : [],
    };
  };
  const top = (children.get(null) ?? []).map((c) => toGroup(c, 0)).filter((g) => g.count);
  if (top.length) return top;

  const types = [...new Set(products.map((p) => p.type).filter(Boolean))];
  return types.map((type) => {
    const match = (p) => p.type === type;
    return { slug: type, name: TYPE_NAMES[type] ?? labelOf(type), match, count: products.filter(match).length, children: [] };
  });
}

/** The tab and (optional) sub-category for a slug; nulls mean "All". */
export function findGroup(groups, slug) {
  for (const top of groups) {
    if (top.slug === slug) return { top, sub: null };
    const sub = top.children.find((c) => c.slug === slug);
    if (sub) return { top, sub };
  }
  return { top: null, sub: null };
}

export const FILTERS = [
  { key: 'collection', label: 'Collection' },
  { key: 'movement', label: 'Movement' },
  { key: 'material', label: 'Material' },
  { key: 'color', label: 'Colour' },
];

export const labelOf = (value) => String(value).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Filters that have at least one value among these products, each with its sorted options. */
export function filterOptions(products) {
  return FILTERS.map((f) => {
    const seen = new Map();
    for (const p of products) {
      const v = p[f.key];
      if (v && !seen.has(v)) seen.set(v, p.accent);
    }
    const options = [...seen].map(([value, accent]) => ({ value, label: labelOf(value), accent }));
    return { ...f, options: options.sort((a, b) => a.label.localeCompare(b.label)) };
  }).filter((f) => f.options.length);
}

/** Active filters are { key: value }; a product must match every one. */
export const matchesFilters = (product, active) => Object.entries(active).every(([k, v]) => product[k] === v);

const usd = (digits) => new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: 2 });
const whole = usd(0);
const cents = usd(2);
/** "$525", "$1,099.50"; null means no confirmed price. */
export const formatPrice = (amount) =>
  amount == null ? 'Price on request' : `$${(Number.isInteger(amount) ? whole : cents).format(amount)}`;
