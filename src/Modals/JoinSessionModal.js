import React, { useState, useEffect } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { realtime } from '../Data/firebase';
import { ref, onValue, push } from 'firebase/database';
import '../Design/Login.css';

export default function JoinSessionModal( { user, isGuest, pic } ) {

  const [open, setOpen] = useState(false);
  
  let navigate = useNavigate();

  const [room, setRoom] = useState('');
  const [valid, setValid] = useState(true);
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [session, setSession] = useState('');

  /**
   * Adds a user to the waiting room of a session.
   */
  const joinSession = async () => {
    try {
      const waitingRoomRef = ref(realtime, 'sessions/' + room + '/waiting');
      const userId = await push(waitingRoomRef, { user: user ? user : name, pic: pic ? pic : '' }).key;
      navigate('/user/session', { state: {id: userId, user: user ? user : name, room: room, name: session, host: host} });
    } catch (err) {
      console.error(err);
      alert('An error occured while joining this session.');
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setRoom('');
    setValid(true);
    setOpen(false);
  };

  useEffect(() => {
    if ((user !== '' || name !== '') && room !== '') {
      // Check for valid room
      const roomRef = ref(realtime, 'sessions/' + room);
      onValue(roomRef, async (snapshot) => {
          if (snapshot.exists()) {
            setSession(await snapshot.val().name);
            setHost(await snapshot.val().host);
            setValid(true);
          } else {
            setValid(false);
          }
      });
    } 
  }, [room]);

  return (
    <div>
        {isGuest ? <Link variant='body' sx={{ color: '#2949cb' }} onClick={handleClickOpen} className='join-guest'>Join as Guest</Link> :
        <Button onClick={handleClickOpen} variant='outlined'>Join Session</Button>}
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Join a session</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the session code.
                </DialogContentText>
                {isGuest ? <TextField required autoFocus margin='dense' id='name' label='Display Name' type='name' fullWidth variant='standard'
                    onChange={(e) => setName(e.target.value)}/> : <></>}
                <TextField required margin='dense' id='code' label='Session Code' type='name' fullWidth variant='standard'
                    onChange={(e) => setRoom(e.target.value)}/>
                {!valid ? <Alert severity='error'>Invalid session code.</Alert> : <></>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={room === '' || (isGuest && name === '') || !valid} onClick={() => joinSession()}>Join Session</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};