import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// assets
import editSVG from './assets/pencil-square.svg';
import deleteSVG from './assets/trash3.svg';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import pencil_edit from './assets/pencil_edit.png';
import magnifier from './assets/magnifier.png';
import checkbox_checked from './assets/checkbox-checked.svg';
import checkbox from './assets/checkbox.svg';
// import magnifier from './assets/magnifier.png';
import './index.scss';
//
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
// temp data
const tempEmployees = require('./data');

const P04_EMPLOYEES = (props) => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [extendedSideBar, set_extendedSideBar] = useState(false);
    const [employees, set_employees] = useState([]);
    const [taskTypes, set_taskTypes] = useState([]);

    useEffect(() => {
        console.log('*** P04_EMPLOYEES page loaded ***');

        fetchUsers();
    }, []);

    const deleteItem = () => {

    }

    const fetchUsers = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/employees/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log('users fetched: ', response.data)

            set_employees(response.data);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching user data..');
        })
    }

    const switchToUpdateMode = () => {

    }

    return ( <div className='p04-employees'>
        <C01_NAVBAR />
        <C02_SIDEBAR extendedSideBar={extendedSideBar} set_extendedSideBar={set_extendedSideBar} />
        <div className='p04-center-section'>
            <div className='p04-main-section' id='main-section' name='main-section'>
                <div className='p04-nav-bar'>
                    <div className='p04-nav-bar-left'>
                        <img 
                            className='p04-icons' 
                            src={delete_cross} 
                            alt=''
                            // onClick={showState}
                        />
                        <img 
                            className='p04-icons' 
                            src={create_new} alt='' 
                            // onClick={() => set_createMode(!createMode)} 
                        />
                    </div>
                    <div className='p04-nav-bar-right'>
                        <div className='p04-textbox-container'>
                            <input 
                                className='p04-textbox' 
                                type='text' 
                                placeholder='Search ...' 
                            />
                            <img className='p04-img' src={magnifier} alt='' />
                        </div>
                        <img className='p04-icons' src={edit_panels} alt='' />
                        <img className='p04-icons' src={questionmark_blue} alt='' />
                        {/* <input 
                            type='button' 
                            className='p04-button' 
                            value={'X'} 
                            onClick={() => props.toogleVisibility(false)} 
                        /> */}
                    </div>
                </div>
                <div className='p02-c10-content'>
                    <table className='p02-c10-table-01'>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Project</th>
                                <th>Monument</th>
                                <th>Document</th>
                                <th>Milestone</th>
                                <th>Task</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                    </table>
                    <table className='p02-c10-table-02'>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>username</th>
                                <th>firstname</th>
                                <th>lastname</th>
                                <th>email</th>
                                <th>department</th>
                                <th>pensum</th>
                                <th className='p02-c10-access-icons'> 
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p02-c10-access-icons'>
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p02-c10-access-icons'>
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p02-c10-access-icons'>
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p02-c10-access-icons'>
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p02-c10-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th>Is Admin?</th>
                                <th></th>
                                <th>edit / delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* TODO:  */}
                            {employees.map((employee, index) => {
                                let groupsNames = [];

                                employee.user.groups.map((group) => {
                                    groupsNames.push(group.name);
                                })

                                return <tr key={Math.random() * 100000}>
                                    <td>{employee.id}</td>
                                    <td>{employee.user.username}</td>
                                    <td>{employee.user.first_name}</td>
                                    <td>{employee.user.last_name}</td>
                                    <td>{employee.user.email}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.pensum}</td>
                                    <td className='p02-c10-checkboxes'>
                                        <img 
                                            className='p02-c10-checkbox' 
                                            src={groupsNames.find(elem => elem === 'create_project') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                        <img 
                                            className='p02-c10-checkbox' 
                                            src={groupsNames.find(elem => elem === 'edit_project') ? checkbox_checked : checkbox}
                                            alt='' 
                                        />
                                        <img 
                                            className='p02-c10-checkbox' 
                                            src={groupsNames.find(elem => elem === 'delete_project') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                    </td>
                                    <td>{employee.comment}</td>
                                    <td>
                                        <img 
                                            className='p02-c10-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            // onClick={() => switchToUpdateMode(employee, index)} 
                                        />
                                        <img 
                                            className='p02-c10-icons' 
                                            src={delete_cross} 
                                            alt='' 
                                            // onClick={() => deleteItem(employee)} 
                                        />
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div> );
}
 
export default P04_EMPLOYEES;