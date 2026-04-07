"use client"

import * as React from "react"

export type DesignVariant = "A" | "B" | "C" | "D"

interface DesignVariantContextType {
  variant: DesignVariant
  setVariant: (variant: DesignVariant) => void
}

const DesignVariantContext = React.createContext<DesignVariantContextType>({
  variant: "A",
  setVariant: () => {},
})

export function DesignVariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = React.useState<DesignVariant>("A")

  return (
    <DesignVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </DesignVariantContext.Provider>
  )
}

export function useDesignVariant() {
  return React.useContext(DesignVariantContext)
}
