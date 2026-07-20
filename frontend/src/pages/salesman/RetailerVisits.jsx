import { useState } from "react";

import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";

const initialVisits = [
  { retailer: "Sharma Stores", area: "Main Bazaar", time: "10:00 AM", status: "Completed" },
  { retailer: "City Mart", area: "Station Road", time: "11:30 AM", status: "Collection due" },
  { retailer: "Fresh Basket", area: "Lake View", time: "02:00 PM", status: "Order expected" },
  { retailer: "Royal Traders", area: "Market Yard", time: "04:30 PM", status: "Pending" },
];

export default function RetailerVisits() {
  const [visits, setVisits] = useState(initialVisits);

  const markVisit = (retailer) => {
    setVisits((current) =>
      current.map((visit) =>
        visit.retailer === retailer ? { ...visit, status: "Completed" } : visit
      )
    );
  };

  const navigateToVisit = (visit) => {
    const query = encodeURIComponent(`${visit.retailer} ${visit.area}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Box>
      <Typography variant="h4" mb={1}>Retailer Visits</Typography>
      <Typography color="text.secondary" mb={3}>
        Track daily route, visit outcome, and next action for each retailer.
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Retailer</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.retailer}>
                <TableCell>{visit.retailer}</TableCell>
                <TableCell>{visit.area}</TableCell>
                <TableCell>{visit.time}</TableCell>
                <TableCell>
                  <Chip label={visit.status} size="small" />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button size="small" startIcon={<NavigationIcon />} onClick={() => navigateToVisit(visit)}>Navigate</Button>
                    <Button size="small" startIcon={<CheckCircleIcon />} onClick={() => markVisit(visit.retailer)}>Mark Visit</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
