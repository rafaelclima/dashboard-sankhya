export interface listaKabumPorArquivo {
  IDCONC: string
  DTLANC: string
  LABEL: string
  MESLANC: string
  ANOLANC: string
}

export interface dadosArquivoKabum {
  IDTRANSACAO: string
  IDCONCILIACAO: string
  DESCRICAO: string
  TIPO: string
  VALOR_TRANSACAO: string
  DEBITO: string
  CREDITO: string
  SALDO: string
  LINHA_ARQUIVO: string
  BH_CODEMKT: string
  STATUS: string
  ULTIMA_OCORRENCIA: string | null
  GEROU_MB_POR_NFNE: string | null
}

export interface arquivoConciliacaoKabum {
  IDCONCILIACAO: string
  DHIMPORTACAO: string
  DH_REPASSE: string
  DH_BAIXA_OU_LANC_MOV_BANC: string
  NUMFATURA: string
  DEBITO: string
  CREDITO: string
  SALDO: string
  NOME_ARQUIVO: string
}

export interface acompanhamentoFinanceiroKabum {
  VENDAS: string
  DEVOLUCOES: string
  COMISSAO: string
  ESTORNO_COMISSAO: string
  TRATATIVA_JUDICIAL: string
  REPASSE_PIX: string
  REPASSE_BB: string
  VALOR_REPASSE: string
  DIFERENCA: string
}

export interface DadosDoGraficoKabum {
  tipo: string
  valor: number
}