import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { registerWithEmailAndPassword } from '../Data/firebase';

/**
 * Modal for user to create new account.
 * 
 * @returns sign up modal
 */
export default function SignUpModal() {

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Create new user account.
   */
  const register = () => {
    registerWithEmailAndPassword(name, email, password);
    handleClose();
  };

  return (
    <div>
      <Button className='hover' variant='outlined' onClick={handleClickOpen}>Sign Up</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a Pollit Account</DialogTitle>
        <DialogContent>
            <DialogContentText>
            Enter the following information to get started with Pollit.
            </DialogContentText>
            <TextField required autoFocus margin='dense' id='username' label='Display Name' type='name' fullWidth variant='standard'
             onChange={(e) => setName(e.target.value)}/>
            <TextField required margin='dense' id='name' label='Email Address' type='email' fullWidth variant='standard'
             onChange={(e) => setEmail(e.target.value)}/>
            <TextField required margin='dense' id='password' label='Password' type='password' fullWidth variant='standard'
             onChange={(e) => setPassword(e.target.value)}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={name === '' || email === '' || password === ''} onClick={register}>Sign Up</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};