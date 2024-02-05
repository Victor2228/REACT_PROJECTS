import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
  Fade,
  Typography,
  Button,
  Modal,
  ButtonGroup,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './App.css';
import PA from './images/PA.png'
import GalleryItem from '../src/components/GalleryItem/GalleryItem';
import EnlargedImageView from '../src/components/EnlargedImageView/EnlargedImageView';
import UploadForm from '../src/components/UploadForm/UploadForm';
import MusicPlayer from '../src/components//MusicPlayer/MusicPlayer';
import ToggleSwitch from './components/ToggleSwitch/ToggleSwitch';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const getStoredImages = () => {
  const storedImages = localStorage.getItem('uploadedImages');
  return storedImages ? JSON.parse(storedImages) : [];
};

const getLikedImages = () => {
  const likedImages = localStorage.getItem('likedImages');
  return likedImages ? JSON.parse(likedImages) : [];
};

const auth = getAuth();

const ITEMS_PER_PAGE = 40; // Number of items to display per page

const App = () => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(getStoredImages());
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLikedImages, setShowLikedImages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedImages, setLikedImages] = useState(getLikedImages());
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        const q = query(collection(db, 'images'), where('userId', '==', user.uid));
        const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
          const images = [];
          querySnapshot.forEach((doc) => {
            images.push({ id: doc.id, ...doc.data() });
          });
          setUploadedImages(images);
          setIsLoading(false);
        });

        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribe();
  }, []);
  

  const handleFilterChange = (newFilter) => {
    const formattedFilter = newFilter.toLowerCase();
    setFilter(formattedFilter);
    setSort('default');
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    if (newSort === 'default') {
      setSort('default');
      setUploadedImages([...uploadedImages].sort((a, b) => a.id - b.id));
    } else {
      setSort(newSort);
      setCurrentPage(1);
      // Add logic here for other sorting options
      // ...
    }
  };

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Set loading state
      setIsLoading(true);

      const result = await signInWithPopup(auth, provider);
      setUser(result.user);

      // Reset loading state
      setIsLoading(false);
    } catch (error) {
      console.error('Error signing in:', error.message);

      // Handle error and reset loading state
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Set loading state
      setIsLoading(true);
  
      await signOut(auth);
  
      // Introduce a delay (e.g., 1.5 seconds) before resetting the loading state
      setTimeout(() => {
        // Reset user and loading state
        setUser(null);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error signing out:', error.message);
  
      // Handle error and reset loading state
      setIsLoading(false);
    }
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseEnlargedView = () => {
    setSelectedImage(null);
  };

  const handleDeleteClick = async (id) => {
    try {
      // Delete Firestore document
      const docRef = doc(db, 'images', id);
      await deleteDoc(docRef);
  
      // Update local state
      setUploadedImages((prevImages) => prevImages.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error.message);
    }
  };

  const handleUpload = async (newImage) => {
    if (user) {
      const storageRef = ref(storage, `images/${newImage.id}`);

      try {
        // Close the upload form before starting the upload
        handleCloseUploadForm();

        // Set loading state
        setIsLoading(true);

        // Upload image to Firebase Storage
        await uploadBytes(storageRef, newImage.file);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Add image metadata to Firestore
        const collectionRef = collection(db, 'images');
        const docRef = await addDoc(collectionRef, {
          userId: user.uid,
          category: newImage.category,
          date: newImage.date,
          description: newImage.description,
          src: downloadURL,
          isLiked: false,
        });

        // Update local state with the newly uploaded image, avoiding duplicates
        setUploadedImages((prevImages) => {
          const updatedImages = [
            ...prevImages,
            {
              id: docRef.id,
              userId: user.uid,
              category: newImage.category,
              date: newImage.date,
              description: newImage.description,
              src: downloadURL,
              isLiked: false,
            },
          ];

          // Use Set to remove duplicates based on the image id
          const uniqueImages = Array.from(new Set(updatedImages.map((image) => image.id))).map(
            (id) => updatedImages.find((image) => image.id === id)
          );

          return uniqueImages;
        });

        // Reset loading state
        setIsLoading(false);
      } catch (error) {
        console.error('Error uploading image:', error.message);

        // Handle error and reset loading state
        setIsLoading(false);
      }
    }
  };

  const handleUploadClick = () => {
    setShowUploadForm(true);
  };

  const handleCloseUploadForm = () => {
    setShowUploadForm(false);
  };

  const handleSaveEdit = async (id, editedCategory, editedDate, editedSrc, editedDescription) => {
    try {
      // Update Firestore document
      const docRef = doc(db, 'images', id);
      await updateDoc(docRef, {
        category: editedCategory,
        date: editedDate,
        description: editedDescription,
        src: editedSrc,
      });
  
      // Update local state
      setUploadedImages((prevImages) =>
        prevImages.map((item) =>
          item.id === id
            ? {
                ...item,
                category: editedCategory,
                date: editedDate,
                description: editedDescription,
                src: editedSrc,
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error saving edit:', error.message);
    }
  };
  
  const handleLikeClick = async (id) => {
    const updatedImages = uploadedImages.map((item) =>
      item.id === id ? { ...item, isLiked: !item.isLiked } : item
    );
    setUploadedImages(updatedImages);

    // Update liked images in localStorage
    const updatedLikedImages = updatedImages.filter((item) => item.isLiked && item.userId === user.uid);
    setLikedImages(updatedLikedImages);
    localStorage.setItem('likedImages', JSON.stringify(updatedLikedImages));

    // Update Firestore document
    try {
      const docRef = doc(db, 'images', id);
      await updateDoc(docRef, {
        isLiked: updatedImages.find((item) => item.id === id)?.isLiked || false,
      });
    } catch (error) {
      console.error('Error updating liked status in Firestore:', error.message);
    }
  };
  const handleToggleLikedImages = () => {
    setShowLikedImages(!showLikedImages);
    setCurrentPage(1);
  };

  const filteredData = user
  ? (showLikedImages
    ? uploadedImages.filter((item) => item.isLiked && item.userId === user.uid)
    : uploadedImages.filter(
      (item) =>
        (!showLikedImages || (showLikedImages && item.isLiked)) &&
        item.userId === user.uid &&
        (filter === 'all' || item.category === filter) &&
        (searchTerm === '' ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ))
  : [];

  if (sort === 'date') {
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === 'category') {
    filteredData.sort((a, b) => a.category.localeCompare(b.category));
  }

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <MusicPlayer />
          <ToggleSwitch />
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'Georgia, serif',
              fontSize: '32px',
            }}
          >
            PHOTO ALBUM
          </Typography>
          
          <Button color="inherit" onClick={handleUploadClick}>
            Upload
          </Button>
          
          {user ? (
            <Button color="inherit" onClick={handleSignOut}>
              {user.displayName}
            </Button>
          ) : (
            <Button color="inherit">
              Hi, Hello
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          marginTop: '70px',
          padding: '20px',
          filter: showUploadForm ? 'blur(3px)' : 'none',
          transition: 'filter 0.3s ease-in-out',
          // Adjust the value based on your design
      
        }}
      >
        {user ? (
        <>
        <section id="filter-sort">
        <Button variant={showLikedImages === true ? 'contained' : 'outlined'} onClick={handleToggleLikedImages} sx={{ margin: '5px 10px' }}>
            {showLikedImages ? 'Favourites' : 'Favourites'}
          </Button>
          <ButtonGroup>
            <Button onClick={() => handleFilterChange('all')} variant={filter === 'all' ? 'contained' : 'outlined'}>All</Button>
            {/* Add specific filters based on the categories of uploaded images */}
            <Button onClick={() => handleFilterChange('travels')} variant={filter === 'travels' ? 'contained' : 'outlined'}>Travels</Button>
            <Button onClick={() => handleFilterChange('special-moments')} variant={filter === 'special-moments' ? 'contained' : 'outlined'}>Special-Moments</Button>
            <Button onClick={() => handleFilterChange('candids')} variant={filter === 'candids' ? 'contained' : 'outlined'}>Candids</Button>
            <Button onClick={() => handleFilterChange('themes')} variant={filter === 'themes' ? 'contained' : 'outlined'}>Themes</Button>
            <Button onClick={() => handleFilterChange('solos')} variant={filter === 'solos' ? 'contained' : 'outlined'}>Solos</Button>
            <Button onClick={() => handleFilterChange('miscellaneous')} variant={filter === 'miscellaneous' ? 'contained' : 'outlined'}>Miscellaneous</Button>
            {/* Add more filters as needed */}
            {/* Add more filters as needed */}
          </ButtonGroup>
          
          <ButtonGroup sx={{ marginTop: '' }}>
            <Button onClick={() => handleSortChange('default')} variant={sort === 'default' ? 'contained' : 'outlined'}>Default</Button>
            <Button onClick={() => handleSortChange('date')} variant={sort === 'date' ? 'contained' : 'outlined'}>Date</Button>
            <Button onClick={() => handleSortChange('category')} variant={sort === 'category' ? 'contained' : 'outlined'}>Category</Button>
          </ButtonGroup>
        </section>
        <div className="search-bar">
          <TextField
            label="Search images"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <SearchIcon className="search-icon" />
        </div>
        <section id="gallery" className="gallery-grid">
       
        {isLoading ? (
          <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
        ) : (
          currentItems.map((item) => (
            <GalleryItem
              key={item.id}
              item={item}
              onImageClick={handleImageClick}
              onDeleteClick={handleDeleteClick}
              onSaveEdit={handleSaveEdit}
              onLikeClick={handleLikeClick}
            />
          ))
        )}
  
        </section>

        {/* Pagination */}
        <div className="pagination-container">
          {filteredData.length > ITEMS_PER_PAGE ? (
            <ul className="pagination">
              {[...Array(Math.ceil(filteredData.length / ITEMS_PER_PAGE))].map(
                (_, index) => (
                  <li key={index} className="page-item">
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          ) : (
            <ul className="pagination">
              <li className="page-item">
                <button
                  onClick={() => paginate(1)}
                  className={`page-link ${currentPage === 1 ? 'active' : ''}`}
                >
                  1
                </button>
              </li>
            </ul>
          )}
        </div>
        
        {selectedImage && (
          <EnlargedImageView
            imageSrc={selectedImage}
            onClose={handleCloseEnlargedView}
          />
        )}
        
      <Modal
        open={showUploadForm}
        onClose={handleCloseUploadForm}
      >
        <Fade in={showUploadForm}>
          <Container
            sx={{
              marginTop: '30vh',
              textAlign: 'center',
              backgroundColor: '#ccc',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              width: '50vh',
            }}
          >
            <Typography variant="h6" component="div" sx={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px' }}>
              Upload Your Image
            </Typography>
            <UploadForm onUpload={handleUpload} />
          </Container>
        </Fade>
      </Modal>
      </>
        ) : (
          
          <div className="not-signed-in-placeholder">
          <Typography
            variant="h4"
            component="div"
            sx={{
              textAlign: 'center',
              marginTop: '5vh',
              marginBottom: '5vh',
              fontWeight: 'bold',
              fontSize: '28px',
            }}
          >
            <img src={PA} style={{cursor: 'pointer'}}></img>
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{
              textAlign: 'center',
              marginBottom: '30px',
              fontWeight: 'bold',
              fontSize: '28px',
            }}
          >
            Welcome to the Photo Album App!
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              marginBottom: '30px',
            }}
          >
            <em>
              This app allows you to manage and showcase your photo collection. Sign in to enjoy personalized features like uploading images, categorizing them, applying filters, and more!
            </em>
          </Typography>
          
          <Typography
            variant="body1"
            component="div"
            sx={{
              textAlign: 'center',
              fontSize: '16px',
             
            }}
          >
            <p>You can play with the features in the appbar for demo<br/>BUT<br/>
            To unlock the full experience, please sign in with your Google account.</p>
          </Typography>
          <Button color="primary" variant="contained" onClick={handleSignIn} sx={{ marginTop: '20px' }}>
            Sign In with Google
          </Button>
        </div>
        )}
      </Container>
      <footer
        style={{
          backgroundColor: '#1976D2',
          color: '#fff',
          padding: '5px',
          textAlign: 'center',
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '100%',
          zIndex: '2',
        }}
      >
        &copy; 2023 Aditya Chakraborty | All Rights Reserved
      </footer>
    </div>
  );
}

export default App;