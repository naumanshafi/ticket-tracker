import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

export const MyProjectsPage = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

export const MyProjectsContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const MyProjectsContent = styled.div`
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Title = styled.h1`
  ${font.size(24)}
  ${font.medium}
  color: ${color.textDarkest};
  margin: 0;
`;

export const Subtitle = styled.p`
  ${font.size(16)}
  color: ${color.textMedium};
  margin: 0;
  line-height: 1.5;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const CreateProjectButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  ${font.size(14)}
  ${font.medium}
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ProjectCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(102, 126, 234, 0.2);
  }
`;

export const ProjectCardInner = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
`;

export const ProjectName = styled.h3`
  ${font.size(15)}
  ${font.bold}
  color: ${color.textDarkest};
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

export const ProjectDescription = styled.p`
  ${font.size(14)}
  color: ${color.textMedium};
  margin: 0 0 20px 0;
  line-height: 1.5;
  flex: 1;
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
  border-top: 1px solid ${color.backgroundLight};
  margin-top: auto;
`;

export const ProjectOwner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProjectStats = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

export const ProjectBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  ${font.size(11)}
  ${font.medium}
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  ${props => {
    if (props.role) {
      return props.role === 'owner' 
        ? `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        `
        : `
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        `;
    }
    
    // Category badges
    switch (props.category) {
      case 'software':
        return `
          background: linear-gradient(135deg, #0052cc 0%, #0747a6 100%);
          color: white;
        `;
      case 'marketing':
        return `
          background: linear-gradient(135deg, #ff5630 0%, #de350b 100%);
          color: white;
        `;
      case 'business':
        return `
          background: linear-gradient(135deg, #00875a 0%, #006644 100%);
          color: white;
        `;
      case 'design':
        return `
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        `;
      case 'research':
        return `
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        `;
      case 'product':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        `;
      default:
        return `
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
        `;
    }
  }}
`;

export const NoProjects = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

export const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.6;
`;

export const EmptyStateTitle = styled.h2`
  ${font.size(24)}
  ${font.medium}
  color: ${color.textDarkest};
  margin: 0 0 12px 0;
`;

export const EmptyStateDescription = styled.p`
  ${font.size(16)}
  color: ${color.textMedium};
  margin: 0;
  line-height: 1.6;
  max-width: 400px;
`;
