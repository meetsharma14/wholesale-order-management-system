import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Suppliers from "./pages/admin/Suppliers";
import Retailers from "./pages/admin/Retailers";
import Salesmen from "./pages/admin/Salesmen";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import Payments from "./pages/admin/Payments";
import Reports from "./pages/admin/Reports";

import SalesmanDashboard from "./pages/salesman/SalesmanDashboard";
import RetailerVisits from "./pages/salesman/RetailerVisits";
import NewOrder from "./pages/salesman/NewOrder";
import Collections from "./pages/salesman/Collections";

import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import Catalog from "./pages/retailer/Catalog";
import MyOrders from "./pages/retailer/MyOrders";
import Ledger from "./pages/retailer/Ledger";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="retailers" element={<Retailers />} />
        <Route path="salesmen" element={<Salesmen />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route
        path="/salesman"
        element={
          <ProtectedRoute roles={["SALESMAN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SalesmanDashboard />} />
        <Route path="visits" element={<RetailerVisits />} />
        <Route path="new-order" element={<NewOrder />} />
        <Route path="collections" element={<Collections />} />
      </Route>

      <Route
        path="/retailer"
        element={
          <ProtectedRoute roles={["RETAILER"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RetailerDashboard />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="ledger" element={<Ledger />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
