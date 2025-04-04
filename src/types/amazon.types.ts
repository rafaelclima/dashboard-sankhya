export interface arquivosAmazon {
  IDCONCILIACAO: string
  DHIMPORTACAO: string
  DT_ENVIO: string
  DT_REPASSE: string
  VLR_TOTAL_REPASSE: string
  SALDO_ANTERIOR_RESERVA: string
  VLR_RESERVA_ATUAL: string
  NOME_ARQUIVO: string
  DH_BAIXA_OU_LANC_MOV_BANC: string
}

export interface dadosArquivoAmazon {
  IDCONCILIACAO: string
  IDTRANSACAO: string
  BH_CODEMKT: string
  TIPO_VALOR: string
  TIPO_TRANSACAO: string
  VALOR_TRANSACAO: string
  LINHA_ARQUIVO: string
  TIPO_DE_MOVIMENTACAO: string
  STATUS: string
  GEROU_MB_POR_NFNE: string | null
  ULTIMA_OCORRENCIA: string | null
}

export interface selectConciliacaoAmazon {
  VALUE: string
  LABEL: string
}

export interface conciliacaoAmazon {
  IDCONCILIACAO: string
  DHIMPORTACAO: string
  DT_ENVIO: string
  DT_REPASSE: string
  VLR_TOTAL_REPASSE: string
  SALDO_ANTERIOR_RESERVA: string
  VLR_RESERVA_ATUAL: string
  NOME_ARQUIVO: string
  DH_BAIXA_OU_LANC_MOV_BANC: string
}

export interface acompanhamentoFinanceiro {
  Devolucao: number | string
  Comissao: number | string
  FreteAmazon: number | string
  TaxaParcelamento: number | string
  Vendas: number | string
  ReembolsoComissao: number | string
  ReembolsoFrete: number | string
  TarifaCancelamento: number | string
  TaxaCadastro: number | string
  GarantiaReembolso: number | string
  EstornoTaxaParcelamentoDev: number | string
  Repasse: number | string
  ValorLiquido: number | string
  Diferenca: number | string
}

export interface DadosDoGrafico {
  tipo: string
  valor: number
}

export interface MovimentacaoPorDia {
  LABEL: string
  VALUE: string
}

export interface DadosMovimentacaoPorDiaAmazon {
  IDCONCILIACAO: string
  IDTRANSACAO: string
  BH_CODEMKT: string
  TIPO_VALOR: string
  TIPO_TRANSACAO: string
  VALOR_TRANSACAO: string
  LINHA_ARQUIVO: string
  TIPO_DE_MOVIMENTACAO: string
  STATUS: string
  GEROU_MB_POR_NFNE: string | null
  ULTIMA_OCORRENCIA: string | null
}

export interface SomaInfoPorDiaAmazon {
  VLR_TOTAL_REPASSE: string
  SALDO_ANTERIOR_RESERVA: string
  VLR_RESERVA_ATUAL: string
}
