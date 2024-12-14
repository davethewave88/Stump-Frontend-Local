import React, {useState} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import styles from './AdminLayout.module.css';

const NewsAdd = (props) => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [post, setPost] = useState({title:'', description:''});


    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
    };

    const editClose = () => {
        setOpen(false);
        setPost({title:'', description:''});
        setEditMessage('');
    };

    const editChange = (event) => {
        setPost({...post,  [event.target.name]:event.target.value})
    };

    //fields must be complete
    const onSave = () => {
        if (!post.title || !post.description) {
            setEditMessage("All fields are required.");
        } else {
            props.save(post);
            setEditMessage("News saved successfully.");
            editClose();
        }
    };


    return (
        <>
            <Button onClick={editOpen} className={styles.postButton} >Add News</Button>
            <Dialog open={open} >
                <DialogTitle>Add Post</DialogTitle>
                <DialogContent >
                    <h4>{editMessage}</h4>
                    <TextField style={{padding:10}} fullWidth label="Title" name="title" value={post.title} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth multiline rows={4} label="Description" name="description" value={post.description} onChange={editChange} variant= 'outlined' />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default NewsAdd;