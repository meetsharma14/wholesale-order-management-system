import { useState } from "react";

import { Alert, Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import useApiResource from "../../hooks/useApiResource";
import { formatCurrency } from "../../utils/format";

export default function Catalog() {
  const { data: products, loading, error } = useApiResource("products");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  const addToReorder = (product) => {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);

      if (exists) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { id: product.id, name: product.name, quantity: 1 }];
    });
    setMessage(`${product.name} added to reorder list.`);
  };

  return (
    <Box>
      <Typography variant="h4" mb={1}>Product Catalog</Typography>
      <Typography color="text.secondary" mb={3}>
        Browse wholesale items and add products to a reorder.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
      {cart.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Reorder list has {cart.reduce((sum, item) => sum + item.quantity, 0)} items.
        </Alert>
      )}

      {loading && (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">Loading catalog from backend...</Typography>
        </Stack>
      )}

      <Grid container spacing={3}>
        {!loading && products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={2}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="h5">{formatCurrency(product.selling_price)}</Typography>
                <Typography color="text.secondary">
                  {product.stock} {product.unit} available
                </Typography>
                <Button variant="outlined" startIcon={<AddShoppingCartIcon />} onClick={() => addToReorder(product)}>
                  Add
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
