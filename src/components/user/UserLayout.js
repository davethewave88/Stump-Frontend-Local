import {Outlet, Link} from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logout from '../../Logout.js'
import NewsView from '../user/NewsView.js';
import PostView from "./PostView";
import styles from './UserLayout.module.css';
import React, {useEffect, useState} from "react";
import {SERVER_URL} from "../../Constants";
import ProfileView from "./ProfileView";

export const UserRouter = (props) => {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UserLayout />} >
                        <Route index element={<UserHome />} />
                        <Route path="profile" element={<ProfileView />} />
                        <Route path="news" element={<NewsView />} />
                        <Route path="news/:id" element={<PostView />} />
                        <Route path="logout" element={<Logout logout={props.logout}/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}


export const UserHome = () => {
    const jwt = sessionStorage.getItem('jwt');
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState([]);

    useEffect(() => {
        fetchSiteNews();
    }, []);

    //fetch recent website news
    const  fetchSiteNews = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sitenews`,
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



    return (
        <div className="containerWrapper">
        <div className="container">
            <h1>Hello, {sessionStorage.getItem("login_name")}</h1>
            <h2>Welcome back</h2>
            <h3>{message}</h3>
            <h3>Site News: </h3>
            <ul className={styles.sitenewsUl}>
                {posts.map((post) => (
                    <li key={post.post_id} className={styles.sitenewsLi}>
                        <div className={styles.sitenewsLiDiv}>
                            <div className={styles.meta}>
                                PostID: {post.post_id} &nbsp;
                                Posted at: {post.create_time}
                            </div>
                            <p className={styles.title} >{post.title}</p>
                            <p className={styles.desc} >{post.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

//nav bar for users
export const UserLayout = () => {
    return (
        <>
            <header>
                <nav>
                    <Link id="home" to="/">Home</Link> &nbsp;|&nbsp;
                    <Link id="profile" to="/profile">Profile</Link> &nbsp;|&nbsp;
                    <Link id="news" to="/news">News</Link>&nbsp;|&nbsp;
                    <Link id="logout" to="/logout">Logout</Link>
                </nav>
            </header>
            <Outlet />
        </>
    )
};