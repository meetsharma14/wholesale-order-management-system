import { useState } from "react";

import { Box, Grid } from "@mui/material";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StoreIcon from "@mui/icons-material/Store";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import DashboardCard from "../../components/common/DashboardCard";
import DataPanel from "../../components/common/DataPanel";
import PageHeader from "../../components/common/PageHeader";
import ResourceFormDialog from "../../components/common/ResourceFormDialog";
import StatusChip from "../../components/common/StatusChip";
import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";
import { formatCurrency } from "../../utils/format";

const initialRetailer = {
  shop_name: "",
  owner_name: "",
  phone: "",
  email: "",
  gst_number: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  credit_limit: 0,
};

export default function Retailers() {
  const { data: retailers, loading, error, reload } = useApiResource("retailers");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = retailers.map((retailer) => ({
    ...retailer,
    name: retailer.shop_name,
    area: [retailer.city, retailer.state].filter(Boolean).join(", ") || retailer.address || "Not set",
    outstanding: formatCurrency(retailer.outstanding_balance),
    creditLimit: formatCurrency(retailer.credit_limit),
    status: retailer.is_active
      ? Number(retailer.outstanding_balance) > Number(retailer.credit_limit || 0)
        ? "Overdue"
        : "Active"
      : "On hold",
  }));

  const creditExposure = retailers.reduce(
    (sum, retailer) => sum + Number(retailer.outstanding_balance || 0),
    0
  );

  const addRetailer = async (form) => {
    setSaving(true);
    setFormError("");

    try {
      await createResource("retailers", {
        ...form,
        email: form.email || null,
        gst_number: form.gst_number || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        pincode: form.pincode || null,
        credit_limit: Number(form.credit_limit || 0),
      });
      setDialogOpen(false);
      reload();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Unable to add retailer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Customers"
        title="Retailers"
        description="Manage retailer accounts, territory ownership, credit balances, and buying activity."
        actionLabel="Add Retailer"
        actionIcon={<AddBusinessIcon />}
        onAction={() => setDialogOpen(true)}
      />

      <ResourceFormDialog
        open={dialogOpen}
        title="Add Retailer"
        fields={[
          { name: "shop_name", label: "Shop name" },
          { name: "owner_name", label: "Owner name" },
          { name: "phone", label: "Phone" },
          { name: "email", label: "Email", type: "email", required: false },
          { name: "gst_number", label: "GST number", required: false },
          { name: "credit_limit", label: "Credit limit", type: "number" },
          { name: "city", label: "City", required: false },
          { name: "state", label: "State", required: false },
          { name: "pincode", label: "Pincode", required: false },
          { name: "address", label: "Address", required: false, multiline: true, minRows: 2, size: { xs: 12 } },
        ]}
        initialValues={initialRetailer}
        submitLabel="Add Retailer"
        error={formError}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={addRetailer}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Retailers" value={rows.length} icon={<StoreIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Active Buyers" value={rows.filter((row) => row.is_active).length} icon={<TrendingUpIcon />} color="#2f855a" caption="Live retailer accounts" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Credit Exposure" value={formatCurrency(creditExposure)} icon={<AccountBalanceWalletIcon />} color="#d97706" />
        </Grid>
      </Grid>

      <DataPanel
        title="Retailer accounts"
        description="Current account health and ownership."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "id", label: "Retailer ID" },
          { key: "name", label: "Retailer" },
          { key: "area", label: "Area" },
          { key: "creditLimit", label: "Credit Limit" },
          { key: "outstanding", label: "Outstanding" },
          { key: "status", label: "Status", render: (row) => <StatusChip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
