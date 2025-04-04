import React, { useState } from 'react'

import { AmazonTabs } from '@/components/Amazon/AmazonTabs'
import { CardInfoPorArquivo } from '@/components/Amazon/CardInfoAmazon/CardInfoPorArquivo'
import { CardInfoPorDia } from '@/components/Amazon/CardInfoAmazon/CardInfoPorDia'
import { GraficoPorArquivo } from '@/components/Amazon/GraficoAmazon/GraficoPorArquivo'
import { GraficoPorDia } from '@/components/Amazon/GraficoAmazon/GraficoPorDia'
import { useAmazonContext } from '@/contexts/AmazonContext'

export function Amazon() {
  const {
    setDiaDaMovimentacaoSelecionada,
    diaDaMovimentacaoSelecionada,
    conciliacaoSelecionada,
    setConciliacaoSelecionada,
    setRangeDate,
    setHiddenContent,
    tableData,
    setTableData,
    isErrorSelected,
    refetchSelected,
    isLoadingInfo,
    isErrorInfo,
    refetchInfo,
    isLoadingChart,
    isErrorChartPorDia,
    isLoadingChartPorDia,
    isErrorChart,
    refetchChart,
    dataInfo,
    dataChart,
    dataChartPorDia,
    dataSomaInfoPorDiaAmazon,
    isLoadingSomaInfoPorDiaAmazon,
    isErrorSomaInfoPorDiaAmazon,
    isErrorMovimentacaoPendentePorDia,
    refetchInfoMovimentacao,
    refetchMovimentacaoPendentePorDia,
    refetchChartPorDia,
  } = useAmazonContext()

  const [buscarPorArquivo, setBuscarPorArquivo] = useState(false)
  const [buscarPorDia, setBuscarPorDia] = useState(false)

  function handleClearInput(): void {
    setRangeDate(undefined)
    setConciliacaoSelecionada('')
    setDiaDaMovimentacaoSelecionada('')
  }

  async function handleSearch(): Promise<void> {
    if (conciliacaoSelecionada) {
      setBuscarPorArquivo(false)
      setBuscarPorDia(false)
      const { data: selectedData } = await refetchSelected()
      await refetchInfo()
      await refetchChart()
      if (selectedData) {
        setTableData(selectedData)
      } else {
        setTableData([])
      }
      setBuscarPorArquivo(true)
      setHiddenContent(true)
    } else {
      alert('É obrigatório selecionar uma conciliação para prosseguir.')
      setTableData([])
    }
  }

  async function handleSearchPorDia(): Promise<void> {
    if (diaDaMovimentacaoSelecionada) {
      setBuscarPorArquivo(false)
      setBuscarPorDia(false)
      setConciliacaoSelecionada('')
      setTableData([])
      const { data: movimentacaoPendenteData } = await refetchMovimentacaoPendentePorDia()
      await refetchInfoMovimentacao()
      await refetchChartPorDia()
      if (movimentacaoPendenteData) {
        setTableData(movimentacaoPendenteData)
      } else {
        setTableData([])
      }
      setBuscarPorDia(true)
      setHiddenContent(true)
    } else {
      alert('É obrigatório selecionar uma data para prosseguir.')
      setTableData([])
    }
  }

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      <h1 className="text-2xl font-bold font-titulo">Amazon</h1>
      <AmazonTabs
        handleSearch={handleSearch}
        handleClearInput={handleClearInput}
        handleSearchPorDia={handleSearchPorDia}
        esconderFiltroPorDia={setBuscarPorDia}
        esconderFiltroPorArquivo={setBuscarPorArquivo}
      />

      {/* Card de informações */}
      {buscarPorArquivo && (
        <>
          <div className="w-full">
            {isLoadingInfo ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Carregando Dados...</h1>
              </div>
            ) : isErrorInfo ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Erro ao carregar dados</h1>
              </div>
            ) : (
              dataInfo && <CardInfoPorArquivo data={dataInfo} />
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
                  tableData={tableData}
                  isErrorSelected={isErrorSelected}
                />
              )
            )}
          </div>
        </>
      )}

      {buscarPorDia && (
        <>
          <div className="w-full">
            {isLoadingSomaInfoPorDiaAmazon ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Carregando Dados...</h1>
              </div>
            ) : isErrorSomaInfoPorDiaAmazon ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Erro ao carregar dados</h1>
              </div>
            ) : dataSomaInfoPorDiaAmazon && dataSomaInfoPorDiaAmazon.length > 0 ? (
              <CardInfoPorDia
                data={dataSomaInfoPorDiaAmazon}
                diaSelecionado={diaDaMovimentacaoSelecionada}
              />
            ) : null}
          </div>

          <div className="w-full h-full">
            {isLoadingChartPorDia ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Carregando Dados...</h1>
              </div>
            ) : isErrorChartPorDia ? (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold">Erro ao carregar dados</h1>
              </div>
            ) : (
              dataChartPorDia && (
                <GraficoPorDia
                  dataChart={dataChartPorDia}
                  tableData={tableData}
                  isErrorMovimentacaoPendentePorDia={isErrorMovimentacaoPendentePorDia}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
