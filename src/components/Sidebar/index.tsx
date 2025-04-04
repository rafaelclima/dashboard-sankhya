import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import React, { useEffect, useState } from 'react'
import { TbLetterK, TbLetterV } from 'react-icons/tb'

import { FaAmazon } from 'react-icons/fa'
import { IoChevronBack } from 'react-icons/io5'
import { MdOutlineLocalGroceryStore } from 'react-icons/md'
import { SiMercadopago } from 'react-icons/si'
import { NavLink } from 'react-router-dom'

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const [showTitle, setShowTitle] = useState(false)

  const menuPlace = [
    // {
    //   title: 'Home',
    //   src: 'home',
    //   icon: <MdDashboard size={28} className="text-verde-sankhya" />,
    // },
    {
      title: 'Amazon',
      src: 'amazon',
      icon: <FaAmazon size={28} className="text-verde-sankhya" />,
    },
    {
      title: 'Kabum',
      src: 'kabum',
      icon: <TbLetterK size={28} className="text-verde-sankhya" />,
    },
    {
      title: 'Mercado Livre',
      src: 'mercado-livre',
      icon: <SiMercadopago size={28} className="text-verde-sankhya" />,
    },
    {
      title: 'Via Varejo',
      src: 'via-varejo',
      icon: <TbLetterV size={28} className="text-verde-sankhya" />,
    },
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (open) {
      timer = setTimeout(() => setShowTitle(true), 300)
    } else {
      setShowTitle(false)
    }
    return () => clearTimeout(timer)
  }, [open])

  return (
    <div className="flex h-full">
      <div
        className={` ${
          open ? 'w-64' : 'w-20 '
        } bg-cinza-sankhya h-full p-4 pt-8 relative transition-all duration-300`}>
        <div
          className={` flex items-center justify-center absolute cursor-pointer -right-3 top-8 w-7 h-7 bg-verde-sankhya text-branco-sankhya border border-verde-sankhya shadow-md rounded-full
              ${!open && 'rotate-180'}`}
          onClick={() => setOpen(!open)}>
          <IoChevronBack size={22} />
        </div>

        <div className="flex p-[6px] gap-x-2">
          <MdOutlineLocalGroceryStore size={28} className="text-verde-sankhya" />
          <h1
            className={`text-white font-titulo font-bold text-xl transition-opacity duration-300 ${showTitle ? 'opacity-100' : 'opacity-0'} ${
              !open ? 'hidden' : ''
            }`}>
            Conciliações
          </h1>
        </div>

        <div className="pt-8 flex flex-col gap-y-4">
          {menuPlace.map((Menu) => (
            <NavLink
              className="font-titulo transition-all duration-300 ease-in-out transform hover:scale-105"
              to={Menu.src}
              key={Menu.title}>
              {({ isActive }) => (
                <div className="flex items-center gap-x-4 relative group">
                  <TooltipProvider
                    key={Menu.title}
                    delayDuration={300}
                    skipDelayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger
                        style={{ background: 'transparent', outline: 'none' }}>
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full 
                  ${isActive ? 'border-2 border-verde-sankhya' : 'border-transparent'} 
                  bg-gray-800 transition-transform duration-300 transform hover:scale-110`}>
                          {Menu.icon}
                        </div>
                      </TooltipTrigger>
                      {!open && (
                        <TooltipContent
                          side="right"
                          sideOffset={8}
                          className="bg-gray-800 border-2 border-verde-sankhya text-white shadow">
                          <p>{Menu.title}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <span
                    className={`${
                      isActive ? 'text-white' : 'text-gray-400'
                    } ${!open && 'hidden'} transition-opacity duration-300 ${
                      showTitle ? 'opacity-100' : 'opacity-0'
                    } relative group-hover:text-verde-sankhya`}>
                    {Menu.title}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-verde-sankhya transition-all duration-300 group-hover:w-full" />
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
