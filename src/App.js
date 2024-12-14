import './App.css';
import React, {useState } from 'react';
import Login from './Login';

import {AdminRouter} from './components/admin/AdminLayout';
import {UserRouter} from './components/user/UserLayout';

function App() {

  const[isAuthenticated, setAuth] = useState(false);
  const[userType, setUserType] = useState('');

  const logout = () => {
    setAuth(false);
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("login_id");
    sessionStorage.removeItem("login_name");
  }

  if (! isAuthenticated) {
    return (
        <Login setAuth={setAuth} setUserType={setUserType}/>
    );
  } else if (userType==='ADMIN') {
    return (
        <AdminRouter logout={logout}/>
    )
  } else if (userType==='USER') {
    return (
        <UserRouter logout={logout}/>
    )
  }
   else {
    return <h1>Unknown user type</h1>


  }
}

export default App;
