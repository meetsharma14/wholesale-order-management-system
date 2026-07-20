import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

export default function ResourceFormDialog({
  open,
  title,
  fields,
  initialValues,
  submitLabel = "Save",
  error,
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    if (open) {
      setForm(initialValues);
    }
  }, [initialValues, open]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const hasMissingRequiredSelect = fields.some(
    (field) =>
      field.type === "select" &&
      field.required !== false &&
      (!field.options?.length || !form[field.name])
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid component="form" id="resource-form" container spacing={2} sx={{ mt: 0.5 }} onSubmit={handleSubmit}>
          {fields.map((field) => (
            <Grid key={field.name} size={field.size || { xs: 12, md: 6 }}>
              <TextField
                select={field.type === "select"}
                type={field.type === "select" ? undefined : field.type || "text"}
                label={field.label}
                value={form[field.name] ?? ""}
                required={field.required !== false}
                fullWidth
                multiline={field.multiline}
                minRows={field.minRows}
                disabled={field.disabled}
                helperText={field.helperText}
                onChange={(event) => handleChange(field.name, event.target.value)}
              >
                {field.type === "select" && !field.options?.length && (
                  <MenuItem value="" disabled>
                    {field.emptyLabel || `No ${field.label.toLowerCase()} available`}
                  </MenuItem>
                )}
                {(field.options || []).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="resource-form" variant="contained" disabled={loading || hasMissingRequiredSelect}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
