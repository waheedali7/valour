import { notFound } from "next/navigation";
import { getProduct, getRelated } from "@/server/catalog-v2/dev-fallback";
import ProductView from "./ProductView";

// Watches and straps by slug: published database products and the static
// catalog (see storefront.js for the merge rule). Read on every request, so admin
// edits appear on the next load; drafts, archived and unknown slugs are a 404.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? `${product.name} | Valour` : "Valour" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelated(product);
  return <ProductView product={product} related={related} />;
}
