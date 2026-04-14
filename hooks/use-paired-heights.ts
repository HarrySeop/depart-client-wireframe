"use client"

import { useCallback, useEffect, useRef } from "react"

export function usePairedHeights(enabled: boolean) {
  const leftRefs = useRef(new Map<string, HTMLElement>())
  const rightRefs = useRef(new Map<string, HTMLElement>())
  const observerRef = useRef<ResizeObserver | null>(null)
  const skipRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const applySync = useCallback(() => {
    if (!enabled) return
    if (skipRef.current) return
    skipRef.current = true
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const keys = new Set<string>([
        ...leftRefs.current.keys(),
        ...rightRefs.current.keys(),
      ])
      keys.forEach((key) => {
        const l = leftRefs.current.get(key)
        const r = rightRefs.current.get(key)
        if (l) l.style.minHeight = ""
        if (r) r.style.minHeight = ""
      })
      keys.forEach((key) => {
        const l = leftRefs.current.get(key)
        const r = rightRefs.current.get(key)
        if (!l || !r) return
        const max = Math.max(l.offsetHeight, r.offsetHeight)
        l.style.minHeight = `${max}px`
        r.style.minHeight = `${max}px`
      })
      requestAnimationFrame(() => {
        skipRef.current = false
      })
    })
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      leftRefs.current.forEach((el) => {
        el.style.minHeight = ""
      })
      rightRefs.current.forEach((el) => {
        el.style.minHeight = ""
      })
      observerRef.current?.disconnect()
      observerRef.current = null
      return
    }
    const ro = new ResizeObserver(() => applySync())
    observerRef.current = ro
    leftRefs.current.forEach((el) => ro.observe(el))
    rightRefs.current.forEach((el) => ro.observe(el))
    applySync()
    return () => {
      ro.disconnect()
      observerRef.current = null
    }
  }, [enabled, applySync])

  const registerLeft = useCallback(
    (key: string, el: HTMLElement | null) => {
      const prev = leftRefs.current.get(key)
      if (prev && prev !== el) {
        observerRef.current?.unobserve(prev)
        prev.style.minHeight = ""
      }
      if (el) {
        leftRefs.current.set(key, el)
        observerRef.current?.observe(el)
      } else {
        leftRefs.current.delete(key)
      }
      applySync()
    },
    [applySync],
  )

  const registerRight = useCallback(
    (key: string, el: HTMLElement | null) => {
      const prev = rightRefs.current.get(key)
      if (prev && prev !== el) {
        observerRef.current?.unobserve(prev)
        prev.style.minHeight = ""
      }
      if (el) {
        rightRefs.current.set(key, el)
        observerRef.current?.observe(el)
      } else {
        rightRefs.current.delete(key)
      }
      applySync()
    },
    [applySync],
  )

  return { registerLeft, registerRight }
}
