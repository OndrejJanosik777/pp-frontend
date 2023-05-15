import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import './index.scss';
//
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';

const P04_EMPLOYEES = () => {
    const [extendedSideBar, set_extendedSideBar] = useState(false);

    return ( <div className='p04-employees'>
        <C01_NAVBAR />
        <C02_SIDEBAR extendedSideBar={extendedSideBar} set_extendedSideBar={set_extendedSideBar} />
        <div className='p02-center-section'>
            <div className='p02-main-section' id='main-section' name='main-section'></div>
        </div>
    </div> );
}
 
export default P04_EMPLOYEES;