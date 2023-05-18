import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Displays time remaining to answer question.
 * 
 * @param {*} param0 
 * @returns timer
 */
export default function Timer({ posted, limit, handleEnd }) {
    
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [ended, setEnded] = useState(false);

    /**
     * Updates time left.
     */
    const getTime = () => {

        var time = limit - (new Date(Date.now()) - new Date(posted));

        if (time < 0) {
            setMinutes(0);
            setSeconds(0);
            setEnded(true);
            if (handleEnd) {
                handleEnd();
            }
        } else {
            setMinutes(Math.floor((time / 1000 / 60) % 60));
            setSeconds(Math.floor((time / 1000) % 60));
        }
    };

    useEffect(() => {
        if (!ended) {
            const interval = setInterval(() => getTime(), 1000);
            return () => clearInterval(interval);
        }
    }, [minutes, seconds]);

    return (
        <Box display='grid' justifyContent='center' padding={1}>
            {ended ? <Typography variant='h4'>Times up!</Typography> : <Typography variant='h4'>Time remaining:</Typography>} 
            <Typography variant='h4'>{minutes > 9 ? minutes : '0' + minutes}:{seconds > 9 ? seconds : '0' + seconds}</Typography>
        </Box>
    );
};