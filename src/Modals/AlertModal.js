import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/**
 * Color for theme.
 */
const theme = createTheme({
  palette: {
    neutral: {
      main: '#FFFFFF',
    },
  },
});

/**
 * Alerts user before performing an action.
 *  
 * @param {*} param0 
 * @returns alert modal
 */
export default function AlertModal( { title, color, description, handleClick } ) {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Button color={color ? color : 'neutral'} sx={{ fontSize: 18 }} startIcon={<LogoutIcon sx={{ width: 22, height: 22 }}/>} 
                    onClick={handleClickOpen}>{title}</Button> 
            </ThemeProvider>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClick} autoFocus>{title}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};