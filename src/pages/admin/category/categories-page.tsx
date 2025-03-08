import Header from "@/components/header";
import ToolsPanel from "./tools-panel";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Category } from "@/types/category";
import { useState, useEffect } from "react";
import { getCategories } from "@/lib/api/category-api";

const CategoriesPage = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Định nghĩa fetchCategories để có thể truyền xuống component con
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      if ((response as { success: boolean }).success) {
        setData(
          response.data.map((item:any) => ({
            id: item.id,
            name: item.name,
            createAt: item.createAt,
            updateAt: item.updateAt,
          }))
        );
      } else {
        console.error("Lỗi khi tải danh mục:", response.error);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách loại sản phẩm len" />
      <div className="p-5 flex-1 overflow-auto">
        {/* Truyền fetchCategories xuống ToolsPanel */}
        <ToolsPanel fetchCategories={fetchCategories} />
        {loading ? <p className="text-center">Đang tải dữ liệu...</p> : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  );
};

export default CategoriesPage;
