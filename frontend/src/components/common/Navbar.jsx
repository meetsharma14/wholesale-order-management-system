import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  InputBase,
  Badge,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const roleLabel = user?.role ? user.role.toLowerCase() : "user";
  const initial = user?.email?.[0]?.toUpperCase() || roleLabel[0]?.toUpperCase();
  const title = roleLabel === "admin" ? "Wholesale HQ" : "Wholesale Desk";

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        zIndex: 1300,
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        backgroundColor: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, gap: 2 }}>
        <IconButton
          color="primary"
          aria-label="Open navigation"
          onClick={onMenuClick}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ minWidth: { xs: 150, md: 220 } }}>
          <Typography variant="h6" color="primary" sx={{ lineHeight: 1 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Inventory, orders, payments
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            flexGrow: 1,
            maxWidth: 520,
            px: 1.5,
            py: 0.75,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.default",
          }}
        >
          <SearchIcon fontSize="small" color="action" />
          <InputBase
            placeholder="Search orders, retailers, products..."
            sx={{ ml: 1, flex: 1, fontSize: 14 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="primary" aria-label="Notifications">
          <Badge color="secondary" variant="dot">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
            {initial}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" fontWeight={800}>
              {user?.email || "Team member"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {roleLabel}
            </Typography>
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
