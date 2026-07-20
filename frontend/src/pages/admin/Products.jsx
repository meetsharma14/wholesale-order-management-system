import { useMemo, useState } from "react";

import { Box, Chip, Grid, Stack, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WarehouseIcon from "@mui/icons-material/Warehouse";

import DashboardCard from "../../components/common/DashboardCard";
import DataPanel from "../../components/common/DataPanel";
import PageHeader from "../../components/common/PageHeader";
import ResourceFormDialog from "../../components/common/ResourceFormDialog";
import StatusChip from "../../components/common/StatusChip";
import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";
import { formatPercent } from "../../utils/format";

const initialProduct = {
  name: "",
  sku: "",
  barcode: "",
  category_id: "",
  supplier_id: "",
  brand: "",
  purchase_price: "",
  selling_price: "",
  gst: 18,
  stock: 0,
  minimum_stock: 0,
  unit: "pcs",
  description: "",
};

export default function Products() {
  const { data: products, loading, error, reload } = useApiResource("products");
  const { data: categories } = useApiResource("categories");
  const { data: suppliers } = useApiResource("suppliers");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = products.map((product) => {
    const margin =
      product.selling_price && product.purchase_price
        ? ((product.selling_price - product.purchase_price) / product.selling_price) * 100
        : 0;
    const isLowStock = Number(product.stock) <= Number(product.minimum_stock);

    return {
      ...product,
      id: product.id,
      sku: product.sku,
      category: product.category_id,
      stockLabel: `${product.stock} ${product.unit}`,
      margin: formatPercent(margin),
      status: product.is_active ? (isLowStock ? "Low stock" : "Active") : "On hold",
    };
  });

  const lowStockCount = rows.filter((product) => product.status === "Low stock").length;
  const productFields = useMemo(
    () => [
      { name: "name", label: "Product name" },
      { name: "sku", label: "SKU" },
      { name: "barcode", label: "Barcode", required: false },
      {
        name: "category_id",
        label: "Category",
        type: "select",
        options: categories.map((category) => ({ value: category.id, label: category.name })),
        emptyLabel: "No categories yet. Add a category first.",
        helperText: categories.length ? "" : "Go to Categories and create one before adding products.",
      },
      {
        name: "supplier_id",
        label: "Supplier",
        type: "select",
        options: suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name })),
        emptyLabel: "No suppliers yet. Add a supplier first.",
        helperText: suppliers.length ? "" : "Go to Suppliers and create one before adding products.",
      },
      { name: "brand", label: "Brand" },
      { name: "purchase_price", label: "Purchase price", type: "number" },
      { name: "selling_price", label: "Selling price", type: "number" },
      { name: "gst", label: "GST %", type: "number" },
      { name: "stock", label: "Opening stock", type: "number" },
      { name: "minimum_stock", label: "Minimum stock", type: "number" },
      { name: "unit", label: "Unit" },
      { name: "description", label: "Description", required: false, multiline: true, minRows: 2, size: { xs: 12 } },
    ],
    [categories, suppliers]
  );

  const addProduct = async (form) => {
    setSaving(true);
    setFormError("");

    try {
      await createResource("products", {
        ...form,
        purchase_price: Number(form.purchase_price),
        selling_price: Number(form.selling_price),
        gst: Number(form.gst),
        stock: Number(form.stock),
        minimum_stock: Number(form.minimum_stock),
        barcode: form.barcode || null,
        description: form.description || null,
      });
      setDialogOpen(false);
      reload();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Unable to add product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Inventory"
        title="Products"
        description="Manage SKUs, stock availability, margins, and replenishment risk across the warehouse."
        actionLabel="Add Product"
        actionIcon={<AddIcon />}
        onAction={() => setDialogOpen(true)}
      />

      <ResourceFormDialog
        open={dialogOpen}
        title="Add Product"
        fields={productFields}
        initialValues={{
          ...initialProduct,
          category_id: categories[0]?.id || "",
          supplier_id: suppliers[0]?.id || "",
        }}
        submitLabel="Add Product"
        error={formError}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={addProduct}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Active SKUs" value={rows.length} icon={<InventoryIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Warehouse Items" value={rows.reduce((sum, item) => sum + Number(item.stock || 0), 0)} icon={<WarehouseIcon />} color="#2f855a" caption="Live stock units" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Low Stock" value={lowStockCount} icon={<WarningAmberIcon />} color="#d97706" caption="Needs purchase order" />
        </Grid>
      </Grid>

      <DataPanel
        title="Product catalog"
        description="Core inventory list used by admin, salesmen, and retailers."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "sku", label: "SKU" },
          {
            key: "name",
            label: "Product",
            render: (row) => (
              <Stack spacing={0.25}>
                <Typography fontWeight={800}>{row.name}</Typography>
                <Chip label={row.category} size="small" variant="outlined" sx={{ alignSelf: "flex-start" }} />
              </Stack>
            ),
          },
          { key: "stockLabel", label: "Stock" },
          { key: "margin", label: "Margin" },
          { key: "status", label: "Status", render: (row) => <StatusChip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
