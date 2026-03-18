import { AffiliateCatalog } from "@/components/AffiliateCatalog";
import { requireRole } from "@/lib/auth";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AffiliatePage() {
  const session = await requireRole("affiliate");
  const initialProducts = await listProducts();

  return (
    <main>
      <AffiliateCatalog initialProducts={initialProducts} userLabel={session.displayName} />
    </main>
  );
}
