import HomeClient from './HomeClient'
import { listProducts } from '@/server/catalog-v2/dev-fallback'

// Read on every request so the watch carousel shows newly published database
// watches (and stops showing archived ones) on the next load.
export const dynamic = 'force-dynamic'

export default async function Home() {
  return <HomeClient watches={await listProducts('watch')} />
}
