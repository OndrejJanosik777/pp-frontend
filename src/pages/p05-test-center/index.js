import React, { Component } from 'react'

import home from './assets/home.png';
import small_arrow_down from './assets/small_arrow_down.png';

import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
import './index.scss';

const P05_TEST_CENTER = () => {
    return ( <div className='p05-test-center'>
        <C01_NAVBAR />
        <C02_SIDEBAR />
        <div className='p05-center-section'>
            <img className='p05-img-home' src={home} alt='' />
            <button className='p05-button-container'>
                <div className='p05-button-name'>Quick Links</div>
                <img className='p05-img' src={small_arrow_down} alt='' />
            </button>
            <div className='p05-main-section' id='main-section' name='main-section'>
                hello
            </div>
        </div>
    </div> );
}
 
export default P05_TEST_CENTER;