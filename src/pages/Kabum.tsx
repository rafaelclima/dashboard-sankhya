import React, { useEffect, useState } from 'react'

import { CardInfoPorArquivo } from '@/components/Kabum/CardInfoKabum/CardInfoPorArquivo'
import { GraficoPorArquivo } from '@/components/Kabum/GraficoKabum/GraficoPorArquivo'
import { KabumTabs } from '@/components/Kabum/KabumTabs'
import { useKabumContext } from '@/contexts/KabumContext'

export function Kabum() {
  const {
    conciliacaoSelecionada,
    setDiaDaMovimentacaoSelecionada,
    setConciliacaoSelecionada,
    refetchInfoArquivoKabum,
    refetchDadosArquivoKabum,
    isLoadingListaKabumPorArquivo,
    isErrorListaKabumPorArquivo: isErrorSelected,
    dataInfoArquivoKabum,
    dataDadosArquivoKabum,
    dataChartKabum: dataChart,
    isLoadingChartKabum: isLoadingChart,
    isErrorChartKabum: isErrorChart,
    refetchChartKabum,
    setRangeDate,
    setHiddenContent,
  } = useKabumContext()

  const [buscarPorArquivo, setBuscarPorArquivo] = useState(false)

  function handleClearInput(): void {
    setRangeDate(undefined)
    setConciliacaoSelecionada('')
    setDiaDaMovimentacaoSelecionada('')
  }

  async function handleSearch(): Promise<void> {
    if (conciliacaoSelecionada) {
      setBuscarPorArquivo(false)
      await refetchDadosArquivoKabum()
      await refetchInfoArquivoKabum()
      await refetchChartKabum()
      setBuscarPorArquivo(true)
      setHiddenContent(true)
    } else {
      alert('É obrigatório selecionar uma conciliação para prosseguir.')
    }
  }

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      <h1 className="text-2xl font-bold font-titulo">Kabum</h1>
      <KabumTabs
        handleSearch={handleSearch}
        handleClearInput={handleClearInput}
        esconderFiltroPorArquivo={setBuscarPorArquivo}
      />

      {/* Card de informações */}
      {buscarPorArquivo && (
        <>
          <div className="w-full">
            {isLoadingListaKabumPorArquivo ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Carregando Dados...</h1>
              </div>
            ) : isErrorSelected ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Erro ao carregar dados</h1>
              </div>
            ) : (
              dataInfoArquivoKabum && <CardInfoPorArquivo data={dataInfoArquivoKabum} />
            )}
          </div>

          <div className="w-full h-full">
            {isLoadingChart ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Carregando Dados...</h1>
              </div>
            ) : isErrorChart ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Erro ao carregar dados</h1>
              </div>
            ) : (
              dataChart && (
                <GraficoPorArquivo
                  dataChart={dataChart}
                  tableData={dataDadosArquivoKabum}
                  isErrorSelected={isErrorSelected}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
