import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCategory, updateCategory } from "@/lib/api/category-api";
import { formatDate } from "@/lib/datetime";
import { Category } from "@/types/category";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import { Modal, Input } from "antd";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Tên danh mục
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "createAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Ngày chỉnh sửa
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.original.createAt;
      return <div>{dateStr ? new Date(dateStr).toLocaleString() : "-"}</div>;
    },
  },
  
  
  {
    accessorKey: "updateAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Ngày chỉnh sửa
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.original.updateAt;
      return <div>{dateStr ? new Date(dateStr).toLocaleString() : "-"}</div>;
    },
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      // State để quản lý Modal cập nhật danh mục
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [categoryName, setCategoryName] = useState(category.name);

      const showEditModal = () => {
        setCategoryName(category.name);
        setIsModalOpen(true);
      };
      const handleUpdateCategory = async () => {
        if (!category?.id) {
          toast.error("Lỗi: Không tìm thấy ID danh mục");
          return;
        }

        try {
          console.log("Dữ liệu gửi lên:", category.id, categoryName);
          const response = await updateCategory(category.id, { name: categoryName });

          console.log("Response từ API:", response);

          if (response?.success) {
            setIsModalOpen(false);
            window.location.reload();
          } else {
            toast.error(response?.message || "Cập nhật danh mục thất bại");
          }
        } catch (error: any) {
          console.error("Lỗi khi cập nhật danh mục:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Lỗi khi cập nhật danh mục");
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Mở modal cập nhật danh mục */}
              <DropdownMenuItem onClick={showEditModal}>Cập nhật danh mục</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  Modal.confirm({
                    title: "Xác nhận xóa",
                    content: `Bạn có chắc muốn xóa danh mục "${category.name}"?`,
                    okText: "Xóa",
                    okType: "danger",
                    cancelText: "Hủy",
                    onOk: async () => {
                      try {
                        const response = await deleteCategory(category.id);
                        if (response?.success) {
                          toast.success("Xóa danh mục thành công");
                          window.location.reload();
                        } else {
                          toast.success("Xóa danh mục thành công");
                          window.location.reload();
                        }
                      } catch (error) {
                        toast.error("Lỗi khi xóa danh mục");
                      }
                    },
                  });
                }}
              >
                Xóa danh mục
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modal cập nhật danh mục */}
          <Modal
            title="Cập nhật danh mục"
            open={isModalOpen}
            onOk={handleUpdateCategory}
            onCancel={() => setIsModalOpen(false)}
            okText="Lưu"
            cancelText="Hủy"
          >
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục mới"
            />
          </Modal>
        </>
      );
    },
  },
];
