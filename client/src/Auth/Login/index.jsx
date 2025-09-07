import React, { useState, useEffect, useRef } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import toast from 'shared/utils/toast';
import api from 'shared/utils/api';
import { storeAuthToken } from 'shared/utils/authToken';
import { config } from 'shared/constants/config';
import { Icon } from 'shared/components';

import {
  LoginPage,
  LoginBox,
  Title,
  Logo,
  GoogleLoginWrapper,
  ErrorMessage,
  ErrorContainer
} from './Styles';

const Login = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!isMountedRef.current) return;
      setIsLoading(true);
      setError('');
      
      const decoded = jwt_decode(credentialResponse.credential);
      
      const response = await api.post('/auth/google', {
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        googleId: decoded.sub
      });

      if (!isMountedRef.current) return;
      storeAuthToken(response.token);
      history.push('/');
      toast.success('Successfully logged in!');
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Login error:', err);
      
      // Handle different error formats
      let errorMessage = 'Failed to login with Google';
      
      if (err && typeof err === 'object') {
        if (err.status === 403) {
          errorMessage = 'Access denied. You are not authorized to access this application. Please contact an administrator to be added as a project member.';
        } else if (err.message && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if (err.message && typeof err.message === 'object') {
          // Handle nested error objects
          if (err.message.message) {
            errorMessage = err.message.message;
          } else if (err.message.detail) {
            errorMessage = err.message.detail;
          } else {
            errorMessage = 'Authentication failed. Please try again.';
          }
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        } else if (err.detail) {
          errorMessage = err.detail;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. This may be due to OAuth configuration issues.');
    toast.error('Google login failed');
  };


  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <LoginPage>
        <LoginBox>
          <Logo size={48} />
          <Title>Sign in to Ticket Tracker</Title>
          
          {error && (
            <ErrorContainer>
              <Icon type="close" size={24} />
              <ErrorMessage>{error}</ErrorMessage>
            </ErrorContainer>
          )}

          <GoogleLoginWrapper>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              size="large"
              theme="outline"
            />
          </GoogleLoginWrapper>

          {/* Development Login Options - Only show if Google OAuth fails */}
        </LoginBox>
      </LoginPage>
    </GoogleOAuthProvider>
  );
};

export default Login;
