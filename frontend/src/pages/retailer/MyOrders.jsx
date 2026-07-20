import { Box, Chip, Typography } from "@mui/material";

import DataPanel from "../../components/common/DataPanel";
import useApiResource from "../../hooks/useApiResource";
import { formatCurrency } from "../../utils/format";

export default function MyOrders() {
  const { data: orders, loading, error } = useApiResource("orders");

  const rows = orders.map((order) => ({
    ...order,
    amount: formatCurrency(order.total_amount),
    itemsCount: order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0,
    status: "Processing",
  }));

  return (
    <Box>
      <Typography variant="h4" mb={1}>My Orders</Typography>
      <Typography color="text.secondary" mb={3}>
        Track order status from confirmation to delivery.
      </Typography>

      <DataPanel
        title="Order history"
        description="Orders loaded from the backend."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "id", label: "Order" },
          { key: "retailer_id", label: "Retailer" },
          { key: "itemsCount", label: "Items" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status", render: (row) => <Chip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
