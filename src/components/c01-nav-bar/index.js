import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import logo from './assets/logo.png';
import arrow_down from './assets/arrow_down.png';
import magnifier from './assets/magnifier.png';
import small_arrow_down from './assets/small_arrow_down.png';
import './index.scss';

// navbar component
// 

const C01_NAVBAR = () => {
    return ( <div className='c01-nav-bar'>
        <div className='c01-left-container'>
            <img className='c01-logo' src={logo} alt='' />
            <div className='c01-username'>{useSelector(state => state.api.userProfile.username)}</div>
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