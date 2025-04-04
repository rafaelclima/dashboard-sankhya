import type {
  DadosDoGrafico,
  DadosMovimentacaoPorDiaAmazon,
  MovimentacaoPorDia,
  SomaInfoPorDiaAmazon,
  conciliacaoAmazon,
  dadosArquivoAmazon,
  selectConciliacaoAmazon,
} from '@/types/amazon.types'
// biome-ignore lint/style/useImportType: <explanation>
import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  useAcompanhamentoConcAmazon,
  useAcompanhamentoConcAmazonPorDia,
  useAmazonConciliacoes,
  useAmazonListaDiasUnicosMovimentacaoAmazon,
  useAmazonMovimentacaoPendentePorDia,
  useArquivosAmazon,
  useInfoArquivoAmazon,
  useSomaInfoPorDiaAmazon,
} from '@/utils/Amazon'

import type { DateRange } from 'react-day-picker'
import type { QueryObserverResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'

interface AmazonContextProps {
  rangeDate: DateRange | undefined
  setRangeDate: (range: DateRange | undefined) => void
  conciliacaoSelecionada: string
  setConciliacaoSelecionada: (value: string) => void
  diaDaMovimentacaoSelecionada: string
  setDiaDaMovimentacaoSelecionada: (value: string) => void
  hiddenContent: boolean
  setHiddenContent: (value: boolean) => void
  listaConciliacoesAmazon: selectConciliacaoAmazon[]
  listaMovimentacaoPorDia: MovimentacaoPorDia[]
  isLoadingAmazon: boolean
  isErrorAmazon: boolean
  isLoadingSelected: boolean
  isErrorSelected: boolean
  isLoadingInfo: boolean
  isErrorInfo: boolean
  isLoadingChart: boolean
  isErrorChart: boolean
  isLoadingMovimentacao: boolean
  isErrorMovimentacao: boolean
  isLoadingChartPorDia: boolean
  isErrorChartPorDia: boolean
  dataSelected: dadosArquivoAmazon[] | undefined
  dataInfo: conciliacaoAmazon[] | undefined
  dataChart: DadosDoGrafico[] | undefined
  tableData: dadosArquivoAmazon[]
  setTableData: React.Dispatch<React.SetStateAction<dadosArquivoAmazon[]>>
  refetchSelected: () => Promise<QueryObserverResult<dadosArquivoAmazon[], Error>>
  refetchInfo: () => Promise<QueryObserverResult<conciliacaoAmazon[], Error>>
  refetchChart: () => Promise<QueryObserverResult<DadosDoGrafico[], Error>>
  dataMovimentacaoPendentePorDia: DadosMovimentacaoPorDiaAmazon[] | undefined
  dataChartPorDia: DadosDoGrafico[] | undefined
  isLoadingMovimentacaoPendentePorDia: boolean
  isErrorMovimentacaoPendentePorDia: boolean
  dataSomaInfoPorDiaAmazon: SomaInfoPorDiaAmazon[] | undefined
  isLoadingSomaInfoPorDiaAmazon: boolean
  isErrorSomaInfoPorDiaAmazon: boolean
  refetchInfoMovimentacao: () => Promise<
    QueryObserverResult<SomaInfoPorDiaAmazon[], Error>
  >
  refetchMovimentacaoPendentePorDia: () => Promise<
    QueryObserverResult<DadosMovimentacaoPorDiaAmazon[], Error>
  >
  refetchChartPorDia: () => Promise<QueryObserverResult<DadosDoGrafico[], Error>>
}

const AmazonContext = createContext<AmazonContextProps | undefined>(undefined)

export const AmazonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>()
  const [conciliacaoSelecionada, setConciliacaoSelecionada] = useState<string>('')
  const [diaDaMovimentacaoSelecionada, setDiaDaMovimentacaoSelecionada] =
    useState<string>('')
  const [hiddenContent, setHiddenContent] = useState(false)
  const [tableData, setTableData] = useState<dadosArquivoAmazon[]>([])

  const {
    data: dataAmazon,
    isLoading: isLoadingAmazon,
    isError: isErrorAmazon,
  } = useAmazonConciliacoes(rangeDate?.from, rangeDate?.to)
  const {
    data: dataMovimentacao,
    isLoading: isLoadingMovimentacao,
    isError: isErrorMovimentacao,
  } = useAmazonListaDiasUnicosMovimentacaoAmazon()
  const {
    data: dataSelected,
    isLoading: isLoadingSelected,
    isError: isErrorSelected,
    refetch: refetchSelected,
  } = useArquivosAmazon(conciliacaoSelecionada)
  const {
    data: dataInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
    refetch: refetchInfo,
  } = useInfoArquivoAmazon(conciliacaoSelecionada)
  const {
    data: dataChart,
    isLoading: isLoadingChart,
    isError: isErrorChart,
    refetch: refetchChart,
  } = useAcompanhamentoConcAmazon(conciliacaoSelecionada)
  const {
    data: dataMovimentacaoPendentePorDia,
    isLoading: isLoadingMovimentacaoPendentePorDia,
    isError: isErrorMovimentacaoPendentePorDia,
    refetch: refetchMovimentacaoPendentePorDia,
  } = useAmazonMovimentacaoPendentePorDia(diaDaMovimentacaoSelecionada)
  const {
    data: dataSomaInfoPorDiaAmazon,
    isLoading: isLoadingSomaInfoPorDiaAmazon,
    isError: isErrorSomaInfoPorDiaAmazon,
    refetch: refetchInfoMovimentacao,
  } = useSomaInfoPorDiaAmazon(diaDaMovimentacaoSelecionada)
  const {
    data: dataChartPorDia,
    isLoading: isLoadingChartPorDia,
    isError: isErrorChartPorDia,
    refetch: refetchChartPorDia,
  } = useAcompanhamentoConcAmazonPorDia(diaDaMovimentacaoSelecionada)

  const listaConciliacoesAmazon = dataAmazon || []
  const listaMovimentacaoPorDia = dataMovimentacao || []

  const contextValue = useMemo(() => {
    return {
      rangeDate,
      setRangeDate,
      conciliacaoSelecionada,
      setConciliacaoSelecionada,
      diaDaMovimentacaoSelecionada,
      setDiaDaMovimentacaoSelecionada,
      hiddenContent,
      setHiddenContent,
      listaConciliacoesAmazon,
      listaMovimentacaoPorDia,
      tableData,
      setTableData,
      isLoadingAmazon,
      isErrorAmazon,
      isLoadingSelected,
      isErrorSelected,
      isLoadingInfo,
      isErrorInfo,
      isLoadingChart,
      isErrorChart,
      isLoadingMovimentacao,
      isErrorMovimentacao,
      isLoadingMovimentacaoPendentePorDia,
      isErrorMovimentacaoPendentePorDia,
      isLoadingChartPorDia,
      isErrorChartPorDia,
      dataChartPorDia,
      dataSomaInfoPorDiaAmazon,
      isLoadingSomaInfoPorDiaAmazon,
      isErrorSomaInfoPorDiaAmazon,
      dataSelected,
      dataInfo,
      dataChart,
      dataMovimentacaoPendentePorDia,
      refetchSelected,
      refetchInfo,
      refetchChart,
      refetchInfoMovimentacao,
      refetchMovimentacaoPendentePorDia,
      refetchChartPorDia,
    }
  }, [
    rangeDate,
    conciliacaoSelecionada,
    diaDaMovimentacaoSelecionada,
    hiddenContent,
    listaConciliacoesAmazon,
    listaMovimentacaoPorDia,
    tableData,
    isLoadingAmazon,
    isErrorAmazon,
    isLoadingSelected,
    isErrorSelected,
    isLoadingInfo,
    isErrorInfo,
    isLoadingChart,
    isLoadingSomaInfoPorDiaAmazon,
    isErrorSomaInfoPorDiaAmazon,
    isLoadingMovimentacao,
    isErrorMovimentacao,
    isLoadingMovimentacaoPendentePorDia,
    isErrorMovimentacaoPendentePorDia,
    isLoadingChartPorDia,
    isErrorChartPorDia,
    dataSelected,
    dataInfo,
    dataChart,
    dataMovimentacaoPendentePorDia,
    dataSomaInfoPorDiaAmazon,
    refetchSelected,
    refetchInfo,
    refetchChart,
    refetchInfoMovimentacao,
    refetchMovimentacaoPendentePorDia,
    refetchChartPorDia,
  ])

  return <AmazonContext.Provider value={contextValue}>{children}</AmazonContext.Provider>
}

export const useAmazonContext = (): AmazonContextProps => {
  const context = useContext(AmazonContext)
  if (!context) {
    throw new Error('useAmazonContext deve ser usado dentro de um AmazonProvider')
  }
  return context
}
