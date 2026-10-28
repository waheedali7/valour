// GET /api/storefront/catalog/ — public, read-only. Published watches and straps
// (card fields only) and the active product categories, for shop listings such
// as the Valour 2 site. Drafts, inactive and deleted rows are never included.
// Like /our-shop/, local development falls back to the static catalog when the
// database is down; production answers 503 instead.
import { listCategories, listProducts } from '@/server/catalog-v2/dev-fallback'
import { toShopCard } from '@/server/catalog-v2/storefront'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }

export async function GET() {
  try {
    const [watches, straps, categories] = await Promise.all([listProducts('watch'), listProducts('strap'), listCategories()])
    return Response.json({ categories, products: [...watches, ...straps].map(toShopCard) }, { headers: HEADERS })
  } catch (error) {
    // Database details stay in the server log, never in the response.
    console.error('[storefront/catalog] read failed:', error.message.split('\n').pop())
    return Response.json({ error: 'catalog_unavailable' }, { status: 503, headers: HEADERS })
  }
}
