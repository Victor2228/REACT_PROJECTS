// GalleryItem.js
import React, { useState } from 'react';
import { Card, CardMedia, Paper, Button, Typography, TextField, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
const GalleryItem = ({ item, onImageClick, onDeleteClick, onSaveEdit, onLikeClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(item.category);
  const [editedDate, setEditedDate] = useState(item.date);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [isLiked, setIsLiked] = useState(localStorage.getItem(`liked_${item.id}`) === 'true');

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDeleteClick(item.id);
  };

  const handleEditClick = () => {
    setShowOptions(false);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSaveEdit(item.id, editedCategory, editedDate, item.src, editedDescription, );
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCategory(item.category);
    setEditedDate(item.date);
  };

  const handleEnlargeClick = (event) => {
    event.stopPropagation();
    onImageClick(item.src);
  };

  const handleLikeClick = (event) => {
    event.stopPropagation();
    setIsLiked(!isLiked);
    onLikeClick(item.id);
    localStorage.setItem(`liked_${item.id}`, !isLiked);
  };

  return (
    <Card
      elevation={3}
      sx={{
        width: 300,
        margin: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        position: 'relative',
        zIndex: isEditing ? 'auto' : 1, // Ensure the card is on top during editing
        '&:hover': {
          transform: isEditing ? 'none' : 'scale(1.05)', // Apply hover effect only when not editing
        },
      }}
      onClick={() => {}}
      onMouseEnter={() => setShowOptions(!isEditing)} // Hide options when editing
      onMouseLeave={() => setShowOptions(false)}
    >
      {showOptions && !isEditing && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          
          <>
            <Button variant="contained" onClick={handleEnlargeClick} sx={{margin: 2}}>
              Enlarge
            </Button>
            <Button variant="contained" onClick={handleEditClick} sx={{marginBottom: 2, backgroundColor: '#4CAF50', '&:hover': {
                  backgroundColor: '#4CAF50',},}}>
              Edit
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteClick} >
              Delete
            </Button>
            <IconButton color={isLiked ? 'error' : 'default'} onClick={handleLikeClick} sx={{marginTop: 2}}>
              <FavoriteIcon />
            </IconButton>
          </>
          
        </div>
      )}

      {isEditing && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button variant="contained" onClick={handleSaveClick} sx={{ marginBottom: 2 }}>
            Save
          </Button>
          <Button variant="contained" color="error" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
      )}
      <CardMedia component="img" alt={item.category} height="140" image={item.src} />
      <Paper
        sx={{
          padding: '16px',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        {isEditing ? (
          <>
            <TextField
              label="Edit Category"
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              type="date"
              label="Edit Date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </>
        ) : (
          <>
            <Typography variant="subtitle1" color="textPrimary">
              Category: {item.category}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Date: {item.date}
            </Typography>
            <Typography variant="subtitle1" color="textPrimary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',}}>
  Description: {item.description}
</Typography>
          </>
        )}
      </Paper>
    </Card>
  );
};

export default GalleryItem;