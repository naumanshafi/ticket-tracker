import styled from 'styled-components';

export const Lists = styled.div`
  display: flex;
  flex-direction: column;
  margin: 26px -5px 0;
  height: calc(100vh - 200px); /* Constrain height since page doesn't scroll */
  min-height: 500px; /* Minimum height for usability */
`;

export const ListsHeader = styled.div`
  display: flex;
  flex-shrink: 0; /* Keep headers fixed within container */
  margin-bottom: 0;
  background: white; /* Ensure headers have background */
`;

export const ListsContent = styled.div`
  display: flex;
  flex: 1; /* Take remaining space after headers */
  align-items: stretch; /* Make all columns stretch to the same height */
  overflow-y: auto; /* Enable scrolling for tab content only */
  overflow-x: hidden;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Touch scrolling support for mobile */
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar but keep scrolling functional */
  -ms-overflow-style: none;  /* IE and old Edge */
  scrollbar-width: none;     /* Firefox */
  &::-webkit-scrollbar {     /* Chrome, Safari, new Edge */
    width: 0;
    height: 0;
    background: transparent;
  }
  &::-webkit-scrollbar {     /* ✅ add this line */
    display: none;           /* ✅ add this line */
  }

  /* Mobile responsive adjustments */
  @media (max-width: 480px) {
    flex-direction: column; /* Stack columns on very small screens if needed */
    align-items: normal; /* Reset alignment for stacked layout */
  }
`;
