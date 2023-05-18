import React, { useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { db } from '../Data/firebase';
import { query, collection, getDocs, getDoc, setDoc, doc, where } from 'firebase/firestore';
import EditSharingModal from './EditSharingModal';

/**
 * Modal to share question sets.
 * 
 * @param {*} param0 
 * @returns sharing modal
 */
export default function ShareSetsModal( { questionSet } ) {

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sharedWith, setSharedWith] = useState([]);
  const [error, setError] = useState(false);

  /**
   * Get user information from database by id.
   * 
   * @param {*} id 
   * @returns user
   */
  const fetchUserById = async (id) => {
    try {
        const q = query(collection(db, 'users'), where('uid', '==', id));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        return data.email;
      } catch (err) {
        console.error(err);
        alert('An error occured while fetching shared user info.');
      }
  }

  /**
   * Find user information by email.
   * 
   * @returns user
   */
  const fetchUserByEmail = async () => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setError(false);
      return data.uid;
    } catch (err) {
      setError(true);
    }
  }

  /**
   * Share question set with other user.
   */
  const shareSet = async () => {
    const id = await fetchUserByEmail();
    if (id) {
      try {
        const ref = doc(db, 'question_sets', questionSet.id);
        const data = await getDoc(ref);
        var shared_ids = data.get('shared_users') || [];
        shared_ids.push(id);
        await setDoc(ref, { shared_users: shared_ids }, { merge: true });
        window.location.reload();
      } catch (err) {
          console.error(err);
          alert('An error occured while sharing this folder.');
      }
    }
  }

  /**
   * Fetch users question set is currently shared with.
   */
  const handleClickOpen = async () => {
    if (questionSet.shared_users && questionSet.shared_users.length > 0) {
        var shared_with = [];
        for await (const userId of questionSet.shared_users) {
            const user = await fetchUserById(userId);
            shared_with.push(user);
        }
        await setSharedWith(shared_with);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setEmail('');
    setError(false);
    setOpen(false);
  };

  return (
    <div>
        <Button onClick={handleClickOpen} variant='contained' endIcon={<SendIcon />}>Share</Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Share {questionSet.name}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the email address of the user you would like to share this question set with.
                </DialogContentText>
                {sharedWith && sharedWith.length > 0 ? 
                <Box textAlign='center'>
                    <Typography paragraph>Currently shared with:</Typography>
                    {sharedWith.map((user, index) => 
                    <Box display='grid' justifyContent='center' textAlign='center' key={index}>       
                      <Typography>{user}</Typography>
                      <Box display='flex'>
                        <EditSharingModal type={'remove'} user_id={questionSet.shared_users[index]} question_set={questionSet}
                        title='Remove' description={'Are you sure you want to remove ' + user + ' from ' + questionSet.name + '?'}/>
                        <EditSharingModal type={'owner'} user_id={questionSet.shared_users[index]} question_set={questionSet}
                        title='Make Owner' description={'Are you sure you want to make ' + user + ' the owner of ' + questionSet.name + 
                        '? You will still have access to this question as a shared user.'}/>
                      </Box>
                    </Box>
                    )}
                </Box> : <></>}
                <TextField required autoFocus margin='dense' id='email' label='Email' type='email' fullWidth variant='standard'
                    onChange={(e) => setEmail(e.target.value)}/>
                {error ? <Alert severity='error'>User not found.</Alert> : <></>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={email === '' || !questionSet} onClick={() => shareSet()}>Share</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
  
};