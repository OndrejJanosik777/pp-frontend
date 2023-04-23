import React, { Component } from 'react';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import magnifier from './assets/magnifier.png';
import './index.scss';

const ManageProjects = (props) => {
    return ( <div className='c1-manage-projects'>
        <div className='c1-background'></div>
        <div className='c1-window'>
            <div className='c1-nav-bar'>
                <div className='c1-nav-bar-left'>
                    <img className='c1-icons' src={delete_cross} alt='' />
                    <img className='c1-icons' src={create_new} alt='' />
                </div>
                <div className='c1-nav-bar-right'>
                    <div className='c1-textbox-container'>
                        <input className='c1-textbox' type='text' placeholder='Search ...' />
                        <img className='c1-img' src={magnifier} alt='' />
                    </div>
                    <img className='c1-icons' src={edit_panels} alt='' />
                    <img className='c1-icons' src={questionmark_blue} alt='' />
                </div>
            </div>
            <div className='c1-content'>
                <table>
                    <thead>
                        <tr>
                            <th>show</th>
                            <th>name</th>
                            <th>number</th>
                            <th>description</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type='checkbox' /></td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                        </tr>
                        <tr>
                            <td><input type='checkbox' /></td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                        </tr>
                        <tr>
                            <td><input type='checkbox' /></td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                        </tr>
                        <tr>
                            <td><input type='checkbox' /></td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                            <td>col1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='c1-win-footer'>
                <div className='c1-footer-row1'>
                    <div className='c1-row1-col1'>name</div>
                    <div className='c1-row1-col2'>
                        <div className='c1-textbox-container'>
                            <input className='c1-textbox' type='text' placeholder='Search ...' />
                        </div>
                    </div>
                </div>
                <div className='c1-footer-row1'>
                    <div className='c1-row1-col1'>number</div>
                    <div className='c1-row1-col2'>
                        <div className='c1-textbox-container'>
                            <input className='c1-textbox' type='text' placeholder='Search ...' />
                        </div>
                    </div>
                </div>
                <div className='c1-footer-row1'>
                    <div className='c1-row1-col1'>short name</div>
                    <div className='c1-row1-col2'>
                        <div className='c1-textbox-container'>
                            <input className='c1-textbox' type='text' placeholder='Search ...' />
                        </div>
                    </div>
                </div>
                <div className='c1-footer-row2'>
                    <div className='c1-row2-col1'>
                        <input type='button' className='button' value='Save' />
                    </div>
                    <div className='c1-row2-col2'>
                        <input type='button' className='button' value='Cancel' onClick={() => props.set_manageProjects_toogle(false)} />
                    </div>
                </div>
            </div>
        </div>
    </div> );
}
 
export default ManageProjects;