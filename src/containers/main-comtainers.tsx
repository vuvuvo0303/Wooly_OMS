import NotFound from "@/components/page-not-found";
import MainLayout from "@/layouts/main-layout";
import CategoriesPage from "@/pages/admin/category/categories-page";
import DashboardPage from "@/pages/admin/dashboard/dashboard-page";
import OrderDetailPage from "@/pages/admin/order/order-detail-page";
import OrderHistoryPage from "@/pages/admin/order-history/order-history-page";
import OrdersPage from "@/pages/admin/order/orders-page";
import CreateProductPage from "@/pages/admin/product/create-product-page";
import ProductDetailPage from "@/pages/admin/product/product-detail-page";
import ProductsPage from "@/pages/admin/product/product-listing/products-page";
import UpdateProductPage from "@/pages/admin/product/update-product-page";
import TranasctionPending from "@/pages/admin/transactions/tranasction-pending";
import TransactionComplete from "@/pages/admin/transactions/transaction-complete";

import UsersPage from "@/pages/admin/user/user-listing/users-page";
import LoginPage from "@/pages/auth/login-page";
import { Route, Routes, Navigate } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

const MainContainer = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route
          path="/transaction-pending"
          element={isAuthenticated() ? <TranasctionPending /> : <Navigate to="/login" />}
        />
        <Route
          path="/transaction-complete"
          element={isAuthenticated() ? <TransactionComplete /> : <Navigate to="/login" />}
        />
        <Route path="/user" element={isAuthenticated() ? <UsersPage /> : <Navigate to="/login" />} />

        <Route path="/product" element={isAuthenticated() ? <ProductsPage /> : <Navigate to="/login" />} />
        <Route
          path="/product/:productId"
          element={isAuthenticated() ? <ProductDetailPage /> : <Navigate to="/login" />}
        />
        <Route path="/create-product" element={isAuthenticated() ? <CreateProductPage /> : <Navigate to="/login" />} />
        <Route
          path="/edit-product/:productId"
          element={isAuthenticated() ? <UpdateProductPage /> : <Navigate to="/login" />}
        />
        <Route path="/order" element={isAuthenticated() ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/order/:orderId" element={isAuthenticated() ? <OrderDetailPage /> : <Navigate to="/login" />} />
        <Route path="/category" element={isAuthenticated() ? <CategoriesPage /> : <Navigate to="/login" />} />
        <Route path="/orderHistory" element={isAuthenticated() ? <OrderHistoryPage /> : <Navigate to="/login" />} />

        <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default MainContainer;
