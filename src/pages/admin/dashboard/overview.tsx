import { useEffect, useState } from "react";
import { getStatics, getRevenuePerWeek } from "@/lib/api/statics-api";
import { formatCurrencyVND } from "@/lib/currency";
import Loader from "@/components/loader";

const dataDefault = {
  totalSales: 0,
  lastTotalSales: 0,
  totalOrders: 0,
  lastTotalOrders: 0,
  numOfVisitors: 0,
  lastNumOfVisitors: 0,
  numOfRefunded: 0,
  lastNumOfRefunded: 0,
};

const Card = ({ value, title, incrementalPercentage, onClick, toggleLabel }) => (
  <div className="col-span-3 bg-white rounded-lg p-8 shadow">
    <h3 className="text-sm">{title}</h3>
    <p className="text-2xl font-bold py-3">{value}</p>
    {onClick && (
      <button onClick={onClick} className="mt-2 text-sm text-blue-500 hover:text-blue-700">
        {toggleLabel}
      </button>
    )}
  </div>
);

const calculatePercentageIncrement = (original, newNumber) => {
  if (original === 0) return 0;
  return ((newNumber - original) / original) * 100;
};

const Overview = () => {
  const [data, setData] = useState(dataDefault);
  const [showWeeklyRevenue, setShowWeeklyRevenue] = useState(false);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStatics();
      if (response.success && response.data?.data) {
        setData({
          totalSales: response.data.data.totalRevenue,
          lastTotalSales: dataDefault.lastTotalSales,
          totalOrders: response.data.data.totalOrders,
          lastTotalOrders: dataDefault.lastTotalOrders,
          numOfVisitors: response.data.data.numberUser,
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

  useEffect(() => {
    const fetchRevenuePerWeek = async () => {
      try {
        const response = await getRevenuePerWeek();
        console.log("Response RevenuePerWeek từ API: ", response);

        if (response.success && Array.isArray(response.data)) {
          console.log("is ok");

          setWeeklyRevenue(response.data[0].totalRevenue);
        } else {
          console.error("Dữ liệu trả về không hợp lệ: ", response);
        }
      } catch (error) {
        console.error("Lỗi khi fetch RevenuePerWeek API: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenuePerWeek();
  }, []);

  const toggleRevenueView = async () => {
    setShowWeeklyRevenue(!showWeeklyRevenue);
  };

  if (loading)
    return (
      <div>
        {" "}
        <Loader />
      </div>
    );

  return (
    <>
      <Card
        title={showWeeklyRevenue ? "Doanh thu tuần" : "Tổng doanh thu toàn hệ thống"}
        value={showWeeklyRevenue ? formatCurrencyVND(weeklyRevenue) : formatCurrencyVND(data.totalSales)}
        incrementalPercentage={calculatePercentageIncrement(data.lastTotalSales, data.totalSales)}
        onClick={toggleRevenueView}
        toggleLabel={showWeeklyRevenue ? "Xem doanh thu toàn hệ thống" : "Xem doanh thu tuần"}
      />
      <Card
        title="Tổng số đơn hàng"
        value={data.totalOrders.toLocaleString()}
        incrementalPercentage={calculatePercentageIncrement(data.lastTotalOrders, data.totalOrders)}
      />
      <Card
        title="Tổng số người dùng"
        value={data.numOfVisitors.toLocaleString()}
        incrementalPercentage={calculatePercentageIncrement(data.lastNumOfVisitors, data.numOfVisitors)}
      />
      <Card
        title="Tổng lượt truy cập"
        value={data.numOfRefunded.toLocaleString()}
        incrementalPercentage={calculatePercentageIncrement(data.lastNumOfRefunded, data.numOfRefunded)}
      />
    </>
  );
};

export default Overview;
