import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import './index.scss';

const LandingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [showSpinnerLogin, setShowSpinnerLogin] = useState(false);

    const showState = () => {
        console.log('username: ', username);
        console.log('password: ', password);
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
                setShowSpinnerLogin(false);

                // dispatch(fetchUser(response.data.access));

                navigate('/dashboard/');
            }))
            .catch((error) => {
                alert('problem getting token: /api/token/');

                console.log(error);
            })
    }

    return (<div className='p01-landing-page'>
        <div className='p01-container'>
            <div className="form-floating mb-3 p01-input">
                <input type="text" className="form-control" id="floatingInput" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="floatingInput">username</label>
            </div>
            <div className="form-floating p01-input">
                <input type="password" className="form-control" id="floatingPassword" value={password} onChange={(e) => setPassword(e.target.value)} />
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