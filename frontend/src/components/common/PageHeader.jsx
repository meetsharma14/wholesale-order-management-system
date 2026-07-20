import { Box, Button, Chip, Stack, Typography } from "@mui/material";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  actionTo,
  actionComponent,
  meta,
}) {
  const actionProps = actionTo
    ? { component: actionComponent, to: actionTo }
    : { onClick: onAction };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "flex-start" }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Box>
        {eyebrow && (
          <Typography variant="overline" color="secondary" fontWeight={800}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
            {description}
          </Typography>
        )}
        {meta && (
          <Chip label={meta} size="small" variant="outlined" sx={{ mt: 1.5 }} />
        )}
      </Box>

      {actionLabel && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
          {...actionProps}
        >
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}
