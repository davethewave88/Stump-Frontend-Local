import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';
import UserAdd from './UserAdd';
import Button from "@mui/material/Button";
import { confirmAlert } from 'react-confirm-alert';

function CommentsView() {
    const headers = ['ID', 'User', 'Time', 'Text', ''];

    const [comments, setComments] = useState([  ]);

    const [message, setMessage] = useState('');

    const jwt = sessionStorage.getItem('jwt');

    //fetch comments across all posts
    const  fetchComments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/comments`,
                {
                    headers: {'Authorization': jwt}
                });
            if (response.ok) {
                const comments = await response.json();
                setComments(comments);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }



    useEffect( () => {
        fetchComments();
    }, []);

    //delete a comment
    const deleteComment = async (id) => {
        try {
            const response = await fetch(`${SERVER_URL}/comments/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt,
                    },
                });
            if (response.ok) {
                setMessage("Comment deleted");
                fetchComments();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }


    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const id = comments[row_idx].comment_id;

        const isConfirmed = window.confirm('Do you really want to delete this comment?');

        if (isConfirmed) {
            // If user clicks "Yes" (OK in confirm dialog), delete the user
            deleteComment(id);
        }
    }

    return(
        <div className="containerWrapper">
            <div className="container">
            <h1>Manage Comments</h1>
            <h4 style={{color: "red"}}>{message}</h4>
            <table>
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {comments.map((comment) => (
                    <tr key={comment.comment_id}>
                        <td>{comment.comment_id}</td>
                        <td>{comment.name}</td>
                        <td>{comment.create_time}</td>
                        <td>{comment.text}</td>
                        <td><Button onClick={onDelete}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </div>
    );
}
export default CommentsView;
