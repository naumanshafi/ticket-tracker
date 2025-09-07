import styled from 'styled-components';
import { Button } from 'shared/components';

export const MembersPage = styled.div`
  padding: 24px;
  background: #f4f5f7;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8eaed;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  letter-spacing: -0.3px;
`;

export const AddButton = styled(Button)`
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  transition: all 0.2s ease;
  letter-spacing: 0.2px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
  
  svg {
    margin-right: 6px;
  }
`;

export const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MemberCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #667eea;
  }
`;

export const MemberInfo = styled.div`
  flex: 1;
  margin-left: 16px;
`;

export const MemberName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
  letter-spacing: -0.2px;
`;

export const MemberEmail = styled.div`
  font-size: 13px;
  color: #718096;
  font-weight: 400;
`;

export const MemberRole = styled.div`
  margin-right: 20px;
  
  span {
    font-size: 12px;
    color: #0052cc;
    text-transform: uppercase;
    font-weight: 700;
    background: linear-gradient(135deg, #deebff 0%, #e8f2ff 100%);
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid #b3d4ff;
    letter-spacing: 0.5px;
  }
`;

export const MemberActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const NoMembers = styled.div`
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
