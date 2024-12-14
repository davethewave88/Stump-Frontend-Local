import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import styles from './ProfileView.module.css';

const UpdateBio = (props)  => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [updatedUser, setUpdatedUser] = useState({bio:''});


    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
    };

    const editClose = () => {
        setOpen(false);
        setUpdatedUser({bio:''});
        setEditMessage('');
    };

    const editChange = (event) => {
        setUpdatedUser({...updatedUser,  [event.target.name]:event.target.value})
    }

    //bio is allowed to be blank
    const onSave = async () => {
        await props.save(updatedUser);
        editClose();
    }

    return (
        <>
            <Button className={styles.bioButton} onClick={editOpen}>Update Bio</Button>
            <Dialog open={open} >
                <DialogTitle>Update Bio</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4 style={{color: "red"}}>{editMessage}</h4>
                    <p>Enter your new bio:</p>
                    <TextField fullWidth multiline rows={4} name="bio" value={updatedUser.bio} onChange={editChange} variant="outlined"/>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UpdateBio;