"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import type { howItWorksSteps } from "@/db/schema";

type Step = typeof howItWorksSteps.$inferSelect;

export function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <section id="how-it-works" className="relative bg-[#104042] py-28 text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#AEFF1C]/8 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#AEFF1C] bg-[#AEFF1C]/10 px-3.5 py-1.5 rounded-full border border-[#AEFF1C]/20">
            <Sparkles className="h-3.5 w-3.5" /> Proven Methodology
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl font-display">
            How We Scale Your Ads
          </h2>
          <p className="mt-4 text-lg text-white/50">
            A battle-tested 4-stage roadmap to transform advertising into your #1 revenue channel.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0c3234]/60 p-7 backdrop-blur-md shadow-xl transition-all hover:border-[#AEFF1C]/40 hover:bg-[#0c3234]/90"
            >
              {/* Step indicator */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-xl bg-[#AEFF1C]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#AEFF1C] border border-[#AEFF1C]/20">
                    Step {String(step.stepNumber ?? index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-2xl font-black text-white/15 group-hover:text-[#AEFF1C]/40 transition-colors font-display">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-white group-hover:text-[#AEFF1C] transition-colors font-display">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-white/30 group-hover:text-[#AEFF1C] transition-colors">
                <span>Phase {index + 1}</span>
                <ArrowRight className="ml-auto h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
