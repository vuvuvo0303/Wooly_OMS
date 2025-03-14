import { useState, useEffect } from "react";
import { Spin, Table, Tag, Tabs } from "antd"; // Added Tabs import
import Header from "@/components/header";
import { orderHistoryAPI } from "@/lib/api/category-api";
import ToolsPanel from "@/pages/admin/category/tools-panel";
import Loader from "@/components/loader";

const { TabPane } = Tabs; // Destructure TabPane from Tabs

const OrderHistoryPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // New state for filtered items
  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await orderHistoryAPI();
      console.log("🚀 ~ fetchOrderHistory ~ response:", response.data);

      // Sort items by orderDate (newest first) before setting state
      const sortedItems = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

      setItems(sortedItems);
      setFilteredItems(sortedItems); // Initially show all sorted items
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const filterByStatus = (status: string) => {
    if (status === "All") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) => item.orderStatus === status);
      setFilteredItems(filtered);
    }
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Tổng giá tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Danh sách sản phẩm",
      dataIndex: "itemList",
      key: "itemList",
      render: (itemList) => itemList.map((item) => item.productName).join(", "),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const colorMap = {
          Pending: "orange",
          Paid: "green",
          Cancalled: "red", // Fixed typo "Cancalled" -> "Cancelled"
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => {
        const date = new Date(orderDate);
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
  ];

  return (
    <div className="flex flex-col h-screen p-4">
      <Header title="Tổng quan" href="/" currentPage="Danh sách lịch sử đơn hàng" />
      <div className="p-5 flex-1 overflow-auto">
        <Tabs defaultActiveKey="All" onChange={filterByStatus}>
          <TabPane tab="Tất cả" key="All" />
          <TabPane tab="Pending" key="Pending" />
          <TabPane tab="Paid" key="Paid" />
          <TabPane tab="Cancalled" key="Cancalled" />
        </Tabs>

        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <Table columns={columns} dataSource={filteredItems} />
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
