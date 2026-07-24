import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { decodeToken, getHomePath } from "../../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      setLoading(true);

      const data = await loginUser({ email, password });

      if (!data.access_token) {
        setError("Login failed. No access token received.");
        return;
      }

      const decodedUser = decodeToken(data.access_token);
      const didLogin = login(data.access_token);

      if (!didLogin) {
        setError("Your session token is invalid or expired.");
        return;
      }

      navigate(getHomePath(decodedUser?.role));
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          (err.request
            ? "Unable to reach the backend. Check VITE_API_BASE_URL and backend CORS settings."
            : null) ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", alignItems: "center", py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
              minHeight: { md: 620 },
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 6 },
                backgroundColor: "primary.main",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.75, fontWeight: 800 }}>
                    Wholesale management
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, maxWidth: 520 }}>
                    Run inventory, orders, routes, and collections from one focused workspace.
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  {[
                    ["Live stock control", "Know what is selling, low, and ready to dispatch."],
                    ["Retailer ordering", "Give every account a cleaner buying and ledger flow."],
                    ["Field collections", "Keep route visits, orders, and payments connected."],
                  ].map(([title, copy]) => (
                    <Stack key={title} direction="row" spacing={1.5}>
                      <TrendingUpIcon sx={{ mt: 0.25, color: "secondary.light" }} />
                      <Box>
                        <Typography fontWeight={800}>{title}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.78 }}>
                          {copy}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 5 }}>
                <StorefrontIcon />
                <Typography variant="body2" sx={{ opacity: 0.82 }}>
                  Built for wholesalers, sales teams, and retailers.
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 3, md: 6 }, display: "flex", alignItems: "center" }}>
              <Stack spacing={2.5} sx={{ width: "100%" }}>
                <Box>
                  <Typography variant="h4">Welcome back</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Sign in to continue to your dashboard.
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<LockOpenIcon />}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <Divider />

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  New retailer?{" "}
                  <Link to="/register" style={{ color: "#1f4f46", fontWeight: 800 }}>
                    Create an account
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
