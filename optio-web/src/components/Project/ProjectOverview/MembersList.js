import React from "react";

import {
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

function MembersList({ projectMembers }) {
  if (!projectMembers) return <h1>No Members Yet !!!</h1>;
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Members
        </Typography>

        <TableContainer component={Paper} elevation={0}>
          <Table size="medium" aria-label="project projectMembers">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">User Name</TableCell>
                <TableCell align="right">Joined At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectMembers.map((m) => (
                <TableRow
                  key={m.id}
                  hover
                  sx={{
                    transition: "background .2s ease",
                    "&:hover": { backgroundColor: alpha("#000", 0.12) },
                  }}
                >
                  {/* First Name */}
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography fontWeight={700}>{m.firstName}</Typography>
                    </Stack>
                  </TableCell>

                  {/* Last Name (centered) */}
                  <TableCell align="center">{m.lastName}</TableCell>

                  {/* User Name (centered) */}
                  <TableCell sx={{ opacity: 0.95 }} align="center">
                    {m.email}
                  </TableCell>

                  {/* Joined At (right aligned) */}
                  <TableCell align="right">{m.dateJoined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default React.memo(MembersList);
