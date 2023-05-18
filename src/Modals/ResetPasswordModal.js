import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, TextField } from '@mui/material';
import { sendPasswordReset } from '../Data/firebase';
import '../Design/Login.css';

/**
 * Modal to enter email for password reset.
 * 
 * @returns password reset modal
 */
export default function ResetPasswordModal() {

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Link className='forgot-pass'
        sx={{ color: '#2949cb' }}
        variant='body'
        onClick={handleClickOpen}>
        Forgot Password?
      </Link>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address associated with your Pollit account.
          </DialogContentText>
          <TextField required autoFocus margin='dense' id='name' label='Email Address' type='email' fullWidth variant='standard'
            onChange={(e) => setEmail(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={email === ''} onClick={() => {sendPasswordReset(email);
            handleClose();}}>Send Reset Link</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};