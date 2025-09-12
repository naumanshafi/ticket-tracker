import styled from 'styled-components';

import { font, color, mixin, zIndexValues } from 'shared/utils/styles';

export const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const TooltipContent = styled.div`
  position: absolute;
  z-index: ${zIndexValues.modal + 2};
  padding: 8px 12px;
  background: ${color.backgroundDarkPrimary};
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  ${mixin.boxShadowDropdown}
  
  /* Positioning based on placement */
  ${props => {
    switch (props.placement) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
          
          &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: ${color.backgroundDarkPrimary};
          }
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-bottom-color: ${color.backgroundDarkPrimary};
          }
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 8px;
          
          &::after {
            content: '';
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border: 4px solid transparent;
            border-left-color: ${color.backgroundDarkPrimary};
          }
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 8px;
          
          &::after {
            content: '';
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border: 4px solid transparent;
            border-right-color: ${color.backgroundDarkPrimary};
          }
        `;
      default:
        return '';
    }
  }}
  
  /* Animation */
  animation: tooltipFadeIn 0.2s ease-out;
  
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: ${props => {
        switch (props.placement) {
          case 'top':
            return 'translateX(-50%) translateY(4px)';
          case 'bottom':
            return 'translateX(-50%) translateY(-4px)';
          case 'left':
            return 'translateY(-50%) translateX(4px)';
          case 'right':
            return 'translateY(-50%) translateX(-4px)';
          default:
            return 'translateX(-50%) translateY(4px)';
        }
      }};
    }
    to {
      opacity: 1;
      transform: ${props => {
        switch (props.placement) {
          case 'top':
          case 'bottom':
            return 'translateX(-50%) translateY(0)';
          case 'left':
          case 'right':
            return 'translateY(-50%) translateX(0)';
          default:
            return 'translateX(-50%) translateY(0)';
        }
      }};
    }
  }
`;
