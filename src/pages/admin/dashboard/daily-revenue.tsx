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
import { getRevenuePerDay } from "@/lib/api/statics-api";

const chartConfig = {
    revenue: {
        label: "Doanh thu",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const DailyRevenue = () => {
    const [chartData, setChartData] = useState<Array<any>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRevenuePerDay();
            if (response.success && response.data) {
                const formattedData = response.data.map((item: any) => ({
                    ...item,
                    date: formatDate(item.date),
                }));
                setChartData(formattedData);
            } else {
                console.error("Lỗi khi tải dữ liệu doanh thu:", response.error);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const formatToThousandVND = (value: number) => {
        return ` ${(value / 1000).toLocaleString()}K đồng`;
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="text-lg">Doanh thu theo ngày</CardTitle>
                <CardDescription>
                    <div className="flex gap-2 items-center">
                        Doanh thu 7 ngày gần đây
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => (value / 1000).toLocaleString()}
                            label={{
                                value: "K đồng",
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
                                                style={{
                                                    "--color-bg": `var(--color-${name})`,
                                                } as React.CSSProperties}
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
                            fill="#82ca9d"
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="w-full items-start gap-2 text-sm">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Hiển thị doanh thu theo ngày trong 7 ngày qua.
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default DailyRevenue;