import React, { forwardRef } from 'react';
import { Box } from '@mui/material';

const MainForm = forwardRef(({ children, spacing = 1, ...props }, ref) => {
  return (
    <form ref={ref} {...props} noValidate>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: -spacing,
        }}
      >
        {React.Children.map(children, (child, index) => (
          <Box
            key={index}
            sx={{
              padding: spacing,
              width: {
                xs: '100%',
                sm: '50%',
                md: '50%',
                lg: '33.33%',
              },
              minWidth: 100,
            }}
          >
            {child}
          </Box>
        ))}
      </Box>
    </form>
  );
});

export default MainForm;