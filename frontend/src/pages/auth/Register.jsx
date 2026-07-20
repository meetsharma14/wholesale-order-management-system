import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    role: "RETAILER",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const { confirmPassword, ...payload } = form;
      await api.post("/auth/register", payload);
      setMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Registration failed.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", alignItems: "center", py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between">
              <Box>
                <Typography variant="overline" color="secondary" fontWeight={800}>
                  Account registration
                </Typography>
                <Typography variant="h4">Create your account</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Register as a salesman or retailer and sign in to the right workspace.
                </Typography>
              </Box>
              <VerifiedUserIcon color="primary" sx={{ fontSize: 44 }} />
            </Stack>

            {message && (
              <Alert severity={message.startsWith("Registration successful") ? "success" : "error"}>
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField select fullWidth label="Account type" name="role" value={form.role} onChange={handleChange}>
                  <MenuItem value="RETAILER">Retailer</MenuItem>
                  <MenuItem value="SALESMAN">Salesman</MenuItem>
                </TextField>
                <TextField fullWidth label={form.role === "RETAILER" ? "Store or owner name" : "Full name"} name="name" value={form.name} onChange={handleChange} required />
                <TextField fullWidth type="email" label="Email" name="email" value={form.email} onChange={handleChange} required />
                <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
                <TextField fullWidth type="password" label="Password" name="password" value={form.password} onChange={handleChange} required />
                <TextField fullWidth type="password" label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

                <Button type="submit" fullWidth size="large" variant="contained" startIcon={<PersonAddIcon />}>
                  Create Account
                </Button>

                <Button component={Link} to="/" fullWidth>
                  Already have an account? Sign in
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
