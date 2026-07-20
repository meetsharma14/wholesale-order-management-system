import { Chip } from "@mui/material";

const colorByStatus = {
  Paid: "success",
  Delivered: "success",
  Active: "success",
  Ready: "success",
  Processing: "warning",
  Pending: "warning",
  Overdue: "error",
  "Low stock": "warning",
  "On hold": "default",
};

export default function StatusChip({ label }) {
  return (
    <Chip
      label={label}
      size="small"
      color={colorByStatus[label] || "default"}
      variant={colorByStatus[label] ? "filled" : "outlined"}
    />
  );
}
