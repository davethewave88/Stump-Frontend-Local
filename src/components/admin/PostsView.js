import React, {useEffect, useState} from "react";
import {SERVER_URL} from "../../Constants";
import Button from "@mui/material/Button";
import PostAdd from "../PostAdd";

function PostsView() {
    const headers = ['ID', 'User', 'Time', 'Link', ''];

    const [posts, setPosts]= useState([]);

    const [message, setMessage] = useState('');

    const jwt = sessionStorage.getItem('jwt');


    //fetch all posts
    const  fetchPosts = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/posts`,
                {
                    headers: {'Authorization': jwt}
                });
            if (response.ok) {
                const posts = await response.json();
                setPosts(posts);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    useEffect( () => {
        fetchPosts();
    }, []);

    //add a new post
    const addPost = async (post) => {
        try {
            const response = await  fetch(`${SERVER_URL}/posts`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt,
                    },
                    body: JSON.stringify(post),
                });
            if (response.ok) {
                const newpost = await response.json();
                setMessage("post added id="+newpost.post_id);
                fetchPosts();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    //delete a post
    const deletePost = async (id) => {
        try {
            const response = await fetch(`${SERVER_URL}/posts/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt,
                    },
                });
            if (response.ok) {
                setMessage("post deleted");
                fetchPosts();
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
        const id = posts[row_idx].post_id;

        const isConfirmed = window.confirm('Do you really want to delete this post?');

        if (isConfirmed) {
            // If user clicks "Yes" (OK in confirm dialog), delete the user
            deletePost(id);
        }
    }

    return(
        <div className="containerWrapper">
            <div className="container">
            <h1>Manage Posts</h1>
            <h4 style={{color: "red"}}>{message}</h4>
            <table>
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {posts.map((post) => (
                    <tr key={post.post_id}>
                        <td>{post.post_id}</td>
                        <td>{post.creator_id}</td>
                        <td>{post.create_time}</td>
                        <td>{post.link}</td>
                        <td><Button onClick={onDelete}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <PostAdd save={addPost} />
        </div>
        </div>
    );
}
export default PostsView;