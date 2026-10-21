import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { asc } from "drizzle-orm";
import { TestimonialsManager } from "./TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.order));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Testimonials</h1>
        <p className="mt-1 text-sm text-slate-500">Manage client testimonials shown on your website.</p>
      </div>
      <TestimonialsManager initialTestimonials={rows} />
    </div>
  );
}
