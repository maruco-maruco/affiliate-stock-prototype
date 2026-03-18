import { AdminDashboard } from "@/components/AdminDashboard";
import { requireRole } from "@/lib/auth";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  const session = await requireRole("company");
  const initialProducts = await listProducts();

  return (
    <main>
      <AdminDashboard initialProducts={initialProducts} userLabel={session.displayName} />
    </main>
  );
}
