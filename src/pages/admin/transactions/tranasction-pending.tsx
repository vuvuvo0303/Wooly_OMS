import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { getTransactionPending } from "@/lib/api/transaction-api";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react"; // Giả sử bạn dùng lucide-react cho icon
import Loader from "@/components/loader";

const TranasctionPending = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const response = await getTransactionPending();
        console.log(response);
        if (!response.error && response.data) {
          setTransactions(response.data);
        } else {
          setError(response.error || "Không thể tải giao dịch");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi bất ngờ khi tải giao dịch");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTransactions();
  }, []);

  // Hàm để chọn màu sắc cho Badge dựa trên trạng thái
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Giao dịch" href="/" currentPage="Giao dịch chưa hoàn thành" />
        <div className="flex justify-center items-center p-4">
        <Loader/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Giao dịch" href="/" currentPage="Giao dịch chưa hoàn thành" />
        <div className="p-4 text-center text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Giao dịch" href="/" currentPage="Giao dịch chưa hoàn thành" />
      <div className="p-6 max-w-7xl mx-auto">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Không có giao dịch nào đang chờ xử lý.</div>
        ) : (
          <Table className="border rounded-lg shadow-sm bg-white">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">ID Giao dịch</TableHead>
                <TableHead className="font-semibold text-gray-700">ID Người dùng</TableHead>
                <TableHead className="font-semibold text-gray-700">Phương thức thanh toán</TableHead>
                <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionId} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="text-gray-900">{transaction.transactionId}</TableCell>
                  <TableCell className="text-gray-900">{transaction.userName}</TableCell>
                  <TableCell className="text-gray-900">{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className="bg-red-600 text-white">{transaction.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                  {transaction.createdAt}
                  </TableCell>
                  <TableCell className="text-gray-600">
                  {transaction.updatedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TranasctionPending;
