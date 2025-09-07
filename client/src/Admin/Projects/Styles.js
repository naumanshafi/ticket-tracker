import styled from 'styled-components';

export const AdminProjectsPage = styled.div`
  display: flex;
  height: 100vh;
  background: #f4f5f7;
`;

export const AdminProjectsContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const AdminProjectsContent = styled.div`
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
  margin: 0;
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

export const ProjectCard = styled.div`
  background: white;
  border: 1px solid #e4e6ea;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #0052cc;
  }
`;

export const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const ProjectName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #172b4d;
  margin: 0;
  flex: 1;
  margin-right: 12px;
`;

export const ProjectDescription = styled.p`
  color: #5e6c84;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f4f5f7;
`;

export const ProjectOwner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProjectStats = styled.div`
  display: flex;
  gap: 16px;
`;

export const ProjectActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NoProjects = styled.div`
  text-align: center;
  padding: 64px 32px;
  color: #5e6c84;

  h2 {
    color: #172b4d;
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    margin: 0;
  }
`;
