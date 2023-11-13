import { presets, type ListType } from '#data/lists'
import { useTokenProvider } from '@commercelayer/app-elements'

import type { FormFullValues } from '@commercelayer/app-elements/dist/ui/resources/useResourceFilters/types'
import castArray from 'lodash/castArray'
import useSWR, { type SWRResponse } from 'swr'
import { metricsApiFetcher } from './fetcher'
import { getLastYearIsoRange } from './utils'

const fetchReturnStats = async ({
  slug,
  accessToken,
  filters
}: {
  slug: string
  accessToken: string
  filters: object
}): Promise<VndApiResponse<MetricsApiReturnsStatsData>> =>
  await metricsApiFetcher<MetricsApiReturnsStatsData>({
    endpoint: '/returns/stats',
    slug,
    accessToken,
    body: {
      stats: {
        field: 'return.id',
        operator: 'value_count'
      },
      filter: {
        return: {
          ...getLastYearIsoRange(new Date()),
          date_field: 'updated_at',
          ...filters
        }
      }
    }
  })

const fetchAllCounters = async ({
  slug,
  accessToken
}: {
  slug: string
  accessToken: string
}): Promise<{
  requested: number
  approved: number
  shipped: number
}> => {
  function fulfillResult(result?: PromiseSettledResult<number>): number {
    return result?.status === 'fulfilled' ? result.value : 0
  }

  // keep proper order since responses will be assigned for each list in the returned object
  const lists: ListType[] = ['requested', 'approved', 'shipped']

  const allStats = await Promise.allSettled(
    lists.map(async (listType) => {
      return await fetchReturnStats({
        slug,
        accessToken,
        filters: fromFormValuesToMetricsApi(presets[listType])
      }).then((r) => r.data.value)
    })
  )

  return {
    requested: fulfillResult(allStats[0]),
    approved: fulfillResult(allStats[1]),
    shipped: fulfillResult(allStats[2])
  }
}

export function useListCounters(): SWRResponse<{
  requested: number
  approved: number
  shipped: number
}> {
  const {
    settings: { accessToken, organizationSlug }
  } = useTokenProvider()

  const swrResponse = useSWR(
    {
      slug: organizationSlug,
      accessToken
    },
    fetchAllCounters,
    {
      revalidateOnFocus: false
    }
  )

  return swrResponse
}

/**
 * Covert FilterFormValues in Metrics API filter object.
 * Partial implementation: it only supports status, payment_status and fulfillment_status
 */
function fromFormValuesToMetricsApi(formValues: FormFullValues): object {
  return {
    statuses:
      formValues.status_in != null && castArray(formValues.status_in).length > 0
        ? {
            in: formValues.status_in
          }
        : undefined
  }
}
