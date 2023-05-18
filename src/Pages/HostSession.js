import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, remove, onValue } from 'firebase/database';
import { Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import TabContext from '@mui/lab/TabContext';
import { realtime } from '../Data/firebase';
import Logo from '../Design/Images/PollitLogoAlt.png';
import LogoAlt from '../Design/Images/PollitLogo.png';
import Responses from '../Components/Responses';
import AlertModal from '../Modals/AlertModal';
import HostTabs from '../Tabs/HostTabs';
import QuestionsTab from '../Tabs/QuestionsTab';
import ResponsesTab from '../Tabs/ResponsesTab';
import UsersTab from '../Tabs/UsersTab';
import WaitingTab from '../Tabs/WaitingTab';
import InvalidSession from './InvalidSession';
import '../Design/Sessions.css';

/**
 * Host view for session.
 * 
 * @param {*} param0 
 * @returns host page
 */
export default function HostSession( { mobileView } ) {

    const location = useLocation();
    let navigate = useNavigate();

    const [waiting, setWaiting] = useState([]);
    const [users, setUsers] = useState([]);
    const [responses, setResponses] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState({});
    const [data, setData] = useState([]);
    const [ended, setEnded] = useState(false);
    const [tab, setTab] = useState('Send Questions');

    const error = location.state ? false : true;
    const room = location.state ? location.state.room : 'invalid';

    const handleChange = (event, newTab) => {
        setTab(newTab);
    };

    /**
     * Grades responses and saves them to display at end of session.
     */
    const handleData = async () => {
        const graded_responses = responses.map((response) => {
        if (activeQuestion.answer && activeQuestion.answer !== '') {
            if (response.answer.toLowerCase() === activeQuestion.answer.toLowerCase()) {
                response.score = 1;
            } else {
                response.score = 0;
            }
        } else if (activeQuestion.options && activeQuestion.options.some(option => option.isAnswer === true)) {
            if (activeQuestion.type === 'MC') {
                for (const option of activeQuestion.options) {
                    if (option.isAnswer === true) {
                        if (response.answer === option.option) {
                            response.score = 1;
                        } else {
                            response.score = 0;
                        }
                    }
                }
            } else if (activeQuestion.type === 'MS') {
                var correct = 0;
                var total = 0;
                for (const option of activeQuestion.options) {
                    if (option.isAnswer === true) {
                        total++;
                        if (response.answer.split(', ').includes(option.option)) {
                            correct++;
                        } 
                    }
                }
                response.score = correct / total;
            }
        }
        return response;
        });
        await setData((list) => [...list, ...graded_responses]);
    }

    /**
     * Ends session for all users.
     */
    const endSession = async () => {
        try {
            const sessionRef = ref(realtime, 'sessions/' + location.state.room);
            await remove(sessionRef);
            setEnded(true);
        } catch (err) {
            console.error(err);
            alert('An error occured while ending this session.');
        }
    }

    useEffect(() => {

        // Warn before reload
        const handleTabClose = event => {
            event.preventDefault();
      
            console.log('beforeunload event triggered');
      
            return (event.returnValue =
              'Are you sure you want to exit?');
        };
      
        window.addEventListener('beforeunload', handleTabClose);

        // Validate session
        const roomRef = ref(realtime, 'sessions/' + room);
        onValue(roomRef, async (snapshot) => {
            if (!snapshot.exists()) {
                setEnded(true);
            }
        });
        if (!ended) {
            // Check waiting room
            const waitingRoomRef = ref(realtime, 'sessions/' + room + '/waiting');
            onValue(waitingRoomRef, async (snapshot) => {
                if (snapshot.exists()) {
                    var new_waiting = [];
                    snapshot.forEach((childSnapshot) => {
                        var item = childSnapshot.val();
                        item.id = childSnapshot.key;
                        new_waiting.push(item);
                    });
                    await setWaiting(new_waiting);
                } else {
                    setWaiting([]);
                }
            });
            // Check for active users
            const usersRef = ref(realtime, 'sessions/' + room + '/users');
            onValue(usersRef, async (snapshot) => {
                if (snapshot.exists()) {
                    var new_users = [];
                    snapshot.forEach((childSnapshot) => {
                        var item = childSnapshot.val();
                        item.id = childSnapshot.key;
                        new_users.push(item);
                    });
                    await setUsers(new_users);
                } else {
                    setUsers([]);
                }
            });
            // Fetch responses 
            const responsesRef = ref(realtime, 'sessions/' + room + '/responses');
            onValue(responsesRef, async (snapshot) => {
                if (snapshot.exists()) {
                    var new_responses = [];
                    snapshot.forEach((childSnapshot) => {
                        var item = childSnapshot.val();
                        item.id = childSnapshot.key;
                        new_responses.push(item);
                    });
                    await setResponses(new_responses);
                } else {
                    setResponses([]);
                }
            });
            // Get active question 
            const questionRef = ref(realtime, 'sessions/' + room + '/currQuestion');
            onValue(questionRef, async (snapshot) => {
                await setActiveQuestion(snapshot.val() ? snapshot.val() : {});
            });
        }

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };

    }, [ended, room]);

    if (error) {
        // Invalid permissions to access host view
        return (
            <InvalidSession />
        );
    } else if (ended) {
        // Displays responses available for download at end of session
        return (
            <div className='session-inactive'>
                <img className='pollit-logo' src={LogoAlt} alt='Logo'></img>
                <Responses data={data}/>
                <Button color='error' sx={{ fontSize: 20 }} startIcon={<LogoutIcon sx={{ width: 30, height: 30 }}/>} 
                onClick={() => navigate('/')}>Exit</Button>
            </div>
        );
    } else {
        return (
            <div className={mobileView ? 'session-mobile' : 'session'}>
                <div className={mobileView ? 'session-header' : 'session-sidebar'}>
                    {!mobileView ? <img className='session-logo' src={Logo} alt='Logo'></img> : <></>}
                    <Typography variant='h4'>{location.state.name}</Typography>
                    <Typography className = 'session-code' variant='h5' style={{fontWeight: 'bold'}}>
                        Session Code: <span style={{textDecoration: 'underline'}}>{location.state.room}</span>
                    </Typography>
                    <AlertModal title={'End Session'} 
                    description={'Are you sure you want to end this session?'} 
                    handleClick={endSession}/>
                </div>
                <div className={mobileView ? 'session-body-mobile' : 'session-body'}>
                    <Box sx={{ alignItems: 'center', display: 'grid', justifyContent: 'center', alignContent: 'center'}}>
                        <TabContext value={tab}>
                            <HostTabs handleChild={handleChange} responses={responses} waiting={waiting} users={users}/>
                            <QuestionsTab room={location.state.room} activeQuestion={activeQuestion} 
                                question_sets={location.state.question_sets} shared_sets={location.state.shared_sets} 
                                questions={location.state.questions} handleData={handleData}/>
                            <ResponsesTab responses={responses} activeQuestion={activeQuestion} />
                            <UsersTab users={users} room={location.state.room} />
                            <WaitingTab waiting={waiting} room={location.state.room} />
                        </TabContext>
                    </Box>
                </div>
            </div>
        );
    }
};