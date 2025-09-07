import React from 'react';
import { Modal, Button } from 'shared/components';
import { removeStoredAuthToken } from 'shared/utils/authToken';

const LogoutModal = ({ isOpen, onClose, userType = 'user' }) => {
  const handleLogout = () => {
    console.log('Logging out...');
    removeStoredAuthToken();
    localStorage.clear();
    onClose();
    window.location.href = '/authenticate';
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      renderContent={modal => (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 32px rgba(255, 71, 87, 0.3)'
          }}>
            <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#172b4d',
            margin: '0 0 12px 0'
          }}>
            Logout Confirmation
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b778c',
            margin: '0 0 32px 0'
          }}>
            Are you sure you want to logout from the {userType === 'admin' ? 'admin panel' : 'application'}?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)'
              }}
            >
              Yes, Logout
            </Button>
            <Button
              variant="empty"
              onClick={onClose}
              style={{
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b778c',
                border: '1px solid #dfe1e6'
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    />
  );
};

export default LogoutModal;
