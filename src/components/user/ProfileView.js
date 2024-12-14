import UpdateBio from "./UpdateBio";
import PostAdd from "../PostAdd";
import React, {useEffect, useState} from "react";
import {SERVER_URL} from "../../Constants";
import {generatePath, Link} from "react-router-dom";
import styles from './ProfileView.module.css'


function ProfileView() {

    const jwt = sessionStorage.getItem('jwt');

    const login_name = sessionStorage.getItem("login_name");

    const login_id = sessionStorage.getItem("login_id");

    const [posts, setPosts]= useState([]);

    const [user, setUser] = useState({bio:""});



    const [message, setMessage] = useState('');

    //fetch user profile data
    const fetchUser = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/user/${login_id}`, {
                headers: { 'Authorization': jwt }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                const rc = await response.json();
                setMessage(rc.message || "Unknown error occurred.");
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    //fetch posts by user
    const  fetchPosts = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/posts/${login_id}`,
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
        fetchUser();
    }, []);

    //send put request for updated user bio
    const updateBio = async (updatedUser) => {
        const newuser = user;
        newuser.bio = updatedUser.bio;
        try {
            const response = await fetch(`${SERVER_URL}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
                body: JSON.stringify(newuser),
            });
            if (response.ok) {
                // On success, re-fetch the user data to get the latest bio
                fetchUser();
                setMessage('Bio updated successfully.');
            } else {
                const rc = await response.json();
                setMessage(rc.message || "Failed to update bio.");
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    //add a new post
    const addPost = async (post) => {
        try {
            const response = await fetch(`${SERVER_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
                body: JSON.stringify(post),
            });
            if (response.ok) {
                const newpost = await response.json();
                setMessage("post added with id= " + newpost.post_id);
                fetchPosts();
            } else {
                const rc = await response.json();
                setMessage(rc.message || "Unknown error occurred.");
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };



    return(
        <div className="containerWrapper">
        <div className="container">
            <h1 className={styles.name}>{login_name}</h1>
            <h2 style={{color: "red"}}>{message}</h2>
            <div className={styles.bio} ><h3 >Bio:</h3>
                <h4>{user.bio}</h4></div>
            <UpdateBio save={updateBio} />
            <div className={styles.border}></div>

            <h2>Your Posts:</h2>
            <PostAdd save={addPost} />
            <ul className={styles.newsUl}>
                {posts.map((post) => (
                    <li key={post.post_id} className={styles.newsLi}>
                        <div className={styles.newsLiDiv}>
                            <div className={styles.meta}>
                                PostID: {post.post_id} &nbsp;
                                UserID: {post.creator_id} &nbsp;
                                Name: {post.username} &nbsp;
                                Posted at: {post.create_time}
                            </div>
                        <div>
                            <p className={styles.link}>{post.link}</p>
                            <a href={post.link} target="_blank" rel="noopener noreferrer">Go to article</a>
                            <p className={styles.desc}>
                                {post.description.length > 150 ? `${post.description.substring(0, 150)}...` : post.description}
                            </p>
                            <Link to={generatePath("/news/:id", { id: post.post_id })} >See Discussion</Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
}
export default ProfileView;