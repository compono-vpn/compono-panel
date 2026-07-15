import { useGetRelayMetrics } from '@shared/api/hooks'

import { RelayMetricsPage } from '../ui/relay-metrics.page'

export function RelayMetricsPageConnector() {
    const { data, error, isLoading, isRefetching, refetch } = useGetRelayMetrics()

    return (
        <RelayMetricsPage
            error={error}
            isLoading={isLoading}
            isRefetching={isRefetching}
            onRefresh={() => {
                refetch().catch(() => undefined)
            }}
            snapshot={data}
        />
    )
}
