import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

export const ProjectsPage = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: ${color.backgroundLightest};
`;

export const ProjectsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

export const ProjectsSidebar = styled.div`
  position: relative;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 230px;
  min-height: 100vh;
  background: #0747a6;
  padding: 0 16px 24px;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 4px;
`;

export const SidebarTitle = styled.div`
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
`;

export const SidebarSubtitle = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.3;
  margin-top: 3px;
`;

export const SidebarNavItem = styled.div`
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

export const SidebarNavText = styled.div`
  padding-top: 2px;
  font-size: 14.5px;
  font-weight: 500;
`;

export const SidebarDivider = styled.div`
  margin-top: 17px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

export const ProjectsContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  ${font.size(28)}
  ${font.medium}
  color: ${color.textDarkest};
  margin: 0 0 8px 0;
`;

export const Subtitle = styled.p`
  ${font.size(16)}
  color: ${color.textMedium};
  margin: 0;
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

export const ProjectCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  ${mixin.boxShadowMedium}
  
  &:hover {
    border-color: ${color.primary};
    transform: translateY(-2px);
    ${mixin.boxShadowDropdown}
  }
`;

export const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const ProjectName = styled.h3`
  ${font.size(18)}
  ${font.medium}
  color: ${color.textDarkest};
  margin: 0;
  ${mixin.truncateText}
`;

export const ProjectCategory = styled.div`
  ${font.size(12)}
  color: ${color.textMedium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
`;

export const ProjectDescription = styled.p`
  ${font.size(14)}
  color: ${color.textDark};
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProjectMeta = styled.div`
  ${font.size(12)}
  color: ${color.textLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProjectRole = styled.span`
  ${font.size(12)}
  ${font.medium}
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  background: ${color.backgroundLight};
  border-radius: 4px;
  flex-shrink: 0;
`;

export const NoProjects = styled.div`
  text-align: center;
  padding: 80px 40px;
  
  h2 {
    ${font.size(24)}
    ${font.medium}
    color: ${color.textDark};
    margin: 0 0 12px 0;
  }
  
  p {
    ${font.size(16)}
    color: ${color.textMedium};
    line-height: 1.5;
    margin: 8px 0;
  }
`;
