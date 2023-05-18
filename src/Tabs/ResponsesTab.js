import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import { labelledIcons } from '../Components/ConfidenceIcons';
import '../Design/Sessions.css';

/**
 * Tab for responses on host session view.
 * 
 * @param {*} param0 
 * @returns responses tab
 */
export default function ResponsesTab( { responses, activeQuestion } ) {
    return (
        <TabPanel value='Responses'>
            {activeQuestion.question ? 
            <Stack direction='column' spacing={2}>
                <Typography variant='h4'>{activeQuestion.question}</Typography>
                <Stack direction='column'>
                    {responses && responses.length > 0 ? responses.map((response, index) => 
                        <Stack key={index} spacing={1} direction='row' alignItems='center' justifyContent='center' padding={2}>
                            <strong>{response.user}:</strong> 
                            <p>{response.answer};</p>
                            <em>{response.confidence}</em>
                            <div>{labelledIcons[response.confidence]}</div>
                        </Stack>) : 
                        <Box display='grid' justifyContent='center' padding={2}>
                            <Typography>No responses.</Typography>
                        </Box>}
                </Stack>
            </Stack>
            : <Typography variant='h6'>Send a question to view responses.</Typography>}
        </TabPanel>
    );
};