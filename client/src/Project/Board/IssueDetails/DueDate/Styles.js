import styled, { css } from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export const DueDateSection = styled.div`
  margin-top: 24px;
  position: relative;
`;

export const DueDateLabel = styled.div`
  padding-bottom: 12px;
  color: ${color.textMedium};
  ${font.size(13)}
  ${font.medium}
  text-transform: uppercase;
`;

export const DueDateValue = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  background: ${color.backgroundLight};
  border: 1px solid ${color.borderLightest};
  cursor: pointer;
  transition: all 0.2s ease;
  ${font.size(14)}
  color: ${color.textDark};
  position: relative;
  
  &:hover {
    background: ${color.backgroundLightPrimary};
    border-color: ${color.borderInputFocus};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  i {
    margin-right: 10px;
    color: ${color.primary};
  }
`;

export const NoDueDate = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  background: ${color.backgroundLight};
  border: 2px dashed ${color.borderLight};
  cursor: pointer;
  transition: all 0.2s ease;
  ${font.size(14)}
  color: ${color.textMedium};
  
  &:hover {
    background: ${color.backgroundLightPrimary};
    border-color: ${color.primary};
    color: ${color.primary};
    transform: translateY(-1px);
  }
  
  i {
    margin-right: 10px;
  }
`;

export const ClearButton = styled.div`
  margin-left: auto;
  padding: 6px;
  border-radius: 4px;
  opacity: 0.6;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    background: ${color.danger};
    color: white;
    transform: scale(1.1);
  }
  
  i {
    margin: 0;
    color: inherit;
  }
`;

export const DatePickerModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const DatePickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${color.borderLightest};
  background: linear-gradient(135deg, ${color.primary} 0%, #667eea 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  
  h3 {
    margin: 0;
    ${font.size(18)}
    ${font.medium}
  }
  
  i {
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const DatePickerContent = styled.div`
  background: white;
  border-radius: 0 0 12px 12px;
  max-width: 420px;
  width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

export const Calendar = styled.div`
  padding: 24px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  span {
    ${font.size(18)}
    ${font.medium}
    color: ${color.textDark};
  }
  
  i {
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    transition: all 0.2s ease;
    color: ${color.textMedium};
    
    &:hover {
      background: ${color.backgroundLight};
      color: ${color.primary};
      transform: scale(1.1);
    }
  }
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;
  
  div {
    text-align: center;
    padding: 12px 0;
    ${font.size(12)}
    ${font.medium}
    color: ${color.textMedium};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const Day = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  ${font.size(14)}
  color: ${props => props.isCurrentMonth ? color.textDark : color.textLight};
  background: ${props => props.isSelected ? color.primary : 'transparent'};
  color: ${props => props.isSelected ? 'white' : (props.isCurrentMonth ? color.textDark : color.textLight)};
  position: relative;
  
  ${props => props.isToday && !props.isSelected && css`
    background: ${color.backgroundLightPrimary};
    color: ${color.primary};
    font-weight: 600;
  `}
  
  &:hover {
    background: ${props => props.isSelected ? color.primary : color.backgroundLightPrimary};
    color: ${props => props.isSelected ? 'white' : color.primary};
    transform: scale(1.1);
  }
  
  ${props => !props.isCurrentMonth && css`
    opacity: 0.3;
  `}
`;

export const TimeSection = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${color.borderLightest};
  background: ${color.backgroundLightest};
  
  h4 {
    margin: 0 0 16px 0;
    ${font.size(16)}
    ${font.medium}
    color: ${color.textDark};
  }
  
  .time-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    select {
      padding: 8px 12px;
      border: 1px solid ${color.borderLight};
      border-radius: 6px;
      background: white;
      ${font.size(14)}
      color: ${color.textDark};
      cursor: pointer;
      
      &:focus {
        outline: none;
        border-color: ${color.primary};
        box-shadow: 0 0 0 3px ${color.primary}20;
      }
    }
    
    span {
      ${font.size(16)}
      ${font.medium}
      color: ${color.textMedium};
    }
  }
  
  .time-display {
    ${font.size(14)}
    color: ${color.textMedium};
    background: ${color.backgroundLight};
    padding: 8px 12px;
    border-radius: 4px;
    text-align: center;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${color.borderLightest};
  background: ${color.backgroundLightest};
`;

export const Button = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  ${font.size(14)}
  ${font.medium}
  
  ${props => props.variant === 'primary' ? css`
    background: linear-gradient(135deg, ${color.primary} 0%, #667eea 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
  ` : css`
    background: ${color.backgroundLight};
    color: ${color.textMedium};
    border: 1px solid ${color.borderLight};
    
    &:hover {
      background: ${color.backgroundMedium};
      color: ${color.textDark};
    }
  `}
`;
