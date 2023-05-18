import React, { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, Collapse, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../Design/InfoCard.css';

/**
 * Used to expand card for more information.
 */
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
 * Component for question card.
 * 
 * @param {*} param0 
 * @returns question card
 */
export default function InfoCard( { props, handleChild } ) {

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className='info-card'> 
      <Card sx={{ maxWidth: 270 }}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>{props.question}</Typography>
          <Typography variant='body2' color='text.secondary'>
            {props.type === 'FR' ? 'Free Response' : <></>}
            {props.type === 'MC' ? 'Multiple Choice' : <></>}
            {props.type === 'MS' ? 'Multi Select' : <></>}
          </Typography>
          {props.answer ? <Typography variant='body' color='green'>{'Answer: ' + props.answer}</Typography> : <></>}
        </CardContent>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <CardActions>
            {handleChild ? <Button size='small' onClick={() => handleChild(props)}>Select</Button> : <></>}
            <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
        </Box>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            {props.options && props.options.length > 0 ? 
            <Box>
              <Typography paragraph>Options</Typography>
              <Box className='options_wrapper'>{props.options.map((option, index) => <Typography paragraph key={index} 
              color={option.isAnswer ? 'green' : ''}>{option.option}</Typography>)}</Box>
            </Box>
            : <Typography paragraph>No options</Typography>}
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}