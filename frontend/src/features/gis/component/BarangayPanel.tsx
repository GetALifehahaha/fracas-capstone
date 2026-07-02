import { X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardTitle, CardContent } from '@/common/ui/card'
import { Label } from '@/common/ui/label'
import { Progress, ProgressLabel } from '@/common/ui/progress'
import { Badge } from '@/common/ui/badge'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/common/ui/chart'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import capitalize from '@/common/utils/capitalize'
import { useBarangayRisk } from '../hooks/useBarangayRisk'
import { CATEGORY_LABELS, RISK_COLORS } from '../constants/risk'
import type { BarangayRisk, RiskFactorBreakdown } from '../types/api'

const chartConfig = {
    rainfall: { label: 'Rainfall', color: 'var(--chart-2)' },
} satisfies ChartConfig

const FACTOR_LABELS: Record<string, string> = {
    rainfall: 'Rainfall',
    dam: 'Dam / river stage',
    vulnerability: 'Vulnerability',
}

const fmt = (v: number | null | undefined, unit = ''): string =>
    v == null ? '—' : `${v}${unit}`

const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className='absolute top-0 right-0 w-1/4 h-full bg-background z-3 border-l shadow-xl'>
        <div className='h-full overflow-y-auto flex flex-col gap-4 p-4'>{children}</div>
    </div>
)

const CloseButton = ({ onClose }: { onClose: () => void }) => (
    <button
        type='button'
        onClick={onClose}
        aria-label='Close panel'
        className='text-muted-foreground hover:bg-muted flex size-7 items-center justify-center rounded-md transition-colors'
    >
        <X className='size-4' />
    </button>
)

const FactorBar = ({ name, factor }: { name: string; factor: RiskFactorBreakdown }) => (
    <div className='flex flex-col gap-1'>
        <div className='flex justify-between text-xs'>
            <span>{FACTOR_LABELS[name] ?? capitalize(name)}</span>
            <span className='text-muted-foreground'>
                {factor.available ? `${Math.round(factor.value * 100)}%` : 'no data'}
            </span>
        </div>
        <div className='bg-muted h-1.5 w-full overflow-hidden rounded-full'>
            <div
                className='h-full rounded-full bg-foreground/70'
                style={{ width: factor.available ? `${factor.value * 100}%` : 0 }}
            />
        </div>
    </div>
)

const PanelBody = ({ data }: { data: BarangayRisk }) => {
    const chartData = [
        { name: 'Now', rainfall: data.current_rainfall },
        { name: '1hr', rainfall: data.rainfall_forecast_1hr },
        { name: '2hr', rainfall: data.rainfall_forecast_2hr },
        { name: '3hr', rainfall: data.rainfall_forecast_3hr },
        { name: '4hr', rainfall: data.rainfall_forecast_4hr },
    ].filter((d) => d.rainfall != null)

    const category = data.status
    const roc = data.rainfall_rate_change

    return (
        <>
            <Card>
                <CardTitle className='flex items-center justify-between'>
                    <span>Hazard: {category ? CATEGORY_LABELS[category] : 'No data'}</span>
                    {category && (
                        <Badge style={{ backgroundColor: RISK_COLORS[category], color: '#3f0a0a' }}>
                            {CATEGORY_LABELS[category]}
                        </Badge>
                    )}
                </CardTitle>
                {data.is_degraded && (
                    <p className='text-destructive text-xs'>
                        Score is degraded — some inputs were stale.
                    </p>
                )}
                <div className='grid grid-cols-2 gap-4'>
                    <Card className='justify-between'>
                        <Label className='text-xs'>Current Rainfall</Label>
                        <span className='flex items-end gap-1'>
                            <h1 className='text-3xl font-semibold'>{fmt(data.current_rainfall)}</h1>
                            <h5 className='text-muted-foreground'>mm/hr</h5>
                        </span>
                    </Card>
                    <Card className='justify-between'>
                        <Label className='text-xs'>Rate of Change</Label>
                        <span className='flex items-end gap-1'>
                            <h1 className='text-3xl font-semibold'>
                                {roc == null ? '—' : `${roc > 0 ? '+' : ''}${roc}`}
                            </h1>
                            <h5 className='text-muted-foreground'>mm/hr</h5>
                        </span>
                    </Card>
                </div>
                <Progress value={data.risk_score ?? 0}>
                    <ProgressLabel className='flex w-full justify-between'>
                        <span>Final Hazard Risk Score</span>
                        <span>{data.risk_score == null ? '—' : `${Math.round(data.risk_score)}%`}</span>
                    </ProgressLabel>
                </Progress>
            </Card>

            {data.breakdown && (
                <Card>
                    <CardTitle>Why this score</CardTitle>
                    <div className='flex flex-col gap-3'>
                        {Object.entries(data.breakdown).map(([name, factor]) => (
                            <FactorBar key={name} name={name} factor={factor} />
                        ))}
                    </div>
                </Card>
            )}

            <Card>
                <CardTitle>Rainfall</CardTitle>
                <div className='flex flex-col gap-2'>
                    {[
                        ['Current', data.current_rainfall],
                        ['Forecast (1 hr)', data.rainfall_forecast_1hr],
                        ['Forecast (2 hr)', data.rainfall_forecast_2hr],
                        ['Forecast (3 hr)', data.rainfall_forecast_3hr],
                        ['Forecast (4 hr)', data.rainfall_forecast_4hr],
                        ['Accumulated (24 hr)', data.accumulated_24hr],
                    ].map(([label, value]) => (
                        <Card size='sm' className='flex-row justify-between' key={label as string}>
                            <Label>{label}</Label>
                            <h1>{fmt(value as number | null)} mm</h1>
                        </Card>
                    ))}
                </div>
            </Card>

            {chartData.length > 1 && (
                <Card className='h-fit py-2'>
                    <Label>Rainfall Trend</Label>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{ top: 12, left: 2, right: 12 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey='name' tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Line
                                    dataKey='rainfall'
                                    type='natural'
                                    stroke='var(--color-rainfall)'
                                    strokeWidth={2}
                                    dot={{ fill: 'var(--color-rainfall)' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            )}

            {data.computed_at && (
                <p className='text-muted-foreground text-center text-xs'>
                    Updated {formatDistanceToNow(new Date(data.computed_at), { addSuffix: true })}
                </p>
            )}
        </>
    )
}

interface BarangayPanelProps {
    barangayId: number
    onClose: () => void
}

const BarangayPanel = ({ barangayId, onClose }: BarangayPanelProps) => {
    const { data, isLoading, isError, refetch } = useBarangayRisk(barangayId)

    return (
        <Shell>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-medium'>{data?.name ?? 'Barangay'}</h1>
                <CloseButton onClose={onClose} />
            </div>

            {isLoading && <p className='text-muted-foreground text-sm'>Loading…</p>}
            {isError && (
                <Card className='items-start gap-2'>
                    <p className='text-destructive text-sm'>Could not load barangay detail.</p>
                    <button
                        type='button'
                        onClick={() => refetch()}
                        className='text-sm underline underline-offset-2'
                    >
                        Retry
                    </button>
                </Card>
            )}
            {data && <PanelBody data={data} />}
        </Shell>
    )
}

export default BarangayPanel
