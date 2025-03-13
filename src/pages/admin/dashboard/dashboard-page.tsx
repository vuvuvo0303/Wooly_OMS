import Header from "@/components/header";
import Overview from "./overview";
import Revenue from "./revenue";
import BestSelling from "./best-selling";
import DailyRevenue from "./daily-revenue";
import CategorySalesPieChart from "./category-sales-pie-chart";

const DashboardPage = () => {
  return (
    <div>
      <Header title="Tổng quan" href="/" currentPage="Dashboard" />
      <div className="grid grid-cols-12 gap-5 p-5">
        <Overview />
        <Revenue />
        <BestSelling />
        <DailyRevenue />
        <CategorySalesPieChart />
      </div>
    </div>
  );
};

export default DashboardPage;
