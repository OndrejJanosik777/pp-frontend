import React, { Component } from 'react'
import arrow_left from './assets/arrow_left.png';
import magnifier_dark from './assets/magnifier_dark.png';
import './index.scss';

const SideBar = () => {
    return ( <div className='side-bar'>
        <div  className='left-section'>
            <img className='img' src={arrow_left} alt='' />
            <img className='img' src={magnifier_dark} alt='' />
        </div>
    </div> );
}
 
export default SideBar;