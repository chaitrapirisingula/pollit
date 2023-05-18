import React from 'react';
import { logout } from '../Data/firebase';
import { Avatar, Typography } from '@mui/material';
import AlertModal from '../Modals/AlertModal';
import UploadImageModal from '../Modals/UploadImageModal';
import '../Design/UserInfo.css';

/**
 * Component with user account information.
 * 
 * @param {*} param0 
 * @returns account information
 */
export default function UserInfo( { name, user, photoURL } ) {
    return (
        <div>
            <div className='image-section'>
                <Avatar alt={name} src={photoURL} sx={{ width: 156, height: 156 }}/>
                <UploadImageModal user={user}/>
            </div>
            <div className='user-info'>
                <Typography variant='h4' gutterBottom>{name}</Typography>
                <Typography variant='h5' gutterBottom>{user?.email}</Typography>
                <AlertModal title={'Logout'} 
                description={'Are you sure you want to logout?'} 
                handleClick={logout}/>
            </div>
        </div>
    );
};