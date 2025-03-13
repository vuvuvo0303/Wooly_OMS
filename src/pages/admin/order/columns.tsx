import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orderStatus } from "@/constants/order-status";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDateTime } from "@/lib/datetime";
import { Order } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Mã đơn hàng",
    cell: ({ row }) => <div>{row.original.id}</div>,
  },
  {
    accessorKey: "customerPhone",
    header: "Số điện thoại khách hàng",
  },
  {
    accessorKey: "user",
    header: "Tên khách hàng",
  },
  {
    accessorKey: "customerAddress",
    header: "Địa chỉ khách hàng",
  },
  {
    accessorKey: "totalPrice",
    header: "Tổng giá",
    cell: ({ row }) => {
      if (row.original.totalPrice == null) {
        return "";
      }
      return <div>{row.original.totalPrice.toLocaleString()} VND</div>;
    },
  },
  {
    accessorKey: "orderDate",
    header: "Ngày đặt",
    cell: ({ row }) => {
      const date = new Date(row.original.orderDate);
      return <div>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</div>;
    },
  },
  {
    accessorKey: "cancelled",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge className={row.original.cancelled ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
        {row.original.cancelled ? "Đã hủy" : "Hoàn tất"}
      </Badge>
    ),
  },
];
