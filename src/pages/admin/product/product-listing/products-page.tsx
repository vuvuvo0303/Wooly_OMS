import Header from "@/components/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import ToolPanel from "./tool-panel";
import { getAllProducts } from "@/lib/api/product-api"; // Import API
import { Product } from "@/types/product"; // Đảm bảo import type Product

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts();
        console.log("API Response: ", response);
        if (response.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data); // ✅ Lấy đúng mảng sản phẩm
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  

  return (
    <div className="flex flex-col h-screen">
      <Header title="Cửa hàng" href="/" currentPage="Danh sách sản phẩm" />
      <div className="p-5 flex-1 overflow-auto">
        <ToolPanel />
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <DataTable columns={columns} data={products} />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;