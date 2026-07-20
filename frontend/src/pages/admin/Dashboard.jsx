import { useEffect, useMemo, useState } from "react";

import { Alert, Box, Chip, CircularProgress, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import DashboardCard from "../../components/common/DashboardCard";
import PageHeader from "../../components/common/PageHeader";
import StatusChip from "../../components/common/StatusChip";
import { getDashboard } from "../../services/dashboardService";
import { getResource } from "../../services/resourceService";
import { formatCurrency } from "../../utils/format";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [dashboardData, orderData, productData] = await Promise.all([
          getDashboard(),
          getResource("orders"),
          getResource("products"),
        ]);

        if (isMounted) {
          setSummary(dashboardData);
          setOrders(orderData);
          setProducts(productData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.detail || "Unable to load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const topOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => Number(b.total_amount || 0) - Number(a.total_amount || 0))
        .slice(0, 3)
        .map((order) => ({
          id: order.id,
          retailer: order.retailer_id,
          value: formatCurrency(order.total_amount),
          status: "Processing",
        })),
    [orders]
  );

  const stockAlerts = useMemo(
    () =>
      products
        .filter((product) => Number(product.stock || 0) <= Number(product.minimum_stock || 0))
        .slice(0, 3)
        .map((product) => ({
          name: product.name,
          level: product.minimum_stock
            ? Math.min(100, Math.round((Number(product.stock || 0) / Number(product.minimum_stock)) * 100))
            : 0,
          note: `${product.stock} ${product.unit} available`,
        })),
    [products]
  );

  return (
    <Box>
      <PageHeader
        eyebrow="Operations"
        title="Admin Dashboard"
        description="Monitor today's order flow, stock pressure, retailer activity, and payment exposure from one place."
        meta="Updated 9:30 AM"
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Products" value={loading ? "..." : summary?.total_products ?? 0} icon={<InventoryIcon />} caption={`${summary?.total_categories ?? 0} categories`} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Orders" value={loading ? "..." : summary?.total_orders ?? 0} icon={<ShoppingCartIcon />} color="#2f855a" caption="Backend order count" />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Retailers" value={loading ? "..." : summary?.total_retailers ?? 0} icon={<StoreIcon />} color="#d97706" caption={`${summary?.total_salesmen ?? 0} salesmen`} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Payments" value={loading ? "..." : summary?.total_payments ?? 0} icon={<PaymentsIcon />} color="#7c3aed" caption={`${summary?.total_suppliers ?? 0} suppliers`} />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 2.5, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6">Order pipeline</Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority orders moving through warehouse and delivery.
                </Typography>
              </Box>
              <Chip icon={<LocalShippingIcon />} label={`${orders.length} orders`} variant="outlined" />
            </Stack>

            <Stack spacing={1.5}>
              {loading && (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Loading orders...</Typography>
                </Stack>
              )}

              {!loading && topOrders.length === 0 && (
                <Typography color="text.secondary">No backend orders yet.</Typography>
              )}

              {!loading && topOrders.map((order) => (
                <Stack
                  key={order.id}
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                >
                  <Box>
                    <Typography fontWeight={800}>{order.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.retailer}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography fontWeight={800}>{order.value}</Typography>
                    <StatusChip label={order.status} />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 2.5, height: "100%" }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <WarningAmberIcon color="warning" />
              <Box>
                <Typography variant="h6">Stock watchlist</Typography>
                <Typography variant="body2" color="text.secondary">
                  Items that need purchasing attention.
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              {loading && (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Loading products...</Typography>
                </Stack>
              )}

              {!loading && stockAlerts.length === 0 && (
                <Typography color="text.secondary">No low-stock products yet.</Typography>
              )}

              {!loading && stockAlerts.map((item) => (
                <Box key={item.name}>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography fontWeight={800}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.level}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.level}
                    color={item.level < 25 ? "warning" : "success"}
                    sx={{ height: 8, borderRadius: 2, mb: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {item.note}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
