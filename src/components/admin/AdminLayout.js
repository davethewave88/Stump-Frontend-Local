import styles from './AdminLayout.module.css';

import { Outlet, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logout from '../../Logout.js'
import PostsView from './PostsView';
import UsersView from './UsersView';
import React, {useEffect, useState} from "react";
import {SERVER_URL} from "../../Constants";
import PostAdd from "../PostAdd";
import NewsAdd from "./NewsAdd";
import CommentsView from "./CommentsView";

export const AdminRouter = (props) => {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLayout />} >
              <Route index element={<AdminHome />} />
              <Route path="users" element={<UsersView />} />
              <Route path="posts" element={<PostsView />} />
              <Route path="comments" element={<CommentsView />} />
              <Route path="logout" element={<Logout logout={props.logout}/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export const AdminHome = (props) => {

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

    //add a post about Stump updates
    const addNews = async (post) => {
        try {
            const response = await fetch(`${SERVER_URL}/sitenews`, {
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
                fetchSiteNews();
            } else {
                const rc = await response.json();
                setMessage(rc.message || "Unknown error occurred.");
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

  return (
      <div className="containerWrapper">
          <div className="container">
              <h1>Admin Home</h1>
              <h2>Hello, {sessionStorage.getItem("login_name")}</h2>
              <h3>Manage users, posts, and comments</h3>
              <h4 style={{color: "red"}}>{message}</h4>
              <NewsAdd save={addNews} />

              <ul className={styles.sitenewsUl}>
                  {posts.map((post) => (
                      <li key={post.post_id} className={styles.sitenewsLi}>
                          <div className={styles.sitenewsLiDiv}>
                              <div className={styles.meta}>
                                  PostID: {post.post_id} &nbsp;
                                  Posted at: {post.create_time}
                              </div>
                              <div>
                                  <p className={styles.title}>{post.title}</p>
                                  <p className={styles.desc}>{post.description}</p>
                              </div>
                          </div>
                      </li>
                  ))}
              </ul>
            </div>
      </div>
      
      );
};

export const AdminLayout = () => {
  return (
    <>
     <header>
      <nav>
        <Link id="home" to="/">Home</Link> &nbsp;|&nbsp;   
        <Link id="users" to="/users">Users</Link>&nbsp;|&nbsp;
        <Link id="posts" to="/posts">Posts</Link>&nbsp;|&nbsp;
        <Link id="comments" to="/comments">Comments</Link>&nbsp;|&nbsp;
        <Link id="logout" to="/logout">Logout</Link>
      </nav>
    </header>
      <Outlet />
    </>
  )
};