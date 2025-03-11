import { useState, useEffect } from "react";
import { Spin, Table } from "antd";
import Header from "@/components/header";
import { orderHistoryAPI } from "@/lib/api/category-api";
import ToolsPanel from "@/pages/admin/category/tools-panel";

const OrderHistoryPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState([]);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const response = await orderHistoryAPI();
            console.log("🚀 ~ fetchOrderHistory ~ response:", response.data);

            setItems(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);

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
        },
        {
            title: "Danh sách sản phẩm",
            dataIndex: "itemList",
            key: "itemList",
            render: (itemList) =>
                itemList.map((item) => item.productName).join(", "),
        },
    ];

    return (
        <div className="flex flex-col h-screen p-4">
            <Header
                title="Tổng quan"
                href="/"
                currentPage="Danh sách lịch sử đơn hàng"
            />
            <div className="p-5 flex-1 overflow-auto">
                <ToolsPanel fetchOrderHistory={fetchOrderHistory} />
                {loading ? (
                    <p className="text-center">Đang tải dữ liệu...</p>
                ) : (
                    <Table columns={columns} dataSource={items} />
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
