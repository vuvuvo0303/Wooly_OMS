import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDateTime } from "@/lib/datetime";
import { Order } from "@/types/order";

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "orderId",
        header: "Mã đơn hàng",
    },
    {
        accessorKey: "customerId",
        header: "Mã khách hàng",
    },
    {
        accessorKey: "customerName",
        header: "Tên khách hàng",
    },
    {
        accessorKey: "customerAddress",
        header: "Địa chỉ khách hàng",
    },
    {
        accessorKey: "customerNote",
        header: "Ghi chú khách hàng",
    },
    {
        accessorKey: "totalPrice",
        header: "Tổng giá trị",
        cell: ({ row }) => formatCurrencyVND(row.original.totalPrice),
    },
    {
        accessorKey: "orderDate",
        header: "Ngày đặt hàng",
        cell: ({ row }) => formatDateTime(row.original.orderDate),
    },
    {
        accessorKey: "orderStatus",
        header: "Trạng thái đơn hàng",
    },
    {
        accessorKey: "cancelled",
        header: "Trạng thái hủy",
        cell: ({ row }) => (
            <Badge className={row.original.cancelled ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
                {row.original.cancelled ? "Đã hủy" : "Hoạt động"}
            </Badge>
        ),
    },
    {
        accessorKey: "itemList",
        header: "Danh sách sản phẩm",
        cell: ({ row }) => (
            <ul className="list-disc pl-4">
                {row.original.itemList.map((item) => (
                    <li key={item.orderDetailId}>
                        {item.productName} - {formatCurrencyVND(item.productPrice)} ({item.productQuantity}x)
                    </li>
                ))}
            </ul>
        ),
    },
];
