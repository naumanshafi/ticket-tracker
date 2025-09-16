import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'shared/utils/api';
import { PageLoader, Avatar, Button, DeleteModal } from 'shared/components';
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
} from 'shared/components/MyProjects/Styles';

const AdminProjects = () => {
  const history = useHistory();
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Only check access and fetch data after user is loaded
    if (isLoadingUser) return;
    
    // Check if user is admin
    if (currentUser && currentUser.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      history.push('/');
      return;
    }
    
    if (currentUser) {
      fetchAllProjects();
    }
  }, [currentUser, isLoadingUser, history]);

  const fetchAllProjects = async () => {
    try {
      const response = await api.get('/admin/projects');
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

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      setIsDeleting(true);
      await api.delete(`/projects/${projectToDelete.id}`);
      toast.success('Project deleted successfully');
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchAllProjects(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (project, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Prevent card click
    }
    console.log('Opening delete modal for project:', project.name);
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };


  // Show loading while user data is being fetched
  if (isLoadingUser) {
    return <PageLoader />;
  }

  // Check admin access only after user data is loaded
  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  // Show loading while projects are being fetched
  if (isLoading) return <PageLoader />;

  return (
    <MyProjectsPage>
      <MyProjectsContainer>
        <AdminSidebar />
        <MyProjectsContent>
          <Header>
            <HeaderContent>
              <div>
                <Title>All Projects ({projects.length})</Title>
                <p style={{ color: '#5e6c84', fontSize: '14px', margin: '8px 0 0 0' }}>
                  Manage all projects in the system
                </p>
              </div>
            </HeaderContent>
          </Header>

          {projects.length === 0 ? (
            <NoProjects>
              <EmptyStateIcon>📂</EmptyStateIcon>
              <EmptyStateTitle>No projects found</EmptyStateTitle>
              <EmptyStateDescription>
                No projects have been created yet
              </EmptyStateDescription>
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
                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDeleteModal(project, e);
                          }}
                          style={{
                            padding: '6px',
                            background: 'rgba(255, 71, 87, 0.1)',
                            border: '1px solid rgba(255, 71, 87, 0.3)',
                            borderRadius: '6px',
                            color: '#ff4757',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px'
                          }}
                          title="Delete Project"
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 71, 87, 0.2)';
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 71, 87, 0.1)';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          🗑️
                        </button>
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

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete"
        itemName={projectToDelete?.name}
        isLoading={isDeleting}
        confirmText="Delete Project"
        type="project"
      />
    </MyProjectsPage>
  );
};

export default AdminProjects;
