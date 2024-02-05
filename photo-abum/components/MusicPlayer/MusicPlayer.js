import React, { useState } from 'react';
import { Button, Menu, MenuItem, styled, Fade } from '@mui/material';

import {song1, song2, song3, song4, song5, song6, song7, song8, song9, song10, song11, song12, song13, song14, song15, song16, song17, song18, song19, song20, song21, song22, song23} from '../../music/music'; 

const StyledButton = styled(Button)({
  borderRadius: '8px',
  padding: '8px 16px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
});

const StyledMenuItem = styled(MenuItem)({
  
  fontSize: '14px',
  '&:hover': {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
});

const StyledMenu = styled(Menu)({
  '& .MuiPaper-root': {
    backgroundColor: '#333', // Background color of the menu
    color: '#fff', // Text color of the menu
  },
});


const songs = [
  { id: 1, title: 'A Thousand Years', src: song1 },
  { id: 2, title: 'Aami Tomar Songe', src: song2 },
  { id: 3, title: 'Dil Nu', src: song3 },
  { id: 4, title: 'Abar Jonmo Nebo', src: song4 },
  { id: 5, title: 'Ei Meghla Dine Ekla', src: song5 },
  { id: 6, title: 'Dekhne Ko Tarsu', src: song6 },
  { id: 7, title: 'Heavenly', src: song7 },
  { id: 8, title: 'Ijazat', src: song8 },
  { id: 9, title: 'Invisible Beauty', src: song9 },
  { id: 10, title: 'Janla khola', src: song10 },
  { id: 11, title: 'Keno Je Toke', src: song11 },
  { id: 12, title: 'Love Story', src: song12 },
  { id: 13, title: 'Love Me Like You Do', src: song13 },
  { id: 14, title: 'Mann Mera', src: song14 },
  { id: 15, title: 'Marriage D Amour', src: song15 },
  { id: 16, title: 'Mi Amor', src: song16 },
  { id: 17, title: 'Night Changes', src: song17 },
  { id: 18, title: 'Perfect', src: song18 },
  { id: 19, title: 'Priyotama', src: song19 },
  { id: 20, title: 'Tomake Valo Legeche', src: song20 },
  { id: 21, title: 'Tomar Khola Haowa', src: song21 },
  { id: 22, title: 'Tumse Hi', src: song22 },
  { id: 23, title: 'Tumse Mohabbat Hai', src: song23 },
  // Add more songs as needed
];

const MusicPlayer = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSongClick = (song) => {
    if (currentSong && currentSong.id === song.id) {
      const audio = document.getElementById('audio');
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
    handleMenuClose();
  };

  return (
    <>
      <StyledButton onClick={handleButtonClick}>
        {currentSong ? currentSong.title : 'Select Song'}
      </StyledButton>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade} // Use the Fade transition
        TransitionProps={{ timeout: 600 }} // Set the animation duration
      >
        {songs.map((song) => (
          <StyledMenuItem key={song.id} onClick={() => handleSongClick(song)}>
            {song.title}
          </StyledMenuItem>
        ))}
      </StyledMenu>

      {currentSong && (
        <audio
          id="audio"
          src={currentSong.src}
          autoPlay={isPlaying}
          onPause={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
      )}

      {/* Add wavy glow effect on the edges of the screen when a song is playing */}
      {isPlaying && (
        <style>
          {`
            body::before {
              content: "";
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              pointer-events: none;
              z-index: 9999;
              box-shadow: 0 0 20px 20px rgba(255, 255, 255, 0.5) inset;
              animation: wavyGlow 2s infinite;
            }

            @keyframes wavyGlow {
              0% {
                box-shadow: 0 0 20px 20px rgba(205, 155, 55, 0.8) inset;
              }
              50% {
                box-shadow: 0 0 30px 20px rgba(25, 255, 255, 1) inset;
              }
              100% {
                box-shadow: 0 0 20px 20px rgba(225, 105, 255, 1.3) inset;
              }
              @media (max-width: 600px) {
                body::before {
                  box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.5) inset;
                }
            }
          `}
        </style>
      )}
    </>
  );
};

export default MusicPlayer;