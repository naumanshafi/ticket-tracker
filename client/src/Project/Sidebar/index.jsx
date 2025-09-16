import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';

import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon, ProjectAvatar, Modal, Form, Button, LogoutModal } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';

import {
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  Divider,
  LinkItem,
  LinkText,
  NotImplemented,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectSidebar = ({ project }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const { currentUser } = useCurrentUser();

  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);


  const handleCreateProject = async (values) => {
    try {
      setIsCreating(true);
      const response = await api.post('/projects', values);
      toast.success('Project created successfully');
      setCreateProjectModalOpen(false);
      history.push(`/project/${response.project.id}/board`);
    } catch (error) {
      toast.error(error.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };


  const renderProjectsItem = () => (
    <>
      <LinkItem as="div" onClick={() => history.push('/projects')} style={{ cursor: 'pointer' }}>
        <Icon type="component" />
        <LinkText>Switch Project</LinkText>
      </LinkItem>
      {currentUser?.role === 'admin' && (
        <LinkItem as="div" onClick={() => setCreateProjectModalOpen(true)} style={{ cursor: 'pointer' }}>
          <Icon type="plus" />
          <LinkText>Create Project</LinkText>
        </LinkItem>
      )}
    </>
  );

  return (
    <>
      <Sidebar>
        <ProjectInfo>
          <ProjectAvatar />
          <ProjectTexts>
            <ProjectName>{project.name}</ProjectName>
            <ProjectCategory>{ProjectCategoryCopy[project.category]} project</ProjectCategory>
          </ProjectTexts>
        </ProjectInfo>

        {renderLinkItem(match, 'Kanban Board', 'board', '/board')}
        
        {/* All Projects button for regular users */}
        {currentUser && currentUser.role !== 'admin' && (
          <LinkItem 
            as="div" 
            onClick={() => history.push('/projects')} 
            style={{ cursor: 'pointer' }}
          >
            <Icon type="component" />
            <LinkText>All Projects</LinkText>
          </LinkItem>
        )}
        
        {/* Admin-only sections */}
        {currentUser && currentUser.role === 'admin' && renderLinkItem(match, 'Project Settings', 'settings', '/settings')}
        {currentUser && currentUser.role === 'admin' && renderLinkItem(match, 'Team Members', 'users', '/members')}
        {currentUser && currentUser.role === 'admin' && (
          <LinkItem 
            as="div" 
            onClick={() => history.push('/admin/projects')} 
            style={{ cursor: 'pointer' }}
          >
            <Icon type="component" />
            <LinkText>Admin</LinkText>
          </LinkItem>
        )}
        <div style={{ flex: 1 }} />
        <Divider />
        <LinkItem 
          as="div" 
          onClick={() => setLogoutConfirmOpen(true)} 
          style={{ cursor: 'pointer', marginTop: 'auto' }}
        >
          <Icon type="close" />
          <LinkText>Logout</LinkText>
        </LinkItem>
      </Sidebar>

      {createProjectModalOpen && (
        <Modal
          isOpen
          testId="modal:create-project"
          width={600}
          onClose={() => setCreateProjectModalOpen(false)}
          renderContent={modal => (
            <div style={{ padding: '32px', background: 'white', borderRadius: '12px' }}>


              <Form
                enableReinitialize
                initialValues={{
                  name: '',
                  description: '',
                  category: 'software'
                }}
                validations={{
                  name: [Form.is.required(), Form.is.maxLength(100)],
                  description: Form.is.maxLength(1000)
                }}
                onSubmit={async (values, form) => {
                  await handleCreateProject(values);
                  form.reset();
                }}
              >
                <Form.Element>
                  <div style={{ marginBottom: '20px' }}>
                    <Form.Field.Input
                      name="name"
                      label="Project Name"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <Form.Field.Textarea
                      name="description"
                      label="Description (optional)"
                      placeholder="Describe your project"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '32px' }}>
                    <Form.Field.Select
                      name="category"
                      label="Category"
                      options={[
                        { value: 'software', label: '💻 Software' },
                        { value: 'marketing', label: '📈 Marketing' },
                        { value: 'business', label: '💼 Business' }
                      ]}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button 
                      type="button" 
                      variant="empty" 
                      onClick={modal.close}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#5e6c84',
                        border: '1px solid #dfe1e6'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      isWorking={isCreating}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      Create Project
                    </Button>
                  </div>
                </Form.Element>
              </Form>
            </div>
          )}
        />
      )}
      
      <LogoutModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        userType="user"
      />
    </>
  );
};

const renderLinkItem = (match, text, iconType, path) => {
  const isImplemented = !!path;

  const linkItemProps = isImplemented
    ? { as: NavLink, exact: true, to: `${match.url}${path}` }
    : { as: 'div' };

  return (
    <LinkItem {...linkItemProps}>
      <Icon type={iconType} />
      <LinkText>{text}</LinkText>
      {!isImplemented && <NotImplemented>Not implemented</NotImplemented>}
    </LinkItem>
  );
};

ProjectSidebar.propTypes = propTypes;

export default ProjectSidebar;
