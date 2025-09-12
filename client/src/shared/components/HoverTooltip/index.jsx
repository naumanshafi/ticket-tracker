import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { TooltipContainer, TooltipContent } from './Styles';

const propTypes = {
  content: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
};

const defaultProps = {
  placement: 'top',
  delay: 500,
};

const HoverTooltip = ({ content, children, placement, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  return (
    <TooltipContainer
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onTouchStart={showTooltip}
      onTouchEnd={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <TooltipContent placement={placement}>
          {content}
        </TooltipContent>
      )}
    </TooltipContainer>
  );
};

HoverTooltip.propTypes = propTypes;
HoverTooltip.defaultProps = defaultProps;

export default HoverTooltip;
