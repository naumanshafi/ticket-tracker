import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 5px;
  width: 25%;
  border-radius: 3px;
  background: ${color.backgroundLightest};
  
  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    width: 23%; /* Slightly narrower on tablets */
    margin: 0 3px;
  }
  
  @media (max-width: 480px) {
    width: 100%; /* Full width when stacked */
    margin: 0 0 10px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Title = styled.div`
  padding: 13px 10px 17px;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)};
  ${mixin.truncateText}
`;

export const IssuesCount = styled.span`
  text-transform: lowercase;
  ${font.size(13)};
`;

export const Issues = styled.div`
  flex: 1; /* Take remaining space after title */
  padding: 0 5px 10px; /* Add bottom padding for better UX */
  overflow-y: auto;    /* Enable vertical scrolling when content overflows */
  overflow-x: hidden;  /* Prevent horizontal scrolling */
  min-height: 0;       /* Important for flex child with overflow */
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Touch scrolling support for mobile */
  -webkit-overflow-scrolling: touch;
  
  /* Custom scrollbar styling for webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${color.backgroundLight};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${color.borderLight};
    border-radius: 3px;
    
    &:hover {
      background: ${color.borderMedium};
    }
  }
  
  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: ${color.borderLight} ${color.backgroundLight};

  /* ✅ Extra rules to hide scrollbar but keep scrolling functional */
  -ms-overflow-style: none;    /* IE & old Edge */
  scrollbar-width: none;       /* Firefox override to hide */
  &::-webkit-scrollbar {       /* Chrome, Safari, new Edge */
    display: none;
  }
`;
