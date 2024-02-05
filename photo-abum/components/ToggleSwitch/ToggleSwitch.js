import React, { useState } from 'react';
import { styled, IconButton } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';

const StyledIconButton = styled(IconButton)({
  color: '#fff',
  backgroundColor: '#1976D2',
  '&:hover': {
    backgroundColor: '#1565C0',
  },
});

const ColorPalette = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px'
});

const ColorInput = styled('input')({
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
});

const DayNightToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customColor, setCustomColor] = useState('#282C34');

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#fff' : customColor;
    document.body.style.color = isDarkMode ? '#fff' : '#000'; // Set text color based on mode
  };

  const handleColorInputChange = (event) => {
    const newValue = event.target.value;
    setCustomColor(newValue);
    if (isDarkMode) {
      document.body.style.backgroundColor = newValue;
    }
  };

  return (
    <>
      <StyledIconButton color="primary" onClick={handleToggle} sx={{ marginRight: '8px', marginLeft: '15px' }}>
        {isDarkMode ? <NightsStay /> : <WbSunny />}
      </StyledIconButton>
      <ColorPalette>
        <ColorInput
          type="color"
          value={customColor}
          onChange={handleColorInputChange}
          sx={{ margin: '0 5px', width: '30px', height: '30px', padding: '0' }}
        />
      </ColorPalette>
      <style>
        {`
          @media (max-width: 600px) {
            .MuiIconButton-root {
              margin-left: 5px;
              margin-right: 5px;
            }
          }
        `}
      </style>
    </>
  );
};

export default DayNightToggle;
