import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from 'shared/components';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func
};

const AccessDeniedModal = ({ 
  isOpen, 
  onClose, 
  title = "Access Denied",
  message = "You do not have access to any projects. Please contact an administrator.",
  onConfirm
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={500}
      renderContent={() => (
        <div style={{
          textAlign: 'center',
          padding: '40px 32px 32px'
        }}>
          {/* Header with Icon */}
          <div style={{
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
            }}>
              <svg width="36" height="36" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#172b4d',
              margin: '0 0 12px 0'
            }}>
              {title}
            </h2>
          </div>

          {/* Message */}
          <div style={{
            marginBottom: '32px'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#6b778c',
              lineHeight: '1.5',
              margin: '0 0 20px 0'
            }}>
              {message}
            </p>
            
            <div style={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              margin: '20px 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                color: '#dc2626'
              }}>
                <span style={{ marginRight: '8px', fontSize: '16px' }}>⚠️</span>
                <strong>What you can do:</strong>
              </div>
              <ul style={{
                margin: '8px 0 0 24px',
                padding: 0,
                fontSize: '14px',
                color: '#dc2626',
                textAlign: 'left'
              }}>
                <li>Contact your system administrator</li>
                <li>Request access to a project</li>
                <li>Try logging in with a different account</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <Button
              variant="primary"
              onClick={handleConfirm}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              🔐 Back to Login
            </Button>
          </div>
        </div>
      )}
    />
  );
};

AccessDeniedModal.propTypes = propTypes;

export default AccessDeniedModal;
