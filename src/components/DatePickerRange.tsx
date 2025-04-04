import * as React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import type { DayContentProps } from 'react-day-picker'

interface CustomDayContentProps extends DayContentProps {
  outside?: boolean
}

interface DatePickerWithRangeProps {
  className?: string
  rangeDate: DateRange | undefined
  setRangeDate: (date: DateRange | undefined) => void
  disabled: boolean
  setDatePickerOpen: (boolean) => void
  datePickerOpen: boolean
}

export function DatePickerWithRange({
  className,
  rangeDate,
  setRangeDate,
  disabled,
  setDatePickerOpen,
  datePickerOpen,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-4 w-full', className)}>
      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            disabled={disabled}
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left text-white font-medium bg-cinza-sankhya border-gray-300 shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-verde-sankhya transition-all',
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
              'hover:border-verde-sankhya', // Aplica mudança de cor no texto e ícone ao hover
            )}>
            <CalendarIcon className="mr-2 h-5 w-5" />{' '}
            {/* Ícone sem hover, será afetado pelo hover do botão */}
            {rangeDate?.from ? (
              rangeDate.to ? (
                <>
                  {format(rangeDate.from, 'dd/MM/yyyy')} -{' '}
                  {format(rangeDate.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(rangeDate.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1 bg-gray-800 border-verde-sankhya shadow-md rounded-lg">
          <Calendar
            initialFocus
            locale={ptBR}
            mode="range"
            defaultMonth={rangeDate?.from}
            selected={rangeDate}
            onSelect={setRangeDate}
            numberOfMonths={2}
            className="[&_.rdp-day]:m-2 text-sm"
            classNames={{
              day: 'flex items-center justify-center h-[24px] w-[24px] text-center rounded-full relative',
              day_range_middle: 'bg-verde-sankhya text-white',
              day_selected: 'bg-verde-sankhya text-white border border-verde-sankhya',
              day_today: 'bg-verde-sankhya text-black border border-verde-sankhya',
              day_outside: 'text-gray-500 bg-gray-700 hover:bg-gray-600',
              day_disabled: 'text-gray-400',
              day_hidden: 'invisible',
              day_range_end: 'bg-verde-sankhya text-white border border-verde-sankhya',
              day_range_start: 'bg-verde-sankhya text-white border border-verde-sankhya',
              cell: 'text-verde-sankhya bg-transparent',
              caption: 'text-verde-sankhya text-lg font-bold text-center',
              caption_label: 'text-verde-sankhya font-bold text-center',
              head_cell: 'text-white w-full text-sm text-center h-7 w-7 rounded-full',
              nav_button:
                'flex items-center justify-center bg-cinza-sankhya rounded-full text-verde-sankhya hover:bg-gray-700 h-6 w-6 mx-2',
              table: 'border-collapse border-spacing-1',
            }}
            components={{
              DayContent: (props: CustomDayContentProps) => (
                <button
                  className={cn(
                    'h-[20px] w-[20px] p-0 font-normal text-xs flex items-center justify-center rounded-full',
                    props.outside
                      ? 'text-gray-500 bg-gray-800'
                      : 'bg-gray-800 text-white hover:bg-gray-700',
                  )}
                  {...props}>
                  {props.date.getDate()}
                </button>
              ),
              IconLeft: () => <ChevronLeft className="text-verde-sankhya h-5 w-5" />,
              IconRight: () => <ChevronRight className="text-verde-sankhya h-5 w-5" />,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
