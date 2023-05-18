import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { ref, remove, onValue } from 'firebase/database';
import { realtime } from '../Data/firebase';
import Question from '../Components/Question';
import Loading from '../Components/Loading';
import Logo from '../Design/Images/PollitLogoAlt.png';
import LogoAlt from '../Design/Images/PollitLogo.png';
import AlertModal from '../Modals/AlertModal';
import InvalidSession from './InvalidSession';
import '../Design/Sessions.css';

/**
 * User view for sessions.
 * 
 * @param {*} param0 
 * @returns user session page
 */
export default function UserSession( { mobileView } ) {

    const location = useLocation();
    const navigate = useNavigate();

    const [currQuestion, setCurrQuestion] = useState({});
    const [isActive, setIsActive] = useState(true);
    const [approved, setApproved] = useState(false);
    const [waiting, setWaiting] = useState(true);

    const error = location.state ? false : true;
    const room = location.state ? location.state.room : 'invalid';
    const id = location.state ? location.state.id : 'invalid';

    /**
     * Allows a user to remove themselves from a session.
     */
    const leaveSession = async () => {
        try {
            const userRef = ref(realtime, 'sessions/' + room + '/users/' + id);
            await remove(userRef); 
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('An error occured while leaving session.');
        }
    }

    /**
     * Allows a user to leave a session while they are in the waiting room.
     */
    const leaveWaitingRoom = async () => {
        try {
            const waitingRef = ref(realtime, 'sessions/' + room + '/waiting/' + id);
            await remove(waitingRef); 
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('An error occured while leaving waiting room.');
        }
    }

    useEffect(() => {

        // Validate that session is active
        const roomRef = ref(realtime, 'sessions/' + room);
        onValue(roomRef, async (snapshot) => {
            if (!snapshot.exists()) {
                setIsActive(false);
            }
        });

        // Check for host approval
        const usersRef = ref(realtime, 'sessions/' + room + '/users/' + id);
        onValue(usersRef, async (snapshot) => {
            if (snapshot.exists()) {
                setApproved(true);
            } else {
                setApproved(false);
            }
        });

        // Check if user is in waiting room
        const waitingRef = ref(realtime, 'sessions/' + room + '/waiting/' + id);
        onValue(waitingRef, async (snapshot) => {
            if (snapshot.exists()) {
                setWaiting(true);
            } else {
                setWaiting(false);
            }
        });
   
        // Check for posted questions
        const questionRef = ref(realtime, 'sessions/' + room + '/currQuestion');
        onValue(questionRef, async (snapshot) => {
            await setCurrQuestion(snapshot.val() ? snapshot.val() : {});
        });
    }, [room, id]);

    if (error || !isActive) {
        // Invalid permissions to access session
        return (
            <InvalidSession />
        );
    } else if (waiting) {
        // User is in waiting room
        return (
            <div className='session-inactive'>
                <div>
                    <img className='pollit-logo' src={LogoAlt} alt='Logo'></img>
                    <Loading message={'Waiting for host approval'} color={'#4eada5'}/>
                    <AlertModal title={'Leave'} color='error'
                    description={'Are you sure you want to leave the waiting room for this session?'} 
                    handleClick={leaveWaitingRoom}/>
                </div>
            </div>
        );
    } else if (!waiting && !approved) {
        // User was denied access by the host
        return (
            <div className='session-inactive'>
                <div>
                    <img className='pollit-logo' src={LogoAlt} alt='Logo'></img>
                    <p>Session access denied.</p>
                    <Button color='error' sx={{ fontSize: 20 }} startIcon={<LogoutIcon sx={{ width: 30, height: 30 }}/>} 
                    onClick={() => navigate('/')}>Exit</Button>
                </div>
            </div>
        );
    } else {
        // Valid session
        return (
            <div className={mobileView ? 'session-mobile' : 'session'}>
                <div className={mobileView ? 'session-header' : 'session-sidebar'}>
                    {!mobileView ? <img className='session-logo' src={Logo} alt='Logo'></img> : <></>}
                    <Typography variant='h4'>{location.state.name}</Typography>
                    <Typography variant='h5'>Host: {location.state.host}</Typography>
                    <AlertModal title={'Exit Session'} 
                    description={'Are you sure you want to exit this session?'} 
                    handleClick={leaveSession}/>
                </div>
                <div className='session-body'> 
                    {currQuestion.question ? <Question user={location.state.user} room={location.state.room} question={currQuestion}/> : 
                    <Loading message={'Please wait for the host to post a question.'} color={'#4eada5'}/>}
                </div>
            </div>
        );
    }
};