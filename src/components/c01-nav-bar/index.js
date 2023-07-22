import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import logo from './assets/logo.png';
import arrow_down from './assets/arrow_down.png';
import magnifier from './assets/magnifier.png';
import small_arrow_down from './assets/small_arrow_down.png';
import './index.scss';

const C01_NAVBAR = () => {
    const count = useSelector(state => state.counter.value);
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [loggedUser, set_loggedUser] = useState({
        id: 0,
        password: "",
        last_login: "",
        is_superuser: false,
        username: "...",
        first_name: "",
        last_name: "",
        email: "",
        is_staff: "",
        is_active: "",
        date_joined: "",
        groups: [],
        user_permissions: [],
    })
    const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/my-profile/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log('user data fetched: ', response.data)

            set_loggedUser(response.data)
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching user data..');
        })
    }

    return ( <div className='c01-nav-bar'>
        <div className='c01-left-container'>
            <img className='c01-logo' src={logo} alt='' />
            <div className='c01-username'>{loggedUser.username}</div>
        </div>
        <div className='c01-right-container'>
            <div className='c01-textbox-container'>
                <input className='c01-textbox' type='text' placeholder='All types' />
                <img className='c01-img' src={arrow_down} alt='' />
            </div>
            <div className='c01-textbox-container'>
                <input className='c01-textbox' type='text' placeholder='Search ...' />
                <img className='c01-img' src={magnifier} alt='' />
                <img className='c01-img' src={arrow_down} alt='' />
            </div>
            <button className='c01-button-container'>
                <div className='c01-button-name'>Quick Links</div>
                <img className='c01-img' src={small_arrow_down} alt='' />
            </button>
        </div>
    </div> );
}
 
export default C01_NAVBAR;