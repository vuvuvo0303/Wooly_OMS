import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Hàm tạo màu sắc động dựa trên số lượng ngành hàng
const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const color = `hsl(${(i * 360) / count}, 70%, 50%)`; // Tạo màu sắc dựa trên HSL
        colors.push(color);
    }
    return colors;
};

const CategorySalesPieChart = () => {
    // State quản lý dữ liệu ngành hàng
    const [categorySalesData, setCategorySalesData] = useState([
        { name: "Thú bông", value: 400 },
        { name: "Móc khoá", value: 300 },
        { name: "Khác", value: 200 },
        { name: "Hoa", value: 100 },
        { name: "Túi xách", value: 150 },
    ]);

    // State quản lý input thêm ngành hàng mới
    const [newCategory, setNewCategory] = useState("");
    const [newValue, setNewValue] = useState("");

    // Hàm thêm ngành hàng mới
    const addCategory = () => {
        if (newCategory && newValue) {
            const newData = [...categorySalesData, { name: newCategory, value: parseInt(newValue, 10) }];
            setCategorySalesData(newData);
            setNewCategory("");
            setNewValue("");
        }
    };

    // Tạo màu sắc động dựa trên số lượng ngành hàng
    const colors = generateColors(categorySalesData.length);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="text-lg">Tỷ lệ sản phẩm bán được theo ngành hàng</CardTitle>
                <CardDescription>
                    <div className="flex gap-2 items-center">
                        Phần trăm sản phẩm bán được
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                {/* Biểu đồ tròn */}
                <div className="w-full max-w-[350px] mx-auto">
                    <PieChart width={350} height={250}>
                        <Pie
                            data={categorySalesData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value" // Sử dụng trường value để tính toán phần trăm
                            label={false} // Tắt nhãn trên biểu đồ
                        >
                            {categorySalesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value} sản phẩm`,
                                `${name}: ${(props.payload.percent * 100).toFixed(2)}%`,
                            ]}
                        />
                        <Legend />
                    </PieChart>
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full items-start gap-2 text-sm">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Hiển thị tỷ lệ sản phẩm bán được theo ngành hàng.
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default CategorySalesPieChart;