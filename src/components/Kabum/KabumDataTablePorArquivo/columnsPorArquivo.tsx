import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, CirclePlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { dadosArquivoKabum } from '@/types/kabum.types'
import type { ColumnDef } from '@tanstack/react-table'
import copy from 'copy-to-clipboard'
import React from 'react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<dadosArquivoKabum, unknown>[] = [
  {
    accessorKey: 'IDTRANSACAO',
    header: 'ID da Transação',
  },
  {
    accessorKey: 'IDCONCILIACAO',
    header: ({ column }) => (
      <Button
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === 'asc')
        }}
        className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
        ID da Conciliação
        <ArrowUpDown
          size={16}
          className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
        />
      </Button>
    ),
  },

  {
    accessorKey: 'DESCRICAO',
    header: 'Descrição',
  },
  {
    accessorKey: 'TIPO',
    header: 'Tipo',
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
      const value = info.getValue() as number | undefined
      if (value) {
        return (
          <span
            className={`text-sm font-bold ${
              value > 0 ? 'text-verde-sankhya' : 'text-btn-danger'
            }`}>
            {value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
          </span>
        )
      }
      return info.getValue()
    },
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
        const value = row.getValue('VALOR_TRANSACAO') as number | undefined

        if (value) {
          return sum + value
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
    accessorKey: 'DEBITO',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
          className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
          Débito
          <ArrowUpDown
            size={16}
            className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
          />
        </Button>
      )
    },
    cell: (info) => {
      const value = info.getValue() as number | undefined
      if (value) {
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
        const value = row.getValue('DEBITO') as number | undefined

        if (value) {
          return sum + value
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
    accessorKey: 'CREDITO',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
          className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
          Crédito
          <ArrowUpDown
            size={16}
            className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
          />
        </Button>
      )
    },
    cell: (info) => {
      const value = info.getValue() as number | undefined
      if (value) {
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
        const value = row.getValue('CREDITO') as number | undefined

        if (value) {
          return sum + value
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
    accessorKey: 'SALDO',
    header: 'Saldo',
    cell: (info) => {
      const value = info.getValue() as number | undefined
      if (value) {
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
    // footer: ({ table }) => {
    //   const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
    //     const value = row.getValue('SALDO') as number | undefined

    //     if (value) {
    //       return sum + value
    //     }
    //     return sum
    //   }, 0)
    //   return (
    //     <span
    //       className={`text-sm text-center font-bold ${
    //         total > 0 ? 'text-verde-sankhya' : 'text-btn-danger'
    //       }`}>
    //       Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    //     </span>
    //   )
    // },
  },
  {
    accessorKey: 'LINHA_ARQUIVO',
    header: ({ column }) => {
      return (
        <Button
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
          className="p-0 bg-transparent hover:bg-transparent border-none text-gray-800 flex items-center hover:rotate-360 transition-transform duration-500">
          Linha do Arquivo
          <ArrowUpDown
            size={16}
            className="ml-2 text-gray-800 transition-transform duration-500 hover:rotate-360 hover:text-white"
          />
        </Button>
      )
    },
    // filterFn: (row, columnId, filterValue) => {
    //   if (!filterValue || filterValue.length === 0) return true // Se nenhum filtro for aplicado, mostrar todas as linhas
    //   return filterValue.includes(row.getValue(columnId)) // Comparação exata para múltiplos valores
    // },
  },
  {
    accessorKey: 'BH_CODEMKT',
    header: 'BH CodeMKT',
  },
  {
    accessorKey: 'STATUS',
    header: 'Status',
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true // Se nenhum filtro for aplicado, mostrar todas as linhas
      return filterValue.includes(row.getValue(columnId)) // Comparação exata para múltiplos valores
    },
  },
  {
    accessorKey: 'ULTIMA_OCORRENCIA',
    header: 'Última Ocorrência',
  },
  {
    accessorKey: 'GEROU_MB_POR_NFNE',
    header: 'Gerou MB por NFNE',
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
                  copy(conciliacao.BH_CODEMKT)
                  toast({
                    description: 'BH CodeMKT copiado',
                    duration: 1500,
                    className: 'bg-gray-800/85 text-white border border-verde-sankhya',
                  })
                }}>
                Copiar BH CodeMKT
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
