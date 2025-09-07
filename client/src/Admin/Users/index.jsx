import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'shared/utils/api';
import { Button, Modal, Form, Avatar, PageLoader, DeleteModal } from 'shared/components';
import AdminSidebar from 'Admin/Sidebar';
import toast from 'shared/utils/toast';
import useCurrentUser from 'shared/hooks/currentUser';

import {
  UsersPage,
  UsersContainer,
  UsersContent,
  Header,
  Title,
  UsersList,
  UserCard,
  UserInfo,
  UserName,
  UserEmail,
  UserRole,
  UserMeta,
  AddButton,
  NoUsers
} from './Styles';

const AdminUsers = () => {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    console.log('AdminUsers useEffect - currentUser:', currentUser);
    if (currentUser) {
      console.log('Current user role:', currentUser.role);
      if (currentUser.role === 'admin') {
        console.log('User is admin, fetching users...');
        fetchUsers();
      } else {
        console.log('User is not admin, role:', currentUser.role);
        // Try to fetch anyway for debugging
        console.log('Trying to fetch users anyway for debugging...');
        fetchUsers();
      }
    } else {
      console.log('No current user, but trying to fetch users for debugging...');
      // Try to fetch anyway for debugging
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      console.log('Current user:', currentUser);
      console.log('Auth token:', localStorage.getItem('authToken'));
      
      const response = await api.get('/users');
      console.log('Fetched users response:', response);
      
      if (response && response.users) {
        console.log('Setting users:', response.users);
        setUsers(response.users);
      } else {
        console.log('No users in response, setting empty array');
        setUsers([]);
      }
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', error.response?.data);
      console.error('Full error:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (values) => {
    try {
      setIsAdding(true);
      console.log('Creating user with values:', values);
      const response = await api.post('/users', values);
      console.log('User creation response:', response);
      toast.success('User created successfully');
      setAddModalOpen(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error creating user:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create user';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      await api.put(`/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const openDeleteModal = (user) => {
    if (user.id === currentUser.id) {
      toast.error('You cannot delete yourself');
      return;
    }
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeletingUserId(userToDelete.id);
      await api.delete(`/users/${userToDelete.id}`);
      toast.success('User deleted successfully');
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    } finally {
      setDeletingUserId(null);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <UsersPage>
        <Title>Access Denied</Title>
        <p>Only administrators can access this page.</p>
      </UsersPage>
    );
  }

  if (isLoading) return <PageLoader />;

  return (
    <UsersPage>
      <UsersContainer>
        <AdminSidebar />
        <UsersContent>
          <Header>
            <div>
              <Title>User Management ({users?.length || 0})</Title>
              <p style={{ color: '#5e6c84', fontSize: '14px', margin: '8px 0 0 0' }}>
                Manage system users and their roles
              </p>
            </div>
            <AddButton
              icon="plus"
              onClick={() => setAddModalOpen(true)}
            >
              Add User
            </AddButton>
          </Header>

      {users.length === 0 ? (
        <NoUsers>
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e4e6ea'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>
              👥
            </div>
            <h2 style={{ 
              color: '#172b4d', 
              fontSize: '24px', 
              fontWeight: '600', 
              margin: '0 0 12px 0' 
            }}>
              No users yet
            </h2>
            <p style={{ 
              color: '#5e6c84', 
              fontSize: '16px', 
              margin: '0 0 32px 0' 
            }}>
              Add users to get started with your team
            </p>
            <Button
              variant="primary"
              onClick={() => setAddModalOpen(true)}
            >
              Add First User
            </Button>
          </div>
        </NoUsers>
      ) : (
        <UsersList>
          {users.map(user => (
            <UserCard key={user.id}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  size={56}
                />
                {user.id === currentUser?.id && (
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    background: '#00875a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'white',
                    border: '2px solid white'
                  }}>
                    ✓
                  </div>
                )}
              </div>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
                <UserMeta>
                  {user.lastLogin ? (
                    <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                  ) : (
                    <span>Never logged in</span>
                  )}
                </UserMeta>
              </UserInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <UserRole role={user.role}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </UserRole>
                {user.id !== currentUser?.id && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant={user.role === 'admin' ? 'secondary' : 'primary'}
                      size="small"
                      onClick={() => handleUpdateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      isWorking={updatingUserId === user.id}
                      disabled={updatingUserId === user.id}
                    >
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => openDeleteModal(user)}
                      isWorking={deletingUserId === user.id}
                      disabled={deletingUserId === user.id}
                    >
                      Delete
                    </Button>
                  </div>
                )}
                {user.id === currentUser?.id && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: '#e3f2fd',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#1976d2'
                  }}>
                    <span>✨</span>
                    <span>You</span>
                  </div>
                )}
              </div>
            </UserCard>
          ))}
        </UsersList>
      )}

      {addModalOpen && (
        <Modal
          isOpen
          testId="modal:add-user"
          onClose={() => setAddModalOpen(false)}
          renderContent={modal => (
            <div style={{
              padding: '32px',
              background: 'white',
              borderRadius: '16px',
              maxWidth: '570px',
              width: '100%'
            }}>
              <div style={{ 
                textAlign: 'center',
                marginBottom: '32px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '24px'
                }}>
                  👤
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#172b4d',
                  margin: '0 0 8px 0'
                }}>
                  Add New User
                </h2>
                <p style={{
                  color: '#5e6c84',
                  fontSize: '14px',
                  margin: '0'
                }}>
                  Add a new team member to your organization
                </p>
              </div>

              <Form
                enableReinitialize
                initialValues={{
                  email: '',
                  role: 'user'
                }}
                validations={{
                  email: [Form.is.required(), Form.is.email()]
                }}
                onSubmit={async (values, form) => {
                  await handleAddUser(values);
                  form.reset();
                }}
              >
                <Form.Element>
                  <div style={{ marginBottom: '24px' }}>
                    <Form.Field.Input
                      name="email"
                      label="Email Address"
                      placeholder="Enter user's work email"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '2px solid #e4e6ea',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease',
                        '&:focus': {
                          borderColor: '#0052cc',
                          outline: 'none'
                        }
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '32px' }}>
                    <Form.Field.Select
                      name="role"
                      label="User Role"
                      options={[
                        { value: 'user', label: '👤 User - Standard access' },
                        { value: 'admin', label: '👑 Admin - Full access' }
                      ]}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '2px solid #e4e6ea',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '16px' }}>💡</span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#2d3748'
                      }}>
                        What happens next?
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#4a5568',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      The user will be created and can log in using Google OAuth with this email address.
                    </p>
                  </div>

                  <Form.Actions style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                  }}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={modal.close}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isWorking={isAdding}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      {isAdding ? 'Creating...' : 'Create User'}
                    </Button>
                  </Form.Actions>
                </Form.Element>
              </Form>
            </div>
          )}
        />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete"
        itemName={userToDelete?.name}
        isLoading={deletingUserId === userToDelete?.id}
        confirmText="Delete User"
        type="user"
      />
        </UsersContent>
      </UsersContainer>
    </UsersPage>
  );
};

export default AdminUsers;
