import styled from 'styled-components';
import { Logo as SharedLogo } from 'shared/components';

export const LoginPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
    opacity: 0.3;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(1deg); }
    66% { transform: translateY(10px) rotate(-1deg); }
  }
`;

export const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 48px;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const Logo = styled(SharedLogo)`
  margin: 0 auto 24px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #172b4d;
  margin-bottom: 32px;
  line-height: 1.2;
`;

export const Divider = styled.div`
  margin: 24px 0;
  text-align: center;
  position: relative;
  color: #5e6c84;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #dfe1e6;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

export const Form = styled.form`
  text-align: left;
`;

export const FormField = styled.div`
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #172b4d;
  margin-bottom: 8px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 2px solid #dfe1e6;
  border-radius: 3px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #0052cc;
  }

  &:disabled {
    background: #f4f5f7;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: #0052cc;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #0065ff;
  }

  &:disabled {
    background: #091e42;
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GoogleLoginWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  > div {
    width: 100% !important;
  }

  iframe {
    border-radius: 8px !important;
  }
`;

export const ErrorContainer = styled.div`
  background: #ffebe6;
  border: 1px solid #ffbdad;
  color: #de350b;
  padding: 12px;
  border-radius: 3px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ErrorMessage = styled.div`
  color: inherit;
  font-size: inherit;
  line-height: 1.4;
`;

export const AdminNote = styled.div`
  margin-top: 24px;
  text-align: center;
  color: #5e6c84;
  font-size: 13px;
  line-height: 1.5;
`;

export const LoginOptions = styled.div`
  margin-top: 20px;
  text-align: center;

  button {
    background: none;
    border: none;
    color: #0052cc;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    padding: 8px 16px;
    transition: color 0.2s;

    &:hover {
      color: #0065ff;
    }
  }
`;
