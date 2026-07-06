import { format } from 'date-fns'
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, XAxis, YAxis } from 'recharts'

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/common/ui/chart'
import { DAM_COLOR, DAM_CRITICAL_COLOR, DAM_NORMAL_COLOR } from '../constants/analytics'
import { useDamTimeline } from '../hooks/useAnalytics'
import type { AnalyticsWindow } from '../types/api'
import PanelCard from './PanelCard'

const chartConfig = { level: { label: 'Water level', color: DAM_COLOR } } satisfies ChartConfig

const DamLevelChart = ({ days }: { days: AnalyticsWindow }) => {
    const { data, isLoading, isError, refetch } = useDamTimeline(days)

    const dam = data?.dam
    const chartData = (data?.series ?? []).map((r) => ({
        t: new Date(r.recorded_at).getTime(),
        level: r.water_level,
        spilling: r.is_spilling,
    }))

    return (
        <PanelCard
            title={dam ? `${dam.name} level` : 'Dam level'}
            description='Water level vs normal / critical thresholds (m)'
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            isEmpty={chartData.length === 0}
            emptyMessage='No dam readings in this window.'
        >
            <ChartContainer config={chartConfig} className='aspect-auto h-56 w-full'>
                <LineChart data={chartData} margin={{ top: 8, right: 12, left: 2, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey='t'
                        type='number'
                        scale='time'
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(t: number) => format(new Date(t), 'MMM d')}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={40}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tickLine={false}
                        axisLine={false}
                        width={38}
                        tickFormatter={(v: number) => v.toFixed(1)}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={(_, p) =>
                                    p?.[0] ? format(new Date(p[0].payload.t), 'MMM d, yyyy ha') : ''
                                }
                            />
                        }
                    />
                    {dam && (
                        <>
                            <ReferenceLine
                                y={dam.normal_level}
                                stroke={DAM_NORMAL_COLOR}
                                strokeDasharray='4 4'
                                label={{ value: 'Normal', position: 'insideBottomRight', fontSize: 10, fill: DAM_NORMAL_COLOR }}
                            />
                            <ReferenceLine
                                y={dam.critical_level}
                                stroke={DAM_CRITICAL_COLOR}
                                strokeDasharray='4 4'
                                label={{ value: 'Critical', position: 'insideTopRight', fontSize: 10, fill: DAM_CRITICAL_COLOR }}
                            />
                        </>
                    )}
                    <Line
                        dataKey='level'
                        type='monotone'
                        stroke={DAM_COLOR}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                    />
                    {chartData
                        .filter((d) => d.spilling)
                        .map((d) => (
                            <ReferenceDot
                                key={d.t}
                                x={d.t}
                                y={d.level}
                                r={4}
                                fill={DAM_CRITICAL_COLOR}
                                stroke='var(--background)'
                                strokeWidth={1.5}
                            />
                        ))}
                </LineChart>
            </ChartContainer>
        </PanelCard>
    )
}

export default DamLevelChart
