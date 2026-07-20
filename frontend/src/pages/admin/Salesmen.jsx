import { useState } from "react";

import { Box, Grid } from "@mui/material";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import RouteIcon from "@mui/icons-material/Route";

import DashboardCard from "../../components/common/DashboardCard";
import DataPanel from "../../components/common/DataPanel";
import PageHeader from "../../components/common/PageHeader";
import ResourceFormDialog from "../../components/common/ResourceFormDialog";
import StatusChip from "../../components/common/StatusChip";
import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";

const initialSalesman = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export default function Salesmen() {
  const { data: salesmen, loading, error, reload } = useApiResource("salesmen");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = salesmen.map((salesman) => ({
    ...salesman,
    route: salesman.address || "Route not assigned",
    status: "Active",
  }));

  const addSalesman = async (form) => {
    setSaving(true);
    setFormError("");

    try {
      await createResource("salesmen", {
        ...form,
        address: form.address || null,
      });
      setDialogOpen(false);
      reload();
    } catch (err) {
      setFormError(err.response?.data?.detail || "Unable to add salesman.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Field team"
        title="Salesmen"
        description="Measure route coverage, order booking, collection responsibility, and field execution."
        actionLabel="Add Salesman"
        actionIcon={<GroupAddIcon />}
        onAction={() => setDialogOpen(true)}
      />

      <ResourceFormDialog
        open={dialogOpen}
        title="Add Salesman"
        fields={[
          { name: "name", label: "Name" },
          { name: "phone", label: "Phone" },
          { name: "email", label: "Email", type: "email" },
          { name: "address", label: "Route or address", required: false, multiline: true, minRows: 2, size: { xs: 12 } },
        ]}
        initialValues={initialSalesman}
        submitLabel="Add Salesman"
        error={formError}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={addSalesman}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Field Staff" value={rows.length} icon={<GroupsIcon />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Routes Assigned" value={rows.filter((row) => row.address).length} icon={<RouteIcon />} color="#2f855a" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Contactable" value={rows.filter((row) => row.phone || row.email).length} icon={<PaymentsIcon />} color="#d97706" />
        </Grid>
      </Grid>

      <DataPanel
        title="Route performance"
        description="Field staff records loaded from the backend."
        rows={rows}
        loading={loading}
        error={error}
        columns={[
          { key: "id", label: "Staff ID" },
          { key: "name", label: "Name" },
          { key: "route", label: "Route" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status", render: (row) => <StatusChip label={row.status} /> },
        ]}
      />
    </Box>
  );
}
