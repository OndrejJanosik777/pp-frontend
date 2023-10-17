import React, { Component } from 'react'
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
import './index.scss';

const P05_TEST_CENTER = () => {
    return ( <div className='p05-test-center'>
        <C01_NAVBAR />
        <C02_SIDEBAR />
        hello world from page test center.
    </div> );
}
 
export default P05_TEST_CENTER;