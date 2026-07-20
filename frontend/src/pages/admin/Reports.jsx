import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import useApiResource from "../../hooks/useApiResource";
import { exportCsv } from "../../utils/exportCsv";
import { formatCurrency } from "../../utils/format";

export default function Reports() {
  const { data: orders } = useApiResource("orders");
  const { data: payments } = useApiResource("payments");
  const { data: products } = useApiResource("products");
  const { data: retailers } = useApiResource("retailers");
  const salesTotal = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const collectedTotal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const lowStockCount = products.filter(
    (product) => Number(product.stock || 0) <= Number(product.minimum_stock || 0)
  ).length;
  const outstanding = retailers.reduce(
    (sum, retailer) => sum + Number(retailer.outstanding_balance || 0),
    0
  );
  const reports = [
    { name: "Sales summary", status: `${orders.length} orders`, value: formatCurrency(salesTotal) },
    { name: "Low stock watchlist", status: `${lowStockCount} items`, value: lowStockCount ? "Action needed" : "Healthy" },
    { name: "Retailer outstanding", status: `${retailers.length} retailers`, value: formatCurrency(outstanding) },
    { name: "Collections", status: `${payments.length} payments`, value: formatCurrency(collectedTotal) },
  ];

  const exportReports = () => {
    exportCsv("admin-reports.csv", reports, [
      { key: "name", label: "Report" },
      { key: "status", label: "Status" },
      { key: "value", label: "Value" },
    ]);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4">Reports</Typography>
          <Typography color="text.secondary">
            Review sales, stock, and outstanding balance snapshots.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportReports}>
          Export
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid key={report.name} size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={2}>
                <BarChartIcon color="primary" />
                <Typography variant="h6">{report.name}</Typography>
                <Typography variant="h5">{report.value}</Typography>
                <Chip label={report.status} sx={{ alignSelf: "flex-start" }} />
              </Stack>
            </Paper>
          </Grid>
        ))}

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TrendingUpIcon color="success" />
              <Box>
                <Typography variant="h6">This week focus</Typography>
                <Typography color="text.secondary">
                  Push fast-moving products, clear low-stock replenishment, and
                  follow up with retailers above their payment due date.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
