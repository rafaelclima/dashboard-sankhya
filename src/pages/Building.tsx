import { BuildingSvg } from '@/components/SvgBuildingComponent'
import React from 'react'

export const PaginaEmConstrucao = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <p className="text-gray-700 text-lg text-center">A página está sendo construída.</p>
      <BuildingSvg width={'720px'} height={'560px'} />
    </div>
  )
}
