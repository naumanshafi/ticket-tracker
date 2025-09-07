import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from 'shared/utils/api';
import { Button, Modal, Form, Avatar, PageLoader, Select } from 'shared/components';
import toast from 'shared/utils/toast';
import useCurrentUser from 'shared/hooks/currentUser';

import {
  MembersPage,
  Header,
  Title,
  MembersList,
  MemberCard,
  MemberInfo,
  MemberName,
  MemberEmail,
  MemberRole,
  MemberActions,
  AddButton,
  NoMembers
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectMembers = ({ project }) => {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  
  const isAdmin = currentUser && currentUser.role === 'admin';


  useEffect(() => {
    if (project && project.id) {
      fetchMembers();
    }
    return () => setIsMounted(false);
  }, [project]);

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/projects/${project.id}/users`);
      console.log('DEBUG: fetchMembers response:', response);
      if (isMounted) {
        setMembers(response.users);
        console.log('DEBUG: Members set to:', response.users);
      }
    } catch (error) {
      console.error('DEBUG: fetchMembers error:', error);
      if (isMounted) {
        toast.error('Failed to load members');
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      if (!isMounted) return;
      // Get all users
      const allUsersResponse = await api.get('/users');
      const allUsers = allUsersResponse.users || [];
      
      // Filter out users who are already members of this project
      const memberIds = members.map(member => member.id);
      const available = allUsers.filter(user => !memberIds.includes(user.id));
      
      if (isMounted) {
        setAvailableUsers(available);
      }
    } catch (error) {
      if (isMounted) {
        console.error('Error fetching available users:', error);
      }
    }
  };

  const handleAddMember = async (values) => {
    try {
      if (!isMounted) return;
      setIsAdding(true);
      
      // Find the selected user
      const selectedUser = availableUsers.find(user => user.id === parseInt(values.userId));
      if (!selectedUser) {
        toast.error('Please select a user');
        return;
      }
      
      // Send the user's email to the backend (role will be taken from their global role)
      await api.post(`/projects/${project.id}/users`, {
        email: selectedUser.email
      });
      
      if (isMounted) {
        toast.success('Member added successfully');
        setAddModalOpen(false);
        // Force refresh the members list
        setIsLoading(true);
        await fetchMembers();
      }
    } catch (error) {
      if (isMounted) {
        toast.error(error.message || 'Failed to add member');
      }
    } finally {
      if (isMounted) {
        setIsAdding(false);
      }
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToDelete) return;
    
    try {
      await api.delete(`/projects/${project.id}/users/${memberToDelete.id}`);
      toast.success('Member removed successfully');
      setDeleteConfirmOpen(false);
      setMemberToDelete(null);
      fetchMembers();
    } catch (error) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const openDeleteConfirm = (member) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const handleUpdateRole = async (userId, role) => {
    console.log('DEBUG: handleUpdateRole called with:', { userId, role, projectId: project.id });
    try {
      const response = await api.put(`/projects/${project.id}/users/${userId}/role`, { role });
      console.log('DEBUG: Role update response:', response);
      toast.success('Role updated successfully');
      
      // Force refresh the members list
      setIsLoading(true);
      await fetchMembers();
      
      // If the updated user is the current user, force refresh the page to update the top-right user info
      if (userId === currentUser?.id) {
        console.log('DEBUG: Updated current user role, refreshing page...');
        window.location.reload();
      }
    } catch (error) {
      console.error('DEBUG: Role update error:', error);
      toast.error(error.message || 'Failed to update role');
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <MembersPage>
      <Header>
        <div>
          <Title>Project Members ({members.length})</Title>
        </div>
        {currentUser?.role === 'admin' && (
                  <AddButton
                    icon="plus"
                    onClick={() => {
                      setAddModalOpen(true);
                      fetchAvailableUsers();
                    }}
                  >
                    Add Member
                  </AddButton>
        )}
      </Header>

      {members.length === 0 ? (
        <NoMembers>
          <h3>No members yet</h3>
          <p>Add team members to collaborate on this project</p>
        </NoMembers>
      ) : (
        <MembersList>
          {members.map(member => (
            <MemberCard key={member.id}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  name={member.name}
                  avatarUrl={member.avatarUrl}
                  size={56}
                />
                {member.role === 'admin' && (
                  <div style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: '18px',
                    height: '18px',
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    border: '2px solid white'
                  }}>
                    👑
                  </div>
                )}
              </div>
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberEmail>{member.email}</MemberEmail>
              </MemberInfo>
              <MemberRole>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: member.role === 'admin' ? 
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  boxShadow: member.role === 'admin' ? 
                    '0 2px 6px rgba(102, 126, 234, 0.25)' : 
                    '0 2px 6px rgba(245, 87, 108, 0.25)',
                  border: 'none'
                }}>
                  {member.role === 'admin' ? '👑 Admin' : '👤 User'}
                </div>
              </MemberRole>
              {currentUser?.role === 'admin' && member.id !== currentUser?.id && (
                <MemberActions>
                  <Button
                    icon="trash"
                    variant="empty"
                    onClick={() => openDeleteConfirm(member)}
                    style={{
                      color: '#ff4757',
                      padding: '8px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffe8e8';
                      e.currentTarget.style.borderColor = '#ff6b7a';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </MemberActions>
              )}
            </MemberCard>
          ))}
        </MembersList>
      )}

      {addModalOpen && (
        <Modal
          isOpen
          testId="modal:add-member"
          width={520}
          onClose={() => setAddModalOpen(false)}
          renderContent={modal => (
            <div style={{ 
              padding: '40px',
              background: 'white',
              borderRadius: '16px'
            }}>
              <Form
                enableReinitialize
              initialValues={{
                userId: '',
                role: 'user'
              }}
              validations={{
                userId: [Form.is.required()]
              }}
                onSubmit={async (values, form) => {
                  await handleAddMember(values);
                  form.reset();
                }}
              >
                <Form.Element>
                  <div style={{ 
                    textAlign: 'center',
                    marginBottom: '40px'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                    }}>
                      <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </div>
                    <h2 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#1a202c', 
                      fontSize: '28px', 
                      fontWeight: '700',
                      letterSpacing: '-0.8px'
                    }}>
                      Invite Team Member
                    </h2>
                    <p style={{ 
                      margin: 0, 
                      color: '#718096', 
                      fontSize: '16px',
                      lineHeight: '1.5',
                      fontWeight: '400'
                    }}>
                      Add someone to collaborate on this project
                    </p>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <Form.Field.Select
                      name="userId"
                      label="Select User"
                      placeholder="Choose a user to add"
                      options={availableUsers.map(user => ({
                        value: user.id,
                        label: `${user.name} (${user.email})`
                      }))}
                    />
                  </div>
                  

                  <div style={{
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    margin: '32px 0',
                    fontSize: '14px',
                    color: '#4a5568',
                    lineHeight: '1.6'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#2d3748', 
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>✨</span>
                      What happens when you add someone?
                    </div>
                    <div style={{ paddingLeft: '24px' }}>
                      <div style={{ marginBottom: '6px' }}>• User must already exist in the system</div>
                      <div style={{ marginBottom: '6px' }}>• They will be added with their current role</div>
                      <div>• Access granted to this project</div>
                    </div>
                  </div>

                  <Form.Actions>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={modal.close}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isWorking={isAdding}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isAdding ? (
                        <>
                          <span style={{ marginRight: '8px' }}>⏳</span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <span style={{ marginRight: '8px' }}>🚀</span>
                          Add Member
                        </>
                      )}
                    </Button>
                  </Form.Actions>
                </Form.Element>
              </Form>
            </div>
          )}
        />
      )}

      {deleteConfirmOpen && memberToDelete && (
        <Modal
          isOpen
          testId="modal:delete-member"
          width={400}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setMemberToDelete(null);
          }}
          renderContent={modal => (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#ffe8e8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid #ff6b7a'
              }}>
                🗑️
              </div>
              <h3 style={{ margin: '0 0 16px 0', color: '#172b4d', fontSize: '20px', fontWeight: '600' }}>
                Remove Team Member
              </h3>
              <p style={{ margin: '0 0 24px 0', color: '#5e6c84', fontSize: '14px' }}>
                Are you sure you want to remove <strong>{memberToDelete.name}</strong> from this project? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button
                  variant="secondary"
                  onClick={modal.close}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRemoveMember}
                  style={{
                    background: '#ff4757',
                    borderColor: '#ff4757'
                  }}
                >
                  Remove Member
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </MembersPage>
  );
};

ProjectMembers.propTypes = propTypes;

export default ProjectMembers;
