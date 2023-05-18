import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Alert, Button, TextField, Typography } from '@mui/material';
import { auth, logInWithEmailAndPassword } from '../Data/firebase';
import Logo from '../Design/Images/PollitLogo.png';
import Loading from '../Components/Loading';
import ResetPasswordModal from '../Modals/ResetPasswordModal';
import SignUpModal from '../Modals/SignUpModal';
import JoinSessionModal from '../Modals/JoinSessionModal';
import '../Design/App.css';
import '../Design/Login.css';

/**
 * Login page on startup.
 * 
 * @returns login page
 */
export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) return;
        if (user && !user?.isAnonymous) navigate('/profile');
      }, [user, loading]);

    return (
        <div>
            {loading ? <Loading color={'#4eada5'}/> : 
            <div>
                <div className='box-bg-white'>
                    {error ? <Alert severity='error'>An error occurred!</Alert> : ''}
                    <div className='log-in'>
                        <img className='pollit-logo' src={Logo} alt='Logo'></img>
                        <TextField id='outlined-search' label='Email' type='email'
                        onChange={(event) => {setEmail(event.target.value)}}/>
                        <TextField id='outlined-password-input' label='Password' type='password'
                        autoComplete='current-password' onChange={(event) => {setPassword(event.target.value)}}/>
                        <Button className='hover' variant='outlined' disabled={email === '' || password === ''}
                        onClick={() => logInWithEmailAndPassword(email, password)}>Login</Button>
                        <ResetPasswordModal/>
                    </div>
                    <div className='sign-up'>
                        <Typography variant='h4'>New to Pollit?</Typography>
                        <p>Create an account to host sessions, create questions, and save question sets.</p>
                        <SignUpModal/>
                        <JoinSessionModal isGuest={true}/>
                    </div>
                </div>
                <div className='background-image'></div>   
            </div>}   
        </div>
    );
};