import type {
  DadosDoGraficoKabum,
  acompanhamentoFinanceiroKabum,
  arquivoConciliacaoKabum,
  dadosArquivoKabum,
  listaKabumPorArquivo,
} from '@/types/kabum.types'

import { dbExplorer } from '@/services/ApiSankhya'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import React from 'react'

/**
 *
 * Essa função retorna os arquivos disponíveis da conciliação Kabum e pode receber os parâmetros de data inicial e data final para retornar os arquivos por período.
 */

function consultaArquivosKabum(dtIni: Date | undefined, dtFim: Date | undefined) {
  if (dtIni && dtFim) {
    const dtIniString = format(dtIni, 'dd/MM/yyyy')
    const dtFimString = format(dtFim, 'dd/MM/yyyy')

    const sql = `
SELECT 
    IDCONCILIACAO AS IDCONC, 
    TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'dd/MM/yyyy') AS DTLANC,
    IDCONCILIACAO || ' - ' || TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'dd/MM/yyyy') AS LABEL,
    TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'MM') AS MESLANC,
    TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'YYYY') AS ANOLANC
FROM AD_CONCKABUM
WHERE DH_BAIXA_OU_LANC_MOV_BANC BETWEEN TO_DATE('${dtIniString}', 'DD/MM/YYYY') 
AND TO_DATE('${dtFimString}', 'DD/MM/YYYY')
ORDER BY DH_BAIXA_OU_LANC_MOV_BANC
    `
    return sql
  }

  const sql = `
SELECT 
    IDCONCILIACAO AS IDCONC, 
    TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'dd/MM/yyyy') AS DTLANC,
    IDCONCILIACAO || ' - ' || TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'dd/MM/yyyy') AS LABEL,
    TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'MM') AS MESLANC,
    TO_CHAR(DH_BAIXA_OU_LANC_MOV_BANC, 'YYYY') AS ANOLANC
FROM AD_CONCKABUM
ORDER BY DH_BAIXA_OU_LANC_MOV_BANC
    `
  return sql
}

function carregarConciliacoesKabumPorArquivo(
  dtIni: Date | undefined,
  dtFim: Date | undefined,
): Promise<listaKabumPorArquivo[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      consultaArquivosKabum(dtIni || undefined, dtFim || undefined),
      [],
      (resposta) => {
        try {
          const data: listaKabumPorArquivo[] = JSON.parse(resposta)
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

export function useListaKabumPorArquivo(
  dtIni: Date | undefined,
  dtFim: Date | undefined,
) {
  return useQuery({
    queryKey: ['lista_conciliacoes_kabum', dtIni, dtFim],
    queryFn: () => carregarConciliacoesKabumPorArquivo(dtIni, dtFim),
    refetchOnMount: true,
  })
}

/**
 *
 * Essa função retorna os dados da conciliação Kabum
 * de acordo com o id da conciliação.
 * é através dessa função que o data-table é carregado.
 */

function consultaRetornoArquivosKabum(id: string) {
  const sql = `
      SELECT
      IDTRANSACAO,
      IDCONCILIACAO,
      DESCRICAO,
      TIPO,
      VALOR_TRANSACAO,
      DEBITO,
      CREDITO,
      SALDO,
      LINHA_ARQUIVO,
      BH_CODEMKT,
      CASE STATUS
          WHEN 'C' THEN 'Criada Movimentação Bancária'
          WHEN 'B' THEN 'Baixada'
          WHEN 'P' THEN 'Pendente'
      ELSE STATUS
      END AS STATUS,
      ULTIMA_OCORRENCIA,
      GEROU_MB_POR_NFNE
  FROM AD_CONCKABUMTRANSACOES
  WHERE IDCONCILIACAO = '${id}'
    `
  return sql
}

export function useCarregarDadosArquivoKabum(id: string) {
  return useQuery({
    queryKey: ['dados_arquivos_kabum', id],
    queryFn: async () =>
      await dbExplorer<dadosArquivoKabum>(consultaRetornoArquivosKabum(id)),
  })
}

// function carregarDadosArquivoKabum(id: string): Promise<dadosArquivoKabum[]> {
//   return new Promise((resolve, reject) => {
//     executeQuery(
//       consultaRetornoArquivosKabum(id),
//       [],
//       (resposta) => {
//         try {
//           const data: dadosArquivoKabum[] = JSON.parse(resposta)
//           resolve(data)
//         } catch (error) {
//           console.error(`Erro ao analisar os dados retornados: ${error}`)
//           alert(
//             'Ocorreu um erro ao processar as conciliações. Por favor, tente novamente mais tarde.',
//           )
//           reject(new Error('Falha ao processar os dados da conciliação.'))
//         }
//       },
//       (err) => {
//         console.error(`Erro ao consultar as conciliações: ${err}`)

//         if (typeof err === 'string') {
//           if (err.includes('timeout')) {
//             alert(
//               'A consulta demorou muito para responder. Verifique sua conexão e tente novamente.',
//             )
//           } else if (err.includes('network')) {
//             alert(
//               'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
//             )
//           } else {
//             alert(
//               'Ocorreu um erro ao tentar carregar os dados de conciliação. Por favor, tente novamente.',
//             )
//           }
//         } else {
//           alert('Ocorreu um erro inesperado.')
//         }

//         reject(new Error('Erro ao realizar a consulta de conciliações.'))
//       },
//     )
//   })
// }

// export function useCarregarDadosArquivoKabum(id: string) {
//   return useQuery({
//     queryKey: ['dados_arquivos_kabum', id],
//     queryFn: () => carregarDadosArquivoKabum(id),
//   })
// }

/**
 * Essa função retorna as informações do arquivo de conciliação
 * e não os dados da conciliação do arquivo. é daqui que os cards de informações por arquivo são gerados.
 */

function consultaDadosConciliacaoArquivoKabum(id: string) {
  const sql = `
    SELECT * FROM AD_CONCKABUM WHERE IDCONCILIACAO = '${id}'
  `
  return sql
}

function dadosConciliacaoArquivoKabum(id: string): Promise<arquivoConciliacaoKabum[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      consultaDadosConciliacaoArquivoKabum(id),
      [],
      (resposta) => {
        try {
          const data: arquivoConciliacaoKabum[] = JSON.parse(resposta)
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

export function useInfoArquivoKabum(id: string) {
  return useQuery({
    queryKey: ['info_arquivo_kabum'],
    queryFn: () => dadosConciliacaoArquivoKabum(id),
  })
}

/**
 *
 * A consulta a seguir, bem como as funções, retornam os registros que o financeiro usa como base para validações e acompanhamento das conciliações. é através dessa função que o gráfico é carregado.
 *
 */

function dadosAcompanahementoFinanceiroKabumPorArquivo(
  idConciliacao: string,
  mesLanc: string,
  anoLanc: string,
) {
  const sql = `
WITH 
    vendas_kabum AS (
        SELECT 
            SUM(CASE WHEN tipo = 'Valor do pedido' THEN valor_transacao ELSE 0 END) +
            SUM(CASE WHEN tipo = 'Valor do envio do pedido' THEN valor_transacao ELSE 0 END) AS vendas,
            SUM(CASE WHEN tipo = 'Valor do pedido de reembolso' THEN valor_transacao ELSE 0 END) +
            SUM(CASE WHEN tipo = 'Valor de envio do pedido de reembolso' THEN valor_transacao ELSE 0 END) AS devolucoes,
            SUM(CASE WHEN tipo = 'Taxas de comissão' THEN valor_transacao ELSE 0 END) AS comissao,
            SUM(CASE WHEN tipo = 'Taxa de comissão de reembolso' THEN valor_transacao ELSE 0 END) AS estorno_comissao,
            SUM(CASE WHEN descricao LIKE '%Tratativa Judicial%' THEN valor_transacao ELSE 0 END) AS tratativa_judicial
        FROM ad_conckabumtransacoes
        WHERE idconciliacao = '${idConciliacao}'
    ),
    repasses_kabum AS (
        SELECT 
            SUM(CASE WHEN codctabcocontra = '1006' THEN vlrlanc ELSE 0 END) AS repasse_pix,
            SUM(CASE WHEN codctabcocontra = '2030' THEN vlrlanc ELSE 0 END) AS repasse_bb
        FROM tgfmbc
        WHERE codctabcoint = '1012'
              AND codctabcocontra IN ('1006', '2030')
              AND EXTRACT(MONTH FROM dhconciliacao) = '${mesLanc}'
              AND EXTRACT(YEAR FROM dhconciliacao) = '${anoLanc}'
    )
SELECT 
    v.vendas,
    v.devolucoes,
    v.comissao,
    v.estorno_comissao,
    v.tratativa_judicial,
    r.repasse_pix,
    r.repasse_bb,
    (v.vendas + v.devolucoes + v.comissao + v.estorno_comissao + v.tratativa_judicial) AS valor_repasse,
    ((v.vendas + v.devolucoes + v.comissao + v.estorno_comissao + v.tratativa_judicial) - r.repasse_bb - r.repasse_pix) AS diferenca
FROM vendas_kabum v
CROSS JOIN repasses_kabum r
  `
  return sql
}

function carregarAcompanhamentoFinanceiroKabumPorArquivo(
  idConciliacao: string,
  mesLanc: string,
  anoLanc: string,
): Promise<DadosDoGraficoKabum[]> {
  return new Promise((resolve, reject) => {
    executeQuery(
      dadosAcompanahementoFinanceiroKabumPorArquivo(idConciliacao, mesLanc, anoLanc),
      [],
      (resposta) => {
        try {
          const data: acompanhamentoFinanceiroKabum[] = JSON.parse(resposta)

          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Nenhum dado encontrado.')
          }

          const valores = data[0]
          const chartData: DadosDoGraficoKabum[] = [
            { tipo: 'Vendas', valor: Number.parseFloat(valores.VENDAS) || 0 },
            { tipo: 'Devoluções', valor: Number.parseFloat(valores.DEVOLUCOES) || 0 },
            { tipo: 'Comissão', valor: Number.parseFloat(valores.COMISSAO) || 0 },
            {
              tipo: 'Estorno Comissão',
              valor: Number.parseFloat(valores.ESTORNO_COMISSAO) || 0,
            },
            {
              tipo: 'Tratativa Judicial',
              valor: Number.parseFloat(valores.TRATATIVA_JUDICIAL) || 0,
            },
            { tipo: 'Repasse PIX', valor: Number.parseFloat(valores.REPASSE_PIX) || 0 },
            {
              tipo: 'Repasse Banco do Brasil',
              valor: Number.parseFloat(valores.REPASSE_BB) || 0,
            },
            {
              tipo: 'Valor Repasse',
              valor: Number.parseFloat(valores.VALOR_REPASSE) || 0,
            },
            { tipo: 'Diferença', valor: Number.parseFloat(valores.DIFERENCA) || 0 },
          ]

          resolve(chartData)
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Erro ao processar os dados retornados: ${error.message}`)
            reject(new Error(`Erro ao processar os dados: ${error.message}`))
          } else {
            console.error(`Erro desconhecido: ${error}`)
            reject(new Error('Erro inesperado.'))
          }
        }
      },
      (err) => {
        console.error(`Erro ao consultar os dados: ${err}`)

        if (typeof err === 'string') {
          if (err.includes('timeout')) {
            reject(
              new Error(
                'A consulta demorou muito para responder. Verifique sua conexão.',
              ),
            )
          } else if (err.includes('network')) {
            reject(
              new Error('Não foi possível conectar ao servidor. Verifique sua internet.'),
            )
          } else {
            reject(new Error('Erro ao carregar os dados da conciliação Kabum.'))
          }
        } else {
          reject(new Error('Erro inesperado ao realizar a consulta.'))
        }
      },
    )
  })
}

export function useAcompanhamentoConcKabumGrafico(
  idConciliacao: string,
  mesLanc: string,
  anoLanc: string,
) {
  return useQuery<DadosDoGraficoKabum[]>({
    queryKey: ['acompanhamento_conc_kabum', idConciliacao, mesLanc, anoLanc],
    queryFn: () =>
      carregarAcompanhamentoFinanceiroKabumPorArquivo(idConciliacao, mesLanc, anoLanc),
  })
}
