import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import styles from './Login.module.css';

const CreateAccount = (props)  => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [user, setUser] = useState({name: '', email:'', bio: ''});


    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
    };

    const editClose = () => {
        setOpen(false);
        setUser({name: '', email:'', bio: ''});
        setEditMessage('');
    };

    const editChange = (event) => {
        setUser({...user,  [event.target.name]:event.target.value})
    }

    //only username and email required for new account
    const onSave = () => {
        if (!user.name || !user.email) {
            setEditMessage("Username and email fields are required.");
            return;
        }
        if (!user.email.includes('@')) {
            setEditMessage("Please enter a valid email.");
            return;
        }
        props.save(user);
        editClose();
    }


    return (
        <>
            <Button className={styles.createAccount} onClick={editOpen}>Create Account</Button>
            <Dialog open={open} >
                <DialogTitle>Create Account</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4 style={{color: 'red'}}>{editMessage}</h4>
                    <p>Enter information:</p>
                    <TextField style={{padding:10}} fullWidth label="username" name="name" value={user.name} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth label="email" name="email" value={user.email} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth multiline rows={4} label="bio" name="bio" value={user.bio} onChange={editChange} variant="outlined"/>
                    <p>Your password will be your name + "2024" Example:</p>
                    <p>Username: David</p>
                    <p>Password: David2024</p>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CreateAccount;