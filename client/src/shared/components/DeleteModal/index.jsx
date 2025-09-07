import React from 'react';
import { Modal, Button } from 'shared/components';

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  isLoading = false,
  confirmText = "Delete",
  type = "user" // user, project, etc.
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'project':
        return (
          <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        );
      case 'user':
      default:
        return (
          <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        );
    }
  };

  const getWarningMessage = () => {
    switch (type) {
      case 'project':
        return "⚠️ This will permanently delete all project data, issues, and member associations. This action cannot be undone.";
      case 'user':
      default:
        return "⚠️ This will permanently delete the user and remove them from all projects. This action cannot be undone.";
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      renderContent={modal => (
        <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px' }}>
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
            {getIcon()}
          </div>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#172b4d',
            margin: '0 0 12px 0'
          }}>
            {title}
          </h2>
          
          <p style={{
            fontSize: '16px',
            color: '#6b778c',
            margin: '0 0 8px 0'
          }}>
            {message} {itemName && <strong>"{itemName}"</strong>}?
          </p>
          
          <div style={{
            background: 'rgba(255, 71, 87, 0.1)',
            border: '1px solid rgba(255, 71, 87, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            margin: '24px 0 32px 0',
            fontSize: '14px',
            color: '#ff4757',
            lineHeight: '1.5'
          }}>
            {getWarningMessage()}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={onConfirm}
              isWorking={isLoading}
              style={{
                background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)',
                minWidth: '120px'
              }}
            >
              {isLoading ? 'Deleting...' : confirmText}
            </Button>
            <Button
              variant="empty"
              onClick={onClose}
              disabled={isLoading}
              style={{
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b778c',
                border: '1px solid #dfe1e6',
                minWidth: '120px'
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

export default DeleteModal;
