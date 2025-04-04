import * as DialogPrimitive from '@radix-ui/react-dialog'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DialogOverlay, DialogPortal } from '@radix-ui/react-dialog'

import { DataTable } from '@/components/Kabum/KabumDataTablePorArquivo/dataTablePorArquivo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { CiCirclePlus } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import { PiListPlusFill } from 'react-icons/pi'

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <DialogOverlay className="fixed inset-0 bg-black/85" /> {/* Fundo escuro */}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'relative min-w-[75vw] min-h-[65vh] max-w-[95vw] max-h-[85vh] bg-gray-900 p-4 shadow-lg rounded-lg border border-verde-sankhya overflow-auto',
          className,
        )}
        {...props}>
        {children}
      </DialogPrimitive.Content>
      {/* Botão de fechar fora do conteúdo */}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-verde-sankhya text-white hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <IoClose size={20} />
        <span className="sr-only">Fechar</span>
      </DialogPrimitive.Close>
    </div>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export const KabumModalComponentPorArquivo = ({
  tableData,
  columns,
  isErrorSelected,
}) => (
  <div>
    <Dialog>
      <DialogTrigger>
        <button
          type="button"
          className="flex items-center justify-center h-10 px-3 py-2 rounded-[6px] bg-verde-sankhya transition-colors duration-300 text-sm text-black border-2 hover:border-gray-800 hover:text-white">
          <div className="relative top-[1px]">
            <span className="flex items-center justify-center gap-1">
              <CiCirclePlus size={18} className="relative bottom-[1px]" />
              Ver Mais
            </span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="w-full h-full">
          {tableData.length > 0 && (
            <DataTable columns={columns} data={tableData} isError={isErrorSelected} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  </div>
)
