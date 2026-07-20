import { useMemo, useState } from "react";

import { Box, Grid } from "@mui/material";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import DashboardCard from "../../components/common/DashboardCard";
import DataPanel from "../../components/common/DataPanel";
import PageHeader from "../../components/common/PageHeader";
import ResourceFormDialog from "../../components/common/ResourceFormDialog";
import StatusChip from "../../components/common/StatusChip";
import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";
import { formatCurrency } from "../../utils/format";

export default function Orders() {
  const { data: orders, loading, error, reload } = useApiResource("orders");
  const { data: retailers } = useApiResource("retailers");
  const { data: products } = useApiResource("products");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = orders.map((order) => ({
    ...order,
    orderId: order.id,
    retailer: order.retailer_id,
    total: formatCurrency(order.total_amount),
    itemsCount: order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0,
    status: "Processing",
  }));

  const orderValue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const orderFields = useMemo(
    () => [
      {
        name: "retailer_id",
        label: "Retailer",
        type: "select",
        options: retailers.map((retailer) => ({ value: retailer.id, label: retailer.shop_name })),
      },
      {
        name: "product_id",
        label: "Product",
        type: "select",
        options: products.map((product) => ({ value: product.id, label: `${product.name} - ${formatCurrency(product.selling_price)}` })),
      },
      { name: "quantity", label: "Quantity", type: "number" },
    ],
    [products, retailers]
  );

  const createOrder = async (form) => {
    setSaving(true);
    setFormError("");

    try {
      await createResource("orders", {
        retailer_id: form.retailer_id,
        items: [{ product_id: form.product_id, quantity: Number(form.quantity) }],
      });
      setDialogOpen(false);
      reload();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Unable to create order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Sales"
        title="Orders"
        description="Track order capture, approvals, warehouse processing, and delivery commitments."
        actionLabel="Create Order"
        actionIcon={<AddShoppingCartIcon />}
        onAction={() => setDialogOpen(true)}
      />

      <ResourceFormDialog
        open={dialogOpen}
        title="Create Order"
        fields={orderFields}
        initialValues={{
          retailer_id: retailers[0]?.id || "",
          product_id: products[0]?.id || "",
          quantity: 1,
        }}
        submitLabel="Create Order"
        error={formError}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={createOrder}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Total Orders" value={rows.length} icon={<ShoppingCartIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Booked Value" value={formatCurrency(orderValue)} icon={<LocalShippingIcon />} color="#d97706" caption="From backend orders" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Line Items" value={rows.reduce((sum, row) => sum + row.itemsCount, 0)} icon={<AssignmentTurnedInIcon />} color="#2f855a" caption="Total units ordered" />
        </Grid>
      </Grid>

      <DataPanel
        title="Recent orders"
        description="Latest retailer orders and operational status."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "orderId", label: "Order" },
          { key: "retailer", label: "Retailer" },
          { key: "itemsCount", label: "Items" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status", render: (row) => <StatusChip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
