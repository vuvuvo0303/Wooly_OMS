import { useState, useEffect } from "react";
import { Spin, Table, Tag, Tabs, Modal } from "antd";
import Header from "@/components/header";
import { orderHistoryAPI } from "@/lib/api/category-api";
import ToolsPanel from "@/pages/admin/category/tools-panel";
import Loader from "@/components/loader";

const { TabPane } = Tabs;

const OrderHistoryPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false); // Modal mới cho thông tin khách hàng
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Lưu thông tin khách hàng được chọn

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await orderHistoryAPI();
      console.log("🚀 ~ fetchOrderHistory ~ response:", response.data);

      const sortedItems = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setItems(sortedItems);
      setFilteredItems(sortedItems);
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

  const showModal = (itemList) => {
    setSelectedItemList(itemList);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm hiển thị modal thông tin khách hàng
  const showCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalVisible(true);
  };

  const handleCustomerModalOk = () => {
    setIsCustomerModalVisible(false);
  };

  const handleCustomerModalCancel = () => {
    setIsCustomerModalVisible(false);
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <span
          style={{ cursor: "pointer", color: "#1890ff" }}
          onClick={() => showCustomerModal(record)} // Gọi hàm hiển thị modal khi nhấn vào tên
        >
          {text}
        </span>
      ),
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
      render: (itemList) => (
        <span
          style={{ cursor: "pointer", color: "#1890ff" }}
          onClick={() => showModal(itemList)}
        >
          {itemList.map((item) => item.productName).join(", ")}
        </span>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const colorMap = {
          Pending: "orange",
          Paid: "green",
          Cancelled: "red",
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

  const itemListColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Giá",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (value) => value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Số lượng",
      dataIndex: "productQuantity",
      key: "productQuantity",
    },
    {
      title: "Hình ảnh",
      dataIndex: "productPicture",
      key: "productPicture",
      render: (url) => <img src={url} alt="product" style={{ width: 50 }} />,
    },
    {
      title: "Chi tiết bộ phận",
      dataIndex: "partList",
      key: "partList",
      render: (partList) => {
        if (!partList || partList.length === 0) {
          return <span>Không có</span>;
        }
        return partList.map((part) => (
          <div key={part.orderDetailPartId}>
            {part.name}: <Tag color={part.color.toLowerCase()}>{part.color}</Tag>
          </div>
        ));
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
          <TabPane tab="Cancelled" key="Cancelled" />
        </Tabs>

        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <Table columns={columns} dataSource={filteredItems} />
        )}

        {/* Modal danh sách sản phẩm */}
        <Modal
          title="Chi tiết danh sách sản phẩm"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
        >
          <Table
            columns={itemListColumns}
            dataSource={selectedItemList}
            pagination={false}
            rowKey="orderDetailId"
          />
        </Modal>

        {/* Modal thông tin khách hàng */}
        <Modal
          title="Thông tin khách hàng"
          visible={isCustomerModalVisible}
          onOk={handleCustomerModalOk}
          onCancel={handleCustomerModalCancel}
          width={500}
        >
          {selectedCustomer && (
            <div>
              <p>
                <strong style={{ color: "#1890ff" }}>Tên khách hàng:</strong>{" "}
                {selectedCustomer.customerName}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedCustomer.customerAddress}
              </p>
              <p>
                <strong>Ghi chú:</strong> {selectedCustomer.customerNote || "Không có"}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrderHistoryPage;