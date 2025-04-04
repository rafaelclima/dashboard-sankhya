import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersVertical,
} from 'lucide-react'
import React, { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { FilterMenuKabum } from '@/components/Kabum/KabumFilterMenu'
import { Button } from '@/components/ui/button'
import type { dadosArquivoKabum } from '@/types/kabum.types'

interface DataTableProps {
  columns: ColumnDef<dadosArquivoKabum, unknown>[]
  data: dadosArquivoKabum[]
  isError: boolean
}

export function DataTable({ columns, data, isError }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    IDTRANSACAO: false,
    IDCONCILIACAO: false,
    DESCRICAO: false,
    TIPO: true,
    VALOR_TRANSACAO: true,
    DEBITO: true,
    CREDITO: true,
    SALDO: true,
    LINHA_ARQUIVO: false,
    BH_CODEMKT: true,
    STATUS: true,
    ULTIMA_OCORRENCIA: true,
    GEROU_MB_POR_NFNE: false,
  })
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
  })

  return (
    <div className="flex flex-col w-max h-max m-auto p-2">
      {isError ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-white">
            Erro ao carregar dados do arquivo de conciliação
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center py-2 justify-between w-full">
            <FilterMenuKabum table={table} />
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-16 h-8 p-2 ml-auto text-white bg-verde-sankhya border border-white hover:bg-verde-sankhya/80">
                  <SlidersVertical size={16} className="mr-2 text-white" />
                  Ver
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-cinza-sankhya">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-white transition-colors duration-200"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto border border-white rounded-t-md">
            <Table className="w-full text-white">
              <TableHeader className="bg-verde-sankhya">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b border-cinza-sankhya hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="border-r border-white last:border-r-0 p-0 text-black text-center whitespace-nowrap hover:bg-transparent hover:shadow-none">
                        {header.isPlaceholder ? null : (
                          <div className="inline-flex items-center justify-center px-2 py-1">
                            {' '}
                            {/* Ajuste o padding aqui */}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="border-b border-cinza-sankhya last:border-b-0 hover:bg-cinza-sankhya/60 hover:text-white transition-colors duration-200">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="border-r border-cinza-sankhya last:border-r-0 p-1 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Sem resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow
                    key={footerGroup.id}
                    className="border-t border-cinza-sankhya">
                    {footerGroup.headers.map((header) => {
                      const isValueColumn =
                        header.column.id === 'VALOR_TRANSACAO' ||
                        header.column.id === 'DEBITO' ||
                        header.column.id === 'CREDITO'
                      return (
                        <TableHead
                          key={header.id}
                          className={`border-r border-cinza-sankhya last:border-r-0 w-max h-max p-2 ${
                            isValueColumn ? 'bg-gray-800/60' : 'bg-transparent'
                          }`}>
                          {header.isPlaceholder ? null : (
                            <div className="w-max h-max flex items-center">
                              {flexRender(
                                header.column.columnDef.footer,
                                header.getContext(),
                              )}
                            </div>
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableFooter>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-white text-sm font-medium">
                Mostrando {pagination.pageIndex * pagination.pageSize + 1}-
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  table.getRowCount(),
                )}{' '}
                de {table.getRowCount()} transações
              </p>
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-white text-sm font-medium">Resultados por página</p>
                <Select
                  value={`${pagination.pageSize}`}
                  onValueChange={(value) => {
                    const newPageSize = Number(value)
                    setPagination({
                      pageSize: newPageSize, // Atualiza o tamanho da página
                      pageIndex: 0, // Retorna à primeira página
                    })
                    table.setPageSize(newPageSize) // Atualiza a tabela
                  }}>
                  <SelectTrigger className="h-8 w-[70px] bg-verde-sankhya text-white border-white">
                    <SelectValue placeholder={pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top" className="bg-verde-sankhya text-white">
                    {[10, 15, 20, 25, 30].map((pageSize) => (
                      <SelectItem
                        key={pageSize}
                        value={`${pageSize}`}
                        className="text-white hover:bg-white hover:text-black transition-colors duration-200">
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium text-white">
                Página {pagination.pageIndex + 1} de {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 bg-verde-sankhya text-white border-white lg:flex"
                  onClick={() => {
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                    table.setPageIndex(0)
                  }}
                  disabled={!table.getCanPreviousPage()}>
                  <span className="sr-only">Ir para a primeira página</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 bg-verde-sankhya text-white border-white"
                  onClick={() => {
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: pagination.pageIndex - 1,
                    }))
                    table.previousPage()
                  }}
                  disabled={!table.getCanPreviousPage()}>
                  <span className="sr-only">Ir para a página anterior</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 bg-verde-sankhya text-white border-white"
                  onClick={() => {
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: pagination.pageIndex + 1,
                    }))
                    table.nextPage()
                  }}
                  disabled={!table.getCanNextPage()}>
                  <span className="sr-only">Ir para a página seguinte</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 bg-verde-sankhya text-white border-white lg:flex"
                  onClick={() => {
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: table.getPageCount() - 1,
                    }))
                    table.setPageIndex(table.getPageCount() - 1)
                  }}
                  disabled={!table.getCanNextPage()}>
                  <span className="sr-only">Ir para a última página</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
