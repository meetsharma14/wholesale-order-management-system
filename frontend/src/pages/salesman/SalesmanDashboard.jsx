import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PaymentsIcon from "@mui/icons-material/Payments";
import RouteIcon from "@mui/icons-material/Route";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

import DashboardCard from "../../components/common/DashboardCard";
import useApiResource from "../../hooks/useApiResource";
import { formatCurrency } from "../../utils/format";

export default function SalesmanDashboard() {
  const { data: orders } = useApiResource("orders");
  const { data: payments } = useApiResource("payments");
  const { data: retailers } = useApiResource("retailers");
  const { data: products } = useApiResource("products");

  const collections = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const lowStock = products.filter(
    (product) => Number(product.stock || 0) <= Number(product.minimum_stock || 0)
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4">Salesman Dashboard</Typography>
          <Typography color="text.secondary">
            Plan visits, take retailer orders, and record collections.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/salesman/new-order"
          variant="contained"
          startIcon={<ShoppingCartIcon />}
        >
          New Order
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Retailers" value={retailers.length} icon={<RouteIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Orders Booked" value={orders.length} icon={<ShoppingCartIcon />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Collections" value={formatCurrency(collections)} icon={<PaymentsIcon />} color="#ed6c02" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard title="Low Stock" value={lowStock.length} icon={<AssignmentTurnedInIcon />} color="#7b1fa2" />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Route progress</Typography>
            <Stack spacing={2}>
              {retailers.slice(0, 4).map((retailer, index) => (
                <Box key={retailer.id}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{retailer.shop_name}</Typography>
                    <Typography color="text.secondary">{index < 2 ? "Done" : "Pending"}</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={index < 2 ? 100 : 25} />
                </Box>
              ))}
              {retailers.length === 0 && (
                <Typography color="text.secondary">No retailers loaded from backend.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Priority tasks</Typography>
            <Stack spacing={1.5}>
              {retailers.slice(0, 2).map((retailer) => (
                <Typography key={retailer.id}>
                  Collect {formatCurrency(retailer.outstanding_balance)} from {retailer.shop_name}.
                </Typography>
              ))}
              {lowStock.slice(0, 1).map((product) => (
                <Typography key={product.id}>
                  Confirm low stock for {product.name}.
                </Typography>
              ))}
              {retailers.length === 0 && lowStock.length === 0 && (
                <Typography color="text.secondary">No priority tasks from backend data.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
