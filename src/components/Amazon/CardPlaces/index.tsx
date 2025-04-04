import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { FaMoneyBillTrendUp } from 'react-icons/fa6'
import { FaSackDollar } from 'react-icons/fa6'
import { GiPiggyBank } from 'react-icons/gi'
import { IoCalendar } from 'react-icons/io5'
import { IoDocumentText } from 'react-icons/io5'
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react'
import type { conciliacaoAmazon } from '@/types/amazon.types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CardPlacesProps {
  data: conciliacaoAmazon[]
}

const formatMoeda = (valor) => {
  return Number.parseFloat(valor.replace(',', '.')).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const getTextColor = (valor) => {
  return Number.parseFloat(valor) < 0 ? 'text-red-700' : 'text-green-600'
}

const ItemCard: React.FC<{
  title: string
  value: string
  className?: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  icon?: any
}> = ({ title, value, className, icon }) => (
  <Card className="flex items-center shadow-md hover:shadow-lg rounded-[8px] transition-shadow duration-300 bg-gray-100 w-[16%] h-24 p-3 text-center border border-slate-200">
    <div className="flex items-center justify-evenly w-full">
      <div className={`text-center ${className ? className : 'text-green-600'}`}>
        {icon}
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-max h-max">
        <CardHeader className="rounded-t-lg w-full p-0">
          <CardTitle className="text-base leading-none font-semibold text-green-600 w-full">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p
            className={`text-base leading-none font-bold ${className ? className : 'text-gray-800'}`}>
            {value}
          </p>
        </CardContent>
      </div>
    </div>
  </Card>
)

export function CardPlaces({ data }: CardPlacesProps) {
  return (
    <>
      {data.map((item) => (
        <div
          key={item.IDCONCILIACAO}
          className="w-full my-4 flex items-center justify-evenly">
          <ItemCard
            title="ID da Conciliação"
            value={item.IDCONCILIACAO}
            icon={<IoDocumentText size={32} className="m-auto w-8 h-8" />}
          />
          <ItemCard
            title="Data do Repasse"
            value={format(new Date(item.DT_REPASSE), 'dd/MM/yyyy', { locale: ptBR })}
            icon={<IoCalendar size={32} className="m-auto w-8 h-8" />}
          />
          <ItemCard
            title="Data da Baixa ou Lançamento"
            value={format(new Date(item.DH_BAIXA_OU_LANC_MOV_BANC), 'dd/MM/yyyy', {
              locale: ptBR,
            })}
            icon={<IoCalendar size={32} className="m-auto w-8 h-8" />}
          />
          <ItemCard
            title="Valor Total do Repasse"
            value={formatMoeda(item.VLR_TOTAL_REPASSE)}
            className={getTextColor(item.VLR_TOTAL_REPASSE)}
            icon={<FaSackDollar size={32} className="m-auto w-8 h-8" />}
          />
          <ItemCard
            title="Saldo Anterior da Reserva"
            value={formatMoeda(item.SALDO_ANTERIOR_RESERVA)}
            className={getTextColor(item.SALDO_ANTERIOR_RESERVA)}
            icon={<FaMoneyBillTrendUp size={32} className="m-auto w-8 h-8" />}
          />
          <ItemCard
            title="Valor da Reserva Atual"
            value={formatMoeda(item.VLR_RESERVA_ATUAL)}
            className={getTextColor(item.VLR_RESERVA_ATUAL)}
            icon={<GiPiggyBank size={32} className="m-auto w-8 h-8" />}
          />
        </div>
      ))}
    </>
  )
}
