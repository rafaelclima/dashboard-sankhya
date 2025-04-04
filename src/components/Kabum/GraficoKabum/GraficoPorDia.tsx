import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { DadosDoGrafico, dadosArquivoAmazon } from '@/types/amazon.types'

import { useAmazonContext } from '@/contexts/AmazonContext'
import React from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import { columnsPorDia } from '../AmazonDataTablePorDia/columnsPorDia'
import { AmazonModalComponentPorDia } from '../Modal/AmazonModalPorDia'

interface dataChartProps {
  dataChart: DadosDoGrafico[]
  tableData: dadosArquivoAmazon[]
  isErrorMovimentacaoPendentePorDia: boolean
}

const chartConfig = {
  tipo: {
    label: 'Tipo',
    color: 'hsl(var(--chart-1))',
  },
  valor: {
    label: 'R$',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function GraficoPorDia({
  dataChart,
  tableData,
  isErrorMovimentacaoPendentePorDia,
}: dataChartProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const positiveData = dataChart.filter((item) => Number(item.valor) > 0)
  const negativeData = dataChart.filter((item) => Number(item.valor) < 0)
  const zeroData = dataChart.filter((item) => Number(item.valor) === 0)

  const chartPositiveData = positiveData.map((item) => ({
    tipo: item.tipo,
    valor: Number(item.valor),
  }))

  const chartNegativeData = negativeData.map((item) => ({
    tipo: item.tipo,
    valor: Math.abs(Number(item.valor)),
  }))

  const { dataMovimentacaoPendentePorDia } = useAmazonContext()

  return (
    <div className="w-full h-max flex items-center justify-center">
      <Card className="w-full bg-gray-100 border-slate-200 shadow-lg rounded-[8px]">
        <CardHeader>
          <div className="w-full flex items-center justify-between">
            <div className="self-start">
              <CardTitle>Acompanhamento financeiro</CardTitle>
              <CardDescription>
                Valores calculados com base no arquivo de retorno
              </CardDescription>
            </div>

            <div>
              <Card className="flex items-center shadow-md hover:shadow-lg rounded-[8px] transition-shadow duration-300 bg-gray-200 w-max h-max p-3 text-center border border-slate-300">
                <div className="flex flex-col items-center justify-center gap-3 w-full">
                  <div className="flex flex-col items-center justify-center gap-2 w-max h-max">
                    <CardHeader className="rounded-t-lg w-full p-0">
                      <CardTitle className="text-xl font-semibold tracking-wider text-black w-full">
                        Pendências
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className={'text-3xl leading-none font-bold text-black'}>
                        {dataMovimentacaoPendentePorDia?.length}
                      </p>

                      {dataMovimentacaoPendentePorDia &&
                      dataMovimentacaoPendentePorDia.length > 0 ? (
                        <div className="mt-3">
                          <AmazonModalComponentPorDia
                            tableData={tableData}
                            columns={columnsPorDia}
                            isErrorMovimentacaoPendentePorDia={
                              isErrorMovimentacaoPendentePorDia
                            }
                          />
                        </div>
                      ) : null}
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row items-center justify-center">
          <ChartContainer config={chartConfig} className="flex-1">
            {/* Gráfico de dados negativos */}
            <div className="flex items-center justify-center h-full">
              <BarChart
                width={700}
                height={380}
                data={chartNegativeData}
                barCategoryGap="10%"
                maxBarSize={80}
                margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                <CartesianGrid
                  vertical={false}
                  horizontal={false}
                  stroke="hsl(var(--chart-800))"
                />
                <XAxis
                  dataKey="tipo"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                {/* <YAxis axisLine={false} tick={false} /> */}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel hideIndicator />}
                />
                <Bar
                  dataKey="valor"
                  fill="hsl(var(--chart-snk-danger))"
                  isAnimationActive={true}>
                  <LabelList
                    position="top"
                    dataKey="valor"
                    fillOpacity={1}
                    formatter={(value) => formatCurrency(-value as number)}
                  />
                </Bar>
              </BarChart>
            </div>
          </ChartContainer>
          <ChartContainer config={chartConfig} className="flex-1">
            {/* Gráfico de dados positivos */}
            <div className="flex items-center justify-center h-full">
              <BarChart
                width={700}
                height={380}
                data={chartPositiveData}
                barCategoryGap="10%"
                maxBarSize={80}
                margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                <CartesianGrid
                  vertical={false}
                  horizontal={false}
                  stroke="hsl(var(--chart-800))"
                />
                <XAxis
                  dataKey="tipo"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                {/* <YAxis axisLine={false} tick={false} /> */}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel hideIndicator />}
                />
                <Bar
                  dataKey="valor"
                  fill="hsl(var(--chart-verde-sankhya))"
                  isAnimationActive={true}>
                  <LabelList
                    position="top"
                    dataKey="valor"
                    fillOpacity={1}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                </Bar>
              </BarChart>
            </div>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {zeroData.length > 0 ? (
            <div className="leading-none text-muted-foreground flex items-center gap-2">
              <h3>Índice com valor igual a zero:</h3>
              {zeroData.map((item) => (
                <div key={item.tipo}>
                  <p className="font-bold italic">*{item.tipo}</p>
                </div>
              ))}
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}
