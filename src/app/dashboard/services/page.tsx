import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ServicesManager } from "./ServicesManager";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const rows = await db.select().from(services).orderBy(asc(services.order));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Services</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the services shown on your website.</p>
      </div>
      <ServicesManager initialServices={rows} />
    </div>
  );
}
