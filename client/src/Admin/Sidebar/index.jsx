import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
  LinkItem,
  LinkText,
  Divider,
} from './Styles';

const AdminSidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const { currentUser } = useCurrentUser();
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);


  const handleCreateProject = async (values) => {
    try {
      setIsCreating(true);
      await api.post('/projects', values);
      toast.success('Project created successfully');
      setCreateProjectModalOpen(false);
      // Refresh the page or navigate to projects
      if (location.pathname === '/admin/projects') {
        window.location.reload();
      } else {
        history.push('/admin/projects');
      }
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar>
      <ProjectInfo>
        <ProjectAvatar name="Admin Panel" />
        <ProjectTexts>
          <ProjectName>Admin Panel</ProjectName>
          <ProjectCategory>System Administration</ProjectCategory>
        </ProjectTexts>
      </ProjectInfo>

      <LinkItem 
        as="div" 
        onClick={() => history.push('/admin/projects')} 
        style={{ 
          cursor: 'pointer',
          background: isActive('/admin/projects') ? '#deebff' : 'transparent',
          color: isActive('/admin/projects') ? '#0052cc' : '#5e6c84'
        }}
      >
        <Icon type="component" />
        <LinkText>All Projects</LinkText>
      </LinkItem>

      <LinkItem 
        as="div" 
        onClick={() => history.push('/admin/users')} 
        style={{ 
          cursor: 'pointer',
          background: isActive('/admin/users') ? '#deebff' : 'transparent',
          color: isActive('/admin/users') ? '#0052cc' : '#5e6c84'
        }}
      >
        <Icon type="users" />
        <LinkText>Manage Users</LinkText>
      </LinkItem>

      <LinkItem 
        as="div" 
        onClick={() => setCreateProjectModalOpen(true)} 
        style={{ cursor: 'pointer' }}
      >
        <Icon type="plus" />
        <LinkText>Create Project</LinkText>
      </LinkItem>

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

      {createProjectModalOpen && (
        <Modal
          isOpen
          testId="modal:create-project"
          width={600}
          onClose={() => setCreateProjectModalOpen(false)}
          renderContent={modal => (
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }} />

              {/* Header Section */}

              {/* Form Section */}
              <div style={{
                background: 'white',
                borderRadius: '16px 16px 0 0',
                padding: '40px',
                position: 'relative',
                zIndex: 2
              }}>
                <Form
                  enableReinitialize
                  initialValues={{
                    name: '',
                    description: '',
                    category: 'software'
                  }}
                  validations={{
                    name: [Form.is.required(), Form.is.maxLength(100)],
                    description: [Form.is.maxLength(500)]
                  }}
                  onSubmit={async (values, form) => {
                    await handleCreateProject(values);
                    form.reset();
                  }}
                >
                  <Form.Element>
                    {/* Form Fields */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '18px',
                          marginRight: '8px'
                        }}>📝</span>
                        <label style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#172b4d'
                        }}>
                          Project Name *
                        </label>
                      </div>
                      <Form.Field.Input
                        name="name"
                        placeholder="e.g., Mobile App Redesign, Website Overhaul"
                        style={{
                          fontSize: '15px',
                          padding: '16px 20px',
                          borderRadius: '12px',
                          border: '2px solid #f1f2f4',
                          background: '#fafbfc',
                          transition: 'all 0.3s ease',
                          fontWeight: '500',
                          width: '100%',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                          '&:focus': {
                            borderColor: '#667eea',
                            background: 'white',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                          }
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '18px',
                          marginRight: '8px'
                        }}>📄</span>
                        <label style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#172b4d'
                        }}>
                          Description (Optional)
                        </label>
                      </div>
                      <Form.Field.Textarea
                        name="description"
                        placeholder="Describe your project's goals, scope, and key objectives..."
                        style={{
                          fontSize: '14px',
                          padding: '16px 20px',
                          borderRadius: '12px',
                          border: '2px solid #f1f2f4',
                          background: '#fafbfc',
                          transition: 'all 0.3s ease',
                          fontWeight: '500',
                          minHeight: '100px',
                          resize: 'vertical',
                          width: '100%',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '18px',
                          marginRight: '8px'
                        }}>🏷️</span>
                        <label style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#172b4d'
                        }}>
                          Project Category
                        </label>
                      </div>
                      <Form.Field.Select
                        name="category"
                        options={[
                          { value: 'software', label: '💻 Software Development' },
                          { value: 'marketing', label: '📈 Marketing & Growth' },
                          { value: 'business', label: '💼 Business Operations' },
                          { value: 'design', label: '🎨 Design & Creative' },
                          { value: 'research', label: '🔬 Research & Analysis' },
                          { value: 'product', label: '🚀 Product Development' }
                        ]}
                        style={{
                          fontSize: '14px',
                          padding: '16px 20px',
                          borderRadius: '12px',
                          border: '2px solid #f1f2f4',
                          background: '#fafbfc',
                          transition: 'all 0.3s ease',
                          fontWeight: '500',
                          width: '100%',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                        }}
                      />
                    </div>

                    {/* Success Preview */}
                    <div style={{
                      background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9ff 100%)',
                      border: '2px solid #10b981',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '32px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '20px',
                        background: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#10b981',
                        border: '2px solid #10b981'
                      }}>
                        READY TO LAUNCH
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <span style={{ fontSize: '20px' }}>⚡</span>
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#065f46',
                            margin: '0 0 4px 0'
                          }}>
                            Your Project Will Be Ready Instantly!
                          </h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#047857',
                            margin: 0
                          }}>
                            Everything you need to start collaborating with your team
                          </p>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          color: '#047857',
                          fontWeight: '500'
                        }}>
                          <span style={{ marginRight: '8px' }}>✅</span>
                          Dedicated workspace
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          color: '#047857',
                          fontWeight: '500'
                        }}>
                          <span style={{ marginRight: '8px' }}>✅</span>
                          Owner permissions
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          color: '#047857',
                          fontWeight: '500'
                        }}>
                          <span style={{ marginRight: '8px' }}>✅</span>
                          Team collaboration
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          color: '#047857',
                          fontWeight: '500'
                        }}>
                          <span style={{ marginRight: '8px' }}>✅</span>
                          Task management
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      flexDirection: 'column'
                    }}>
                      <Button
                        type="submit"
                        variant="primary"
                        isWorking={isCreating}
                        style={{
                          background: isCreating 
                            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px 32px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          boxShadow: isCreating 
                            ? 'none'
                            : '0 8px 25px rgba(102, 126, 234, 0.4)',
                          transition: 'all 0.3s ease',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {isCreating ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              marginRight: '12px'
                            }} />
                            Creating your project...
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{ marginRight: '12px', fontSize: '20px' }}>🚀</span>
                            Create Project
                          </div>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="empty"
                        onClick={modal.close}
                        style={{
                          borderRadius: '12px',
                          padding: '14px 32px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#6b778c',
                          border: '2px solid #e5e7eb',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          width: '100%'
                        }}
                      >
                        Maybe Later
                      </Button>
                    </div>
                  </Form.Element>
                </Form>
              </div>
            </div>
          )}
        />
      )}

      <LogoutModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        userType="admin"
      />
    </Sidebar>
  );
};

export default AdminSidebar;
