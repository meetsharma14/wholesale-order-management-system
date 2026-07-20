import { Box, Grid } from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import DashboardCard from "../../components/common/DashboardCard";
import DataPanel from "../../components/common/DataPanel";
import PageHeader from "../../components/common/PageHeader";
import StatusChip from "../../components/common/StatusChip";
import useApiResource from "../../hooks/useApiResource";
import { exportCsv } from "../../utils/exportCsv";
import { formatCurrency } from "../../utils/format";

export default function Payments() {
  const { data: payments, loading, error } = useApiResource("payments");

  const rows = payments.map((payment) => ({
    ...payment,
    retailer: payment.retailer_id,
    mode: payment.payment_method,
    amountLabel: formatCurrency(payment.amount),
    status: "Paid",
  }));

  const collected = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <Box>
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="Review collections, overdue balances, settlement modes, and retailer credit exposure."
        actionLabel="Export Ledger"
        actionIcon={<DownloadIcon />}
        onAction={() =>
          exportCsv("payments-ledger.csv", rows, [
            { key: "id", label: "Payment" },
            { key: "retailer", label: "Retailer" },
            { key: "mode", label: "Mode" },
            { key: "amountLabel", label: "Amount" },
            { key: "status", label: "Status" },
          ])
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Collected" value={formatCurrency(collected)} icon={<PaymentsIcon />} color="#2f855a" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Retailers Paid" value={new Set(payments.map((payment) => payment.retailer_id)).size} icon={<AccountBalanceWalletIcon />} color="#d97706" caption="Unique retailer accounts" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Payments" value={rows.length} icon={<ReceiptLongIcon />} caption="Loaded from backend" />
        </Grid>
      </Grid>

      <DataPanel
        title="Collection activity"
        description="Latest payments and retailer settlement status."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "id", label: "Payment" },
          { key: "retailer", label: "Retailer" },
          { key: "mode", label: "Mode" },
          { key: "amountLabel", label: "Amount" },
          { key: "status", label: "Status", render: (row) => <StatusChip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
