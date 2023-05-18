import React from 'react';
import { Typography } from '@mui/material';
import QuestionSets from './QuestionSets';
import CreateQuestionsModal from '../Modals/CreateQuestionsModal';
import CreateSessionModal from '../Modals/CreateSessionModal';
import JoinSessionModal from '../Modals/JoinSessionModal';
import Logo from '../Design/Images/PollitLogo.png';
import '../Design/Dashboard.css';

/**
 * Component for dashboard on profile page.
 * 
 * @param {*} param0 
 * @returns dashboard
 */
export default function Dashboard( { name, user, questionSets, sharedSets, questions, photoURL } ) {
    return (
        <div className='question-set-container'>
            <img className='logo' src={Logo} alt='Logo'></img>
            <div className='button-container'>
                <div className='join-button'>
                <JoinSessionModal user={name} pic={photoURL}/>
                </div>
                {((questionSets && questionSets.length > 0) || (sharedSets && sharedSets.length > 0)) ? 
                <div className='create-button'>
                <CreateSessionModal host={name} host_id={user?.uid} question_sets={questionSets} shared_sets={sharedSets} questions={questions}/> 
                </div> : <></>}
            </div>
            <br/><br/>
            <div className='question-set-header'>
                <Typography variant='h4' gutterBottom>My Question Sets</Typography>
                <CreateQuestionsModal question_sets={questionSets} user_id={user?.uid}/>
            </div>
            {questionSets && questionSets.length > 0 ?
            <QuestionSets question_sets={questionSets} questions={questions} isOwner={true}/> : 
            <div>
                <h4>No question sets available.</h4>
                <p>Add questions to host your own sessions.</p>
            </div>}
            <Typography variant='h4'>Shared with me</Typography>
            {sharedSets && sharedSets.length > 0 ?
            <QuestionSets question_sets={sharedSets} questions={questions} /> : 
            <div>
                <h4>No shared question sets available.</h4>
            </div>}
        </div>
    );
}