import React, {useEffect, useState} from "react";
import {SERVER_URL} from "../../Constants";
import {Link} from "react-router-dom";
import {generatePath} from "react-router-dom";
import styles from './NewsView.module.css'

function NewsView() {

    const [posts, setPosts]= useState([]);

    const [message, setMessage] = useState('');

    const jwt = sessionStorage.getItem('jwt');

    useEffect( () => {
        fetchPosts();
    }, []);

    //fetch all user posts starting with most recent
    const  fetchPosts = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/news`,
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
                <h1 className={styles.news}>News</h1>
                <h4 style={{color: "red"}}>{message}</h4>
                (
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
                                </div>
                                <p className={styles.link}>{post.link}</p>
                                <a href={post.link} target="_blank" rel="noopener noreferrer">Go to article</a>
                                <p className={styles.desc}>
                                    {post.description.length > 150 ? `${post.description.substring(0, 150)}...` : post.description}
                                </p>
                                <Link to={generatePath("/news/:id", { id: post.post_id })} >See Discussion</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

}
export default NewsView;