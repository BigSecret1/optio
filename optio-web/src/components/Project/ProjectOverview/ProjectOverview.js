import React, { useState } from "react";
import { Box, Container } from "@mui/material";

import ProjectOverviewThemeProvider from "./ProjectOverviewThemeProvider";
import HeaderSection from "./HeaderSection";
import MembersList from "./MembersList";
import EditProject from "./EditProject";
import { BRAND_PRIMARY, BRAND_SECONDARY } from "../../../constants";
import ManageMembers from "./Members/ManageMembers";
import { searchContext, userSearchStrategy } from "../../../search";

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

  function handleProjectSave(updatedDetails) {
    setCurrentProject(updatedDetails);
    setOpenEditProject(false);
  }

  async function searchUser(input) {
    if (!input) {
      return;
    }
    searchContext.setStrategy(userSearchStrategy);
    const query = { firstName: input };
    const results = await searchContext.executeSearch(query);
    console.log("Search results", results);
    return results;
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
        fetchUsers={searchUser}
      />
    </ProjectOverviewThemeProvider>
  );
}
