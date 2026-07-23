import { useEffect, useState } from "react";

import {
  Alert,
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

import useApiResource from "../../hooks/useApiResource";

export default function RetailerVisits() {
  const {
    data: retailers,
    loading,
    error,
  } = useApiResource("retailers");

  const [visits, setVisits] = useState([]);

  // Convert real retailers into visit rows
  useEffect(() => {
    if (retailers.length > 0) {
      setVisits(
        retailers.map((retailer) => ({
          id: retailer.id,
          retailer: retailer.shop_name,
          area:
            retailer.area ||
            retailer.address ||
            retailer.city ||
            "-",
          time: "-",
          status: "Pending",
        }))
      );
    }
  }, [retailers]);

  const markVisit = (retailerId) => {
    setVisits((current) =>
      current.map((visit) =>
        visit.id === retailerId
          ? { ...visit, status: "Completed" }
          : visit
      )
    );
  };

  const navigateToVisit = (visit) => {
    const query = encodeURIComponent(
      `${visit.retailer} ${visit.area}`
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Box>
      <Typography variant="h4" mb={1}>
        Retailer Visits
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Track daily route, visit outcome, and next action for each retailer.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Retailer</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading retailers...
                </TableCell>
              </TableRow>
            ) : visits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No retailers found.
                </TableCell>
              </TableRow>
            ) : (
              visits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>
                    {visit.retailer}
                  </TableCell>

                  <TableCell>
                    {visit.area}
                  </TableCell>

                  <TableCell>
                    {visit.time}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={visit.status}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={1}
                    >
                      <Button
                        size="small"
                        startIcon={<NavigationIcon />}
                        onClick={() =>
                          navigateToVisit(visit)
                        }
                      >
                        Navigate
                      </Button>

                      <Button
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() =>
                          markVisit(visit.id)
                        }
                      >
                        Mark Visit
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}