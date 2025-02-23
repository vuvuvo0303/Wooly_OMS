import { useEffect, useState } from "react";
import { getStatics } from "@/lib/api/statics-api";
import { formatCurrencyVND } from "@/lib/currency";

const dataDefault = {
  totalSales: 0,
  lastTotalSales: 0,
  totalOrders: 0,
  lastTotalOrders: 0,
  numOfvisitors: 0,
  lastNumOfVisitors: 0,
  numOfRefunded: 0,
  lastNumOfRefunded: 0,
};

const Card = ({
  value,
  title,
  incrementalPercentage,
}: {
  value: string;
  title: string;
  incrementalPercentage: number;
}) => {
  return (
    <div className="col-span-3 bg-white rounded-lg p-8 shadow">
      <h3 className="text-sm">{title}</h3>
      <p className="text-2xl font-bold py-3">{value}</p>
    </div>
  );
};

const calculatePercentageIncrement = (original: number, newNumber: number) => {
  if (original === 0) return 0;
  return ((newNumber - original) / original) * 100;
};

const Overview = () => {
  const [data, setData] = useState(dataDefault);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStatics();
      if (response.success && response.data?.data) {
        setData({
          totalSales: response.data.data.totalRevenue,
          lastTotalSales: dataDefault.lastTotalSales,
          totalOrders: response.data.data.totalOrders,
          lastTotalOrders: dataDefault.lastTotalOrders,
          numOfvisitors: response.data.data.numberUser,
          lastNumOfVisitors: dataDefault.lastNumOfVisitors,
          numOfRefunded: response.data.data.totalAccess,
          lastNumOfRefunded: dataDefault.lastNumOfRefunded,
        });
      } else {
        console.error("Lỗi khi tải dữ liệu:", response.error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Card
        title="Tổng doanh thu toàn hệ thống"
        value={formatCurrencyVND(data.totalSales)}
        incrementalPercentage={calculatePercentageIncrement(
          data.lastTotalSales,
          data.totalSales
        )}
      />
      <Card
        title="Tổng số đơn hàng"
        value={data.totalOrders.toLocaleString()}
        incrementalPercentage={calculatePercentageIncrement(
          data.lastTotalOrders,
          data.totalOrders
        )}
      />
      <Card
        title="Tổng số người dùng"
        value={data.numOfvisitors.toLocaleString()}
        incrementalPercentage={calculatePercentageIncrement(
          data.lastNumOfVisitors,
          data.numOfvisitors
        )}
      />
      <Card
        title="Tổng lượt truy cập"
        value={data.numOfRefunded.toLocaleString()}
        incrementalPercentage={calculatePercentageIncrement(
          data.lastNumOfRefunded,
          data.numOfRefunded
        )}
      />
    </>
  );
};

export default Overview;
