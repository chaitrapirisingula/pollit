import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { realtime } from '../Data/firebase';
import { ref, set } from 'firebase/database';
import '../Design/Login.css';

/**
 * Modal to send hint to all users in session.
 * 
 * @param {*} param0 
 * @returns modal to send hint
 */
export default function SendHintModal({ room, handleSuccess }) {

  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState('');

  /**
   * Sends hint about current question.
   */
  const sendHint = async () => {
    try {
        const hintRef = ref(realtime, 'sessions/' + room + '/currQuestion/hint');
        await set(hintRef, hint);
        handleSuccess();
        handleClose();
    } catch (err) {
        console.error(err);
        alert('An error occured while sending hint.');
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <Button onClick={handleClickOpen} variant='contained' endIcon={<SendIcon />}>Send Hint</Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Send a Hint</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter a hint to help out your users.
                </DialogContentText>
                <TextField required margin='dense' id='hint' label='Hint' type='name' fullWidth variant='standard'
                    onChange={(e) => setHint(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={hint === ''} onClick={() => sendHint()}>Send</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};