import Header from "@/components/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import productData from "@/data/products.json";
import { Product } from "@/types/product";

import ToolPanel from "./tool-panel";
const ProductsPage = () => {
  const data = productData as Product[];
  return (
    <div className="flex flex-col h-screen">
      <Header title="Cửa hàng" href="/" currentPage="Danh sách sản phẩm" />
      <div className="p-5 flex-1 overflow-auto">
        <ToolPanel />
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ProductsPage;
