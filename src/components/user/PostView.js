import React, {useEffect, useState} from "react";
import {SERVER_URL} from "../../Constants";
import {useParams} from "react-router-dom";
import CommentAdd from './CommentAdd';
import styles from './PostView.module.css';

function PostView() {

    const [post, setPost]= useState('');

    const [comments, setComments]= useState([]);

    const [message, setMessage] = useState('');

    const jwt = sessionStorage.getItem('jwt');

    const params = useParams();
    const postId = parseInt(params.id);



    //fetch specific post by id
    const  fetchPost = async (postId) => {
        try {
            const response = await fetch(`${SERVER_URL}/news/${postId}`,
                {
                    headers: {'Authorization': jwt}
                });
            if (response.ok) {
                const post = await response.json();
                setPost(post);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    //fetch comments for post
    const  fetchComments = async (postId) => {
        try {
            const response = await fetch(`${SERVER_URL}/news/${postId}/comments`,
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
        fetchPost(postId);
        fetchComments(postId);
    }, [postId]);

    //send new comment
    const addComment = async (comment) => {
        try {
            const response = await  fetch(`${SERVER_URL}/news/${postId}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt,
                    },
                    body: JSON.stringify(comment),
                });
            if (response.ok) {
                const newcomment = await response.json();
                setMessage("comment added id="+newcomment.comment_id);
                fetchComments(postId);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    };

    //add like to comment
    const upvote = async (comment) => {
        try {
            const response = await fetch(`${SERVER_URL}/comments/${comment.comment_id}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
                body: JSON.stringify(comment),
            });
            if (response.ok) {
                fetchComments(postId);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    //add dislike to comment
    const downvote = async (comment) => {
        try {
            const response = await fetch(`${SERVER_URL}/comments/${comment.comment_id}/dislike`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
                body: JSON.stringify(comment),
            });
            if (response.ok) {
                fetchComments(postId);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };



    return(
        <div className="containerWrapper">
            <div className="container">
                <h3>{post.title}</h3>
                <h4>{message}</h4>
                <div className={styles.newsLiDiv}>
                    <div className={styles.meta}>
                        PostID: {post.post_id} &nbsp;
                        UserID: {post.creator_id} &nbsp;
                        Name: {post.username} &nbsp;
                        Posted at: {post.create_time}
                    </div>
                </div>
                <p className={styles.link}>{post.link}</p>
                <a href={post.link} target="_blank" rel="noopener noreferrer">Go to article</a>
                <p className={styles.desc}>
                    {post.description}
                </p>
                    <p><CommentAdd save={addComment}/></p>
            <div>
                <ul className={styles.commentUl}>
                    {comments.map((comment) => (
                        <li key={comment.comment_id} className={styles.commentLi}>
                            <div className={styles.commentLiDiv}>
                                <div className={styles.meta}>
                                    CommentID: {comment.comment_id} &nbsp;
                                    Name: {comment.name} &nbsp;
                                    UserID: {comment.creator_id} &nbsp;
                                    Posted at: {comment.create_time} &nbsp;
                                </div>
                                <p className={styles.desc}>{comment.text}</p>
                                Like: {comment.upvote} <button id="like" onClick={() => upvote(comment)} className={styles.like}>Add Like</button>
                                Dislike: {comment.downvote} <button id="dislike" onClick={() => downvote(comment)} className={styles.dislike} >Add Dislike</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            </div>
        </div>
    );
}
export default PostView;