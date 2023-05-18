import React from 'react';
import { ref, set, remove } from 'firebase/database';
import { Avatar, Button, Box, Stack, Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TabPanel from '@mui/lab/TabPanel';
import { realtime } from '../Data/firebase';
import '../Design/Sessions.css';

/**
 * Waiting room tab on host session page.
 * 
 * @param {*} param0 
 * @returns waiting room tab
 */
export default function WaitingTab( { waiting, room } ) {

    /**
     * Allows host to approve users in waiting room.
     * 
     * @param {*} user 
     */
    const approveUser = async (user) => {
        try {
            const usersRef = ref(realtime, 'sessions/' + room + '/users/' + user.id);
            await set(usersRef, {user: user.user, pic: user.pic});
            const waitingRoomRef = ref(realtime, 'sessions/' + room + '/waiting/' + user.id);
            await remove(waitingRoomRef);
        } catch (err) {
            console.error(err);
            alert('An error occured while approving user.');
        }
    }

    /**
     * Allows host to deny users in the waiting room.
     * 
     * @param {*} user 
     */
    const denyUser = async (user) => {
        try {
            const waitingRoomRef = ref(realtime, 'sessions/' + room + '/waiting/' + user.id);
            await remove(waitingRoomRef);
        } catch (err) {
            console.error(err);
            alert('An error occured while denying user.');
        }
    }

    /**
     * Approve all users in waiting room at once.
     */
    const approveAll = async () => {
        for await (const user of waiting) {
            await approveUser(user);
        }
    }

    /**
     * Denies all users in waiting room at once. 
     */
    const denyAll = async () => {
        for await (const user of waiting) {
            await denyUser(user);
        }
    }

    return (
        <TabPanel value='Waiting Room'>
            {waiting && waiting.length > 0 ? 
            <Box display='flex' justifyContent='center' gap={1} padding={2}>
                <Button variant='contained' color='success' onClick={() => approveAll()} startIcon={<DoneAllIcon />}>Approve All</Button>
                <Button variant='contained' color='error' onClick={() => denyAll()} endIcon={<ClearAllIcon />}>Deny All</Button>
            </Box> : <></>}
            {waiting && waiting.length > 0 ? waiting.map((user, index) => 
            <Stack key={index} spacing={2} direction='row' alignItems='center' justifyContent='center' padding={1}>
                <Avatar src={user.pic} alt={user.user} />
                <Typography variant='h6'>{user.user}</Typography>
                <Button color='success' onClick={() => approveUser(user)}>Approve</Button>
                <Button color='error' onClick={() => denyUser(user)}>Deny</Button>
            </Stack>) : <Typography variant='h6'>Waiting room is empty.</Typography>}
        </TabPanel>
    );
};