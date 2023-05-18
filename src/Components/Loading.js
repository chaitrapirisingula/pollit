import React from 'react';
import ReactLoading from 'react-loading';
import { Typography } from '@mui/material';
import '../Design/Loading.css';

/**
 * Display loading bar with optional message.
 * 
 * @param {*} param0 
 * @returns loading bar
 */
export default function Loading( { message, color } ) {

  return (
    <div className='loading'>
      <div className='loading-bar'><ReactLoading color={color} height={100} width={100} /></div>
      <div className='message'>{message ? <Typography variant='h5'>{message}</Typography> : ''}</div>
    </div>
  );
  
};