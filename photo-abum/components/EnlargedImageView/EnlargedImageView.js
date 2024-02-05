import React from 'react';
import { Modal } from '@mui/material';

const EnlargedImageView = ({ imageSrc, onClose }) => (
  <Modal open={true} onClose={onClose}>
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ maxWidth: '80vw', maxHeight: '80vh', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
        <img src={imageSrc} alt="Enlarged View" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', transition: 'transform 0.3s' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>
          &times;
        </button>
      </div>
    </div>
  </Modal>
);

export default EnlargedImageView;
