import { useState } from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import api from "../../api/axios";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "SALESMAN",
};

export default function Users() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/auth/users", form);
      setMessage(`${response.data.role} user created successfully.`);
      setForm(initialForm);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Unable to create user.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={1}>Users</Typography>
      <Typography color="text.secondary" mb={3}>
        Create internal admin and salesman accounts. Public registration remains retailer-only.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
                <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
                <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth required />
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />
                <TextField select label="Role" name="role" value={form.role} onChange={handleChange} fullWidth>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SALESMAN">Salesman</MenuItem>
                  <MenuItem value="RETAILER">Retailer</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" startIcon={<PersonAddIcon />}>
                  Create User
                </Button>
                {message && (
                  <Typography color="text.secondary">{message}</Typography>
                )}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Recommended setup</Typography>
            <Stack spacing={1.5}>
              <Typography>Create one admin owner account.</Typography>
              <Typography>Create salesman accounts for field staff.</Typography>
              <Typography>Let retailers self-register or create them here.</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
