import React from 'react';
import { ref, remove } from 'firebase/database';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import { realtime } from '../Data/firebase';
import '../Design/Sessions.css';

/**
 * Tab for users in session.
 * 
 * @param {*} param0 
 * @returns users tab
 */
export default function UsersTab( { users, room } ) {

    /**
     * Allows host to remove users from session.
     * 
     * @param {*} user 
     */
    const removeUser = async (user) => {
        try {
            const userRef = ref(realtime, 'sessions/' + room + '/users/' + user.id);
            await remove(userRef);
        } catch (err) {
            console.error(err);
            alert('An error occured while removing user.');
        }
    }

    return (
        <TabPanel value='Active Users'>
            <Box display='grid' gap={2}>
                {users && users.length > 0 ? users.map((user, index) => 
                <Stack key={index} spacing={2} direction='row' alignItems='center' justifyContent='center'>
                    <Avatar src={user.pic} alt={user.user} />
                    <Typography variant='h6'>{user.user}</Typography>
                    <Button color='error' onClick={() => removeUser(user)}>Remove</Button>
                </Stack>) : <Typography variant='h6'>No active users.</Typography>}
            </Box>
        </TabPanel>
    );
};