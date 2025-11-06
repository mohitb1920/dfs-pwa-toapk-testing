import React, { useRef, useLayoutEffect } from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/system';

const Container = styled('div')`
  display: inline-block;
  position: relative;
`;

const HiddenCheckbox = styled('input')`
  display: none;
`;

const EllipsisText = styled('div')`
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
 transition: max-height 0.8s ease-in-out;
  max-height: 6em; // Approximately 3 lines of text

  input[type='checkbox']:checked ~ & {
    -webkit-line-clamp: unset;
    max-height: 1000px; 
  }
`;

const ToggleLabel = styled('label')`
  cursor: pointer;
  color: #006633;
  font-weight: 800;
  display: none;
  margin-top: 8px;

  &::before {
    content: "Show More";
  }

  input[type='checkbox']:checked ~ &::before {
    content: "Show Less";
  }
`;

const ExpandableEllipsisText = ({ text }) => {
  const textRef = useRef(null);
  const checkboxRef = useRef(null);
  const toggleLabelRef = useRef(null);

  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && toggleLabelRef.current) {
        const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight+2;
        toggleLabelRef.current.style.display = isOverflowing ? 'block' : 'none';
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const handleToggle = () => {
    if (toggleLabelRef.current) {
      toggleLabelRef.current.style.display = 'block';
    }
  };

  return (
    <Container>
      <HiddenCheckbox 
        type="checkbox" 
        id="toggle" 
        ref={checkboxRef} 
        onChange={handleToggle}
      />
      <EllipsisText ref={textRef}>
        <Typography variant="body1">{text}</Typography>
      </EllipsisText>
      <ToggleLabel htmlFor="toggle" ref={toggleLabelRef} />
    </Container>
  );
};

export default ExpandableEllipsisText;