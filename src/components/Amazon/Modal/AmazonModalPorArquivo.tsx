import * as DialogPrimitive from '@radix-ui/react-dialog'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DialogOverlay, DialogPortal } from '@radix-ui/react-dialog'

import { DataTable } from '@/components/Amazon/AmazonDataTablePorArquivo/dataTablePorArquivo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
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

export const AmazonModalComponentPorArquivo = ({
  tableData,
  columns,
  isErrorSelected,
}) => (
  <div>
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          className="flex items-center border-2 justify-center gap-1 rounded bg-gray-800 text-verde-sankhya hover:border-2 hover:border-verde-sankhya hover:text-verde-sankhya hover:bg-gray-800">
          <PiListPlusFill className="w-6 h-6" />
          Ver mais detalhes
        </Button>
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
