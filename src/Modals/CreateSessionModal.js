import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { realtime } from '../Data/firebase';
import { ref, set } from 'firebase/database';
import { v4 as uuid } from 'uuid';

/**
 * Modal to create new session.
 * 
 * @param {*} param0 
 * @returns session creation modal
 */
export default function CreateSessionModal( { host, host_id, questions, question_sets, shared_sets } ) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  let navigate = useNavigate();

  /**
   * Creates a new session with new uuid.
   */
  const createSession = async () => {
    try {
      const unique_id = uuid();
      const small_id = unique_id.slice(0,6)
      const sessionRef = ref(realtime, 'sessions/' + small_id);
      await set(sessionRef, { 
          name: name,
          host: host,
          host_id: host_id
      });
      setName('');
      navigate('/host/session', 
        { state: { host: host, room: small_id, name: name, 
          questions: questions, question_sets: question_sets, shared_sets: shared_sets } });
    } catch (err) {
      console.error(err);
      alert('An error occured while creating this session.');
    }
  } 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName('');
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} variant='outlined'>Create Session</Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Create a session</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your session.
          </DialogContentText>
          <TextField required autoFocus margin='dense' id='name' label='Session Name' type='name' fullWidth variant='standard'
            onChange={(e) => setName(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={name === ''} onClick={() => createSession()}>Create Session</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};