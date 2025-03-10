import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Image, Modal } from "antd";
import { Product } from "@/types/product";
import { deleteProduct } from "@/lib/api/product-api";
import { useState } from "react";
import { toast } from "react-toastify";

// Delete Confirmation Component
interface DeleteConfirmProps {
  product: Product;
  onSuccess?: () => void;
}

const DeleteConfirm = ({ product, onSuccess }: DeleteConfirmProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${product.productName}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const result = await deleteProduct(product.productID);
          console.log("API result:", result); // Log để kiểm tra

          // Kiểm tra nếu result.success là true
          if (result && result.success === true) {
            toast.success("Đã xóa sản phẩm thành công");
            window.location.reload();
            if (onSuccess) onSuccess();
          } else {
            toast.error(result?.message || "Xóa sản phẩm thất bại");
          }
        } catch (error: any) {
          console.error("Error deleting product:", error);
          toast.error(error.message || "Đã xảy ra lỗi khi xóa sản phẩm");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Button variant="destructive" className="w-full text-left justify-start" onClick={handleDelete} disabled={loading}>
      {loading ? "Đang xóa..." : "Xóa sản phẩm"}
    </Button>
  );
};

// Columns Definition
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
        <Link to={`/product/${product.productID}`} className="font-semibold hover:text-blue-400 duration-75">
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
    headerProps: {
      className: "w-[200px]",
    },
    cellProps: {
      className: "w-[200px] whitespace-nowrap",
    },
  },
  {
    accessorKey: "stockQuantity",
    header: "Số lượng tồn kho",
  },
  {
    accessorKey: "partNames",
    header: "Bộ phận",
    cell: ({ row }) => {
      const parts = row.original.partNames || [];
      const partNames = parts.map((part) => part.partName);
      return <div>{partNames.length > 0 ? partNames.join(", ") : "Không có"}</div>;
    },
  },
  {
    accessorKey: "partNames",
    header: "Màu sắc",
    cell: ({ row }) => {
      const parts = row.original.partNames || [];

      return (
        <div className="flex flex-col gap-1">
          {parts.length > 0 ? (
            parts.map((part, partIndex) => (
              <div key={partIndex}>
                <span className="font-semibold">{part.partName}:</span>{" "}
                {part.partColors.length > 0 ? (
                  part.partColors.map((color, colorIndex) => {
                    const bgColor = color.partColor.toLowerCase(); // Chuyển thành lowercase để tránh sai màu
                    const textColor = ["black", "blue", "red", "purple", "brown"].includes(bgColor) ? "#FFF" : "#000"; // Chữ trắng nếu nền tối, chữ đen nếu nền sáng

                    return (
                      <span
                        key={colorIndex}
                        className="px-1 py-0.5 rounded text-[10px] ml-1"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        {color.partColor}
                      </span>
                    );
                  })
                ) : (
                  <span className="ml-1">Không có</span>
                )}
              </div>
            ))
          ) : (
            <span>Không có</span>
          )}
        </div>
      );
    },
    size: 100,
  },

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
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/product/${product.productID}/edit`}>Cập nhật</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
              <DeleteConfirm
                product={product}
                onSuccess={() => {
                  console.log("Deleted successfully");
                  // Thêm logic reload data nếu cần
                }}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
