"use client"

import { motion } from "framer-motion"

import type { AuthSlide } from "@/constants/auth-slides"

export function PollPreviewCard({ poll }: { poll: AuthSlide["poll"] }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-xs text-white/70">
        <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
        Live poll
      </div>
      <p className="mb-4 text-sm font-semibold text-white">{poll.question}</p>
      <div className="flex flex-col gap-3">
        {poll.options.map((option, i) => (
          <div key={option.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-white/80">
              <span>{option.label}</span>
              <span>{option.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${option.value}%` }}
                transition={{ duration: 0.8, delay: 0.15 * i, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
