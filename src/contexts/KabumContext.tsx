import type {
  DadosDoGraficoKabum,
  acompanhamentoFinanceiroKabum,
  arquivoConciliacaoKabum,
  dadosArquivoKabum,
  listaKabumPorArquivo,
} from '@/types/kabum.types'
import {
  useAcompanhamentoConcKabumGrafico,
  useCarregarDadosArquivoKabum,
  useInfoArquivoKabum,
  useListaKabumPorArquivo,
} from '@/utils/Kabum'
// biome-ignore lint/style/useImportType: <explanation>
import React, { createContext, useContext, useMemo, useState } from 'react'

import type { QueryObserverResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { DateRange } from 'react-day-picker'

interface kabumContextProps {
  rangeDate: DateRange | undefined
  setRangeDate: (range: DateRange | undefined) => void
  conciliacaoSelecionada: string
  setConciliacaoSelecionada: (value: string) => void
  diaDaMovimentacaoSelecionada: string
  setDiaDaMovimentacaoSelecionada: (value: string) => void
  hiddenContent: boolean
  setHiddenContent: (value: boolean) => void
  tableData: dadosArquivoKabum[]
  setTableData: React.Dispatch<React.SetStateAction<dadosArquivoKabum[]>>
  dataListaKabumPorArquivo: listaKabumPorArquivo[]
  dataDadosArquivoKabum: dadosArquivoKabum[]
  dataInfoArquivoKabum: arquivoConciliacaoKabum[]
  isLoadingListaKabumPorArquivo: boolean
  isLoadingDadosArquivoKabum: boolean
  isLoadingInfoArquivoKabum: boolean
  isErrorListaKabumPorArquivo: boolean
  isErrorDadosArquivoKabum: boolean
  isErrorInfoArquivoKabum: boolean
  refetchListaKabumPorArquivo: () => Promise<
    QueryObserverResult<listaKabumPorArquivo[], Error>
  >
  refetchInfoArquivoKabum: () => Promise<
    QueryObserverResult<arquivoConciliacaoKabum[], Error>
  >
  refetchDadosArquivoKabum: () => Promise<QueryObserverResult<dadosArquivoKabum[], Error>>
  mesLancamentoSelecionado: string
  setMesLancamentoSelecionado: (value: string) => void
  anoLancamentoSelecionado: string
  setAnoLancamentoSelecionado: (value: string) => void
  dataChartKabum: DadosDoGraficoKabum[]
  isLoadingChartKabum: boolean
  isErrorChartKabum: boolean
  refetchChartKabum: () => Promise<QueryObserverResult<DadosDoGraficoKabum[], Error>>
}

const KabumContext = createContext<kabumContextProps | undefined>(undefined)

export const KabumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>()
  const [conciliacaoSelecionada, setConciliacaoSelecionada] = useState<string>('')
  const [mesLancamentoSelecionado, setMesLancamentoSelecionado] = useState<string>('')
  const [anoLancamentoSelecionado, setAnoLancamentoSelecionado] = useState<string>('')
  const [diaDaMovimentacaoSelecionada, setDiaDaMovimentacaoSelecionada] =
    useState<string>('')
  const [hiddenContent, setHiddenContent] = useState(false)
  const [tableData, setTableData] = useState<dadosArquivoKabum[]>([])

  const {
    data: dataListaKabumPorArquivo,
    isLoading: isLoadingListaKabumPorArquivo,
    isError: isErrorListaKabumPorArquivo,
    refetch: refetchListaKabumPorArquivo,
  } = useListaKabumPorArquivo(rangeDate?.from, rangeDate?.to)
  const {
    data: dataDadosArquivoKabum,
    isLoading: isLoadingDadosArquivoKabum,
    isError: isErrorDadosArquivoKabum,
    refetch: refetchDadosArquivoKabum,
  } = useCarregarDadosArquivoKabum(conciliacaoSelecionada)
  const {
    data: dataInfoArquivoKabum,
    isLoading: isLoadingInfoArquivoKabum,
    isError: isErrorInfoArquivoKabum,
    refetch: refetchInfoArquivoKabum,
  } = useInfoArquivoKabum(conciliacaoSelecionada)
  const {
    data: dataChartKabum,
    isLoading: isLoadingChartKabum,
    isError: isErrorChartKabum,
    refetch: refetchChartKabum,
  } = useAcompanhamentoConcKabumGrafico(
    conciliacaoSelecionada,
    mesLancamentoSelecionado,
    anoLancamentoSelecionado,
  )
  // const {
  //   data: dataChart,
  //   isLoading: isLoadingChart,
  //   isError: isErrorChart,
  //   refetch: refetchChart,
  // } = useAcompanhamentoConcAmazon(conciliacaoSelecionada)
  // const {
  //   data: dataMovimentacaoPendentePorDia,
  //   isLoading: isLoadingMovimentacaoPendentePorDia,
  //   isError: isErrorMovimentacaoPendentePorDia,
  //   refetch: refetchMovimentacaoPendentePorDia,
  // } = useAmazonMovimentacaoPendentePorDia(diaDaMovimentacaoSelecionada)
  // const {
  //   data: dataSomaInfoPorDiaAmazon,
  //   isLoading: isLoadingSomaInfoPorDiaAmazon,
  //   isError: isErrorSomaInfoPorDiaAmazon,
  //   refetch: refetchInfoMovimentacao,
  // } = useSomaInfoPorDiaAmazon(diaDaMovimentacaoSelecionada)
  // const {
  //   data: dataChartPorDia,
  //   isLoading: isLoadingChartPorDia,
  //   isError: isErrorChartPorDia,
  //   refetch: refetchChartPorDia,
  // } = useAcompanhamentoConcAmazonPorDia(diaDaMovimentacaoSelecionada)

  const listaConciliacoesKabum = dataListaKabumPorArquivo || []
  //const listaMovimentacaoPorDia = dataMovimentacao || []

  const kabumContextValue = useMemo(() => {
    return {
      rangeDate,
      setRangeDate,
      conciliacaoSelecionada,
      setConciliacaoSelecionada,
      diaDaMovimentacaoSelecionada,
      setDiaDaMovimentacaoSelecionada,
      hiddenContent,
      setHiddenContent,
      tableData,
      setTableData,
      dataListaKabumPorArquivo: dataListaKabumPorArquivo || [],
      dataDadosArquivoKabum: dataDadosArquivoKabum || [],
      dataInfoArquivoKabum: dataInfoArquivoKabum || [],
      listaConciliacoesKabum: listaConciliacoesKabum || [],
      isLoadingListaKabumPorArquivo,
      isLoadingDadosArquivoKabum,
      isLoadingInfoArquivoKabum,
      isErrorListaKabumPorArquivo,
      isErrorDadosArquivoKabum,
      isErrorInfoArquivoKabum,
      refetchListaKabumPorArquivo,
      refetchInfoArquivoKabum,
      refetchDadosArquivoKabum,
      mesLancamentoSelecionado,
      setMesLancamentoSelecionado,
      anoLancamentoSelecionado,
      setAnoLancamentoSelecionado,
      dataChartKabum: dataChartKabum || [],
      isLoadingChartKabum,
      isErrorChartKabum,
      refetchChartKabum,
    }
  }, [
    rangeDate,
    setRangeDate,
    tableData,
    setTableData,
    conciliacaoSelecionada,
    setConciliacaoSelecionada,
    diaDaMovimentacaoSelecionada,
    setDiaDaMovimentacaoSelecionada,
    hiddenContent,
    setHiddenContent,
    dataListaKabumPorArquivo,
    dataDadosArquivoKabum,
    dataInfoArquivoKabum,
    listaConciliacoesKabum,
    isLoadingListaKabumPorArquivo,
    isLoadingDadosArquivoKabum,
    isLoadingInfoArquivoKabum,
    isErrorListaKabumPorArquivo,
    isErrorDadosArquivoKabum,
    isErrorInfoArquivoKabum,
    refetchListaKabumPorArquivo,
    refetchInfoArquivoKabum,
    refetchDadosArquivoKabum,
    mesLancamentoSelecionado,
    setMesLancamentoSelecionado,
    anoLancamentoSelecionado,
    setAnoLancamentoSelecionado,
    dataChartKabum,
    isLoadingChartKabum,
    isErrorChartKabum,
    refetchChartKabum,
  ])

  return (
    <KabumContext.Provider value={kabumContextValue}>{children}</KabumContext.Provider>
  )
}

export const useKabumContext = (): kabumContextProps => {
  const context = useContext(KabumContext)
  if (!context) {
    throw new Error('useKabumContext deve ser usado dentro de um KabumProvider')
  }
  return context
}
