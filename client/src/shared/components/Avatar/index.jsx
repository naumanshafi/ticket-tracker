import React, { useState } from 'react';
import PropTypes from 'prop-types';

import HoverTooltip from '../HoverTooltip';
import { Image, Letter } from './Styles';

const propTypes = {
  className: PropTypes.string,
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
};

const defaultProps = {
  className: undefined,
  avatarUrl: null,
  name: '',
  size: 32,
};

const Avatar = ({ className, avatarUrl, name, size, ...otherProps }) => {
  const [imageError, setImageError] = useState(false);
  const sharedProps = {
    className,
    size,
    'data-testid': name ? `avatar:${name}` : 'avatar',
    ...otherProps,
  };

  const validAvatarUrl = avatarUrl && avatarUrl !== 'null' && avatarUrl !== 'undefined' && !imageError;

  const avatarElement = validAvatarUrl ? (
    <Image src={avatarUrl} onError={() => setImageError(true)} {...sharedProps} />
  ) : (
    <Letter color={getColorFromName(name)} {...sharedProps}>
      <span>{name ? name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase() : '?'}</span>
    </Letter>
  );

  // Only wrap with tooltip if name is provided
  if (name && name.trim()) {
    return (
      <HoverTooltip content={name} placement="top" delay={300}>
        {avatarElement}
      </HoverTooltip>
    );
  }

  return avatarElement;
};

const colors = [
  '#DA7657',
  '#6ADA57',
  '#5784DA',
  '#AA57DA',
  '#DA5757',
  '#DA5792',
  '#57DACA',
  '#57A5DA',
];

const getColorFromName = name => colors[name.toLocaleLowerCase().charCodeAt(0) % colors.length];

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;

export default Avatar;
