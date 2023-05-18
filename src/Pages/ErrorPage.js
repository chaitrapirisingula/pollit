import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import Logo from '../Design/Images/PollitLogo.png';

/**
 * Page displayed when a link is not found.
 * 
 * @returns error page
 */
export default function ErrorPage() {

    let navigate = useNavigate();

    return (
        <Box display='grid' justifyContent='center' padding={4}>
            <img className='pollit-logo' src={Logo} alt='Logo'></img>
            <Card>
                <CardContent>
                    <Typography variant='h4'>404: Page Not Found.</Typography>
                </CardContent>
                <Box display='grid' alignItems='center' justifyContent='center'>
                    <CardActions>
                        <Button size='small' onClick={() => navigate('/')}>Back to Pollit</Button>
                    </CardActions>
                </Box>
            </Card>
        </Box>
    );
};