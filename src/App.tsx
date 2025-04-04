import { RouterProvider, createHashRouter } from 'react-router-dom'

import { Amazon } from '@pages/Amazon'
import { AppLayout } from '@layout/AppLayout'
import { Home } from '@pages/Home'
import { Kabum } from './pages/Kabum'
import { MercadoLivre } from './pages/MercadoLivre'
import { Providers } from './contexts/Providers'
import React from 'react'
import { ViaVarejo } from './pages/ViaVarejo'

const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // { index: true, element: <Home /> },
      // { path: 'home', element: <Home /> },
      { index: true, element: <Amazon /> },
      { path: 'amazon', element: <Amazon /> },
      { path: 'kabum', element: <Kabum /> },
      { path: 'mercado-livre', element: <MercadoLivre /> },
      { path: 'via-varejo', element: <ViaVarejo /> },
    ],
  },
  { path: '*', element: <div>404 - Rota não encontrada</div> },
])

const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

export default App
