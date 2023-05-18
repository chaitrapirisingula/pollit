import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { uploadProfilePic } from '../Data/firebase';
import '../Design/UploadImageModal.css';

/**
 * Modal to upload or update profile picture for user.
 * 
 * @param {*} param0 
 * @returns image upload modal
 */
export default function UploadImageModal( {user} ) {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [photo, setPhoto] = useState(null);
  const [fileName, setFileName] = useState('No file selected');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPhoto(null);
    setPhotoURL('');
    setFileName('No file selected');
    setOpen(false);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setPhotoURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  const handleClick = async () => {
    await uploadProfilePic(photo, user, setLoading);
    window.location.reload();
  }

  return (
    <div>
      <Button variant='text' onClick={handleClickOpen}>Edit Image</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <form className='upload-section' onClick={() => document.querySelector('.input-field').click()}>
            <input type='file' accept='image/*' className='input-field' onChange={handleChange} hidden/>
            {photoURL ? <img src={photoURL} alt={fileName} width={156} height={156}/> : 
            <div className='upload-icon'><UploadIcon fontSize='large'/></div>}
            <p>{fileName}</p>
          </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={loading || !photo} onClick={handleClick}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}