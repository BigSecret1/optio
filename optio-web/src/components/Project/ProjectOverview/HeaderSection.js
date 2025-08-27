import React from "react";
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";

import AccentBar from "./AccentBar";
import ActionBar from "./ActionBar";

function HeroSection({ project, onProjectEdit, onManageMembers }) {
  return (
    <Card>
      <AccentBar />
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md>
            <Stack spacing={2}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  fontSize: { xs: 20, sm: 28, md: 36 },
                }}
              >
                {project.name}
              </Typography>

              <Typography variant="body1" sx={{ opacity: 0.95, maxWidth: 760 }}>
                {project.description}
              </Typography>

              <ActionBar
                projectId={project.id}
                onEdit={onProjectEdit}
                onManageMembers={onManageMembers}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default HeroSection;
