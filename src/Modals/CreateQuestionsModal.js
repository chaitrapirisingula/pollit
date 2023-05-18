import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField } from '@mui/material';
import { db } from '../Data/firebase';
import { collection, doc, addDoc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Modal to create new question sets or update existing sets.
 * 
 * @param {*} param0 
 * @returns question creation modal
 */
export default function CreateQuestionsModal({ user_id, question_sets }) {
  
    const [inputFields, setInputFields] = useState([{ question: '', type: '' }]);
    const [choice, setChoice] = useState('');
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [questionSet, setQuestionSet] = useState('');
    const [questions, setQuestions] = useState([]);

    // Input validation - ensures all required feilds are filled in
    const choiceValidation = (choice === '') || (choice === 'NEW' && name === '') || (choice === 'UPDATE' && questionSet === '');
    const questionValidation = inputFields.every(input => (input.question && input.type && ((input.options && input.options.every(option => (option.option))) || input.type === 'FR')));
    const invalid = choiceValidation || !questionValidation;

    /**
     * Adds question to database.
     * 
     * @param {*} input 
     */
    const createQuestion = async (input) => {
        try {
            const ref = collection(db, 'questions');
            if (input.type === 'MC' || input.type === 'MS') {
                const docRef = await addDoc(ref, input);
                questions.push(docRef.id);
            } else if (!input.answer) {
                const docRef = await addDoc(ref, {question: input.question, type: input.type});
                questions.push(docRef.id);
            } else {
                const docRef = await addDoc(ref, {question: input.question, type: input.type, answer: input.answer});
                questions.push(docRef.id);
            }
            await setQuestions(questions);
        } catch (err) {
            console.error(err);
            alert('An error occured while creating a question.');
        }
    }

    /**
     * Adds questions to existing question set.
     */
    const addToExistingSet = async () => {
        try {
            const ref = doc(db, 'question_sets', questionSet);
            const data = await getDoc(ref);
            const q_ids = data.get('question_ids');
            const new_questions = q_ids.concat(questions);
            await setQuestions(new_questions);
            await setDoc(ref, { question_ids: new_questions }, { merge: true });
        } catch (err) {
            console.error(err);
            alert('An error occured while adding to question set');
        }
    };

    /**
     * Creates question set with all inputted questions.
     */
    const createSet = async () => {
        if (questionSet !== '' && choice === 'UPDATE') {
            for await (const question of inputFields) {
                await createQuestion(question);
            }
            await addToExistingSet();
        } else if (name !== '' && choice === 'NEW') {
            try {
                for await (const question of inputFields) {
                    await createQuestion(question);
                }
                const ref = collection(db, 'question_sets');
                await addDoc(ref, {name: name, owner_id: user_id, question_ids: questions})
            } catch (err) {
                console.error(err);
                alert('An error occured while creating the question set');
            }
        } 
        window.location.reload();
    };

    /**
     * Updates question inputs.
     * 
     * @param {*} id 
     * @param {*} event 
     * @param {*} option_id 
     * @param {*} type 
     */
    const handleChangeInput = (id, event, option_id, type) => {
        const newInputFields = inputFields.map((input, index) => {
            if (index === id) {
                if (event.target.name === 'options') {
                    if (type === 'answer') {
                        input[event.target.name][option_id].isAnswer = event.target.checked;
                    } else {
                        input[event.target.name][option_id].option = event.target.value;
                    }
                } else {
                    input[event.target.name] = event.target.value;
                }
            }
            return input;
        });
        setInputFields(newInputFields);
    };

    /**
     * Updates number of options.
     * 
     * @param {*} id 
     * @param {*} event 
     */
    const handleChangeNumOptionsInput = (id, event) => {
        if (event.target.value > 0 && event.target.value < 11) {
            const newInputFields = inputFields.map((input, index) => {
                if(index === id) {
                    input[event.target.name] = event.target.value;
                    if (!input['options']) {
                        input['options'] = [];
                    }
                    if (input['options'].length > event.target.value) {
                        while (input['options'].length > event.target.value) {
                            input['options'].pop();
                        }
                    } else if (input['options'].length < event.target.value) {
                        for (var j = input['options'].length - 1; j < event.target.value - 1; j++) {
                            input['options'].push({});
                        }
                    }
                }
                return input;
            });
            setInputFields(newInputFields);
        }
    };

    const handleAddFields = () => {
        setInputFields([...inputFields, { question: '', type: '' }])
    };

    const handleRemoveFields = (id) => {
        const values  = [...inputFields];
        values.splice(id, 1);
        setInputFields(values);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setInputFields([{ question: '', type: '' }]);
        setName('');
        setQuestionSet('');
        setQuestions([]);
        setChoice('');
        setOpen(false);
    };

    return (
        <div>
            <Button variant='outlined' endIcon={<AddIcon/>} onClick={handleClickOpen}>Add Questions</Button>
            <Dialog maxWidth='md' open={open} onClose={handleClose}>
                <DialogTitle>Add Questions</DialogTitle>
                <DialogContent>
                    <FormControl required>
                        <RadioGroup aria-labelledby='controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={choice} onChange={(event) => {setChoice(event.target.value)}}>
                            <FormControlLabel value='NEW' control={<Radio />} label='Create New Set' />
                            <FormControlLabel value='UPDATE' control={<Radio />} label='Update Existing Set' />
                        </RadioGroup>
                    </FormControl>
                    {choice === 'NEW' ? <TextField fullWidth sx={{ mt: 1 }} required name='name' label='Set Name' value={name} onChange={(event) => setName(event.target.value)}/> : '' }
                    {choice === 'UPDATE' ? 
                    <FormControl sx={{ mt: 1 }} fullWidth required>
                        <InputLabel id='select-label'>Question Set</InputLabel>
                        <Select required labelId='set-select-label' id='set-simple-select' value={questionSet} label='Question Set' onChange={(event) => setQuestionSet(event.target.value)}>   
                            {question_sets.map((qSet, index)=> <MenuItem key={index} value={qSet.id}>{qSet.name}</MenuItem>)}
                        </Select>
                    </FormControl> : ''}
                    <div className='questions-input'>
                        {inputFields.map((inputField, index) => (
                        <Box sx={{ mt: 2 }} key={index}>
                            <TextField sx={{ m: 1 }} fullWidth required name='question' label='Question' variant='filled' value={inputField.question} onChange={(event) => handleChangeInput(index, event)}/>
                            <FormControl sx={{ m: 1 }} fullWidth required>
                                <InputLabel id='type-label'>Type</InputLabel>
                                <Select required labelId='type-select-label' id='type-select' name='type' value={inputField.type} label='Type' onChange={(event) => handleChangeInput(index, event)}>   
                                    <MenuItem value={'FR'}>Free Response</MenuItem>
                                    <MenuItem value={'MC'}>Multiple Choice</MenuItem>
                                    <MenuItem value={'MS'}>Multi Select</MenuItem>
                                </Select>
                            </FormControl>
                            {inputField.type === 'MC' || inputField.type === 'MS' ? 
                            <TextField sx={{ m: 1 }} required id='outlined-number' name='numOptions' value={inputField.numOptions || ''}
                            label='Number of options' type='number' InputLabelProps={{ shrink: true }} 
                            onChange={(event) => handleChangeNumOptionsInput(index, event)}/> : <></>}
                            {inputField.options && (inputField.type === 'MC' || inputField.type === 'MS') ? 
                            <div>
                                {inputField.options.map((option, i) => (
                                    <Box key={i}>
                                        <TextField key={i+'option'} sx={{ m: 1 }} name='options' label='Option' variant='filled' value={option.option || ''} onChange={(event) => handleChangeInput(index, event, i, 'value')}/>
                                        <FormControlLabel key={i+'option-answer'} control={
                                             <Switch name='options' checked={option.isAnswer || false} onChange={(event) => handleChangeInput(index, event, i, 'answer')} color='success'/>
                                        } label={'Answer'} />
                                    </Box>
                                ))}
                            </div>
                            : <></>}
                            {inputField.type === 'FR' ? 
                            <TextField sx={{ m: 1 }} fullWidth name='answer' label='Answer' variant='filled' value={inputField.answer || ''} onChange={(event) => handleChangeInput(index, event)}/> 
                            : <></>}
                            <IconButton disabled={inputFields.length === 1} onClick={() => handleRemoveFields(index)}>
                                <RemoveIcon />
                            </IconButton>
                            <IconButton onClick={handleAddFields}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        ))}
                    </div>
                    {invalid ? <Alert severity='warning'>Fill in all required fields.</Alert> : <></>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={invalid} onClick={createSet}>Finish</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};