import styled from 'styled-components';
import { Button } from 'shared/components';

export const UsersPage = styled.div`
  display: flex;
  height: 100vh;
  background: #f4f5f7;
`;

export const UsersContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const UsersContent = styled.div`
  flex: 1;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e4e6ea;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #172b4d;
`;

export const AddButton = styled(Button)`
  padding: 10px 16px;
`;

export const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #e4e6ea;
  border-radius: 12px;
  gap: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #0052cc;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #172b4d;
  margin-bottom: 4px;
`;

export const UserEmail = styled.div`
  font-size: 14px;
  color: #5e6c84;
`;

export const UserRole = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.role === 'admin' ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
  color: white;
  box-shadow: ${props => props.role === 'admin' ? 
    '0 2px 6px rgba(102, 126, 234, 0.25)' : 
    '0 2px 6px rgba(245, 87, 108, 0.25)'};
  border: none;
`;

export const UserMeta = styled.div`
  font-size: 12px;
  color: #6b778c;
  text-align: right;
  min-width: 150px;
`;

export const NoUsers = styled.div`
  text-align: center;
  padding: 60px;
  background: #f4f5f7;
  border-radius: 3px;

  h3 {
    font-size: 20px;
    color: #172b4d;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #5e6c84;
  }
`;
