import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { db } from '../Data/firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';

export default function EditSharingModal( { title, description, type, user_id, question_set } ) {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Unshares question set from user.
     */
    const removeUser = async () => {
        const ref = doc(db, 'question_sets', question_set.id);
        const data = await getDoc(ref);
        var shared_ids = await data.get('shared_users');
        var index = await shared_ids.indexOf(user_id);
        if (index === 0) {
          await shared_ids.shift();
        } else if (index > 0) {
          await shared_ids.splice(index, 1);
        }
        await setDoc(ref, { shared_users: shared_ids }, { merge: true });
        window.location.reload();
    }

    /**
     * Transfers ownership of question set.
     */
    const makeOwner = async () => {
        const ref = doc(db, 'question_sets', question_set.id);
        const data = await getDoc(ref);
        var shared_ids = await data.get('shared_users');
        var index = await shared_ids.indexOf(user_id);
        if (index === 0) {
            await shared_ids.shift();
        } else if (index > 0) {
            await shared_ids.splice(index, 1);
        }
        await shared_ids.push(question_set.owner_id)
        await setDoc(ref, { owner_id: user_id, shared_users: shared_ids }, { merge: true });
        window.location.reload();
    }

    return (
        <div>
            {type === 'remove' ? <Button onClick={handleClickOpen} color='error'>{title}</Button> : <></>}
            {type === 'owner' ? <Button onClick={handleClickOpen} color='secondary'>{title}</Button> : <></>}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {type === 'remove' ? <Button onClick={() => removeUser()} autoFocus>{title}</Button> : <></>}
                {type === 'owner' ? <Button onClick={() => makeOwner()} autoFocus>{title}</Button> : <></>}
                </DialogActions>
            </Dialog>
        </div>
    );
};