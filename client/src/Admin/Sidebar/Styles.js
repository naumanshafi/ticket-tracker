import styled from 'styled-components';

export const Sidebar = styled.div`
  position: relative;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 230px;
  min-height: 100vh;
  background: #0747a6;
  padding: 0 16px 24px;
`;

export const ProjectInfo = styled.div`
  display: flex;
  padding: 24px 4px;
`;

export const ProjectTexts = styled.div`
  padding: 3px 0 0 10px;
`;

export const ProjectName = styled.div`
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
`;

export const ProjectCategory = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.3;
  margin-top: 3px;
`;

export const LinkItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 3px;
  transition: background 0.1s;
  cursor: pointer;
  color: #deebff;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  i {
    margin-right: 15px;
    font-size: 20px;
    flex-shrink: 0;
  }
`;

export const LinkText = styled.div`
  padding-top: 2px;
  font-size: 14.5px;
  font-weight: 500;
`;

export const Divider = styled.div`
  margin-top: 17px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;
