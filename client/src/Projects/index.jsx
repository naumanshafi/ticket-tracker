import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'shared/utils/api';
import { PageLoader, ProjectAvatar, Button, Icon, LogoutModal } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';
import toast from 'shared/utils/toast';
import { ProjectCategoryCopy } from 'shared/constants/projects';

import {
  ProjectsPage,
  ProjectsContainer,
  ProjectsSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
  SidebarSubtitle,
  SidebarNavItem,
  SidebarNavText,
  SidebarDivider,
  ProjectsContent,
  Header,
  Title,
  Subtitle,
  ProjectsGrid,
  ProjectCard,
  ProjectHeader,
  ProjectName,
  ProjectCategory,
  ProjectDescription,
  ProjectMeta,
  ProjectRole,
  NoProjects
} from './Styles';

const Projects = () => {
  const history = useHistory();
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (isLoadingUser) return;
    
    if (currentUser) {
      fetchUserProjects();
    }
  }, [currentUser, isLoadingUser]);

  const fetchUserProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.projects);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    history.push(`/project/${projectId}/board`);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#0052cc';
      case 'user': return '#00875a';
      case 'viewer': return '#ff5630';
      default: return '#5e6c84';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'user': return 'Member';
      case 'viewer': return 'Viewer';
      default: return role;
    }
  };

  // Show loading while user data is being fetched
  if (isLoadingUser || isLoading) {
    return <PageLoader />;
  }

  return (
    <ProjectsPage>
      <ProjectsContainer>
        <ProjectsSidebar>
          <SidebarContent>
            <SidebarHeader>
              <ProjectAvatar name="My Projects" />
              <div style={{ paddingLeft: '10px' }}>
                <SidebarTitle>My Projects</SidebarTitle>
                <SidebarSubtitle>Project Dashboard</SidebarSubtitle>
              </div>
            </SidebarHeader>

            <SidebarNavItem style={{ background: '#deebff', color: '#0052cc' }}>
              <Icon type="component" />
              <SidebarNavText>All Projects</SidebarNavText>
            </SidebarNavItem>

            {currentUser?.role === 'admin' && (
              <SidebarNavItem 
                onClick={() => history.push('/admin/projects')} 
                style={{ cursor: 'pointer' }}
              >
                <Icon type="settings" />
                <SidebarNavText>Admin Panel</SidebarNavText>
              </SidebarNavItem>
            )}

            <div style={{ flex: 1 }} />
            <SidebarDivider />
            <SidebarNavItem 
              onClick={() => setLogoutConfirmOpen(true)} 
              style={{ cursor: 'pointer', marginTop: 'auto' }}
            >
              <Icon type="close" />
              <SidebarNavText>Logout</SidebarNavText>
            </SidebarNavItem>
          </SidebarContent>
        </ProjectsSidebar>

        <ProjectsContent>
          <Header>
            <div>
              <Title>My Projects ({projects.length})</Title>
              <Subtitle>Select a project to get started</Subtitle>
            </div>
          </Header>

          {projects.length === 0 ? (
            <NoProjects>
              <h2>No Projects Available</h2>
              <p>You don't have access to any projects yet.</p>
              <p>Contact an administrator to get access to projects.</p>
            </NoProjects>
          ) : (
            <ProjectsGrid>
              {projects.map(project => (
                <ProjectCard key={project.id} onClick={() => handleProjectClick(project.id)}>
                  <ProjectHeader>
                    <ProjectAvatar name={project.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <ProjectName>{project.name}</ProjectName>
                      <ProjectCategory>
                        {ProjectCategoryCopy[project.category] || project.category}
                      </ProjectCategory>
                    </div>
                    <ProjectRole style={{ color: getRoleColor(project.userRole) }}>
                      {getRoleLabel(project.userRole)}
                    </ProjectRole>
                  </ProjectHeader>
                  
                  {project.description && (
                    <ProjectDescription>{project.description}</ProjectDescription>
                  )}
                  
                  <ProjectMeta>
                    <span>Click to open project</span>
                  </ProjectMeta>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          )}
        </ProjectsContent>
      </ProjectsContainer>

      <LogoutModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        userType="user"
      />
    </ProjectsPage>
  );
};

export default Projects;
