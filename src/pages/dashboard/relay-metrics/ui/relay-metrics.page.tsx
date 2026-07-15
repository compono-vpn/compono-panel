import {
    ActionIcon,
    Alert,
    Badge,
    Box,
    Card,
    Center,
    Grid,
    Group,
    Progress,
    SimpleGrid,
    Stack,
    Table,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import {
    IconActivityHeartbeat,
    IconAlertTriangle,
    IconArrowsShuffle,
    IconClock,
    IconDatabase,
    IconRefresh,
    IconRoute,
    IconServer2,
    IconUsers
} from '@tabler/icons-react'
import { ReactNode } from 'react'

import { LoadingScreen, Page, PageHeaderShared } from '@shared/ui'
import { RelayMetricsSnapshot } from '@shared/api/hooks'

interface RelayMetricsPageProps {
    error: Error | null
    isLoading: boolean
    isRefetching: boolean
    onRefresh: () => void
    snapshot: RelayMetricsSnapshot | undefined
}

interface SummaryCardProps {
    color: string
    detail: string
    icon: ReactNode
    label: string
    value: string
}

function SummaryCard({ color, detail, icon, label, value }: SummaryCardProps) {
    return (
        <Card padding="lg" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" wrap="nowrap">
                <Stack gap={2}>
                    <Text c="dimmed" fw={600} size="xs" tt="uppercase">
                        {label}
                    </Text>
                    <Text fw={700} size="xl">
                        {value}
                    </Text>
                    <Text c="dimmed" size="xs">
                        {detail}
                    </Text>
                </Stack>
                <ThemeIcon color={color} radius="xl" size={46} variant="light">
                    {icon}
                </ThemeIcon>
            </Group>
        </Card>
    )
}

const displayMetric = (value: null | number, suffix = '') =>
    value === null
        ? '—'
        : `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}`

const percentage = (used: null | number, limit: null | number) => {
    if (used === null || limit === null || limit <= 0) return null
    return Math.min(100, Math.max(0, (used / limit) * 100))
}

const capacityColor = (value: null | number) => {
    if (value !== null && value >= 90) return 'red'
    if (value !== null && value >= 75) return 'yellow'
    return 'cyan'
}

function CapacityBar({ label, value }: { label: string; value: null | number }) {
    return (
        <Stack gap={4}>
            <Group justify="space-between">
                <Text c="dimmed" size="xs">
                    {label}
                </Text>
                <Text fw={600} size="xs">
                    {value === null ? 'Not reported' : `${value.toFixed(1)}%`}
                </Text>
            </Group>
            <Progress color={capacityColor(value)} radius="xl" size="sm" value={value ?? 0} />
        </Stack>
    )
}

export function RelayMetricsPage({
    error,
    isLoading,
    isRefetching,
    onRefresh,
    snapshot
}: RelayMetricsPageProps) {
    if (isLoading && !snapshot) {
        return (
            <Page title="Relay Metrics">
                <LoadingScreen height="80vh" />
            </Page>
        )
    }

    return (
        <Page title="Relay Metrics">
            <PageHeaderShared
                actions={
                    <Tooltip label="Refresh now">
                        <ActionIcon
                            aria-label="Refresh relay metrics"
                            loading={isRefetching}
                            onClick={onRefresh}
                            size="lg"
                            variant="light"
                        >
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Tooltip>
                }
                description="Compono two-hop health: relay sync targets, current public paths, and exit state"
                icon={<IconArrowsShuffle size={24} />}
                title="Relay Metrics"
            />

            {error && (
                <Alert
                    color="red"
                    icon={<IconAlertTriangle size={18} />}
                    mb="md"
                    title="Telemetry unavailable"
                >
                    The last relay snapshot could not be refreshed. Previously loaded values remain
                    visible.
                </Alert>
            )}

            {snapshot ? (
                <Stack gap="md">
                    <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
                        <SummaryCard
                            color={
                                snapshot.summary.healthyRelays === snapshot.summary.totalRelays
                                    ? 'teal'
                                    : 'red'
                            }
                            detail="Relay agents receiving user configs"
                            icon={<IconServer2 size={24} />}
                            label="Healthy sync targets"
                            value={`${snapshot.summary.healthyRelays} / ${snapshot.summary.totalRelays}`}
                        />
                        <SummaryCard
                            color={
                                snapshot.summary.healthyHops === snapshot.summary.totalHops
                                    ? 'teal'
                                    : 'red'
                            }
                            detail={`${snapshot.summary.averageLatencyMs.toFixed(0)} ms average latency`}
                            icon={<IconRoute size={24} />}
                            label="Healthy exit paths"
                            value={`${snapshot.summary.healthyHops} / ${snapshot.summary.totalHops}`}
                        />
                        <SummaryCard
                            color={snapshot.summary.userCountMismatch ? 'red' : 'blue'}
                            detail={
                                snapshot.summary.userCountMismatch
                                    ? 'Synchronized user sets differ'
                                    : 'Synchronized user sets are aligned'
                            }
                            icon={<IconUsers size={24} />}
                            label="Synced user configs"
                            value={snapshot.summary.databaseActiveUsers.toLocaleString()}
                        />
                        <SummaryCard
                            color={snapshot.summary.driftedTargets > 0 ? 'orange' : 'teal'}
                            detail="Expected database users versus exit Xray"
                            icon={<IconDatabase size={24} />}
                            label="Sync drift"
                            value={`${snapshot.summary.driftedTargets} target${snapshot.summary.driftedTargets === 1 ? '' : 's'}`}
                        />
                    </SimpleGrid>

                    <Box>
                        <Group align="flex-end" justify="space-between" mb="xs">
                            <Stack gap={0}>
                                <Text fw={700} size="lg">
                                    Relay-agent sync targets
                                </Text>
                                <Text c="dimmed" size="xs">
                                    User-config destinations; these are not live connection counts
                                </Text>
                            </Stack>
                            <Badge
                                color="gray"
                                leftSection={<IconClock size={12} />}
                                variant="light"
                            >
                                Updated {new Date(snapshot.generatedAt).toLocaleTimeString()}
                            </Badge>
                        </Group>
                        <Grid gutter="md">
                            {snapshot.relays.map((relay) => {
                                const memoryUsed =
                                    relay.memoryAvailableMb !== null && relay.memoryTotalMb !== null
                                        ? relay.memoryTotalMb - relay.memoryAvailableMb
                                        : null
                                const memoryPct = percentage(memoryUsed, relay.memoryTotalMb)
                                const nginxPct = percentage(
                                    relay.nginxActiveConnections,
                                    relay.nginxWorkerMax
                                )
                                const fdPct = percentage(
                                    relay.xrayFileDescriptorsUsed,
                                    relay.xrayFileDescriptorsLimit
                                )

                                return (
                                    <Grid.Col key={relay.name} span={{ base: 12, xl: 6 }}>
                                        <Card h="100%" padding="lg" radius="md" withBorder>
                                            <Stack gap="md">
                                                <Group justify="space-between">
                                                    <Group gap="sm">
                                                        <ThemeIcon
                                                            color={relay.up ? 'teal' : 'red'}
                                                            radius="xl"
                                                            variant="light"
                                                        >
                                                            <IconActivityHeartbeat size={18} />
                                                        </ThemeIcon>
                                                        <Box>
                                                            <Text fw={700}>{relay.name}</Text>
                                                            <Text c="dimmed" size="xs">
                                                                {relay.userCount} synced user
                                                                configs
                                                            </Text>
                                                        </Box>
                                                    </Group>
                                                    <Badge
                                                        color={relay.up ? 'teal' : 'red'}
                                                        variant="light"
                                                    >
                                                        {relay.up ? 'Healthy' : 'Down'}
                                                    </Badge>
                                                </Group>

                                                <CapacityBar
                                                    label="Memory used"
                                                    value={memoryPct}
                                                />
                                                <CapacityBar
                                                    label="Nginx connections"
                                                    value={nginxPct}
                                                />
                                                <CapacityBar
                                                    label="Xray file descriptors"
                                                    value={fdPct}
                                                />

                                                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
                                                    <Box>
                                                        <Text c="dimmed" size="xs">
                                                            CPU
                                                        </Text>
                                                        <Text fw={600} size="sm">
                                                            {displayMetric(relay.cpuPercent, '%')}
                                                        </Text>
                                                    </Box>
                                                    <Box>
                                                        <Text c="dimmed" size="xs">
                                                            IO wait
                                                        </Text>
                                                        <Text fw={600} size="sm">
                                                            {displayMetric(
                                                                relay.ioWaitPercent,
                                                                '%'
                                                            )}
                                                        </Text>
                                                    </Box>
                                                    <Box>
                                                        <Text c="dimmed" size="xs">
                                                            Restarts
                                                        </Text>
                                                        <Text fw={600} size="sm">
                                                            {relay.restartCount.toLocaleString()}
                                                        </Text>
                                                    </Box>
                                                    <Box>
                                                        <Text c="dimmed" size="xs">
                                                            Live updates
                                                        </Text>
                                                        <Text fw={600} size="sm">
                                                            {relay.dynamicUpdateCount.toLocaleString()}
                                                        </Text>
                                                    </Box>
                                                </SimpleGrid>
                                            </Stack>
                                        </Card>
                                    </Grid.Col>
                                )
                            })}
                        </Grid>
                    </Box>

                    <Card padding="lg" radius="md" withBorder>
                        <Text fw={700} mb="md" size="lg">
                            Current public two-hop path health
                        </Text>
                        <Table.ScrollContainer minWidth={900}>
                            <Table highlightOnHover verticalSpacing="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Exit path</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Latency</Table.Th>
                                        <Table.Th>Connect</Table.Th>
                                        <Table.Th>TLS</Table.Th>
                                        <Table.Th>TTFB</Table.Th>
                                        <Table.Th>Observed exit IP</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {snapshot.hops.map((hop) => (
                                        <Table.Tr key={hop.address}>
                                            <Table.Td>
                                                <Text fw={600} size="sm">
                                                    {hop.name}
                                                </Text>
                                                <Text c="dimmed" ff="monospace" size="xs">
                                                    {hop.address}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={hop.up ? 'teal' : 'red'}
                                                    variant="light"
                                                >
                                                    {hop.up ? 'Up' : 'Down'}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                {displayMetric(hop.latencyMs, ' ms')}
                                            </Table.Td>
                                            <Table.Td>
                                                {displayMetric(hop.connectMs, ' ms')}
                                            </Table.Td>
                                            <Table.Td>{displayMetric(hop.tlsMs, ' ms')}</Table.Td>
                                            <Table.Td>{displayMetric(hop.ttfbMs, ' ms')}</Table.Td>
                                            <Table.Td>
                                                <Text ff="monospace" size="sm">
                                                    {hop.exitIp || '—'}
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Card>

                    <Card padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="md">
                            <Text fw={700} size="lg">
                                Exit user synchronization
                            </Text>
                            <Text c="dimmed" size="xs">
                                Remnawave expected users → exit Xray state
                            </Text>
                        </Group>
                        <Table.ScrollContainer minWidth={850}>
                            <Table highlightOnHover verticalSpacing="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Target</Table.Th>
                                        <Table.Th>Inbound tag</Table.Th>
                                        <Table.Th>Expected</Table.Th>
                                        <Table.Th>Actual</Table.Th>
                                        <Table.Th>Drift</Table.Th>
                                        <Table.Th>Last success</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {snapshot.syncTargets.map((target) => {
                                        const drift = target.missingUsers + target.staleUsers
                                        return (
                                            <Table.Tr key={`${target.target}-${target.tag}`}>
                                                <Table.Td>
                                                    <Text fw={600} size="sm">
                                                        {target.target}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text ff="monospace" size="xs">
                                                        {target.tag}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>{target.expectedUsers}</Table.Td>
                                                <Table.Td>{target.actualUsers}</Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={drift > 0 ? 'orange' : 'teal'}
                                                        variant="light"
                                                    >
                                                        {drift > 0
                                                            ? `${target.missingUsers} missing · ${target.staleUsers} stale`
                                                            : 'In sync'}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    {target.lastSuccessAt
                                                        ? new Date(
                                                              target.lastSuccessAt
                                                          ).toLocaleString()
                                                        : '—'}
                                                </Table.Td>
                                            </Table.Tr>
                                        )
                                    })}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Card>
                </Stack>
            ) : (
                <Center mih={300}>
                    <Text c="dimmed">No relay telemetry is available yet.</Text>
                </Center>
            )}
        </Page>
    )
}
