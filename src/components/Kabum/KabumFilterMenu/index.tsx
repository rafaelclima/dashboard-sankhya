import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import React from 'react'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { Checkbox } from '../../ui/checkbox'

export const FilterMenuKabum = ({ table }) => {
  //const [tipoValor, setTipoValor] = useState<string[]>([])
  const [tipoTransacao, setTipoTransacao] = useState<string[]>([])
  //const [tipoMovimentacao, setTipoMovimentacao] = useState<string[]>([])
  const [status, setStatus] = useState<string[]>([])

  // Função para aplicar múltiplos filtros
  const handleFilterChange = (
    filterCategory: string[],
    setCategory: Dispatch<SetStateAction<string[]>>,
    value: string,
    column: string,
  ) => {
    if (filterCategory.includes(value)) {
      setCategory(filterCategory.filter((item) => item !== value))
      table
        .getColumn(column)
        ?.setFilterValue(filterCategory.filter((item) => item !== value))
    } else {
      setCategory([...filterCategory, value])
      table.getColumn(column)?.setFilterValue([...filterCategory, value])
    }
  }

  const clearFilters = () => {
    //setTipoValor([])
    setTipoTransacao([])
    //setTipoMovimentacao([])
    setStatus([])
    table.resetColumnFilters()
  }

  return (
    <div className="w-max h-max flex items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-max h-max p-2 ml-auto text-white bg-verde-sankhya border border-white hover:bg-verde-sankhya/80 leading-none">
            <Filter size={16} className="text-white mr-2" />
            <span className="text-base leading-none">Filtrar</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-max max-h-[400px] overflow-y-auto p-2 bg-gray-800/95 rounded-md scrollbar-hidden"
          style={{ height: 'calc(100% + 64px)' }}>
          <div className="flex justify-center mt-1 mb-4 w-full">
            <Button
              className="w-full h-6 p-2 space-x-2 bg-btn-danger text-white hover:bg-btn-danger/80 leading-none rounded-md"
              onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
          {/* Categoria TIPO */}
          <DropdownMenuLabel className="text-verde-sankhya">Tipo</DropdownMenuLabel>
          {[
            'Imposto sobre comissão de reembolso',
            'Imposto sobre taxas de comissão',
            'Taxa de comissão de reembolso',
            'Taxas de comissão',
            'Valor de envio do pedido de reembolso',
            'Valor do envio do pedido',
            'Valor do pedido',
            'Valor do pedido de reembolso',
            'Fatura manual',
            'Imposto sobre fatura manual',
          ].map((item) => (
            <div className="flex items-center space-x-1 my-2" key={item}>
              <Checkbox
                checked={tipoTransacao.includes(item)}
                onCheckedChange={() =>
                  handleFilterChange(tipoTransacao, setTipoTransacao, item, 'TIPO')
                }
                className="mr-1 rounded-full w-5 h-5 data-[state=checked]:bg-verde-sankhya"
              />
              <span className="text-white">{item.toLowerCase()}</span>
            </div>
          ))}
          <DropdownMenuSeparator className="my-2" />
          {/* <DropdownMenuLabel className="text-verde-sankhya">Tipo</DropdownMenuLabel>
          <div className="flex items-center space-x-1 my-2">
            <Checkbox
              checked={tipoValor.includes('Taxa do Item')}
              onCheckedChange={() =>
                handleFilterChange(tipoValor, setTipoValor, 'Taxa do Item', 'TIPO_VALOR')
              }
              className="mr-1 rounded-full w-5 h-5 data-[state=checked]:bg-verde-sankhya"
            />
            <span className="text-white">taxa do item</span>
          </div>
          <div className="flex items-center space-x-1 my-2">
            <Checkbox
              checked={tipoValor.includes('Valor do Item')}
              onCheckedChange={() =>
                handleFilterChange(tipoValor, setTipoValor, 'Valor do Item', 'TIPO_VALOR')
              }
              className="mr-1 rounded-full w-5 h-5 data-[state=checked]:bg-verde-sankhya"
            />
            <span className="text-white">valor do item</span>
          </div>
          <DropdownMenuSeparator className="my-2" /> */}

          {/* Categoria TIPO_TRANSACAO */}
          {/* <DropdownMenuLabel className="text-verde-sankhya">
            Tipo de Transação
          </DropdownMenuLabel>
          {[
            'TARIFA_DE_PARCELAMENTO',
            'COMISSAO',
            'FRETE',
            'VLR_NOTA',
            'VLR_FRETE',
            'VALOR_LIBERADO',
            'ESTORNO_FRETE',
            'VALOR_RETIDO',
            'ESTORNO_COMISSAO',
            'TARIFA_DE_CANCELAMENTO_DE_COMISSAO',
          ].map((item) => (
            <div className="flex items-center space-x-1 my-2" key={item}>
              <Checkbox
                checked={tipoTransacao.includes(item)}
                onCheckedChange={() =>
                  handleFilterChange(
                    tipoTransacao,
                    setTipoTransacao,
                    item,
                    'TIPO_TRANSACAO',
                  )
                }
                className="mr-1 rounded-full w-5 h-5 data-[state=checked]:bg-verde-sankhya"
              />
              <span className="text-white">{item.toLowerCase()}</span>
            </div>
          ))}
          <DropdownMenuSeparator className="my-2" /> */}

          {/* Categoria TIPO_DE_MOVIMENTACAO */}
          {/* <DropdownMenuLabel className="text-verde-sankhya">
            Tipo de Movimentação
          </DropdownMenuLabel>
          {['BANCARIA', 'VENDA', 'DEVOLUCAO'].map((item) => (
            <div className="flex items-center space-x-1 my-2" key={item}>
              <Checkbox
                checked={tipoMovimentacao.includes(item)}
                onCheckedChange={() =>
                  handleFilterChange(
                    tipoMovimentacao,
                    setTipoMovimentacao,
                    item,
                    'TIPO_DE_MOVIMENTACAO',
                  )
                }
                className="mr-1 rounded-full w-5 h-5 data-[state=checked]:bg-verde-sankhya"
              />
              <span className="text-white">{item.toLowerCase()}</span>
            </div>
          ))}
          <DropdownMenuSeparator className="my-2" /> */}

          {/* Categoria STATUS */}
          <DropdownMenuLabel className="text-verde-sankhya">Status</DropdownMenuLabel>
          {['Criada Movimentação Bancária', 'Baixada', 'Pendente'].map((item) => (
            <div className="flex items-center space-x-1 my-2" key={item}>
              <Checkbox
                checked={status.includes(item)}
                onCheckedChange={() =>
                  handleFilterChange(status, setStatus, item, 'STATUS')
                }
                className="mr-1 rounded-full w-5 h-5 data-[state=checked]:bg-verde-sankhya"
              />
              <span className="text-white">{item.toLowerCase()}</span>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
