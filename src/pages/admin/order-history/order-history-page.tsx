import { useEffect, useState } from "react";
import Header from "@/components/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAllOrders } from "@/lib/api/order-api";
import { Order } from "@/types/order";

const OrderHistoryPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders();
            console.log("fetchOrders", response.data.data);

            setOrders(
                response.data.data.map((order) => ({
                    orderId: order.orderId,
                    customerName: order.customerName,
                    customerAddress: order.customerAddress,
                    totalPrice: order.totalPrice,
                    orderDate: order.orderDate,
                    orderStatus: order.orderStatus,
                    itemList: order.itemList,
                    cancelled: order.cancelled,
                }))
            );
            console.log("order", orders);

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
            <Header title="Lịch sử đơn hàng" href="/" currentPage="Lịch sử đơn hàng" />
            <div className="p-5 flex-1 overflow-auto">
                {loading ? (
                    <p className="text-center">Đang tải dữ liệu...</p>
                ) : (
                    <DataTable columns={columns} data={orders} />
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
