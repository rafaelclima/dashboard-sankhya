/* Api Sankhya Ts - versão beta teste
    - versão: 0.0.1
    - data: 14/01/2025
		- como usar: informar a url e porta na const apiSettings (nas versões futuras essas informações serão passadas via parâmetro junto com o sql por exemplo.)
		- função disponível: dbExplorer. Para usar, basta importar a função e enviar a string com sql, ele irá retornar um array de objetos field(coluna), value(valor). A principio o serviço é limitado a 5.000 registros.

		* Nas próximas versões irei implementar o serviço loadRecords, onde será possível realizar CRUD e consultas sem limitação de quantidade de registro entre outras melhorias, e a disponibilização da lib junto com sua documentação no NPM.*
*/
import axios from 'axios'

const api = axios

const apiSettings = {
  url: '',
  port: '',
}

export async function dbExplorer<T>(sql: string): Promise<T[]> {
  const requestBody = {
    serviceName: 'DbExplorerSP.executeQuery',
    requestBody: {
      includePresentationFields: 'N',
      sql,
    },
  }

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=ISO-8859-1',
    },
    url: `${apiSettings.url}:${apiSettings.port}/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json`,
    data: JSON.stringify(requestBody),
  }

  try {
    const response = await api(request)

    const data = response.data

    if (response.status === 200 && data.status === '1') {
      const fields = data.responseBody.fieldsMetadata.map((row) => row.name)
      const rows = data.responseBody.rows

      const result = rows.map((row) => {
        const obj = {} as T
        row.forEach((item, index) => {
          obj[fields[index]] = item
        })
        return obj
      })

      return result
    }
    throw new Error(data.statusMessage || 'Erro ao executar a query.')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro na requisição: ${error.message}`)
    }
    throw new Error('Erro desconhecido ocorreu.')
  }
}
