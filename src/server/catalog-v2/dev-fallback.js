// Local development only: when the database is unreachable, the storefront reads
// fall back to the static catalog (src/data/catalog.js) so pages can still be
// viewed. Production never falls back: it rethrows, as before.
import 'server-only'
import { getProductBySlug, getProductsByType, getRelatedProducts } from '@/data/catalog.js'
import { getRelatedStorefrontProducts, getStorefrontProduct, listStorefrontCategories, listStorefrontProducts } from './storefront.js'

async function withDevFallback(read, fallback) {
  try {
    return await read()
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error
    console.warn('[storefront] database unavailable, using static catalog:', error.message.split('\n').pop())
    return fallback()
  }
}

export const listProducts = (type) =>
  withDevFallback(() => listStorefrontProducts(type), () => getProductsByType(type))

// The static catalog has no categories.
export const listCategories = () => withDevFallback(() => listStorefrontCategories(), () => [])

export const getProduct = (slug) =>
  withDevFallback(() => getStorefrontProduct(slug), () => getProductBySlug(slug) ?? null)

export const getRelated = (product) =>
  withDevFallback(() => getRelatedStorefrontProducts(product), () => getRelatedProducts(product))
