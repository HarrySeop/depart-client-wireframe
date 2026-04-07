"use client"

import * as React from "react"

interface SimulatedDateContextType {
  today: Date
  setToday: (date: Date) => void
  todayStr: string // YYYY-MM-DD
}

const now = new Date()

const SimulatedDateContext = React.createContext<SimulatedDateContextType>({
  today: now,
  setToday: () => {},
  todayStr: formatDateStr(now),
})

function formatDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function SimulatedDateProvider({ children }: { children: React.ReactNode }) {
  const [today, setToday] = React.useState(() => new Date())
  const todayStr = formatDateStr(today)

  return (
    <SimulatedDateContext.Provider value={{ today, setToday, todayStr }}>
      {children}
    </SimulatedDateContext.Provider>
  )
}

export function useSimulatedDate() {
  return React.useContext(SimulatedDateContext)
}
