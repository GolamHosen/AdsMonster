import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SubscribersManager } from "./SubscribersManager";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Newsletter Subscribers</h1>
        <p className="mt-1 text-sm text-slate-500">
          Everyone who signed up for updates from your website.
        </p>
      </div>
      <SubscribersManager initialSubscribers={rows} />
    </div>
  );
}
