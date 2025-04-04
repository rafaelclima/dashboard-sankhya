import * as React from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { selectConciliacaoAmazon } from '@/types/amazon.types'
import type { listaKabumPorArquivo } from '@/types/kabum.types'

interface ComboboxSelectProps {
  value: string
  onChange: (value: string) => void
  data: selectConciliacaoAmazon[] | listaKabumPorArquivo[]
  placeholder?: string
  disabled?: boolean
}

export function ComboboxSelect({
  value,
  onChange,
  data,
  placeholder = 'Selecione uma conciliação...',
  disabled = false,
}: ComboboxSelectProps) {
  const [open, setOpen] = React.useState(false)

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const isAmazon = (item: any): item is selectConciliacaoAmazon => 'VALUE' in item
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const isKabum = (item: any): item is listaKabumPorArquivo => 'IDCONC' in item

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-cinza-sankhya text-white border border-gray-300 hover:border-verde-sankhya">
          {value
            ? Array.isArray(data) &&
              (data[0] as selectConciliacaoAmazon)?.VALUE !== undefined
              ? (data as selectConciliacaoAmazon[]).find((item) => item.VALUE === value)
                  ?.LABEL
              : (data as listaKabumPorArquivo[]).find((item) => item.IDCONC === value)
                  ?.LABEL
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-cinza-sankhya">
        <Command className="bg-cinza-sankhya">
          <CommandInput
            placeholder="Buscar conciliação..."
            className="text-white placeholder:text-white"
          />
          <CommandEmpty className="text-white text-center p-2">
            {Array.isArray(data) && data.length > 0
              ? isAmazon(data[0])
                ? 'Nenhuma conciliação encontrada'
                : isKabum(data[0])
                  ? 'Nenhum arquivo encontrado'
                  : 'Dados desconhecidos'
              : 'Nenhum dado disponível'}
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data.map((conciliacao) => {
                // Verifique se o item é do tipo Amazon ou Kabum
                const isAmazon =
                  (conciliacao as selectConciliacaoAmazon).VALUE !== undefined
                const isKabum = (conciliacao as listaKabumPorArquivo).IDCONC !== undefined

                return (
                  <CommandItem
                    key={
                      isAmazon
                        ? (conciliacao as selectConciliacaoAmazon).VALUE
                        : (conciliacao as listaKabumPorArquivo).IDCONC
                    }
                    value={
                      isAmazon
                        ? (conciliacao as selectConciliacaoAmazon).VALUE
                        : (conciliacao as listaKabumPorArquivo).IDCONC
                    }
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                    className="text-white command-item">
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value ===
                          (isAmazon
                            ? (conciliacao as selectConciliacaoAmazon).VALUE
                            : (conciliacao as listaKabumPorArquivo).IDCONC)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {/* Exibe LABEL, mas depende de Amazon ou Kabum */}
                    {isAmazon
                      ? (conciliacao as selectConciliacaoAmazon).LABEL
                      : isKabum
                        ? (conciliacao as listaKabumPorArquivo).LABEL
                        : 'Desconhecido'}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
