import Header from "@/components/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { guitarOrders } from "@/data/order";
import { Order } from "@/types/order";
import ToolsPanel from "./tools-panel";
import { useEffect, useState } from "react";
import { getLatestOrders } from "@/lib/api/order-api";
const OrdersPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Order[]>([]);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getLatestOrders();
      console.log(response);
      
      if (response.data && response.data.data) {
        setData(
          response.data.data.map((item) => ({
            id: item.id,
            customerPhone: item.customerPhone,
            customerAddress: item.customerAddress,
            totalPrice: item.totalPrice,
            orderDate: item.orderDate,
            cancelled: item.cancelled,
          }))
        );
      } else {
        console.error("Dữ liệu API không hợp lệ:", response);
      }
      
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <Header title="Tổng quan" href="/" currentPage="Danh sách đơn hàng" />
      <div className="p-5 flex-1 overflow-auto">
        <ToolsPanel />
        {loading ? <p className="text-center">Đang tải dữ liệu...</p> : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  );
};

export default OrdersPage;
