import { formatCurrencyVND } from "@/lib/currency";
// import { TrendingDown, TrendingUp } from "lucide-react";

const data = {
  totalSales: 80_000_000,
  lastTotalSales: 71_000_000,
  totalOrders: 12_000,
  lastTotalOrders: 9_407,
  numOfvisitors: 72_499,
  lastNumOfVisitors: 14_358,
  numOfRefunded: 2_300,
  lastNumOfRefunded: 1326,
};
const Card = ({
  value,
  title,
  // incrementalPercentage,
}: {
  value: string;
  title: string;
  incrementalPercentage: number;
}) => {
  return (
    <div className="col-span-3 bg-white rounded-lg p-8 shadow">
      <h3 className="text-sm">{title}</h3>
      <p className="text-2xl font-bold py-3">{value}</p>
      {/* <div className="flex gap-5 text-xs items-center">
        {incrementalPercentage > 0 ? (
          <div className="text-green-600 flex gap-2 items-center">
            <TrendingUp />
            <p>{incrementalPercentage.toFixed(2)}%</p>
          </div>
        ) : (
          <div className="text-red-600 flex gap-2 items-center">
            <TrendingDown />
            <p>{incrementalPercentage.toFixed(2)}%</p>
          </div>
        )}
        <div>So với tháng trước</div>
      </div> */}
    </div>
  );
};

function calculatePercentageIncrement(original: number, newNumber: number) {
  const increment = newNumber - original;
  const percentageIncrement = (increment / original) * 100;
  return percentageIncrement;
}

const Overview = () => {
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
        title="Tổng lượt tài khoản người dùng"
        value={data.numOfvisitors.toLocaleString()}
        incrementalPercentage={calculatePercentageIncrement(
          data.lastNumOfVisitors,
          data.numOfvisitors
        )}
      />
      <Card
        title="Doanh thu trong ngày"
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
