import React, { Component } from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// icons, pictures
import home from '../../assets/home.png';
import small_arrow_down from '../../assets/small_arrow_down.png';
import questionmark_blue from './assets/questionmark_blue.png';
// general components
import C01_NAVBAR from '../../components/c01-nav-bar'
import C02_SIDEBAR from '../../components/c02-side-bar';
import './index.scss'; 
// load temporary tie rod data
import tempTieRods from './data';

const P07_TESTED_PARTS = () => {
    const dispatch = useDispatch();

    const [activeMenu, set_activeMenu] = useState('');
    const [tested_tie_rods, set_tested_tie_rods] = useState([...tempTieRods.tempTieRods]);

    //
    useEffect(() => {
        console.log('component loaded');
        console.log(tested_tie_rods);
        console.log(tempTieRods);
    }, []);

    return ( <div className='p07-tested-parts'>
        <C01_NAVBAR />
        <C02_SIDEBAR />
        <div className='p07-center-section'>
            <img 
                className='p07-img-home' 
                // onClick={() => showState()}
                src={home} 
                alt='' 
            />
            <button className='p07-button-container'>
                <div className='p07-button-name'>Quick Links</div>
                <img className='p07-img' src={small_arrow_down} alt='' />
            </button>
            <div className='p07-main-section' id='main-section' name='main-section'>
                <div className='p07-nav-bar'>
                    <div className='p07-nav-bar-left'>
                        <div 
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageProjects(true))}
                            className={activeMenu === 'Tie Rods' ? 'p07-item-active' : 'p07-item'}
                            onClick={() => set_activeMenu('Tie Rods')}
                        >Tie Rods</div>
                        <div className='p07-item'>|</div>
                        <div 
                            className={activeMenu === 'Upper Attachments' ? 'p07-item-active' : 'p07-item'}
                            onClick={() => set_activeMenu('Upper Attachments')}
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageMilestoneTypes(true))} 
                        >Upper Attachments</div>
                        <div className='p07-item'>|</div>
                        <div 
                            className={activeMenu === 'Lower Attachments' ? 'p07-item-active' : 'p07-item'}
                            onClick={() => set_activeMenu('Lower Attachments')}
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageTaskTypes(true))}
                        >Lower Attachments</div>
                        <div className='p07-item'>|</div>
                        <div 
                            className={activeMenu === 'Doors' ? 'p07-item-active' : 'p07-item'}
                            onClick={() => set_activeMenu('Doors')}
                        >Doors</div>
                        <div className='p07-item'>|</div>
                        <div
                            className={activeMenu === 'Latches' ? 'p07-item-active' : 'p07-item'}
                            onClick={() => { set_activeMenu('Latches'); }}
                        >Latches</div>
                        <div className='p07-item'>|</div>
                        </div>
                        <div className='p07-nav-bar-right'>
                        <img 
                            className='p07-icons' 
                            // onClick={showState}
                            src={questionmark_blue} 
                            alt='' 
                        />
                    </div>
                </div>
                <div style={{backgroundColor: "lightblue"}}>
                    <table style={{ border: "1px solid black" }}>
                        <thead>
                            <tr>
                                <td>{"p/n"}</td>
                                <td>{"tie rod end #1"}</td>
                                <td>{"p/n"}</td>
                                <td>{"p/n"}</td>
                                <td>{"p/n"}</td>
                                <td>{"p/n"}</td>
                                <td>{"p/n"}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div> );
}
 
export default P07_TESTED_PARTS;