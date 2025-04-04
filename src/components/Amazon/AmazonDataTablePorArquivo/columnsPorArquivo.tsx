import { ArrowUpDown, CirclePlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import copy from 'copy-to-clipboard'
import type { dadosArquivoAmazon } from '@/types/amazon.types'
import { useToast } from '@/hooks/use-toast'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

function parseCurrency(valueStr: string): number {
  const trimmedValueStr = valueStr.trim()

  if (trimmedValueStr.includes('.') && trimmedValueStr.includes(',')) {
    const formattedValueStr = trimmedValueStr.replace(/\./g, '').replace(',', '.')
    return Number.parseFloat(formattedValueStr)
  }

  if (trimmedValueStr.includes(',')) {
    const formattedValueStr = trimmedValueStr.replace(',', '.')
    return Number.parseFloat(formattedValueStr)
  }

  return Number.parseFloat(trimmedValueStr)
}

export const columns: ColumnDef<dadosArquivoAmazon, unknown>[] = [
  {
    accessorKey: 'IDCONCILIACAO',
    header: 'ID da Conciliação',
  },
  {
    accessorKey: 'IDTRANSACAO',
    header: ({ column }) => (
      <Button
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === 'asc')
        }}
        className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
        ID da Transação
        <ArrowUpDown
          size={16}
          className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
        />
      </Button>
    ),
  },

  {
    accessorKey: 'BH_CODEMKT',
    header: 'BH CodeMKT',
  },
  {
    accessorKey: 'TIPO_VALOR',
    header: 'Tipo do Valor',
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true // Se nenhum filtro for aplicado, mostrar todas as linhas
      return filterValue.includes(row.getValue(columnId)) // Comparação exata para múltiplos valores
    },
  },
  {
    accessorKey: 'TIPO_TRANSACAO',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
          className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
          Tipo da Transação
          <ArrowUpDown
            size={16}
            className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
          />
        </Button>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true // Se nenhum filtro for aplicado, mostrar todas as linhas
      return filterValue.includes(row.getValue(columnId)) // Comparação exata para múltiplos valores
    },
  },
  {
    accessorKey: 'TIPO_DE_MOVIMENTACAO',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
          className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
          Tipo de Movimentação
          <ArrowUpDown
            size={16}
            className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
          />
        </Button>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true // Se nenhum filtro for aplicado, mostrar todas as linhas
      return filterValue.includes(row.getValue(columnId)) // Comparação exata para múltiplos valores
    },
  },
  {
    accessorKey: 'VALOR_TRANSACAO',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
          className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
          Valor da Transação
          <ArrowUpDown
            size={16}
            className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
          />
        </Button>
      )
    },
    cell: (info) => {
      const valueStr = info.getValue() as string | undefined
      if (valueStr) {
        const value = parseCurrency(valueStr)
        return (
          <span
            className={`text-sm font-bold ${
              value > 0 ? 'text-verde-sankhya' : 'text-btn-danger'
            }`}>
            {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )
      }
      return info.getValue()
    },
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
        const valueStr = row.getValue('VALOR_TRANSACAO') as string | undefined

        if (valueStr) {
          const value = parseCurrency(valueStr)
          return sum + (Number.isNaN(value) ? 0 : value)
        }
        return sum
      }, 0)
      return (
        <span
          className={`text-sm text-center font-bold ${
            total > 0 ? 'text-verde-sankhya' : 'text-btn-danger'
          }`}>
          Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      )
    },
  },
  {
    accessorKey: 'LINHA_ARQUIVO',
    header: 'Linha do Arquivo',
  },
  {
    accessorKey: 'STATUS',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
          className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
          Status
          <ArrowUpDown
            size={16}
            className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
          />
        </Button>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true // Se nenhum filtro for aplicado, mostrar todas as linhas
      return filterValue.includes(row.getValue(columnId)) // Comparação exata para múltiplos valores
    },
  },
  {
    accessorKey: 'GEROU_MB_POR_NFNE',
    header: 'Gerou MB por NFNE',
  },
  {
    accessorKey: 'ULTIMA_OCORRENCIA',
    header: 'Última Ocorrência',
  },
  {
    id: 'AÇÕES',
    header: 'Ações',
    cell: ({ row }) => {
      const conciliacao = row.original
      const { toast } = useToast()

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-max h-max p-1 bg-transparent hover:bg-transparent border-none focus:outline-none">
                <span className="sr-only">Abrir menu de ações</span>
                <CirclePlus
                  size={18}
                  className="text-verde-sankhya hover:text-white transition-colors duration-200"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-cinza-sankhya">
              <DropdownMenuLabel className="text-white">Ações</DropdownMenuLabel>
              <DropdownMenuItem
                className="text-white hover:bg-white hover:text-verde-sankhya hover:border-verde-sankhya"
                onClick={() => {
                  copy(conciliacao.IDCONCILIACAO)
                  toast({
                    description: 'ID da Conciliação copiado',
                    duration: 1500,
                    className: 'bg-gray-800/85 text-white border border-verde-sankhya',
                  })
                }}>
                Copiar ID da Conciliação
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
