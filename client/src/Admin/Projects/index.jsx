import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'shared/utils/api';
import { PageLoader, Avatar, Button, DeleteModal } from 'shared/components';
import AdminSidebar from 'Admin/Sidebar';
import toast from 'shared/utils/toast';
import useCurrentUser from 'shared/hooks/currentUser';

import {
  AdminProjectsPage,
  AdminProjectsContainer,
  AdminProjectsContent,
  Header,
  Title,
  ProjectsGrid,
  ProjectCard,
  ProjectHeader,
  ProjectName,
  ProjectDescription,
  ProjectMeta,
  ProjectOwner,
  ProjectStats,
  ProjectActions,
  NoProjects
} from './Styles';

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
    <AdminProjectsPage>
      <AdminProjectsContainer>
        <AdminSidebar />
        <AdminProjectsContent>
          <Header>
            <div>
              <Title>All Projects ({projects.length})</Title>
              <p style={{ color: '#5e6c84', fontSize: '14px', margin: '8px 0 0 0' }}>
                Manage all projects in the system
              </p>
            </div>
          </Header>

          {projects.length === 0 ? (
            <NoProjects>
              <h2>No projects found</h2>
              <p>No projects have been created yet</p>
            </NoProjects>
          ) : (
            <ProjectsGrid>
              {projects.map(project => (
                <ProjectCard key={project.id}>
                  <div 
                    onClick={() => handleProjectClick(project.id)}
                    style={{ 
                      cursor: 'pointer', 
                      flex: 1,
                      marginRight: '47px'
                    }}
                  >
                    <ProjectHeader>
                      <ProjectName>{project.name}</ProjectName>
                      <ProjectActions>
                        <div style={{
                          background: project.category === 'software' ? '#0052cc' : 
                                    project.category === 'marketing' ? '#ff5630' : '#00875a',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {project.category}
                        </div>
                      </ProjectActions>
                    </ProjectHeader>
                  </div>
                  
                  {/* Separate Delete Button */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 20
                  }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDeleteModal(project, e);
                      }}
                      style={{
                        padding: '8px',
                        background: 'rgba(255, 71, 87, 0.1)',
                        border: '1px solid rgba(255, 71, 87, 0.3)',
                        borderRadius: '8px',
                        color: '#ff4757',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px'
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
                  
                  <ProjectDescription>
                    {project.description || 'No description provided'}
                  </ProjectDescription>
                  
                  <ProjectMeta>
                    <ProjectOwner>
                      <Avatar
                        name={project.ownerName}
                        size={24}
                      />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#172b4d' }}>
                          {project.ownerName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#5e6c84' }}>
                          Owner
                        </div>
                      </div>
                    </ProjectOwner>
                    
                    <ProjectStats>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#0052cc' }}>
                          {project.memberCount}
                        </div>
                        <div style={{ fontSize: '11px', color: '#5e6c84' }}>
                          Members
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#5e6c84' }}>
                          Created
                        </div>
                        <div style={{ fontSize: '11px', color: '#172b4d' }}>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </ProjectStats>
                  </ProjectMeta>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          )}
        </AdminProjectsContent>
      </AdminProjectsContainer>

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
    </AdminProjectsPage>
  );
};

export default AdminProjects;
