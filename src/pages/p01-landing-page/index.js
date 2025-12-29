import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { set_BaseUrl, fetch_userProfile } from '../../app/features/api/apiSlice';
import axios from 'axios';
import './index.scss';

// landing page - with textboxes for username, password
// load baseUrl to store
// load userProfile to store
 
const LandingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp-backend-44378a9b5178.herokuapp.com';
        }
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [showSpinnerLogin, setShowSpinnerLogin] = useState(false);

    // hook to run while loading component
    useEffect(() => {
        // console.log('p01-landing-page loaded...');

        dispatch(set_BaseUrl());
    }, []);

    const showState = () => {
        // console.log('username: ', username);
        // console.log('password: ', password);
    }

    const loggingIn = () => {
        setShowSpinnerLogin(true);

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
            // console.log(response.data);
            localStorage.setItem('PP-token', response.data.access);
            // new line
            setShowSpinnerLogin(false);
            dispatch(fetch_userProfile());
            navigate('/dashboard/');
        }))
        .catch((error) => {
            alert('problem getting token: /api/token/');
            console.log(error);
            setShowSpinnerLogin(false);
        })
    }

    return (<div className='p01-landing-page'>
        <div className='p01-container'>
            <div className="form-floating mb-3 p01-input">
                <input type="text" className="form-control" id="floatingInput" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="floatingInput">username</label>
            </div>
            <div className="form-floating p01-input">
                <input 
                    type="password" 
                    className="form-control" 
                    id="floatingPassword" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") loggingIn();
                    }}
                />
                <label htmlFor="floatingPassword">password</label>
            </div>
            {showSpinnerLogin ?
                <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
                :
                <button type='button' className='btn btn-primary' onClick={loggingIn}>Login</button>
            }
        </div>
    </div>);
}

export default LandingPage;