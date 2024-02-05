import React, { useState } from 'react';
import { Stack, Button, Typography, TextField, Paper, Avatar, Card } from '@mui/material';
import storage from '../../firebase';

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setSelectedFileName(selectedFile ? selectedFile.name : '');

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate the form fields
    if (file && category && date && description) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Call onUpload with image data
        onUpload({
          id: new Date().getTime(),
          file: file,
          category: category,
          date: date,
          description: description,
          previewUrl: reader.result, // Include previewUrl in the uploaded data
        });
      };
      reader.readAsDataURL(file);

      // Reset form fields
      setFile(null);
      setCategory('');
      setDate('');
      setDescription('');
      setSelectedFileName('');
      setPreviewUrl(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', margin: '0 auto' }}>
      <Stack spacing={2}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-button"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-button">
          <Button variant="contained" component="span" color="primary" fullWidth>
            Choose File
          </Button>
        </label>
        {/* Display selected file name */}
        {selectedFileName && (
          <Typography variant="body2" color="textSecondary">
            Selected File: {selectedFileName}
          </Typography>
        )}
        {/* Display image preview */}
        {previewUrl && (
          <Paper elevation={3} style={{ padding: '10px', textAlign: 'center', width: '100px', margin: '10px auto'}}>
            <Avatar variant="rounded" alt="Image Preview" src={previewUrl} sx={{ width: 'auto', height: '100px' }} />
          </Paper>
        )}
        <TextField label="Category" value={category} onChange={handleCategoryChange} required fullWidth size="small" />
        <Typography variant="body2" color="textSecondary">
          Date Format: YYYY-MM-DD
        </Typography>
        <TextField
          label="Date"
          value={date}
          onChange={handleDateChange}
          required
          fullWidth
          size="small"
          sx={{
            '& input': {
              // Custom styling for the date input
              padding: '10px 12px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            },
          }}
        />
        <TextField label="Description" value={description} onChange={handleDescriptionChange} required fullWidth multiline rows={4} />
        <Button type="submit" variant="contained" color="primary" fullWidth size="small">
          Upload
        </Button>
      </Stack>
    </form>
  );
};

export default UploadForm;
