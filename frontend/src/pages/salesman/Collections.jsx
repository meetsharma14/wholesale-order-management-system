import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PaymentsIcon from "@mui/icons-material/Payments";

import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";
import { formatCurrency } from "../../utils/format";

export default function Collections() {
  const { data: retailers, loading, error } = useApiResource("retailers");
  const [form, setForm] = useState({
    retailer_id: "",
    amount: "",
    payment_method: "UPI",
  });
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!form.retailer_id && retailers.length > 0) {
      setForm((current) => ({ ...current, retailer_id: retailers[0].id }));
    }
  }, [form.retailer_id, retailers]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitPayment = async () => {
    setSubmitStatus({ type: "", message: "" });

    try {
      await createResource("payments", {
        retailer_id: form.retailer_id,
        amount: Number(form.amount),
        payment_method: form.payment_method,
      });

      setSubmitStatus({ type: "success", message: "Collection recorded in backend." });
      setForm((current) => ({ ...current, amount: "" }));
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.response?.data?.detail || "Unable to record collection.",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={1}>Collections</Typography>
      <Typography color="text.secondary" mb={3}>
        Record payment collected from retailers and note the payment mode.
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {submitStatus.message && (
        <Alert severity={submitStatus.type} sx={{ mb: 3 }}>{submitStatus.message}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                select
                label="Retailer"
                value={form.retailer_id}
                fullWidth
                disabled={loading}
                onChange={(event) => updateForm("retailer_id", event.target.value)}
              >
                {retailers.map((retailer) => (
                  <MenuItem value={retailer.id} key={retailer.id}>
                    {retailer.shop_name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Amount"
                type="number"
                value={form.amount}
                fullWidth
                onChange={(event) => updateForm("amount", event.target.value)}
              />
              <TextField
                select
                label="Payment method"
                value={form.payment_method}
                fullWidth
                onChange={(event) => updateForm("payment_method", event.target.value)}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
              </TextField>
              <TextField label="Reference note" placeholder="Transaction ID or receipt note" fullWidth />
              <Button
                variant="contained"
                startIcon={<PaymentsIcon />}
                disabled={loading || !form.retailer_id || !Number(form.amount)}
                onClick={submitPayment}
              >
                Record Collection
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Due today</Typography>
            <Stack spacing={1.5}>
              {loading && <Typography color="text.secondary">Loading retailer balances...</Typography>}
              {!loading && retailers.length === 0 && (
                <Typography color="text.secondary">No retailer balances found.</Typography>
              )}
              {!loading && retailers.slice(0, 5).map((retailer) => (
                <Typography key={retailer.id}>
                  {retailer.shop_name} - {formatCurrency(retailer.outstanding_balance)}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
