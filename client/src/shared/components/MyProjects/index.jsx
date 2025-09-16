import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import api from 'shared/utils/api';
import { PageLoader, Avatar, Button, UserSidebar } from 'shared/components';
import AdminSidebar from 'Admin/Sidebar';
import toast from 'shared/utils/toast';
import useCurrentUser from 'shared/hooks/currentUser';

import {
  MyProjectsPage,
  MyProjectsContainer,
  MyProjectsContent,
  Header,
  HeaderContent,
  Title,
  Subtitle,
  HeaderActions,
  ProjectsGrid,
  ProjectCard,
  ProjectCardInner,
  ProjectHeader,
  ProjectName,
  ProjectDescription,
  ProjectMeta,
  ProjectOwner,
  ProjectStats,
  ProjectBadge,
  NoProjects,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from './Styles';

const MyProjects = () => {
  const history = useHistory();
  const location = useLocation();
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if this is admin or user context
  const isAdminContext = location.pathname.startsWith('/admin');
  const isUserContext = location.pathname.startsWith('/user');

  useEffect(() => {
    // Only check access and fetch data after user is loaded
    if (isLoadingUser) return;
    
    // Check access permissions
    if (isAdminContext && currentUser && currentUser.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      history.push('/');
      return;
    }
    
    if (currentUser) {
      fetchMyProjects();
    }
  }, [currentUser, isLoadingUser, history, isAdminContext]);

  const fetchMyProjects = async () => {
    try {
      let endpoint = '/projects'; // Default for regular users
      
      if (isAdminContext) {
        endpoint = '/admin/my-projects';
      }
      
      const response = await api.get(endpoint);
      setProjects(response.projects);
    } catch (error) {
      toast.error('Failed to load your projects');
      console.error('Error fetching my projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    history.push(`/project/${projectId}/board`);
  };

  // Removed handleCreateProject function to match admin projects page

  // Show loading while user data is being fetched
  if (isLoadingUser) {
    return <PageLoader />;
  }

  // Check access permissions
  if (isAdminContext && (!currentUser || currentUser.role !== 'admin')) {
    return null;
  }

  // Show loading while projects are being fetched
  if (isLoading) return <PageLoader />;

  return (
    <MyProjectsPage>
      <MyProjectsContainer>
        {isAdminContext ? <AdminSidebar /> : <UserSidebar />}
        <MyProjectsContent>
          <Header>
            <HeaderContent>
              <div>
                <Title>My Projects ({projects.length})</Title>
                <p style={{ color: '#5e6c84', fontSize: '14px', margin: '8px 0 0 0' }}>
                  {isAdminContext 
                    ? 'Projects where you are a member or owner' 
                    : 'Your assigned projects and workspaces'
                  }
                </p>
              </div>
              <HeaderActions>
                {/* Removed create project button to match admin projects page */}
              </HeaderActions>
            </HeaderContent>
          </Header>

          {projects.length === 0 ? (
            <NoProjects>
              <EmptyStateIcon>🎯</EmptyStateIcon>
              <EmptyStateTitle>
                {isAdminContext 
                  ? `Welcome ${currentUser?.name || 'Admin'}! No Projects Yet` 
                  : `Welcome ${currentUser?.name || 'User'}! 👋`
                }
              </EmptyStateTitle>
              <EmptyStateDescription>
                {isAdminContext 
                  ? "You haven't been added to any projects yet. As an admin, you can create your first project or ask to be added to existing ones."
                  : "You haven't been added to any projects for now. Don't worry - your administrator will add you to projects when they're ready for you to join!"
                }
              </EmptyStateDescription>
              
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '2px solid #0ea5e9',
                borderRadius: '16px',
                padding: '24px',
                marginTop: '32px',
                maxWidth: '500px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>💡</span>
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0c4a6e',
                      margin: '0 0 4px 0'
                    }}>
                      What you can do:
                    </h4>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {isAdminContext ? (
                    <>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#0c4a6e',
                        fontWeight: '500'
                      }}>
                        <span style={{ marginRight: '12px' }}>👥</span>
                        Ask other admins to add you to existing projects
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#0c4a6e',
                        fontWeight: '500'
                      }}>
                        <span style={{ marginRight: '12px' }}>⚙️</span>
                        Manage users and system settings
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#0c4a6e',
                        fontWeight: '500'
                      }}>
                        <span style={{ marginRight: '12px' }}>🏗️</span>
                        Use "All Projects" to create new projects
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#0c4a6e',
                        fontWeight: '500'
                      }}>
                        <span style={{ marginRight: '12px' }}>📧</span>
                        Contact your system administrator
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#0c4a6e',
                        fontWeight: '500'
                      }}>
                        <span style={{ marginRight: '12px' }}>🔄</span>
                        Check back later for project assignments
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#0c4a6e',
                        fontWeight: '500'
                      }}>
                        <span style={{ marginRight: '12px' }}>👤</span>
                        Make sure your profile is complete
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Removed create project button to match admin projects page */}
            </NoProjects>
          ) : (
            <ProjectsGrid>
              {projects.map(project => (
                <ProjectCard key={project.id} onClick={() => handleProjectClick(project.id)}>
                  <ProjectCardInner>
                    <ProjectHeader>
                      <ProjectName>{project.name}</ProjectName>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <ProjectBadge category={project.category}>
                          {project.category}
                        </ProjectBadge>
                        {project.userRole && (
                          <ProjectBadge role={project.userRole}>
                            {project.userRole === 'owner' ? '👑 Owner' : '👤 Member'}
                          </ProjectBadge>
                        )}
                      </div>
                    </ProjectHeader>
                    
                    <ProjectDescription>
                      {project.description || 'No description provided'}
                    </ProjectDescription>
                    
                    <ProjectMeta>
                      <ProjectOwner>
                        <Avatar
                          name={project.ownerName || 'Unknown'}
                          size={32}
                        />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#172b4d' }}>
                            {project.ownerName || 'Unknown Owner'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#5e6c84' }}>
                            Project Owner
                          </div>
                        </div>
                      </ProjectOwner>
                      
                      <ProjectStats>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0052cc' }}>
                            {project.memberCount || 0}
                          </div>
                          <div style={{ fontSize: '11px', color: '#5e6c84', fontWeight: '500' }}>
                            Members
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: '#5e6c84', fontWeight: '500' }}>
                            Created
                          </div>
                          <div style={{ fontSize: '12px', color: '#172b4d', fontWeight: '600' }}>
                            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>
                        </div>
                      </ProjectStats>
                    </ProjectMeta>
                  </ProjectCardInner>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          )}
        </MyProjectsContent>
      </MyProjectsContainer>
    </MyProjectsPage>
  );
};

export default MyProjects;
