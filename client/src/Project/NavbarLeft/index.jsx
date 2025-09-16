import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';

import { NavLeft, LogoLink, StyledLogo, Bottom, Item, ItemText } from './Styles';

const propTypes = {
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
};

const ProjectNavbarLeft = ({ issueSearchModalOpen, issueCreateModalOpen }) => {
  const { currentUser } = useCurrentUser();
  
  // Determine navigation path based on user role
  const logoNavigationPath = currentUser?.role === 'admin' ? '/admin/my-projects' : '/user/my-projects';
  
  return (
    <NavLeft>
      <LogoLink to={logoNavigationPath}>
        <StyledLogo color="#fff" />
      </LogoLink>

    <Item onClick={issueSearchModalOpen}>
      <Icon type="search" size={22} top={1} left={3} />
      <ItemText>Search issues</ItemText>
    </Item>

    <Item onClick={issueCreateModalOpen}>
      <Icon type="plus" size={27} />
      <ItemText>Create Issue</ItemText>
    </Item>

    <Bottom>
    </Bottom>
  </NavLeft>
  );
};

ProjectNavbarLeft.propTypes = propTypes;

export default ProjectNavbarLeft;
