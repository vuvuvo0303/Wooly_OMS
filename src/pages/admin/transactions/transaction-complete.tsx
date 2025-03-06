import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { getTransactionComplete } from "@/lib/api/transaction-api";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react"; // Giả sử dùng lucide-react cho spinner

const TransactionComplete = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedTransactions = async () => {
      try {
        const response = await getTransactionComplete();
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

    fetchCompletedTransactions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Giao dịch" href="/" currentPage="Giao dịch hoàn thành" />
        <div className="flex justify-center items-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Giao dịch" href="/" currentPage="Giao dịch hoàn thành" />
        <div className="p-4 text-center text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Giao dịch" href="/" currentPage="Giao dịch hoàn thành" />
      <div className="p-6 max-w-7xl mx-auto">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Không có giao dịch nào đã hoàn thành.
          </div>
        ) : (
          <Table className="border rounded-lg shadow-sm bg-white">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">ID Giao dịch</TableHead>
                <TableHead className="font-semibold text-gray-700">Tên Người dùng</TableHead>
                <TableHead className="font-semibold text-gray-700">Phương thức thanh toán</TableHead>
                <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.transactionId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-gray-900">{transaction.transactionId}</TableCell>
                  <TableCell className="text-gray-900">{transaction.userName}</TableCell>
                  <TableCell className="text-gray-900">{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600 text-white hover:bg-green-700">
                      {transaction.status === "completed" ? "Hoàn thành" : transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(transaction.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(transaction.updatedAt).toLocaleString("vi-VN")}
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

export default TransactionComplete;