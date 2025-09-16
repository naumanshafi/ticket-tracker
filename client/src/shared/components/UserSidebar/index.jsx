import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Icon, ProjectAvatar, LogoutModal } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';

import {
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  LinkItem,
  LinkText,
  Divider,
} from './Styles';

const UserSidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const { currentUser } = useCurrentUser();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar>
      <ProjectInfo 
        style={{ cursor: 'pointer' }}
        onClick={() => history.push('/user/my-projects')}
      >
        <ProjectAvatar name={currentUser?.name || "User"} />
        <ProjectTexts>
          <ProjectName>{currentUser?.name || "User Dashboard"}</ProjectName>
          <ProjectCategory>My Workspace</ProjectCategory>
        </ProjectTexts>
      </ProjectInfo>

      <LinkItem 
        onClick={() => history.push('/user/my-projects')} 
        style={{ 
          background: isActive('/user/my-projects') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          color: isActive('/user/my-projects') ? '#ffffff' : '#deebff'
        }}
      >
        <Icon type="component" />
        <LinkText>My Projects</LinkText>
      </LinkItem>

      <div style={{ flex: 1 }} />
      <Divider />
      <LinkItem 
        onClick={() => setLogoutConfirmOpen(true)}
        style={{ color: '#deebff' }}
      >
        <Icon type="close" />
        <LinkText>Logout</LinkText>
      </LinkItem>

      <LogoutModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        userType="user"
      />
    </Sidebar>
  );
};

export default UserSidebar;
