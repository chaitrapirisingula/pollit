import React from 'react';
import { Badge, Box, Tab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/Group';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PendingIcon from '@mui/icons-material/Pending';
import TabList from '@mui/lab/TabList';

/**
 * Tabs on host session view.
 * 
 * @param {*} param0 
 * @returns host tabs
 */
export default function HostTabs( { handleChild, responses, waiting, users } ) {
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={(event, newTab) => handleChild(event, newTab)}  
            sx={{'& .MuiTabs-flexContainer': { flexWrap: 'wrap' }}}
            aria-label='lab API tabs example' textColor='secondary' indicatorColor='secondary' centered>
                <Tab label={
                    <div className='tab-label'>
                        <p>Send Questions</p>
                        <SendIcon />
                    </div>} value='Send Questions' />
                <Tab label={
                    <div className='tab-label'>
                        <p>Responses</p>
                        <Badge badgeContent={responses.length} color='secondary'>
                            <QuestionAnswerIcon />
                        </Badge>
                    </div>} value='Responses' />
                <Tab label={
                    <div className='tab-label'>
                        <p>Active Users</p>
                        <Badge badgeContent={users.length} color='secondary'>
                            <GroupIcon />
                        </Badge>
                    </div>} value='Active Users' />
                <Tab label={
                    <div className='tab-label'>
                        <p>Waiting Room</p>
                        <Badge badgeContent={waiting.length} color='secondary'>
                            <PendingIcon />
                        </Badge>
                    </div>} value='Waiting Room' />
            </TabList>
        </Box>
    );
};