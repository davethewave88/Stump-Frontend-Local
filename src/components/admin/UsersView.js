import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';
import UserAdd from './UserAdd';
import Button from "@mui/material/Button";
import styles from './UsersView.module.css';

function UsersView() {
    const headers = ['ID', 'Name', 'Email', 'Type', ''];

    const [users, setUsers] = useState([  ]);

    const [message, setMessage] = useState('');

    const jwt = sessionStorage.getItem('jwt');

    //fetch all registerd users
    const  fetchUsers = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/users`,
                {
                    headers: {'Authorization': jwt}
                });
            if (response.ok) {
                const users = await response.json();
                setUsers(users);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }



    useEffect( () => {
        fetchUsers();
    }, []);


    //manually add user
    const addUser = async (user) => {
        try {
            const response = await  fetch(`${SERVER_URL}/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt,
                    },
                    body: JSON.stringify(user),
                });
            if (response.ok) {
                const newuser = await response.json();
                setMessage("user added id="+newuser.user_id);
                fetchUsers();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    //delete a user
    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${SERVER_URL}/users/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt,
                    },
                });
            if (response.ok) {
                setMessage("User deleted");
                fetchUsers();
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
        const id = users[row_idx].user_id;

        const isConfirmed = window.confirm('Do you really want to delete this user?');

        if (isConfirmed) {
            // If user clicks "Yes" (OK in confirm dialog), delete the user
            deleteUser(id);
        }
    }

    return(
        <div className="containerWrapper">
            <div className="container">
            <h1>Manage Users</h1>
            <h4 style={{color: "red"}}>{message}</h4>
            <table>
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.user_id}>
                        <td>{user.user_id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.type}</td>
                        <td><Button onClick={onDelete}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <UserAdd save={addUser} />
        </div>
        </div>
    );
}
export default UsersView;
