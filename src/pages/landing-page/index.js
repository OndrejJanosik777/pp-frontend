import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.scss';

const LandingPage = () => {
    const navigate = useNavigate();
    // const axios = require('axios');

    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://fut-v2.herokuapp.com';
        }
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());

    const showState = () => {
        console.log('username: ', username);
        console.log('password: ', password);
    }

    const loggingIn = () => {
        axios({
            method: 'post',
            url: baseUrl + '/api/token/',
            data: {
                username: username,
                password: password
            }
        })
            .then((response => {
                // alert('account created succesfully');
                console.log(response.data);
                localStorage.setItem('PP-token', response.data.access);

                navigate('/dashboard/');
            }))
            .catch((error) => {
                console.log(error);
            })
    }

    return (<div className='landing-page'>
        <div className='container'>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingInput" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="floatingInput">username</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="floatingPassword">password</label>
            </div>
            <button type='button' className='btn btn-primary' onClick={loggingIn}>Login</button>
        </div>
    </div>);
}

export default LandingPage;