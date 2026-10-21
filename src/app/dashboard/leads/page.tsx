import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";
import { LeadsManager } from "./LeadsManager";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Contact form submissions from your website visitors.
        </p>
      </div>
      <LeadsManager initialLeads={rows} />
    </div>
  );
}
