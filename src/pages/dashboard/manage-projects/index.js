import React, { Component } from 'react';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import magnifier from './assets/magnifier.png';
import './index.scss';

const ManageProjects = () => {
    return ( <div className='c1-manage-projects'>
        <div className='c1-background'></div>
        <div className='c1-window'>
            <div className='c1-nav-bar'>
                <div className='c1-nav-bar-left'>
                    <img className='c1-icons' src={delete_cross} alt='' />
                    <img className='c1-icons' src={create_new} alt='' />
                </div>
                <div className='c1-nav-bar-right'>
                    {/* <img src={magnifier} alt='' /> */}
                    <div className='c1-textbox-container'>
                        <input className='c1-textbox' type='text' placeholder='Search ...' />
                        <img className='c1-img' src={magnifier} alt='' />
                    </div>
                    <img className='c1-icons' src={edit_panels} alt='' />
                    <img className='c1-icons' src={questionmark_blue} alt='' />
                </div>
            </div>
            <div className='c1-content'>content</div>
            <div className='c1-win-footer'>
                <button className='button-container'>
                    <div className='button-name'>Quick Links</div>
                    {/* <img className='img' src={small_arrow_down} alt='' /> */}
                </button>
            </div>
        </div>
    </div> );
}
 
export default ManageProjects;