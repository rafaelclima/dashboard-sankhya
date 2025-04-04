import * as React from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import type { MovimentacaoPorDia, selectConciliacaoAmazon } from '@/types/amazon.types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ComboboxSelectProps {
  value: string
  onChange: (value: string) => void
  data: MovimentacaoPorDia[]
  placeholder?: string
  disabled?: boolean
}

export function ComboboxSelectPorDia({
  value,
  onChange,
  data,
  placeholder = 'Selecione um dia específico para visualização...',
  disabled = false,
}: ComboboxSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          disabled={disabled}
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-cinza-sankhya text-white border border-gray-300 hover:border-verde-sankhya">
          {value
            ? data.find((conciliacao) => conciliacao.DATA_MOVIMENTACAO === value)
                ?.DATA_MOVIMENTACAO
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
            {data[0]?.DATA_MOVIMENTACAO === ''
              ? 'Nenhum arquivo encontrado'
              : 'Nenhuma conciliação encontrada'}
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data.map((conciliacao) => (
                <CommandItem
                  key={conciliacao.DATA_MOVIMENTACAO}
                  value={conciliacao.DATA_MOVIMENTACAO}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                  className="text-white command-item">
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === conciliacao.DATA_MOVIMENTACAO
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {conciliacao.DATA_MOVIMENTACAO}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
