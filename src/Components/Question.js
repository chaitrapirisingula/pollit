import React, { useState } from 'react';
import { Button, Box, FormControl, FormControlLabel, Checkbox, Radio, RadioGroup, Typography, TextField } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ConfidenceRating from './ConfidenceRating';
import Timer from './Timer';
import { realtime } from '../Data/firebase';
import { ref, push } from 'firebase/database';
import '../Design/Question.css';

/**
 * Component for question view on user side.
 * 
 * @param {*} param0 
 * @returns question
 */
export default function Question( { user, room, question } ) {

  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState([]);
  const [answerSent, setAnswerSent] = useState('');
  const [confidence, setConfidence] = useState('Super Confident');

  const handleChild = (level) => {
    setConfidence(level);
  };

  /**
   * Update answers selected for multi-select question.
   * 
   * @param {*} event 
   */
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
    var checkedItems = updatedList.length
    ? updatedList.reduce((total, choice) => {
        return total + ', ' + choice;
      })
    : '';
    setAnswer(checkedItems);
  };

  /**
   * Send answer to host.
   */
  const sendAnswer = async () => {
    const answerData = {
        user: question.anon === true ? 'Anonymous' : user,
        answer: answer,
        confidence: confidence,
        time: new Date(Date.now()).toISOString(),
        question: question.question
    }
    try {
      const responseRef = ref(realtime, 'sessions/' + room + '/responses');
      await push(responseRef, answerData);
      setAnswerSent(answer);
    } catch (err) {
      console.error(err);
      alert('An error occured while sending response.');
    }
  }

  return (
    <div className='question'> 
      {question.posted && question.limit > 0 ? <Timer posted={question.posted} limit={question.limit}/> : <></>}
      <div className='question-area'> 
        <Typography variant='h4'>{question.question}</Typography>
      </div>
      {question.hint ? <h3>Hint: {question.hint}</h3> : <></>}
      <Box className='answer-area' display='grid'>
        {question.type === 'MC' ? 
        <Box>
          <FormControl>
            <RadioGroup aria-labelledby='controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={answer} onChange={(event) => {setAnswer(event.target.value)}}>
              {question.options.map((option, index) => {
                return option ? 
                <div key={index} className='option-display'>
                  {question.showAnswer && option.isAnswer ? <Box m={1} pt={0.5}><TaskAltIcon color='success' /></Box> : <></>}
                  {question.showAnswer && !option.isAnswer ? <Box m={1} pt={0.5}><HighlightOffIcon color='error' /></Box> : <></>}
                  <FormControlLabel value={option.option} control={<Radio />} label={option.option} />
                </div> 
              : <></>})}
            </RadioGroup>
          </FormControl>
        </Box> : <></>}
        {question.type === 'MS' ? 
        <Box>
          {question.options.map((option, index) => {
            return option ? 
            <div key={index} className='option-display'>
                {question.showAnswer && option.isAnswer ? <Box m={1} pt={0.5}><TaskAltIcon color='success' /></Box> : <></>}
                {question.showAnswer && !option.isAnswer ? <Box m={1} pt={0.5}><HighlightOffIcon color='error' /></Box> : <></>}
                <FormControlLabel control={<Checkbox onChange={handleCheck} value={option.option}/>} label={option.option}/> 
            </div> 
          : <></>})}
        </Box> : <></>}
        {question.type === 'FR' ? 
          <TextField multiline sx={{ width: '20rem', backgroundColor: '#ffffff' }} 
          id='outlined-multiline-flexible' label='Answer' rows={10} 
          onChange={(event) => {setAnswer(event.target.value)}} />
        : <></>}
        <br/><br/>
        {question.showAnswer && question.type === 'FR' ? <h2>{'Correct Answer: ' + question.answer}</h2> : <></>}
        <br/><br/>
        <ConfidenceRating handleChild={handleChild}/>
        <Button variant='contained' disabled={answer === '' || answerSent !== '' || question.ended === true} onClick={sendAnswer}>Submit</Button>
        <br/><br/>
        {answerSent !== '' ? <Typography>You answered: {answerSent}</Typography> : <></>}
      </Box>
    </div>
  );
}