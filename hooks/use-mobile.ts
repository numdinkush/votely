import * as React from "react"

// Keep in sync with `--breakpoint-xs` in globals.css (30rem = 480px).
// Below this width the sidebar becomes a drawer; above it, a collapsible rail.
const MOBILE_BREAKPOINT = 480
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
