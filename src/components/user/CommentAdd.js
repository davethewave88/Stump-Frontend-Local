import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {useParams} from "react-router-dom";
import TextField from "@mui/material/TextField";

const CommentAdd = (props)  => {

    const login_id = sessionStorage.getItem("login_id");
    const login_name = sessionStorage.getItem("login_name");
    const params = useParams();
    const postId = parseInt(params.id);
    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [comment, setComment] = useState({creator_id:login_id, post_id:postId, name:login_name, text:''});


    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
    };

    const editClose = () => {
        setOpen(false);
        setComment({creator_id:login_id, post_id:postId, name:login_name, text:''});
        setEditMessage('');
    };

    const editChange = (event) => {
        setComment({...comment,  [event.target.name]:event.target.value})
    }

    //comment cannot be blank
    const onSave = () => {
        if (!comment.text.trim()) {
            alert('Comment cannot be empty');
            return;
        }
        props.save(comment);
        editClose();
    };


    return (
        <>
            <Button onClick={editOpen}>Add Comment</Button>
            <Dialog open={open} >
                <DialogTitle>Add Comment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4>{editMessage}</h4>
                    <p>Enter comment:</p>
                    <TextField fullWidth multiline rows={4} name="text" value={comment.text} onChange={editChange} variant="outlined"/>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CommentAdd;