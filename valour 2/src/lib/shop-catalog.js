// Server only: reads the shop catalog (published products + product categories)
// from the main Valour site, which owns the database. Called on every request so
// admin changes appear on the next page load.
const SITE_URL = (process.env.VALOUR_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
// Only site paths (proxied to the main site by next.config.mjs); anything else is dropped.
const sitePath = (v) => (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') ? v : null);
const HEX = /^#[0-9a-f]{3,8}$/i;

function toProduct(p) {
  const slug = str(p?.slug);
  const name = str(p?.name);
  if (!slug || !name) return null;
  return {
    id: slug, // slugs are unique across watches and straps
    slug,
    name,
    type: str(p.type),
    categoryId: p.categoryId == null ? null : String(p.categoryId),
    sku: str(p.sku),
    image: sitePath(p.image),
    subtitle: str(p.subtitle),
    collection: str(p.collection),
    movement: str(p.movement),
    material: str(p.material),
    color: str(p.color),
    accent: HEX.test(p.accent ?? '') ? p.accent : null,
    limited: p.limited === true,
    price: num(p.price),
    compareAtPrice: num(p.compareAtPrice),
    available: p.available !== false,
    // Product pages still live on the main site.
    href: `${SITE_URL}/our-shop/${encodeURIComponent(slug)}/`,
  };
}

function toCategory(c) {
  const slug = str(c?.slug);
  const name = str(c?.name);
  if (c?.id == null || !slug || !name) return null;
  return { id: String(c.id), parentId: c.parentId == null ? null : String(c.parentId), name, slug };
}

/** { categories, products, error }; error is true when the catalog could not be read. */
export async function getShopCatalog() {
  try {
    const res = await fetch(`${SITE_URL}/api/storefront/catalog/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      // Above the main site's 10 s database wait, so its local-dev fallback can still answer.
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    return {
      categories: (Array.isArray(data.categories) ? data.categories : []).map(toCategory).filter(Boolean),
      products: (Array.isArray(data.products) ? data.products : []).map(toProduct).filter(Boolean),
      error: false,
    };
  } catch (error) {
    console.error('[shop] catalog unavailable:', error.message);
    return { categories: [], products: [], error: true };
  }
}
