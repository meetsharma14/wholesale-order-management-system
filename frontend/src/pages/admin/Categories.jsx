import { useState } from "react";

import { Box, Grid } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import DashboardCard from "../../components/common/DashboardCard";
import DataPanel from "../../components/common/DataPanel";
import PageHeader from "../../components/common/PageHeader";
import ResourceFormDialog from "../../components/common/ResourceFormDialog";
import StatusChip from "../../components/common/StatusChip";
import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";

const initialCategory = {
  name: "",
  description: "",
};

export default function Categories() {
  const { data: categories, loading, error, reload } = useApiResource("categories");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = categories.map((category) => ({
    ...category,
    description: category.description || "No description",
    status: category.is_active ? "Active" : "On hold",
  }));

  const addCategory = async (form) => {
    setSaving(true);
    setFormError("");

    try {
      await createResource("categories", {
        name: form.name,
        description: form.description || null,
      });
      setDialogOpen(false);
      reload();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Unable to add category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Group products by buying behavior, margin profile, and retailer discovery paths."
        actionLabel="Add Category"
        actionIcon={<AddIcon />}
        onAction={() => setDialogOpen(true)}
      />

      <ResourceFormDialog
        open={dialogOpen}
        title="Add Category"
        fields={[
          { name: "name", label: "Category name", size: { xs: 12 } },
          { name: "description", label: "Description", required: false, multiline: true, minRows: 3, size: { xs: 12 } },
        ]}
        initialValues={initialCategory}
        submitLabel="Add Category"
        error={formError}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={addCategory}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Categories" value={rows.length} icon={<CategoryIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Active Categories" value={rows.filter((row) => row.is_active).length} icon={<InventoryIcon />} color="#2f855a" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Latest Category" value={rows[0]?.name || "None"} icon={<TrendingUpIcon />} color="#d97706" caption="From backend catalog" />
        </Grid>
      </Grid>

      <DataPanel
        title="Category performance"
        description="A quick view of catalog structure from the backend."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "id", label: "Code" },
          { key: "name", label: "Category" },
          { key: "description", label: "Description" },
          { key: "status", label: "Status", render: (row) => <StatusChip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
