import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import InfoCard from '../Components/InfoCard';
import DeleteSetModal from '../Modals/DeleteSetModal';
import ShareSetsModal from '../Modals/ShareSetsModal';
import '../Design/Question.css';

/**
 * Wrapper for question sets.
 * 
 * @param {*} param0 
 * @returns question set wrapper
 */
export default function QuestionSets( { question_sets, questions, handleChild, isOwner } ) {

    const [selectedSet, setSelectedSet] = useState({});

    const handleClick = (qSet) => {
        if (qSet.id === selectedSet.id) {
            setSelectedSet({});
        } else {
            setSelectedSet(qSet);
        }
    };

    return (
        <div className='sets-wrapper'>
            {question_sets.map((qSet, index) => 
                <div key={index}>
                    <Button sx={{ fontSize: 25 }} endIcon={qSet.shared_users && qSet.shared_users.length > 0 ? <FolderSharedIcon sx={{ width: 50, height: 50 }}/> : 
                        <FolderIcon sx={{ width: 50, height: 50 }}/>} onClick={() => handleClick(qSet)}>{qSet.name}</Button>
                    {qSet.id === selectedSet.id ? 
                    <div className='set_info'>
                        {isOwner ? 
                        <Box display='flex' justifyContent='center' gap={1}>
                            <ShareSetsModal questionSet={qSet} /> 
                            <DeleteSetModal questionSet={qSet} />
                        </Box>
                        : <></>}
                        {qSet.question_ids.map((qId, index) => <div className='question_card' key={index}>
                            {<InfoCard props={questions.get(qId)} handleChild={handleChild}/>}</div>)}
                    </div> : ''}
                </div>
            )}
        </div>
    );
    
}