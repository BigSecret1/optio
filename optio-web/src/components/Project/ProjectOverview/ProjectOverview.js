import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, Container } from "@mui/material";

import ProjectOverviewThemeProvider from "./ProjectOverviewThemeProvider";
import HeaderSection from "./HeaderSection";
import MembersList from "./MembersList";
import EditProject from "./EditProject";
import { BRAND_PRIMARY, BRAND_SECONDARY } from "../../../constants";
import ManageMembers from "./Members/ManageMembers";
import { searchContext, userSearchStrategy } from "../../../search";
import ApiManager from "../../../api-manager/api-manager";

export default function ProjectOverview({
  onEdit = () => {},
  onManageMembers = () => {},
}) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);

  const [openEditProject, setOpenEditProject] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);
  const [openManageMembers, setOpenManageMembers] = useState(false);
  const [currentMembers, setCurrentMembers] = useState([]);

  useEffect(() => {
    fetchProject();
    fetchProjectMembers();
  }, [projectId]);

  async function fetchProject() {
    const result = await ApiManager.fetchProject(projectId);
    setProject(result);
    setCurrentProject(result);
  }

  async function fetchProjectMembers() {
    const projectMembers = await ApiManager.fetchProjectMembers(projectId);
    setMembers(projectMembers);
  }

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
    return results;
  }

  async function addProjectMembers(selectMembers) {
    const memberIds = selectMembers.map((member) => member.id);

    try {
      await ApiManager.addProjectMemebers(memberIds, projectId);
      await fetchProjectMembers();
    } catch (e) {
      console.error("Failed to add members to project", e);
    }
  }

  if (!project) return <h1>Loading...</h1>;

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
            project={project}
            onProjectEdit={() => setOpenEditProject(true)}
            onManageMembers={() => setOpenManageMembers(true)}
          />
          <MembersList members={members} />
        </Container>
      </Box>

      <EditProject
        open={openEditProject}
        onClose={() => setOpenEditProject(false)}
        project={project}
        onSave={handleProjectSave}
      />

      <ManageMembers
        open={openManageMembers}
        onClose={() => setOpenManageMembers(false)}
        onSave={addProjectMembers}
        members={currentMembers}
        onChangeMembers={setCurrentMembers}
        fetchUsers={searchUser}
      />
    </ProjectOverviewThemeProvider>
  );
}
