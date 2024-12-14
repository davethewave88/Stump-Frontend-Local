import React, {useState} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import styles from './user/ProfileView.module.css';

const PostAdd = (props) => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const login_id = sessionStorage.getItem("login_id");
    const login_name = sessionStorage.getItem('login_name');
    const [post, setPost] = useState({creator_id:login_id, username:login_name, link:'',title:'', description:''});

    /*
     *  dialog for add post
     */
    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
    };

    const editClose = () => {
        setOpen(false);
        setPost({creator_id:login_id, username:login_name, link:'',title:'', description:''});
        setEditMessage('');
    };

    const editChange = (event) => {
        setPost({...post,  [event.target.name]:event.target.value})
    };

    //all post fields must be filled
    const onSave = () => {
        if (!post.link || !post.title || !post.description) {
            setEditMessage("All fields are required.");
        } else {
            props.save(post);
            setEditMessage("Post saved successfully.");
            editClose();
        }
    };


    return (
        <>
            <Button className={styles.postButton} onClick={editOpen}>Add Post</Button>
            <Dialog open={open} >
                <DialogTitle>Add Post</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4 style={{color: "red"}}>{editMessage}</h4>
                    <TextField style={{padding:10}} fullWidth label="Link" name="link" value={post.link} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth label="Title" name="title" value={post.title} onChange={editChange}  />
                    <TextField style={{padding:10}} fullWidth multiline rows={4} variant="outlined" label="Description" name="description" value={post.description} onChange={editChange}  />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PostAdd;