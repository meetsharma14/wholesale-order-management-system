import { Component } from "react";

import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

export default class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ minHeight: "100vh", display: "grid", alignItems: "center", py: 4 }}>
          <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Something went wrong</Typography>
                <Typography color="text.secondary">
                  The app hit a rendering error. Refresh the page to retry.
                </Typography>
                <Alert severity="error">{this.state.error.message}</Alert>
                <Button variant="contained" onClick={this.handleReload}>
                  Reload
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
