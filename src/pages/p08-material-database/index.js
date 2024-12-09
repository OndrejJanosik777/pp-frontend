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

const P08_MATERIAL_DATABASE = () => {
    const dispatch = useDispatch();

    const [activeMenu, set_activeMenu] = useState('');

    return ( <div className='p08-material-database'>
        <C01_NAVBAR />
        <C02_SIDEBAR />
        <div className='p08-center-section'>
            <img 
                className='p08-img-home' 
                // onClick={() => showState()}
                src={home} 
                alt='' 
            />
            <button className='p08-button-container'>
                <div className='p08-button-name'>Quick Links</div>
                <img className='p08-img' src={small_arrow_down} alt='' />
            </button>
            <div className='p08-main-section' id='main-section' name='main-section'>
                <div className='p08-nav-bar'>
                    <div className='p08-nav-bar-left'>
                        <div 
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageProjects(true))}
                            className={activeMenu === 'Bruhn' ? 'p08-item-active' : 'p08-item'}
                            onClick={() => set_activeMenu('Bruhn')}
                        >Aluminum</div>
                        <div className='p08-item'>|</div>
                        <div 
                            className={activeMenu === 'Nui' ? 'p08-item-active' : 'p08-item'}
                            onClick={() => set_activeMenu('Nui')}
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageMilestoneTypes(true))} 
                        >Steel</div>
                        <div className='p08-item'>|</div>
                        <div 
                            className={activeMenu === 'HSB' ? 'p08-item-active' : 'p08-item'}
                            onClick={() => set_activeMenu('HSB')}
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageTaskTypes(true))}
                        >Wood</div>
                        <div className='p08-item'>|</div>
                    </div>
                    <div className='p08-nav-bar-right'>
                        <img 
                            className='p08-icons' 
                            // onClick={showState}
                            src={questionmark_blue} 
                            alt='' 
                        />
                    </div>
                </div>
                
            </div>
        </div>
    </div> );
}
 
export default P08_MATERIAL_DATABASE;