import Shop from '@/components/shop/Shop';
import { getShopCatalog } from '@/lib/shop-catalog';
import './shop.css';

export const metadata = {
  title: 'Shop — Valour',
  description:
    'Shop the Valour Lucent collection and straps: Grade 5 titanium, an automatic movement and a dial built from light.',
};

// Read on every request: products published in the admin appear on the next load.
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  const [{ category }, catalog] = await Promise.all([searchParams, getShopCatalog()]);
  return (
    <Shop
      categories={catalog.categories}
      products={catalog.products}
      unavailable={catalog.error}
      initialCategory={typeof category === 'string' ? category : null}
    />
  );
}
