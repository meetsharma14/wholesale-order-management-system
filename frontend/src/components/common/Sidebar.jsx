import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import FactoryIcon from "@mui/icons-material/Factory";
import StoreIcon from "@mui/icons-material/Store";
import GroupsIcon from "@mui/icons-material/Groups";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RouteIcon from "@mui/icons-material/Route";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const drawerWidth = 250;

const menusByRole = {
  ADMIN: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Products", icon: <InventoryIcon />, path: "/admin/products" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Suppliers", icon: <FactoryIcon />, path: "/admin/suppliers" },
    { text: "Retailers", icon: <StoreIcon />, path: "/admin/retailers" },
    { text: "Salesmen", icon: <GroupsIcon />, path: "/admin/salesmen" },
    { text: "Users", icon: <ManageAccountsIcon />, path: "/admin/users" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/admin/orders" },
    { text: "Payments", icon: <PaymentsIcon />, path: "/admin/payments" },
    { text: "Reports", icon: <BarChartIcon />, path: "/admin/reports" },
  ],
  SALESMAN: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/salesman" },
    { text: "Retailer Visits", icon: <RouteIcon />, path: "/salesman/visits" },
    { text: "New Order", icon: <ShoppingCartIcon />, path: "/salesman/new-order" },
    { text: "Collections", icon: <PaymentsIcon />, path: "/salesman/collections" },
  ],
  RETAILER: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/retailer" },
    { text: "Catalog", icon: <InventoryIcon />, path: "/retailer/catalog" },
    { text: "My Orders", icon: <AssignmentTurnedInIcon />, path: "/retailer/orders" },
    { text: "Ledger", icon: <ReceiptLongIcon />, path: "/retailer/ledger" },
  ],
};

export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menus = menusByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    onMobileClose?.();
    navigate("/");
  };

  const drawerContent = (
    <>
      <Toolbar />

      <Box sx={{ px: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>
          WORKSPACE
        </Typography>
      </Box>

      <List sx={{ px: 1.25 }}>
        {menus.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={onMobileClose}
            selected={location.pathname === item.path}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              color: "text.secondary",
              "& .MuiListItemIcon-root": {
                color: "inherit",
                minWidth: 40,
              },
              "&.Mui-selected": {
                color: "primary.main",
                backgroundColor: "primary.light",
                fontWeight: 800,
              },
              "&.Mui-selected:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List sx={{ px: 1.25, pb: 2 }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#fbfcfa",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor: "#fbfcfa",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
