import React, { useState } from "react";
import { Box, Container } from "@mui/material";

import ProjectOverviewThemeProvider from "./ProjectOverviewThemeProvider";
import HeaderSection from "./HeaderSection";
import MembersList from "./MembersList";
import EditProject from "./EditProject";
import { BRAND_PRIMARY, BRAND_SECONDARY } from "../../../constants";
import ManageMembers from "./Members/ManageMembers";

export default function ProjectOverview({
  project = {
    id: 2,
    name: "Optio : The Project Management Tool For Everyone",
    description:
      "This is the project description. Keep it to 2–3 sentences for readability.",
  },
  members = [
    {
      firstName: "Alice",
      lastName: "Johnson",
      username: "alicej",
      joinedAt: "12 Jan 2024",
    },
    {
      firstName: "Bob",
      lastName: "Martinez",
      username: "bmartinez",
      joinedAt: "05 Mar 2024",
    },
    {
      firstName: "Clara",
      lastName: "Nguyen",
      username: "clara.ng",
      joinedAt: "22 May 2024",
    },
    {
      firstName: "David",
      lastName: "Singh",
      username: "dsingh",
      joinedAt: "10 Jul 2024",
    },
    {
      firstName: "Ella",
      lastName: "Brown",
      username: "ella_b",
      joinedAt: "30 Aug 2024",
    },
    {
      firstName: "Farhan",
      lastName: "Khan",
      username: "fkhan",
      joinedAt: "15 Sep 2024",
    },
  ],
  onEdit = () => {},
  onManageMembers = () => {},
}) {
  const [openEditProject, setOpenEditProject] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);
  const [openManageMembers, setOpenManageMembers] = useState(false);
  const [currentMembers, setCurrentMembers] = useState([]);

  const mockResponse = [
    { id: "1", name: "Aarav Sharma", email: "aarav@example.com" },
    { id: "2", name: "Diya Patel", email: "diya@example.com" },
    { id: "3", name: "Diya Patel", email: "diya@example.com" },
    { id: "4", name: "Diya Patel", email: "diya@example.com" },
    { id: "5", name: "Diya Patel", email: "diya@example.com" },
    { id: "6", name: "Diya Patel", email: "diya@example.com" },
    { id: "7", name: "Diya Patel", email: "diya@example.com" },
    { id: "8", name: "Diya Patel", email: "diya@example.com" },
    { id: "9", name: "Diya Patel", email: "diya@example.com" },
    { id: "10", name: "Diya Patel", email: "diya@example.com" },
    { id: "11", name: "Diya Patel", email: "diya@example.com" },
    { id: "12", name: "Diya Patel", email: "diya@example.com" },
    { id: "13", name: "Diya Patel", email: "diya@example.com" },
    { id: "14", name: "Diya Patel", email: "diya@example.com" },
    { id: "15", name: "Diya Patel", email: "diya@example.com" },
  ];

  function handleProjectSave(updatedDetails) {
    setCurrentProject(updatedDetails);
    setOpenEditProject(false);
  }

  return (
    <ProjectOverviewThemeProvider>
      <Box
        sx={{
          minHeight: "100vh",
          pb: 8,
          background: `linear-gradient(180deg, ${BRAND_PRIMARY} 0%, ${BRAND_SECONDARY} 100%)`,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 6 }}>
          <HeaderSection
            project={currentProject}
            onProjectEdit={() => setOpenEditProject(true)}
            onManageMembers={() => setOpenManageMembers(true)}
          />
          <MembersList members={members} />
        </Container>
      </Box>
      <EditProject
        open={openEditProject}
        onClose={() => setOpenEditProject(false)}
        project={currentProject}
        onSave={handleProjectSave}
      />
      <ManageMembers
        open={openManageMembers}
        onClose={() => setOpenManageMembers(false)}
        members={currentMembers}
        onChangeMembers={setCurrentMembers}
        fetchUsers={async (q) => {
          console.log("Received api call ehre", q);
          return mockResponse;
        }}
      />
    </ProjectOverviewThemeProvider>
  );
}
