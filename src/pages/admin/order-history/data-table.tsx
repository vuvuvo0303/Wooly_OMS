import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
    orderDetailId: number;
    productName: string;
    productPicture: string;
    productPrice: number;
    productQuantity: number;
    partList: {
        orderDetailPartId: number;
        name: string;
        color: string;
    }[];
}

interface Order {
    orderId: number;
    customerId: number;
    customerNote: string;
    customerName: string;
    customerAddress: string;
    totalPrice: number;
    orderDate: string;
    orderStatus: string;
    cancelled: boolean;
    itemList: OrderItem[];
}

interface DataTableProps {
    data: Order[];
}

export function DataTable({ data }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: "orderId",
            header: "ID Đơn Hàng",
        },
        {
            accessorKey: "customerName",
            header: "Tên Khách Hàng",
        },
        {
            accessorKey: "customerAddress",
            header: "Địa Chỉ",
        },
        {
            accessorKey: "totalPrice",
            header: "Tổng Tiền",
        },
        {
            accessorKey: "orderDate",
            header: "Ngày Đặt",
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
        },
        {
            accessorKey: "orderStatus",
            header: "Trạng Thái",
        },
        {
            accessorKey: "cancelled",
            header: "Hủy Đơn",
            // cell: ({ getValue }) => ((getValue() as boolean) ? "Đã hủy" : "Hoàn tất"),
            cell: ({ getValue }) => (
                <Badge className={(getValue() as boolean) ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
                    {(getValue() as boolean) ? "Đã hủy" : "Hoàn tất"}
                </Badge>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <>
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.original.itemList.map((item) => (
                                        <TableRow key={item.orderDetailId} className="bg-gray-100">
                                            <TableCell colSpan={2}>{item.productName}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={item.productPicture}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover"
                                                />
                                            </TableCell>
                                            <TableCell>{item.productQuantity}</TableCell>
                                            <TableCell>{item.productPrice}</TableCell>
                                            <TableCell colSpan={3}>
                                                {item.partList.map((part) => (
                                                    <div key={part.orderDetailPartId}>
                                                        {part.name} ({part.color})
                                                    </div>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center">
                                            ~o~o~o~o~o~o~o~o~o~o~
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Trước
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Tiếp
                </Button>
            </div>
        </div>
    );
}
