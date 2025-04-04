import * as React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '@/components/ui/button'
import { useAmazonContext } from '@/contexts/AmazonContext'
import { useState } from 'react'
import { ComboboxSelect } from '../../ComboboxSelect'
import { DatePickerWithRange } from '../../DatePickerRange'

interface AmazonTabsProps {
  handleSearch: () => void
  handleClearInput: () => void
  handleSearchPorDia: () => void
  esconderFiltroPorDia: (value: boolean) => void
  esconderFiltroPorArquivo: (value: boolean) => void
}

export function AmazonTabs({
  handleSearch,
  handleClearInput,
  handleSearchPorDia,
  esconderFiltroPorDia,
  esconderFiltroPorArquivo,
}: AmazonTabsProps) {
  const {
    listaConciliacoesAmazon,
    listaMovimentacaoPorDia,
    conciliacaoSelecionada,
    setDiaDaMovimentacaoSelecionada,
    diaDaMovimentacaoSelecionada,
    setConciliacaoSelecionada,
    isLoadingAmazon,
    isErrorAmazon,
    isLoadingMovimentacao,
    isErrorMovimentacao,
    rangeDate,
    setRangeDate,
    hiddenContent,
    setHiddenContent,
  } = useAmazonContext()

  const [activeTab, setActiveTab] = useState<string>('perDay')
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false)

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    if (hiddenContent) {
      setHiddenContent(false)
      esconderFiltroPorDia(false)
      esconderFiltroPorArquivo(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 p-1 gap-2 bg-gray-800 border-gray-400 rounded-[10px]">
        <TabsTrigger
          value="perDay"
          onClick={() => {
            if (hiddenContent) {
              setHiddenContent(false)
              esconderFiltroPorDia(false)
              esconderFiltroPorArquivo(false)
            }
          }}
          className="bg-cinza-sankhya text-white rounded-[8px] data-[state=active]:bg-verde-sankhya data-[state=active]:text-white">
          Por Dia
        </TabsTrigger>
        <TabsTrigger
          value="perArquive"
          onClick={() => {
            if (hiddenContent) {
              setHiddenContent(false)
              esconderFiltroPorDia(false)
              esconderFiltroPorArquivo(false)
            }
          }}
          className="bg-cinza-sankhya text-white rounded-[8px] data-[state=active]:bg-verde-sankhya data-[state=active]:text-white">
          Por Arquivo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="perDay" className={hiddenContent ? 'hidden' : ''}>
        <Card>
          <CardHeader>
            <CardTitle>Filtro por dia</CardTitle>
            <CardDescription>
              esse filtro retorna os dados dos arquivos do dia selecionado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col w-full">
              <ComboboxSelect
                value={diaDaMovimentacaoSelecionada}
                onChange={(ev) => setDiaDaMovimentacaoSelecionada(ev)}
                data={listaMovimentacaoPorDia}
                placeholder={
                  isLoadingMovimentacao
                    ? 'Carregando...'
                    : isErrorMovimentacao
                      ? 'Erro ao carregar dados'
                      : listaMovimentacaoPorDia[0]?.LABEL === ''
                        ? 'Nenhum Dia de Movimentação encontrado'
                        : 'Selecione o dia da movimentação bancária'
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="bg-verde-sankhya text-white hover:bg-verde-sankhya/90 w-full"
              onClick={handleSearchPorDia}>
              Buscar
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="perArquive" className={hiddenContent ? 'hidden' : ''}>
        <Card>
          <CardHeader>
            <CardTitle>Filtro por arquivo</CardTitle>
            <CardDescription>
              esse filtro retorna os dados do arquivo selecionado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-4 w-full">
              <DatePickerWithRange
                rangeDate={rangeDate}
                setRangeDate={setRangeDate}
                disabled={conciliacaoSelecionada !== ''}
                datePickerOpen={datePickerOpen}
                setDatePickerOpen={setDatePickerOpen}
              />
            </div>
            <div className="flex flex-col w-full">
              <ComboboxSelect
                value={conciliacaoSelecionada}
                onChange={setConciliacaoSelecionada}
                data={listaConciliacoesAmazon}
                placeholder={
                  isLoadingAmazon
                    ? 'Carregando...'
                    : isErrorAmazon
                      ? 'Erro ao carregar dados'
                      : listaConciliacoesAmazon[0]?.VALUE === ''
                        ? 'Nenhum arquivo encontrado'
                        : 'Selecione uma conciliação'
                }
                disabled={datePickerOpen}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center items-center w-full gap-2">
              <Button
                className="bg-verde-sankhya text-white hover:bg-verde-sankhya/90 w-full"
                onClick={handleSearch}>
                Buscar
              </Button>
              <Button
                className="bg-btn-danger text-white hover:bg-btn-danger/90 w-full"
                onClick={() => handleClearInput()}>
                Limpar
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
