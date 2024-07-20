import React from 'react';
import './TitleBar.css';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const TitleBar = () => {

    const handleLogout = () => {
    signOut(auth)
        .then(() => {
        window.location.href = '/login';
        })
        .catch((error) => {
        console.error('Logout Error:', error);
        });
    };

    return(
        <div className="navbar">
            <span>SPHERE</span>
            <button onClick={handleLogout} >Logout</button>
        </div>
    );
};

export default TitleBar;
