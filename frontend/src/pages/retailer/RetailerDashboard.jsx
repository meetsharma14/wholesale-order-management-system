import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory2";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

import DashboardCard from "../../components/common/DashboardCard";
import useApiResource from "../../hooks/useApiResource";
import { formatCurrency } from "../../utils/format";

export default function RetailerDashboard() {
  const { data: orders } = useApiResource("orders");
  const { data: payments } = useApiResource("payments");
  const { data: products } = useApiResource("products");
  const { data: retailers } = useApiResource("retailers");

  const orderTotal = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const paymentTotal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const retailer = retailers[0];
  const creditUsed = Number(retailer?.outstanding_balance ?? Math.max(0, orderTotal - paymentTotal));
  const creditLimit = Number(retailer?.credit_limit || 0);
  const creditAvailable = Math.max(0, creditLimit - creditUsed);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4">Retailer Dashboard</Typography>
          <Typography color="text.secondary">
            {retailer?.shop_name || "Reorder stock, track deliveries, and review account balance."}
          </Typography>
        </Box>

        <Button component={Link} to="/retailer/catalog" variant="contained" startIcon={<ShoppingCartIcon />}>
          Place Order
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Open Orders" value={orders.length} icon={<ShoppingCartIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Credit Used" value={formatCurrency(creditUsed)} icon={<PaymentsIcon />} color="#ed6c02" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Credit Available" value={formatCurrency(creditAvailable)} icon={<InventoryIcon />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Last Invoice" value={orders[0]?.id || "None"} icon={<ReceiptLongIcon />} color="#7b1fa2" />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Recommended reorder</Typography>
            <Stack spacing={1.5}>
              {products.slice(0, 3).map((product) => (
                <Typography key={product.id}>
                  {product.name} - {product.stock} {product.unit} available
                </Typography>
              ))}
              {products.length === 0 && (
                <Typography color="text.secondary">No product recommendations loaded.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
