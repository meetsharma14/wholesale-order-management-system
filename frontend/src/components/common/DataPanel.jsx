import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function DataPanel({
  title,
  description,
  columns,
  rows = [],
  loading = false,
  error = "",
  emptyMessage = "No records found.",
}) {
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={700}>
          {loading ? "Loading..." : `${rows.length} records`}
        </Typography>
      </Stack>

      {error && (
        <Box sx={{ p: 2.5, pb: 0 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <TableContainer>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5}>
                    <CircularProgress size={20} />
                    <Typography color="text.secondary">Loading backend data...</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && rows.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align}>
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
