import { useEffect, useState } from "react";
import { CartesianGrid, Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrencyVND } from "@/lib/currency";

const chartConfig = {
    revenue: {
        label: "Doanh thu",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const WeeklyRevenue = () => {
    const [chartData, setChartData] = useState<Array<any>>([]);

    const weeklyRevenueData = [
        { week: 1, year: 2025, totalRevenue: 1200000 },
        { week: 2, year: 2025, totalRevenue: 1350000 },
        { week: 3, year: 2025, totalRevenue: 1400000 },
        { week: 4, year: 2025, totalRevenue: 1550000 },
        { week: 5, year: 2025, totalRevenue: 1600000 },
        { week: 6, year: 2025, totalRevenue: 1700000 },
        { week: 7, year: 2025, totalRevenue: 1800000 },
        { week: 8, year: 2025, totalRevenue: 1900000 },
        { week: 9, year: 2025, totalRevenue: 2000000 },
        { week: 10, year: 2025, totalRevenue: 2100000 },
        { week: 11, year: 2025, totalRevenue: 2200000 },
        { week: 12, year: 2025, totalRevenue: 2300000 },
    ];

    useEffect(() => {
        setChartData(weeklyRevenueData);
    }, []);

    const formatToThousandVND = (value: number) => {
        return `${(value / 1000).toLocaleString()} nghìn đồng`;
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="text-lg">Doanh thu theo tuần</CardTitle>
                <CardDescription>
                    <div className="flex gap-2 items-center">
                        Doanh thu các tuần gần đây
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            // tickMargin={8}
                            label={{
                                value: "Tuần",
                                position: "insideBottom",
                                offset: 0,
                                style: {
                                    fill: "hsl(var(--muted-foreground))",
                                    fontSize: "12px",
                                },
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => (value / 1000).toLocaleString()}
                            label={{
                                value: "nghìn đồng",
                                angle: -90,
                                position: "insideLeft",
                                style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))" },
                            }}
                        />
                        <Tooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name) => (
                                        <>
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                                style={
                                                    {
                                                        "--color-bg": `var(--color-${name})`,
                                                    } as React.CSSProperties
                                                }
                                            />
                                            <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                                                {chartConfig[name as keyof typeof chartConfig]?.label || name}
                                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                    {formatToThousandVND(value as number)}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                />
                            }
                        />
                        <Bar
                            dataKey="totalRevenue"
                            fill="#ffa726"
                            radius={[4, 4, 0, 0]}
                            barSize={15}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="w-full items-start gap-2 text-sm">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Hiển thị doanh thu theo tuần trong 12 tuần qua.
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default WeeklyRevenue;