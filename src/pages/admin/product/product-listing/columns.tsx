import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Image } from "antd";

// Định nghĩa kiểu dữ liệu Product
interface Product {
  productID: number;
  description: string;
  imageUrl: string;
  productName: string;
  price: number;
  stockQuantity: number;
  category: string;
  partName: string[]; // 🟢 Danh sách bộ phận
  partColor: string[]; // 🟢 Danh sách màu sắc
}
export const columns: ColumnDef<Product>[] = [
  {
    header: "Hình ảnh",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Image
          style={{ width: "50px", height: "50px" }}
          src={product.imageUrl}
          alt={product.productName}
          className="size-10 object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "productName",
    header: "Tên sản phẩm",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Link
          to={`/product/${product.productID}`}
          className="font-semibold hover:text-blue-400 duration-75"
        >
          {product.productName}
        </Link>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Danh mục",
  },
  {
    accessorKey: "price",
    header: "Giá bán",
    cell: ({ row }) => {
      const price = row.original.price;
      return <span>{price.toLocaleString()} đ</span>;
    },
  },
  {
    accessorKey: "stockQuantity",
    header: "Số lượng tồn kho",
  },
  {
    accessorKey: "partName",
    header: "Bộ phận",
    cell: ({ row }) => {
      const parts = row.original.partName || []; // Nếu partName undefined/null thì gán mảng rỗng
      return <div>{parts.length > 0 ? parts.join(", ") : "Không có"}</div>; // Hiển thị "Không có" nếu mảng trống
    },
  }
,  
{
  accessorKey: "partColor",
  header: "Màu sắc",
  cell: ({ row }) => {
    const colors = row.original.partColor || []; // Nếu partColor undefined/null thì gán mảng rỗng
    return (
      <div className="flex gap-1">
        {colors.length > 0 ? (
          colors.map((color, index) => (
            <span key={index} className="px-2 py-1 rounded bg-gray-200 text-xs">
              {color}
            </span>
          ))
        ) : (
          <span>Không có</span>
        )}
      </div>
    );
  },
}
,
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(product.productID.toString());
                toast("Đã sao chép.");
              }}
            >
              Sao chép ID sản phẩm
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/product/${product.productID}`}>Xem chi tiết</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`/product/${product.productID}/edit`}>Cập nhật</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Xóa sản phẩm
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
