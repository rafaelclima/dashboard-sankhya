import type {
  DadosDoGrafico,
  DadosMovimentacaoPorDiaAmazon,
  MovimentacaoPorDia,
  SomaInfoPorDiaAmazon,
  acompanhamentoFinanceiro,
  conciliacaoAmazon,
  dadosArquivoAmazon,
  selectConciliacaoAmazon,
} from '@/types/amazon.types'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import React from 'react'

/**
 *
 * Essa função retorna os arquivos disponíveis da conciliação Amazon e pode receber os parâmetros de data inicial e data final para retornar os arquivos por período.
 */

function consultaArquivosAmazon(dtIni: Date | undefined, dtFim: Date | undefined) {
  if (dtIni && dtFim) {
    const dtIniString = format(dtIni, 'dd/MM/yyyy')
    const dtFimString = format(dtFim, 'dd/MM/yyyy')

    const sql = `
      SELECT IDCONCILIACAO AS VALUE, 
        IDCONCILIACAO || ' - ' || TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'DD/MM/YYYY') AS LABEL
      FROM AD_CONCAMAZON
      WHERE DH_BAIXA_OU_LANC_MOV_BANC >= TO_DATE('${dtIniString}', 'DD/MM/YYYY')
        AND DH_BAIXA_OU_LANC_MOV_BANC <= TO_DATE('${dtFimString}', 'DD/MM/YYYY')
      ORDER BY IDCONCILIACAO
    `
    return sql
  }

  const sql = `
        SELECT IDCONCILIACAO AS VALUE, IDCONCILIACAO || ' - ' || TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'dd/MM/yyyy') AS LABEL FROM AD_CONCAMAZON ORDER BY DH_BAIXA_OU_LANC_MOV_BANC
    `
  return sql
}

function carregarConciliacoes(
  dtIni: Date | undefined,
  dtFim: Date | undefined,
): Promise<selectConciliacaoAmazon[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      consultaArquivosAmazon(dtIni || undefined, dtFim || undefined),
      [],
      (resposta) => {
        try {
          const data: selectConciliacaoAmazon[] = JSON.parse(resposta)
          resolve(data)
        } catch (error) {
          console.error(`Erro ao carregar conciliações:${error}`)
          alert('Erro ao carregar conciliações')
          reject(error)
        }
      },
      (err) => {
        console.error(`Erro ao realizar a consulta das conciliações:${err}`)
        alert('Erro ao carregar a consulta das conciliações')
        reject(err)
      },
    )
  })
}

export function useAmazonConciliacoes(dtIni: Date | undefined, dtFim: Date | undefined) {
  return useQuery({
    queryKey: ['conciliacoes_amazon', dtIni, dtFim],
    queryFn: () => carregarConciliacoes(dtIni, dtFim),
    refetchOnMount: true,
  })
}

/**
 *
 * Essa função retorna os dados da conciliação Amazon
 * de acordo com o id da conciliação.
 * é através dessa função que o data-table é carregado.
 */

function consultaRetornoArquivosAmazon(id: string) {
  const sql = `
    SELECT 
      IDCONCILIACAO,
      IDTRANSACAO,
      BH_CODEMKT,
      TIPO_VALOR,
      TIPO_TRANSACAO,
      VALOR_TRANSACAO,
      LINHA_ARQUIVO,
      TIPO_DE_MOVIMENTACAO,
      CASE STATUS
        WHEN 'C' THEN 'Criada Movimentação Bancária'
        WHEN 'B' THEN 'Baixada'
        WHEN 'P' THEN 'Pendente'
        ELSE STATUS
      END AS STATUS,
      GEROU_MB_POR_NFNE,
      ULTIMA_OCORRENCIA
    FROM AD_CONCAMAZONTRANSACOES
    WHERE IDCONCILIACAO = '${id}'
  `
  return sql
}

function carregarDadosArquivoAmazon(id: string): Promise<dadosArquivoAmazon[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      consultaRetornoArquivosAmazon(id),
      [],
      (resposta) => {
        try {
          const data: dadosArquivoAmazon[] = JSON.parse(resposta)
          resolve(data)
        } catch (error) {
          console.error(`Erro ao analisar os dados retornados: ${error}`)
          alert(
            'Ocorreu um erro ao processar as conciliações. Por favor, tente novamente mais tarde.',
          )
          reject(new Error('Falha ao processar os dados da conciliação.'))
        }
      },
      (err) => {
        console.error(`Erro ao consultar as conciliações: ${err}`)

        if (typeof err === 'string') {
          if (err.includes('timeout')) {
            alert(
              'A consulta demorou muito para responder. Verifique sua conexão e tente novamente.',
            )
          } else if (err.includes('network')) {
            alert(
              'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
            )
          } else {
            alert(
              'Ocorreu um erro ao tentar carregar os dados de conciliação. Por favor, tente novamente.',
            )
          }
        } else {
          alert('Ocorreu um erro inesperado.')
        }

        reject(new Error('Erro ao realizar a consulta de conciliações.'))
      },
    )
  })
}

export function useArquivosAmazon(id: string) {
  return useQuery({
    queryKey: ['dados_arquivos_amazon'],
    queryFn: () => carregarDadosArquivoAmazon(id),
  })
}

/**
 * Essa função retorna as informações do arquivo de conciliação,
 * e não os dados da conciliação do arquivo. é daqui que os cards de informações por arquivo são gerados.
 */

function consultaDadosConciliacaoArquivoAmazon(id: string) {
  const sql = `
    SELECT * FROM AD_CONCAMAZON WHERE IDCONCILIACAO = '${id}'
  `
  return sql
}

function dadosConciliacaoArquivoAmazon(id: string): Promise<conciliacaoAmazon[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      consultaDadosConciliacaoArquivoAmazon(id),
      [],
      (resposta) => {
        try {
          const data: conciliacaoAmazon[] = JSON.parse(resposta)
          resolve(data)
        } catch (error) {
          console.error(`Erro ao analisar os dados retornados: ${error}`)
          alert(
            'Ocorreu um erro ao processar as conciliações. Por favor, tente novamente mais tarde.',
          )
          reject(new Error('Falha ao processar os dados da conciliação.'))
        }
      },
      (err) => {
        console.error(`Erro ao consultar as conciliações: ${err}`)

        if (typeof err === 'string') {
          if (err.includes('timeout')) {
            alert(
              'A consulta demorou muito para responder. Verifique sua conexão e tente novamente.',
            )
          } else if (err.includes('network')) {
            alert(
              'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
            )
          } else {
            alert(
              'Ocorreu um erro ao tentar carregar os dados de conciliação. Por favor, tente novamente.',
            )
          }
        } else {
          alert('Ocorreu um erro inesperado.')
        }

        reject(new Error('Erro ao realizar a consulta de conciliações.'))
      },
    )
  })
}

export function useInfoArquivoAmazon(id: string) {
  return useQuery({
    queryKey: ['info_arquivo_amazon'],
    queryFn: () => dadosConciliacaoArquivoAmazon(id),
  })
}

/**
 *
 * A consulta a seguir, bem como as funções, retornam os registros que o financeiro usa como base para validações e acompanhamento das conciliações.
 *
 */

function acompanhamentoConcAmazon(id: string) {
  const sql = `
    WITH 
      Devolucao AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'DEVOLUCAO' AND TIPO_TRANSACAO IN ('VLR_NOTA', 'VLR_FRETE') THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Devolução"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      Comissao AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'COMISSAO' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Comissão"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      FreteAmazon AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'FRETE' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Frete Amazon"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      TaxaParcelamento AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'TARIFA_DE_PARCELAMENTO' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Taxa de parcelamento"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      Vendas AS (
        SELECT SUM(CASE 
                    WHEN TIPO_DE_MOVIMENTACAO = 'VENDA' AND TIPO_TRANSACAO IN ('VLR_NOTA', 'VLR_FRETE') THEN VALOR_TRANSACAO 
                    ELSE 0 
                  END) AS "Vendas"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      ReembolsoComissao AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'ESTORNO_COMISSAO' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Reembolso Comissão"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      ReembolsoFrete AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'ESTORNO_FRETE' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Reembolso Frete"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      TarifaCancelamento AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'TARIFA_DE_CANCELAMENTO_DE_COMISSAO' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Tarifa Cancelamento"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      TaxaDeCadastro AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'TAXA_DE_CADASTRO' AND TIPO_VALOR = 'Valor do Item' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Taxa de cadastro"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      GarantiaDeReembolso AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'GARANTIA_DE_REEMBOLSO' AND TIPO_VALOR = 'Valor do Item' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Garantia de Reembolso"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      EstornoTxParcelamento AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'ESTORNO_DE_TARIFA_DE_PARCELAMENTO' THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Estorno Tx Parcelamento dev."
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      Chargeback AS (
        SELECT SUM(CASE
                    WHEN TIPO_DE_MOVIMENTACAO = 'DEVOLUCAO' AND TIPO_TRANSACAO IN ('VLR_NOTA', 'VLR_FRETE') THEN VALOR_TRANSACAO
                    ELSE 0
                  END) AS "Chargeback"
        FROM AD_CONCAMAZONTRANSACOES
        WHERE IDCONCILIACAO = '${id}'
      ),
      ValorDoRepasse AS (
        SELECT VLR_TOTAL_REPASSE
        FROM AD_CONCAMAZON
        WHERE IDCONCILIACAO = '${id}'
      )

      -- SELECT principal unindo os valores:
      SELECT 
        (SELECT "Devolução" FROM Devolucao) AS "Devolução",
        (SELECT "Comissão" FROM Comissao) AS "Comissão",
        (SELECT "Frete Amazon" FROM FreteAmazon) AS "Frete Amazon",
        (SELECT "Taxa de parcelamento" FROM TaxaParcelamento) AS "Taxa de parcelamento",
        (SELECT "Vendas" FROM Vendas) AS "Vendas",
        (SELECT "Reembolso Comissão" FROM ReembolsoComissao) AS "Reembolso Comissão",
        (SELECT "Reembolso Frete" FROM ReembolsoFrete) AS "Reembolso Frete",
        (SELECT "Tarifa Cancelamento" FROM TarifaCancelamento) AS "Tarifa Cancelamento",
        (SELECT "Taxa de cadastro" FROM TaxaDeCadastro) AS "Taxa de cadastro",
        (SELECT "Garantia de Reembolso" FROM GarantiaDeReembolso) AS "Garantia de Reembolso",
        (SELECT "Estorno Tx Parcelamento dev." FROM EstornoTxParcelamento) AS "Estorno Tx Parcelamento dev.",
        (SELECT VLR_TOTAL_REPASSE FROM ValorDoRepasse) AS "Repasse",

        -- Calculando o Vlr. Líquido somando os campos
        (
          (SELECT "Devolução" FROM Devolucao) + 
          (SELECT "Comissão" FROM Comissao) + 
          (SELECT "Frete Amazon" FROM FreteAmazon) + 
          (SELECT "Taxa de parcelamento" FROM TaxaParcelamento) + 
          (SELECT "Vendas" FROM Vendas) +
          (SELECT "Reembolso Comissão" FROM ReembolsoComissao) + 
          (SELECT "Reembolso Frete" FROM ReembolsoFrete) + 
          (SELECT "Tarifa Cancelamento" FROM TarifaCancelamento) + 
          (SELECT "Taxa de cadastro" FROM TaxaDeCadastro) + 
          (SELECT "Garantia de Reembolso" FROM GarantiaDeReembolso) + 
          (SELECT "Estorno Tx Parcelamento dev." FROM EstornoTxParcelamento)
        ) AS "Vlr. Líquido",
        
        -- Calculando a Diferença somando o Vlr. Líquido com o ValorDoRepasse
        (
          (SELECT "Devolução" FROM Devolucao) + 
          (SELECT "Comissão" FROM Comissao) + 
          (SELECT "Frete Amazon" FROM FreteAmazon) + 
          (SELECT "Taxa de parcelamento" FROM TaxaParcelamento) + 
          (SELECT "Vendas" FROM Vendas) +
          (SELECT "Reembolso Comissão" FROM ReembolsoComissao) + 
          (SELECT "Reembolso Frete" FROM ReembolsoFrete) + 
          (SELECT "Tarifa Cancelamento" FROM TarifaCancelamento) + 
          (SELECT "Taxa de cadastro" FROM TaxaDeCadastro) + 
          (SELECT "Garantia de Reembolso" FROM GarantiaDeReembolso) +
          (SELECT "Estorno Tx Parcelamento dev." FROM EstornoTxParcelamento) -
          (SELECT VLR_TOTAL_REPASSE FROM ValorDoRepasse)
        ) AS "Diferença"
    FROM dual
  `
  return sql
}

function dadosAcompanhamentoConcAmazon(id: string): Promise<DadosDoGrafico[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      acompanhamentoConcAmazon(id),
      [],
      (resposta) => {
        try {
          const data: acompanhamentoFinanceiro[] = JSON.parse(resposta)
          const valores = data[0]
          const chartData = [
            { tipo: 'Devolução', valor: valores['Devolução'] },
            { tipo: 'Comissão', valor: valores['Comissão'] },
            { tipo: 'Frete Amazon', valor: valores['Frete Amazon'] },
            {
              tipo: 'Taxa de parcelamento',
              valor: valores['Taxa de parcelamento'],
            },
            { tipo: 'Vendas', valor: valores['Vendas'] },
            { tipo: 'Reembolso Comissão', valor: valores['Reembolso Comissão'] },
            { tipo: 'Reembolso Frete', valor: valores['Reembolso Frete'] },
            { tipo: 'Tarifa Cancelamento', valor: valores['Tarifa Cancelamento'] },
            { tipo: 'Taxa de cadastro', valor: valores['Taxa de cadastro'] },
            {
              tipo: 'Garantia de Reembolso',
              valor: valores['Garantia de Reembolso'],
            },
            {
              tipo: 'Estorno Tx Parcelamento dev.',
              valor: valores['Estorno Tx Parcelamento dev.'],
            },
            { tipo: 'Repasse', valor: valores['Repasse'] },
            { tipo: 'Vlr. Líquido', valor: valores['Vlr. Líquido'] },
            { tipo: 'Diferença', valor: valores['Diferença'] },
          ]

          resolve(chartData)
        } catch (error) {
          console.error(`Erro ao analisar os dados retornados: ${error}`)
          alert(
            'Ocorreu um erro ao processar os dados da conciliação. Por favor, tente novamente.',
          )
          reject(new Error('Falha ao processar os dados da conciliação.'))
        }
      },
      (err) => {
        console.error(`Erro ao consultar os dados da conciliação: ${err}`)

        if (typeof err === 'string') {
          if (err.includes('timeout')) {
            alert(
              'A consulta demorou muito para responder. Verifique sua conexão e tente novamente.',
            )
          } else if (err.includes('network')) {
            alert(
              'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
            )
          } else {
            alert(
              'Ocorreu um erro ao tentar carregar os dados de conciliação. Por favor, tente novamente.',
            )
          }
        } else {
          alert('Ocorreu um erro inesperado.')
        }

        reject(new Error('Erro ao realizar a consulta de conciliações.'))
      },
    )
  })
}

export function useAcompanhamentoConcAmazon(id: string) {
  return useQuery<DadosDoGrafico[]>({
    queryKey: ['acompanhamento_conc_amazon'],
    queryFn: () => dadosAcompanhamentoConcAmazon(id),
  })
}

/**
 *
 * Essa função retorna uma lista com as datas únicas de movimentação bancária presentes da tabela AD_CONCAMAZON. Daqui é gerada a lista das datas do filtro por dia.
 *
 */

function consultaListaDiasUnicosMovimentacaoAmazon() {
  const sql = `
SELECT 
    CASE 
        WHEN SUBSTR(AC.IDCONCILIACAO, 1, 1) = 'B' THEN 'Boleto - ' || TO_CHAR(AC.DH_BAIXA_OU_LANC_MOV_BANC, 'DD/MM/YYYY')
        WHEN SUBSTR(AC.IDCONCILIACAO, 1, 1) = 'C' THEN 'Cartão - ' || TO_CHAR(AC.DH_BAIXA_OU_LANC_MOV_BANC, 'DD/MM/YYYY')
        ELSE NULL
    END AS LABEL,
    TO_CHAR(AC.DH_BAIXA_OU_LANC_MOV_BANC, 'DD/MM/YYYY') AS VALUE
FROM (
    SELECT 
        AC.DH_BAIXA_OU_LANC_MOV_BANC, 
        AC.IDCONCILIACAO,
        ROW_NUMBER() OVER (PARTITION BY AC.DH_BAIXA_OU_LANC_MOV_BANC ORDER BY AC.DH_BAIXA_OU_LANC_MOV_BANC DESC) AS RN
    FROM AD_CONCAMAZON AC
    WHERE AC.DH_BAIXA_OU_LANC_MOV_BANC IS NOT NULL
) AC
WHERE AC.RN = 1
ORDER BY AC.DH_BAIXA_OU_LANC_MOV_BANC DESC
`
  return sql
}

function carregarListaDiasUnicosMovimentacaoAmazon(): Promise<MovimentacaoPorDia[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      consultaListaDiasUnicosMovimentacaoAmazon(),
      [],
      (resposta) => {
        try {
          const data: MovimentacaoPorDia[] = JSON.parse(resposta)
          resolve(data)
        } catch (error) {
          console.error(`Erro ao carregar conciliações:${error}`)
          alert(
            'Erro ao carregar a lista dos dias de movimentação da tabela AD_CONCAMAZON',
          )
          reject(error)
        }
      },
      (err) => {
        console.error(`Erro ao realizar a consulta das conciliações:${err}`)
        alert('Erro ao carregar a lista dos dias de movimentação da tabela AD_CONCAMAZON')
        reject(err)
      },
    )
  })
}

export function useAmazonListaDiasUnicosMovimentacaoAmazon() {
  return useQuery<MovimentacaoPorDia[]>({
    queryKey: ['lista_movimentacao_por_dia'],
    queryFn: () => carregarListaDiasUnicosMovimentacaoAmazon(),
  })
}

/**
 *
 * Essa função retorna as movimentações pendentes por dia, que será selecionado pelo usuário. Quando o usuário selecionar o dia da conciliação, a data é passada para essa função e retorna os dados da conciliação.
 *
 */

function consultaMovimentacaoPendentePorDiaAmazon(dtMovimentacaoPorDia: string) {
  const sql = `
SELECT 
  T.*,
  C.DH_BAIXA_OU_LANC_MOV_BANC
FROM 
  AD_CONCAMAZONTRANSACOES T
JOIN 
  AD_CONCAMAZON C
ON 
  T.IDCONCILIACAO = C.IDCONCILIACAO
WHERE 
  T.STATUS = 'P'
  AND C.DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dtMovimentacaoPorDia}', 'DD/MM/YYYY')
`
  return sql
}

function carregarMovimentacaoPendentePorDia(
  dtMovimentacaoPorDia: string,
): Promise<DadosMovimentacaoPorDiaAmazon[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      consultaMovimentacaoPendentePorDiaAmazon(dtMovimentacaoPorDia),
      [],
      (resposta) => {
        try {
          const data: DadosMovimentacaoPorDiaAmazon[] = JSON.parse(resposta)

          // Filtrar os registros válidos
          const validData = data.filter((row) =>
            Object.values(row).some((value) => value !== null && value !== ''),
          )

          if (validData.length > 0) {
            resolve(validData)
          } else {
            resolve([])
          }
        } catch (error) {
          console.error(`Erro ao carregar conciliações: ${error}`)
          alert(
            `Erro ao carregar a consulta das movimentações pendentes por dia <br/> - ${error}`,
          )
          reject(error)
        }
      },
      (err) => {
        console.error(`Erro ao realizar a consulta das conciliações: ${err}`)
        alert(
          `Erro ao carregar a consulta das movimentações pendentes por dia <br/> - ${err}`,
        )
        reject(err)
      },
    )
  })
}

export function useAmazonMovimentacaoPendentePorDia(dtMovimentacaoPorDia: string) {
  return useQuery<DadosMovimentacaoPorDiaAmazon[]>({
    queryKey: ['movimentacao_pendente_por_dia', dtMovimentacaoPorDia],
    queryFn: () => {
      if (!dtMovimentacaoPorDia) {
        return Promise.resolve([])
      }
      return carregarMovimentacaoPendentePorDia(dtMovimentacaoPorDia)
    },
    enabled: !!dtMovimentacaoPorDia,
  })
}

/**
 *
 * Essa função retorna a soma do total do repasse, saldo anterior da reserva e valor da reserva atual do dia selecionado. É usada para gerar o card de informações por dia.
 *
 */

function consultaSomaInfoPorDiaAmazon(dtMovimentacao: string) {
  const sql = `
SELECT 
  SUM(VLR_TOTAL_REPASSE) AS "VLR_TOTAL_REPASSE", 
  SUM(SALDO_ANTERIOR_RESERVA) AS "SALDO_ANTERIOR_RESERVA", 
  SUM(VLR_RESERVA_ATUAL) AS "VLR_RESERVA_ATUAL"
FROM AD_CONCAMAZON
WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dtMovimentacao}', 'DD/MM/YYYY')
`
  return sql
}

function carregarSomaInfoPorDiaAmazon(
  dtMovimentacao: string,
): Promise<SomaInfoPorDiaAmazon[]> {
  if (!dtMovimentacao) {
    return Promise.resolve([])
  }

  return new Promise((resolve, reject) => {
    executeQuery(
      consultaSomaInfoPorDiaAmazon(dtMovimentacao),
      [],
      (resposta) => {
        try {
          const data: SomaInfoPorDiaAmazon[] = JSON.parse(resposta)
          resolve(data)
        } catch (error) {
          console.error(`Erro ao carregar conciliações:${error}`)
          alert(
            `Erro ao carregar a consulta do card de informações por dia de movimentação da tabela AD_CONCAMAZON - ${dtMovimentacao}`,
          )
          reject(error)
        }
      },
      (err) => {
        console.error(`Erro ao realizar a consulta das conciliações:${err}`)
        alert(
          `Erro ao carregar a consulta do card de informações por dia de movimentação da tabela AD_CONCAMAZON - ${dtMovimentacao}`,
        )
        reject(err)
      },
    )
  })
}

export function useSomaInfoPorDiaAmazon(dtMovimentacao: string) {
  return useQuery<SomaInfoPorDiaAmazon[]>({
    queryKey: ['soma_info_por_dia_amazon', dtMovimentacao],
    queryFn: () => {
      if (!dtMovimentacao) {
        return Promise.resolve([])
      }
      return carregarSomaInfoPorDiaAmazon(dtMovimentacao)
    },
    enabled: !!dtMovimentacao,
  })
}

/**
 *
 * A consulta a seguir, bem como as funções, retornam os registros que o financeiro usa como base para validações e acompanhamento das conciliações, porém, nesse caso, os valores são por dia e não por arquivo.
 *
 */

function acompanhamentoConcAmazonPorDia(dataMovimentacao: string) {
  const sql = `
WITH 
Devolucao AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'DEVOLUCAO' AND TIPO_TRANSACAO IN ('VLR_NOTA', 'VLR_FRETE') THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Devolução"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
Comissao AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'COMISSAO' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Comissão"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
FreteAmazon AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'FRETE' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Frete Amazon"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
TaxaParcelamento AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'TARIFA_DE_PARCELAMENTO' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Taxa de parcelamento"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
Vendas AS (
  SELECT SUM(CASE 
              WHEN TIPO_DE_MOVIMENTACAO = 'VENDA' AND TIPO_TRANSACAO IN ('VLR_NOTA', 'VLR_FRETE') THEN VALOR_TRANSACAO 
              ELSE 0 
            END) AS "Vendas"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
ReembolsoComissao AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'ESTORNO_COMISSAO' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Reembolso Comissão"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
ReembolsoFrete AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'ESTORNO_FRETE' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Reembolso Frete"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
TarifaCancelamento AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'TARIFA_DE_CANCELAMENTO_DE_COMISSAO' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Tarifa Cancelamento"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
TaxaDeCadastro AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'TAXA_DE_CADASTRO' AND TIPO_VALOR = 'Valor do Item' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Taxa de cadastro"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
GarantiaDeReembolso AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'GARANTIA_DE_REEMBOLSO' AND TIPO_VALOR = 'Valor do Item' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Garantia de Reembolso"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
EstornoTxParcelamento AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'BANCARIA' AND TIPO_TRANSACAO = 'ESTORNO_DE_TARIFA_DE_PARCELAMENTO' THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Estorno Tx Parcelamento dev."
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
Chargeback AS (
  SELECT SUM(CASE
              WHEN TIPO_DE_MOVIMENTACAO = 'DEVOLUCAO' AND TIPO_TRANSACAO IN ('VLR_NOTA', 'VLR_FRETE') THEN VALOR_TRANSACAO
              ELSE 0
            END) AS "Chargeback"
  FROM AD_CONCAMAZONTRANSACOES
  WHERE IDCONCILIACAO IN (SELECT IDCONCILIACAO FROM AD_CONCAMAZON WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY'))
),
ValorDoRepasse AS (
  SELECT VLR_TOTAL_REPASSE
  FROM AD_CONCAMAZON
  WHERE DH_BAIXA_OU_LANC_MOV_BANC = TO_DATE('${dataMovimentacao}', 'DD/MM/YYYY')
)

-- SELECT principal unindo os valores:
SELECT 
  (SELECT SUM("Devolução") FROM Devolucao) AS "Devolução",
  (SELECT SUM("Comissão") FROM Comissao) AS "Comissão",
  (SELECT SUM("Frete Amazon") FROM FreteAmazon) AS "Frete Amazon",
  (SELECT SUM("Taxa de parcelamento") FROM TaxaParcelamento) AS "Taxa de parcelamento",
  (SELECT SUM("Vendas") FROM Vendas) AS "Vendas",
  (SELECT SUM("Reembolso Comissão") FROM ReembolsoComissao) AS "Reembolso Comissão",
  (SELECT SUM("Reembolso Frete") FROM ReembolsoFrete) AS "Reembolso Frete",
  (SELECT SUM("Tarifa Cancelamento") FROM TarifaCancelamento) AS "Tarifa Cancelamento",
  (SELECT SUM("Taxa de cadastro") FROM TaxaDeCadastro) AS "Taxa de cadastro",
  (SELECT SUM("Garantia de Reembolso") FROM GarantiaDeReembolso) AS "Garantia de Reembolso",
  (SELECT SUM("Estorno Tx Parcelamento dev.") FROM EstornoTxParcelamento) AS "Estorno Tx Parcelamento dev.",
  (SELECT SUM("Chargeback") FROM Chargeback) AS "Chargeback",
  (SELECT SUM(VLR_TOTAL_REPASSE) FROM ValorDoRepasse) AS "Repasse",

  -- Calculando o Vlr. Líquido somando os campos
  (
      (SELECT SUM("Devolução") FROM Devolucao) + 
      (SELECT SUM("Comissão") FROM Comissao) + 
      (SELECT SUM("Frete Amazon") FROM FreteAmazon) + 
      (SELECT SUM("Taxa de parcelamento") FROM TaxaParcelamento) + 
      (SELECT SUM("Vendas") FROM Vendas) +
      (SELECT SUM("Reembolso Comissão") FROM ReembolsoComissao) + 
      (SELECT SUM("Reembolso Frete") FROM ReembolsoFrete) + 
      (SELECT SUM("Tarifa Cancelamento") FROM TarifaCancelamento) + 
      (SELECT SUM("Taxa de cadastro") FROM TaxaDeCadastro) + 
      (SELECT SUM("Garantia de Reembolso") FROM GarantiaDeReembolso) + 
      (SELECT SUM("Estorno Tx Parcelamento dev.") FROM EstornoTxParcelamento)
  ) AS "Vlr. Líquido",
  
  -- Calculando a Diferença somando o Vlr. Líquido com o ValorDoRepasse
  (
      (SELECT SUM("Devolução") FROM Devolucao) + 
      (SELECT SUM("Comissão") FROM Comissao) + 
      (SELECT SUM("Frete Amazon") FROM FreteAmazon) + 
      (SELECT SUM("Taxa de parcelamento") FROM TaxaParcelamento) + 
      (SELECT SUM("Vendas") FROM Vendas) +
      (SELECT SUM("Reembolso Comissão") FROM ReembolsoComissao) + 
      (SELECT SUM("Reembolso Frete") FROM ReembolsoFrete) + 
      (SELECT SUM("Tarifa Cancelamento") FROM TarifaCancelamento) + 
      (SELECT SUM("Taxa de cadastro") FROM TaxaDeCadastro) + 
      (SELECT SUM("Garantia de Reembolso") FROM GarantiaDeReembolso) + 
      (SELECT SUM("Estorno Tx Parcelamento dev.") FROM EstornoTxParcelamento) -
      (SELECT SUM(VLR_TOTAL_REPASSE) FROM ValorDoRepasse)
  ) AS "Diferença"
FROM dual
  `
  return sql
}

function dadosAcompanhamentoConcAmazonPorDia(
  dataMovimentacao: string,
): Promise<DadosDoGrafico[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      acompanhamentoConcAmazonPorDia(dataMovimentacao),
      [],
      (resposta) => {
        try {
          const data: acompanhamentoFinanceiro[] = JSON.parse(resposta)
          const valores = data[0]
          const chartData = [
            { tipo: 'Devolução', valor: valores['Devolução'] },
            { tipo: 'Comissão', valor: valores['Comissão'] },
            { tipo: 'Frete Amazon', valor: valores['Frete Amazon'] },
            {
              tipo: 'Taxa de parcelamento',
              valor: valores['Taxa de parcelamento'],
            },
            { tipo: 'Vendas', valor: valores['Vendas'] },
            { tipo: 'Reembolso Comissão', valor: valores['Reembolso Comissão'] },
            { tipo: 'Reembolso Frete', valor: valores['Reembolso Frete'] },
            { tipo: 'Tarifa Cancelamento', valor: valores['Tarifa Cancelamento'] },
            { tipo: 'Taxa de cadastro', valor: valores['Taxa de cadastro'] },
            {
              tipo: 'Garantia de Reembolso',
              valor: valores['Garantia de Reembolso'],
            },
            {
              tipo: 'Estorno Tx Parcelamento dev.',
              valor: valores['Estorno Tx Parcelamento dev.'],
            },
            { tipo: 'Repasse', valor: valores['Repasse'] },
            { tipo: 'Vlr. Líquido', valor: valores['Vlr. Líquido'] },
            { tipo: 'Diferença', valor: valores['Diferença'] },
          ]

          resolve(chartData)
        } catch (error) {
          console.error(`Erro ao analisar os dados retornados: ${error}`)
          alert(
            'Ocorreu um erro ao processar a consulta dos valores da conciliação. Por favor, tente novamente.',
          )
          reject(new Error('Falha ao processar os dados da conciliação.'))
        }
      },
      (err) => {
        console.error(`Erro ao consultar os dados da conciliação: ${err}`)

        if (typeof err === 'string') {
          if (err.includes('timeout')) {
            alert(
              'A consulta demorou muito para responder. Verifique sua conexão e tente novamente.',
            )
          } else if (err.includes('network')) {
            alert(
              'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
            )
          } else {
            alert(
              'Ocorreu um erro ao tentar carregar os dados de conciliação. Por favor, tente novamente.',
            )
          }
        } else {
          alert('Ocorreu um erro inesperado.')
        }

        reject(new Error('Erro ao realizar a consulta de conciliações.'))
      },
    )
  })
}

export function useAcompanhamentoConcAmazonPorDia(dataMovimentacao: string) {
  return useQuery<DadosDoGrafico[]>({
    queryKey: ['acompanhamento_conc_amazon_por_dia', dataMovimentacao],
    queryFn: () => dadosAcompanhamentoConcAmazonPorDia(dataMovimentacao),
    enabled: !!dataMovimentacao,
  })
}
