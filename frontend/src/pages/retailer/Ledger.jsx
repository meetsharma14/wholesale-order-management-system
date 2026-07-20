import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import useApiResource from "../../hooks/useApiResource";
import { exportCsv } from "../../utils/exportCsv";
import { formatCurrency } from "../../utils/format";

export default function Ledger() {
  const { data: orders, loading: ordersLoading, error: ordersError } = useApiResource("orders");
  const { data: payments, loading: paymentsLoading, error: paymentsError } = useApiResource("payments");

  const entries = [
    ...orders.map((order) => ({
      id: `order-${order.id}`,
      type: `Invoice ${order.id}`,
      debit: formatCurrency(order.total_amount),
      credit: "-",
    })),
    ...payments.map((payment) => ({
      id: `payment-${payment.id}`,
      type: `Payment ${payment.id}`,
      debit: "-",
      credit: formatCurrency(payment.amount),
    })),
  ];

  const outstanding =
    orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) -
    payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const loading = ordersLoading || paymentsLoading;
  const error = ordersError || paymentsError;
  const exportStatement = () => {
    exportCsv("retailer-statement.csv", entries, [
      { key: "type", label: "Type" },
      { key: "debit", label: "Debit" },
      { key: "credit", label: "Credit" },
    ]);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4">Ledger</Typography>
          <Typography color="text.secondary">
            Review invoices, payments, and current outstanding balance.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportStatement}>Statement</Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">Outstanding balance</Typography>
            <Typography variant="h4">{formatCurrency(outstanding)}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Debit</TableCell>
                  <TableCell>Credit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={4}>Loading ledger from backend...</TableCell>
                  </TableRow>
                )}
                {!loading && error && (
                  <TableRow>
                    <TableCell colSpan={4}>{error}</TableCell>
                  </TableRow>
                )}
                {!loading && !error && entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>No ledger activity found.</TableCell>
                  </TableRow>
                )}
                {!loading && !error && entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>Backend</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.debit}</TableCell>
                    <TableCell>{entry.credit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
