import React, { useState } from 'react';
import { ref, set, remove } from 'firebase/database';
import { Alert, Typography, TextField, Button, Box, Snackbar, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import TabPanel from '@mui/lab/TabPanel';
import { realtime } from '../Data/firebase';
import QuestionSets from '../Components/QuestionSets';
import SendHintModal from '../Modals/SendHintModal';
import Timer from '../Components/Timer';
import '../Design/Sessions.css';

/**
 * Send questions tab on host session view.
 * 
 * @param {*} param0 
 * @returns questions tab
 */
export default function QuestionsTab( { room, activeQuestion, question_sets, shared_sets, questions, handleData } ) {

    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [answerShown, setAnswerShown] = useState(false);
    const [anon, setAnon] = useState(false);
    const [timeLimit, setTimeLimit] = useState(false);
    const [valid, setValid] = useState(true);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(10);

    const handleChild = (question) => {
        setSelectedQuestion(question);
    };

    const [open, setOpen] = useState(false);

    /**
     * Close success alert.
     * 
     * @param {*} event 
     * @param {*} reason 
     * @returns closes alert
     */
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSuccess = () => {
        setOpen(true);
    }

    /**
     * Sends question to users in the session.
     */
    const sendQuestion = async () => {
        if (timeLimit && (!(minutes > 0 || seconds > 0) || minutes > 59  || seconds > 59)) {
            setValid(false);
        } else {
            try {
                let q = {...selectedQuestion};
                if (timeLimit) {
                    q.limit = (minutes * 60000) + (seconds * 1000);
                } 
                q.anon = anon;
                q.posted = new Date(Date.now()).toISOString();
                const questionRef = ref(realtime, 'sessions/' + room + '/currQuestion');
                await set(questionRef, q);
                setSelectedQuestion({});
            } catch (err) {
                console.error(err);
                alert('An error occured while posting this question.');
            }
        }
    }

    /**
     * Closes question for users.
     */
    const closeQuestion = async () => {
        try {
            await handleData();
            const questionRef = ref(realtime, 'sessions/' + room + '/currQuestion');
            await remove(questionRef);
            const responseRef = ref(realtime, 'sessions/' + room + '/responses');
            await remove(responseRef);
            setAnswerShown(false);
        } catch (err) {
            console.error(err);
            alert('An error occured while closing this question.');
        }
    }

    /**
     * Displays that time limit for question has ended.
     */
    const endTime = async () => {
        try {
            const timeRef = ref(realtime, 'sessions/' + room + '/currQuestion/ended');
            await set(timeRef, true);
        } catch (err) {
            console.error(err);
            alert('An error occured while showing time limit.');
        }
    }

    /**
     * Displays answer from users.
     */
    const showAnswer = async () => {
        try {
            const answerRef = ref(realtime, 'sessions/' + room + '/currQuestion/showAnswer');
            await set(answerRef, true);
            setAnswerShown(true);
        } catch (err) {
            console.error(err);
            alert('An error occured while displaying answer.');
        }
    }

    /**
     * Hides answer if already displayed.
     */
    const hideAnswer = async () => {
        try {
            const answerRef = ref(realtime, 'sessions/' + room + '/currQuestion/showAnswer');
            await remove(answerRef);
            setAnswerShown(false);
        } catch (err) {
            console.error(err);
            alert('An error occured while hiding answer.');
        }
    }


    return (
        <TabPanel value='Send Questions'>
            <Box display='grid'>
                <div className='send-close-questions'>
                    {activeQuestion.question ? 
                    <div>
                        <Typography variant='h6'>Current Question: {activeQuestion.question}</Typography> 
                        <Box padding={1}>
                            {activeQuestion.anon === true ? <Typography variant='h6' sx={{fontStyle: 'italic'}}>Anonymous</Typography> : <></>}
                            {activeQuestion.posted && activeQuestion.limit > 0 && !activeQuestion.ended ? 
                                <Timer posted={activeQuestion.posted} limit={activeQuestion.limit} handleEnd={endTime}/> : <></>}
                            {activeQuestion.ended ? <h2>Times up!</h2> : <></>}
                            <Box display='flex' gap={1} justifyContent='center'> 
                                <Button startIcon={<CloseIcon/>} variant='contained' color='error' onClick={closeQuestion}>Close Question</Button>
                                <SendHintModal room={room} handleSuccess={handleSuccess}/>
                                {((activeQuestion.type === 'FR' && activeQuestion.answer) || (activeQuestion.options && 
                                activeQuestion.options.some(option => option.isAnswer === true))) && !answerShown ? 
                                <Button variant='contained' color='success' onClick={showAnswer}>Show answer</Button> : <></>}
                                {answerShown ? <Button variant='contained' color='error' onClick={hideAnswer}>Hide answer</Button> : <></>}
                            </Box>
                        </Box>
                    </div>
                    : <></>}
                    {selectedQuestion.question && !activeQuestion.question ? 
                    <div>
                        <Typography variant='h6' padding={1}>{'Question Selected: ' + selectedQuestion.question}</Typography>
                        <Typography variant='h7' sx={{fontStyle: 'italic'}}>Add optional settings:</Typography>
                        <Box display='grid' justifyContent='center' alignItems='center'>
                            <FormControlLabel control={
                                <Switch checked={anon} onChange={(event) => {
                                    setAnon(!anon);
                                }} />} 
                            label={'Anonymous'} />
                        </Box>
                        <Box display='grid' justifyContent='center' alignItems='center' padding={1}>
                            {timeLimit ? <Button variant='contained' endIcon={<TimerOffIcon/>} onClick={() => setTimeLimit(false)}>Clear Timer</Button> :
                            <Button variant='contained' startIcon={<TimerIcon/>} onClick={() => setTimeLimit(true)}>Set Timer</Button>}
                            {timeLimit ? 
                            <Box display='grid'>
                                {!valid ? <Alert severity='error'>Invalid input</Alert> : <></>}
                                <Box display='flex'>
                                    <TextField sx={{ m: 1 }} id='minutes-input' name='minutes' value={minutes}
                                        label='Minutes' type='number' InputLabelProps={{ shrink: true }} 
                                        InputProps={{ inputProps: { min: 0, max: 59 } }}
                                        onChange={(event) => setMinutes(event.target.value)} />
                                    <TextField sx={{ m: 1 }} id='seconds-input' name='seconds' value={seconds}
                                        label='Seconds' type='number' InputLabelProps={{ shrink: true }} 
                                        InputProps={{ inputProps: { min: 0, max: 59 } }}
                                        onChange={(event) => setSeconds(event.target.value)}/> 
                                </Box>
                            </Box>: <></>}
                        </Box>
                        <Button variant='contained' color='success' onClick={sendQuestion}>Send Question</Button>
                    </div>
                    : <></>}
                    {!selectedQuestion.question && !activeQuestion.question ? <Typography variant='h6'>Select a question</Typography> : <></>}
                </div>
                <div className='session-content'>
                    <Typography variant='h3'>My Questions</Typography>
                    <div className='question-sets-container'>
                        <QuestionSets question_sets={question_sets} questions={questions} handleChild={handleChild}/>
                    </div>
                    {shared_sets && shared_sets.length > 0 ?
                    <div>
                        <Typography variant='h4'>Shared with me</Typography>
                        <QuestionSets question_sets={shared_sets} questions={questions} handleChild={handleChild}/>
                    </div>
                    : <></>}
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity='success' variant='filled' sx={{ width: '100%' }}>Success!</Alert>
                    </Snackbar>
                </div>
            </Box>
        </TabPanel>
    );
};