'use client'

import React, { createContext, useState } from 'react'

interface NavigationContextType {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  closeMobileNav: () => void;
}

export const NavigationContext = createContext<NavigationContextType>({
  isMobileNavOpen: false,
  setIsMobileNavOpen: () => {},
  closeMobileNav: () => {}
});

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  }

  return (
    <NavigationContext.Provider value={{ isMobileNavOpen, setIsMobileNavOpen, closeMobileNav }}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
