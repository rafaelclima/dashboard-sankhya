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
import { useKabumContext } from '@/contexts/KabumContext'
import { useState } from 'react'
import { ComboboxSelect } from '../../ComboboxSelect'
import { DatePickerWithRange } from '../../DatePickerRange'

interface KabumTabsProps {
  handleSearch: () => void
  handleClearInput: () => void
  esconderFiltroPorArquivo: (value: boolean) => void
}

export function KabumTabs({
  handleSearch,
  handleClearInput,
  esconderFiltroPorArquivo,
}: KabumTabsProps) {
  const {
    dataListaKabumPorArquivo,
    conciliacaoSelecionada,
    setConciliacaoSelecionada,
    isLoadingListaKabumPorArquivo,
    isErrorListaKabumPorArquivo,
    rangeDate,
    setRangeDate,
    hiddenContent,
    setHiddenContent,
    setMesLancamentoSelecionado,
    setAnoLancamentoSelecionado,
  } = useKabumContext()

  const [isActive, setIsActive] = useState<boolean>(true)
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false)

  function handleTabChange() {
    if (hiddenContent) {
      isActive ? esconderFiltroPorArquivo(false) : esconderFiltroPorArquivo(true)
      setIsActive(!isActive)
    }
  }

  return (
    <Tabs
      value={isActive ? 'perArquive' : ''}
      onValueChange={handleTabChange}
      className="w-[400px]">
      <TabsList className="flex items-center justify-center w-full p-1 bg-gray-800 border-gray-400 rounded-[10px]">
        <TabsTrigger
          value="perArquive"
          onClick={() => {
            if (hiddenContent) {
              setHiddenContent(false)
              esconderFiltroPorArquivo(false)
            }
          }}
          className="bg-cinza-sankhya text-white rounded-[8px] w-full data-[state=active]:bg-verde-sankhya data-[state=active]:text-white">
          Filtro por arquivo
        </TabsTrigger>
      </TabsList>

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
                onChange={(value) => {
                  setConciliacaoSelecionada(value)

                  // Busca o item correspondente no array de dados
                  const conciliacaoSelecionadaItem = dataListaKabumPorArquivo.find(
                    (item) => item.IDCONC === value,
                  )

                  // Atualiza MES se encontrado
                  if (conciliacaoSelecionadaItem?.MESLANC) {
                    setMesLancamentoSelecionado(conciliacaoSelecionadaItem.MESLANC)
                  }

                  // Atualiza ANOLANC se encontrado
                  if (conciliacaoSelecionadaItem?.ANOLANC) {
                    setAnoLancamentoSelecionado(conciliacaoSelecionadaItem.ANOLANC)
                  }
                }}
                data={dataListaKabumPorArquivo}
                placeholder={
                  isLoadingListaKabumPorArquivo
                    ? 'Carregando...'
                    : isErrorListaKabumPorArquivo
                      ? 'Erro ao carregar dados'
                      : dataListaKabumPorArquivo[0]?.IDCONC === ''
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
                onClick={() => {
                  handleSearch()
                  conciliacaoSelecionada !== '' && setIsActive(!isActive)
                }}>
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
