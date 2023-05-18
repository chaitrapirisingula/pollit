import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import Logo from '../Design/Images/PollitLogo.png';
import '../Design/Sessions.css';

/**
 * Redirect page for invalid session.
 * 
 * @param {*} param0 
 * @returns invalid session page
 */
export default function InvalidSession() {

    let navigate = useNavigate();

    return (
        <div className='session-inactive'>
            <div>
                <img className='pollit-logo' src={Logo} alt='Logo'></img>
                <p>Invalid Session</p>
                <Button color='error' sx={{ fontSize: 20 }} startIcon={<LogoutIcon sx={{ width: 30, height: 30 }}/>} 
                onClick={() => navigate('/')}>Exit</Button>
            </div>
        </div>
    );
    
};