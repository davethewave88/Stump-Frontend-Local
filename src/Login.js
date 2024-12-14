import React, { useState } from 'react';
import { SERVER_URL } from './Constants';
import CreateAccount from './CreateAccount';
import styles from './Login.module.css';

const logo = require('./img/tree-stump.png');

const Login = (props) => {
    const [user, setUser] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const onChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    //send login request and handle response
    const login = async () => {
        const basicu = 'Basic ' + btoa(user.username + ':' + user.password);
        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': basicu,
                },
            });
            if (response.ok) {
                const json = await response.json();
                sessionStorage.setItem('jwt', 'Bearer ' + json.jwt);
                sessionStorage.setItem('login_name', json.name);
                sessionStorage.setItem('login_id', json.id);
                props.setUserType(json.role);
                props.setAuth(true);
                setMessage('');
            } else {
                setMessage('response error: ' + response.status);
            }
        } catch (err) {
            setMessage('network error: ' + err);
        }
    };

    //send new account request and handle response
    const createAccount = async (user) => {
        try {
            const response = await fetch(`${SERVER_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                const newaccount = await response.json();
                setMessage('account added id=' + newaccount.user_id);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage('network error: ' + err);
        }
    };

    return (
        <div className="containerWrapper">
            <div className="container">
                <h1 className={styles.title}>Stump</h1>
                <img className={styles.logo} src={logo} alt="Logo" />
                <h2 className={styles.subtitle} >Join the discussion</h2>
                <div>
                    <form>
                        <p>
                            <label htmlFor="username">Email:</label>
                            <input
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={onChange}
                                id="username"
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={onChange}
                                id="password"
                                required
                            />
                        </p>
                    </form>
                </div>
                <h4>{message}</h4>
                <button className={styles.loginButton} id="submit" onClick={login}>
                    Login
                </button>
                <p>
                    <CreateAccount save={createAccount} />
                </p>
            </div>
        </div>
    );
};

export default Login;
