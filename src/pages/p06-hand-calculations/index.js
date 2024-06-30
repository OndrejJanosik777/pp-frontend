import React, { Component } from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import home from './assets/home.png';
import small_arrow_down from './assets/small_arrow_down.png';
import questionmark_blue from './assets/questionmark_blue.png';
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
// import * as TCActions from '../../app/features/testCenterSlice';
import './index.scss'; 
import axios from 'axios'; 

const P06_HAND_CALCULATIONS = () => {
    return ( <div className='p06-hand-calculation'>
        <C01_NAVBAR />
        <C02_SIDEBAR />

        
    </div> );
}
 
export default P06_HAND_CALCULATIONS;