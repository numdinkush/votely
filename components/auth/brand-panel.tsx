"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { PollPreviewCard } from "@/components/auth/poll-preview-card"
import { AUTH_SLIDES, SLIDE_INTERVAL_MS } from "@/constants/auth-slides"
import { cn } from "@/lib/utils"

export function BrandPanel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % AUTH_SLIDES.length),
      SLIDE_INTERVAL_MS
    )
    return () => clearInterval(id)
  }, [])

  const slide = AUTH_SLIDES[index]
  const Icon = slide.icon

  return (
    <aside className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-10 lg:p-12">
      <motion.div
        className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -left-24 size-96 rounded-full bg-fuchsia-300/20 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="relative z-10 flex w-full flex-col items-center gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <PollPreviewCard poll={slide.poll} />
          <div className="flex max-w-md flex-col items-center gap-3 text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15">
              <Icon className="size-5" />
            </span>
            <h2 className="text-2xl font-semibold">{slide.title}</h2>
            <p className="text-sm text-white/75">{slide.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex gap-2">
        {AUTH_SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full bg-white transition-all",
              i === index ? "w-8" : "w-1.5 opacity-40"
            )}
          />
        ))}
      </div>
    </aside>
  )
}
