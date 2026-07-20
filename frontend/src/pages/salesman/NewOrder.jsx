import { useEffect, useMemo, useState } from "react";

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

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import useApiResource from "../../hooks/useApiResource";
import { createResource } from "../../services/resourceService";
import { formatCurrency } from "../../utils/format";

export default function NewOrder() {
  const { data: products, loading: productsLoading, error: productsError } = useApiResource("products");
  const { data: retailers, loading: retailersLoading, error: retailersError } = useApiResource("retailers");
  const [retailerId, setRetailerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const loading = productsLoading || retailersLoading;

  useEffect(() => {
    if (!retailerId && retailers.length > 0) {
      setRetailerId(retailers[0].id);
    }
  }, [retailerId, retailers]);

  useEffect(() => {
    if (products.length > 0 && items.every((item) => !item.product_id)) {
      setItems([{ product_id: products[0].id, quantity: 1 }]);
    }
  }, [items, products]);

  const total = useMemo(
    () => items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.product_id);
      return sum + Number(product?.selling_price || 0) * Number(item.quantity || 0);
    }, 0),
    [items]
  );

  const addItem = () => {
    setItems([...items, { product_id: products[0]?.id || "", quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    setItems(items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const submitOrder = async () => {
    setSubmitStatus({ type: "", message: "" });

    try {
      await createResource("orders", {
        retailer_id: retailerId,
        items: items
          .filter((item) => item.product_id && Number(item.quantity) > 0)
          .map((item) => ({
            product_id: item.product_id,
            quantity: Number(item.quantity),
          })),
      });

      setSubmitStatus({ type: "success", message: "Order submitted to backend." });
      setItems([{ product_id: products[0]?.id || "", quantity: 1 }]);
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.response?.data?.detail || "Unable to submit order.",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={1}>Create Retailer Order</Typography>
      <Typography color="text.secondary" mb={3}>
        Build an order while visiting a retailer and confirm estimated total.
      </Typography>
      {(productsError || retailersError) && (
        <Alert severity="error" sx={{ mb: 3 }}>{productsError || retailersError}</Alert>
      )}
      {submitStatus.message && (
        <Alert severity={submitStatus.type} sx={{ mb: 3 }}>{submitStatus.message}</Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                select
                label="Retailer"
                value={retailerId}
                fullWidth
                disabled={loading}
                onChange={(event) => setRetailerId(event.target.value)}
              >
                {retailers.map((retailer) => (
                  <MenuItem value={retailer.id} key={retailer.id}>
                    {retailer.shop_name}
                  </MenuItem>
                ))}
              </TextField>
              {items.map((item, index) => (
                <Grid container spacing={2} key={`${item.product_id}-${index}`}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      select
                      label="Product"
                      value={item.product_id}
                      fullWidth
                      disabled={loading}
                      onChange={(event) => updateItem(index, "product_id", event.target.value)}
                    >
                      {products.map((product) => (
                        <MenuItem value={product.id} key={product.id}>
                          {product.name} - {formatCurrency(product.selling_price)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Qty"
                      type="number"
                      value={item.quantity}
                      fullWidth
                      onChange={(event) => updateItem(index, "quantity", event.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button onClick={addItem} disabled={loading || products.length === 0}>Add another item</Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Order summary</Typography>
            <Typography variant="h4" mb={3}>{formatCurrency(total)}</Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddShoppingCartIcon />}
              disabled={loading || !retailerId || items.every((item) => !item.product_id)}
              onClick={submitOrder}
            >
              Submit Order
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
