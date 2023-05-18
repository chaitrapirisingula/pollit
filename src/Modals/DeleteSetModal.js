import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../Data/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

/**
 * Confirmation modal for deleting a question set.
 * 
 * @param {*} param0 
 * @returns deletion confirmation modal
 */
export default function DeleteSetModal( { questionSet } ) {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Deletes question set along with all questions inside it.
     */
    const deleteSet = async () => {
        try {
            for await (const q_id of questionSet.question_ids) {
                const q = doc(db, 'questions', q_id);
                await deleteDoc(q);
            }
            const ref = doc(db, 'question_sets', questionSet.id);
            await deleteDoc(ref);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('An error occured while deleting this folder.');
        }
      }

    return (
        <div>
            <Button onClick={handleClickOpen} variant='contained' color='error' endIcon={<DeleteIcon />}>Delete</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>Delete Question Set</DialogTitle>
                <DialogContent>
                <DialogContentText id='alert-dialog-description'>{'Are you sure you want to delete ' + questionSet.name + 
                '? This action cannot be undone.'}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => deleteSet()} color='error'>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};