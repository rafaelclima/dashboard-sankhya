import { AmazonProvider } from '@/contexts/AmazonContext'
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react'
import { KabumProvider } from '@/contexts/KabumContext'
// import { MercadoLivreProvider } from '@/contexts/MercadoLivreContext'
// import { ViaVarejoProvider } from '@/contexts/ViaVarejoContext'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AmazonProvider>
      <KabumProvider>{children}</KabumProvider>
    </AmazonProvider>
  )
}
