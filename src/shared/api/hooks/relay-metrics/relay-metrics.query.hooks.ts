import { createQueryKeys } from '@lukemorales/query-key-factory'
import { keepPreviousData } from '@tanstack/react-query'
import { z } from 'zod'

import { createGetQueryHook, errorHandler } from '../../tsq-helpers'

const OptionalMetricSchema = z.number().nullable()

export const RelayMetricsSnapshotSchema = z.object({
    generatedAt: z.string().datetime(),
    summary: z.object({
        totalRelays: z.number(),
        healthyRelays: z.number(),
        totalHops: z.number(),
        healthyHops: z.number(),
        databaseActiveUsers: z.number(),
        userCountMismatch: z.boolean(),
        driftedTargets: z.number(),
        averageLatencyMs: z.number()
    }),
    relays: z.array(
        z.object({
            name: z.string(),
            up: z.boolean(),
            userCount: z.number(),
            cpuPercent: OptionalMetricSchema,
            ioWaitPercent: OptionalMetricSchema,
            memoryAvailableMb: OptionalMetricSchema,
            memoryTotalMb: OptionalMetricSchema,
            swapUsedMb: OptionalMetricSchema,
            swapTotalMb: OptionalMetricSchema,
            xrayFileDescriptorsUsed: OptionalMetricSchema,
            xrayFileDescriptorsLimit: OptionalMetricSchema,
            nginxActiveConnections: OptionalMetricSchema,
            nginxWorkerMax: OptionalMetricSchema,
            restartCount: z.number(),
            dynamicUpdateCount: z.number()
        })
    ),
    hops: z.array(
        z.object({
            name: z.string(),
            address: z.string(),
            exitIp: z.string(),
            up: z.boolean(),
            latencyMs: OptionalMetricSchema,
            connectMs: OptionalMetricSchema,
            tlsMs: OptionalMetricSchema,
            ttfbMs: OptionalMetricSchema
        })
    ),
    syncTargets: z.array(
        z.object({
            target: z.string(),
            tag: z.string(),
            expectedUsers: z.number(),
            actualUsers: z.number(),
            missingUsers: z.number(),
            staleUsers: z.number(),
            lastSuccessAt: z.string().datetime().nullable()
        })
    )
})

export type RelayMetricsSnapshot = z.infer<typeof RelayMetricsSnapshotSchema>

const RelayMetricsResponseSchema = z.object({ response: RelayMetricsSnapshotSchema })

export const relayMetricsQueryKeys = createQueryKeys('relay-metrics', {
    snapshot: { queryKey: null }
})

export const useGetRelayMetrics = createGetQueryHook({
    endpoint: '/api/relay-metrics',
    responseSchema: RelayMetricsResponseSchema,
    getQueryKey: () => relayMetricsQueryKeys.snapshot.queryKey,
    rQueryParams: {
        placeholderData: keepPreviousData,
        refetchInterval: 15_000,
        staleTime: 10_000
    },
    errorHandler: (error) => errorHandler(error, 'Get Relay Metrics')
})
