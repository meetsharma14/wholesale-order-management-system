import { Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";

export default function DashboardCard({
  title,
  value,
  icon,
  color = "#1f4f46",
  trend,
  caption,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight={800} noWrap>
              {value}
            </Typography>

            {caption && (
              <Typography variant="caption" color="text.secondary">
                {caption}
              </Typography>
            )}
          </Stack>

          <Box
            sx={{
              backgroundColor: `${color}14`,
              color,
              p: 1.25,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </Box>
        </Box>

        {trend && (
          <Chip
            label={trend}
            size="small"
            color={trend.startsWith("+") ? "success" : "default"}
            sx={{ mt: 2 }}
          />
        )}
      </CardContent>
    </Card>
  );
}
