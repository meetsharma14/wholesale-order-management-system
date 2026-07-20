import { useState } from "react";

import { Box, Grid } from "@mui/material";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import FactoryIcon from "@mui/icons-material/Factory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import DashboardCard from "../../components/common/DashboardCard";
import DataPanel from "../../components/common/DataPanel";
import PageHeader from "../../components/common/PageHeader";
import ResourceFormDialog from "../../components/common/ResourceFormDialog";
import StatusChip from "../../components/common/StatusChip";
import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";

const initialSupplier = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export default function Suppliers() {
  const { data: suppliers, loading, error, reload } = useApiResource("suppliers");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = suppliers.map((supplier) => ({
    ...supplier,
    contact: supplier.phone,
    status: "Active",
  }));

  const addSupplier = async (form) => {
    setSaving(true);
    setFormError("");

    try {
      await createResource("suppliers", form);
      setDialogOpen(false);
      reload();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Unable to add supplier.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Procurement"
        title="Suppliers"
        description="Track supplier reliability, purchase orders, lead times, and replenishment dependencies."
        actionLabel="Add Supplier"
        actionIcon={<AddBusinessIcon />}
        onAction={() => setDialogOpen(true)}
      />

      <ResourceFormDialog
        open={dialogOpen}
        title="Add Supplier"
        fields={[
          { name: "name", label: "Supplier name" },
          { name: "phone", label: "Phone" },
          { name: "email", label: "Email", type: "email" },
          { name: "address", label: "Address", multiline: true, minRows: 2, size: { xs: 12 } },
        ]}
        initialValues={initialSupplier}
        submitLabel="Add Supplier"
        error={formError}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={addSupplier}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Active Suppliers" value={rows.length} icon={<FactoryIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Contacts" value={rows.filter((row) => row.phone).length} icon={<LocalShippingIcon />} color="#2f855a" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Missing Email" value={rows.filter((row) => !row.email).length} icon={<WarningAmberIcon />} color="#d97706" caption="Needs follow up" />
        </Grid>
      </Grid>

      <DataPanel
        title="Supplier directory"
        description="Procurement partners loaded from the backend supplier module."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "id", label: "Supplier ID" },
          { key: "name", label: "Supplier" },
          { key: "contact", label: "Phone" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          { key: "status", label: "Status", render: (row) => <StatusChip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
