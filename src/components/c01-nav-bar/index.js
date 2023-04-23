import React, { Component } from 'react';
import logo from './assets/logo.png';
import arrow_down from './assets/arrow_down.png';
import magnifier from './assets/magnifier.png';
import small_arrow_down from './assets/small_arrow_down.png';
import './index.scss';

const NavBar = () => {
    return ( <div className='nav-bar'>
        <div className='left-container'>
            <img className='logo' src={logo} alt='' />
            <div className='username'>Janosik</div>
        </div>
        <div className='right-container'>
            <div className='textbox-container'>
                <input className='textbox' type='text' placeholder='All types' />
                <img className='img' src={arrow_down} alt='' />
            </div>
            <div className='textbox-container'>
                <input className='textbox' type='text' placeholder='Search ...' />
                <img className='img' src={magnifier} alt='' />
                <img className='img' src={arrow_down} alt='' />
            </div>
            <button className='button-container'>
                <div className='button-name'>Quick Links</div>
                <img className='img' src={small_arrow_down} alt='' />
            </button>
        </div>
    </div> );
}
 
export default NavBar;<div>
this is nav bar</div>