"use client"

import { RefObject, useEffect } from "react"

export function useSyncedScroll(
  leftRef: RefObject<HTMLElement | null>,
  rightRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return
    const left = leftRef.current
    const right = rightRef.current
    if (!left || !right) return

    let syncing = false

    const makeHandler = (source: HTMLElement, target: HTMLElement) => () => {
      if (syncing) return
      syncing = true
      const sourceMax = source.scrollHeight - source.clientHeight
      const targetMax = target.scrollHeight - target.clientHeight
      if (sourceMax <= 0) {
        target.scrollTop = 0
      } else {
        const ratio = source.scrollTop / sourceMax
        target.scrollTop = ratio * targetMax
      }
      requestAnimationFrame(() => {
        syncing = false
      })
    }

    const onLeft = makeHandler(left, right)
    const onRight = makeHandler(right, left)
    left.addEventListener("scroll", onLeft, { passive: true })
    right.addEventListener("scroll", onRight, { passive: true })
    return () => {
      left.removeEventListener("scroll", onLeft)
      right.removeEventListener("scroll", onRight)
    }
  }, [leftRef, rightRef, enabled])
}
