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
// general components
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
// page specific components
import P04_C01_MANAGE_EMPLOYEES from './p04-c01-manage-employees';
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
    const [loggedUser, set_loggedUser] = useState({
        id: 0,
        password: "",
        last_login: "",
        is_superuser: false,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        is_staff: "",
        is_active: "",
        date_joined: "",
        groups: [],
        user_permissions: [],
    })
    const [userPermissions, set_userPermissions] = useState([]);
    const [userGroups, set_userGroups] = useState([]);
    // controlling of showing/hiding of modal components
    const [manageEmployees_modalToogle, set_manageEmployees_modalToogle] = useState(false);
    const [selectedEmployee, set_selectedEmployee] = useState(undefined);

    useEffect(() => {
        console.log('*** P04_EMPLOYEES page loaded ***');

        fetchEmployees();

        fetchUserData();

        fetchGroups();
    }, []);

    const showState = () => {
        console.log("userPermissions: ", userPermissions);
        console.log("userGroups: ", userGroups);
    }

    const deleteEmployee = (employee) => {
        console.log('deleting employee...', employee);

        let index = employees.findIndex(elem => elem === employee)

        let updatedEmployees = [...employees];
        let backupEmployees = [...employees];

        updatedEmployees.splice(index, 1);

        set_employees([...updatedEmployees]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/employees/${employee.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log("employee deleted sucessfully");
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            set_employees([...backupEmployees]);
        })
    }

    const fetchEmployees = () => {
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
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const fetchEmployee = (employee) => {
        axios({
            method: 'get',
            url: baseUrl + `/company/employees/${employee.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            let index = employees.findIndex(elem => elem.id === response.data.id);

            let updatedEmployees = [...employees];

            updatedEmployees.splice(index, 1, response.data);

            set_employees([...updatedEmployees]);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const fetchGroups = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/get-groups/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log('groups fetched: ', response.data)

            set_userGroups(response.data);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const fetchUserData = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/my-profile/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log('user data fetched: ', response.data)

            let newPermissions = [];

            response.data.groups.map((group) => {
                newPermissions.push(group.name);
            })

            set_loggedUser(response.data);

            set_userPermissions([...newPermissions]);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }
 
    return ( <div className='p04-employees'>
        <C01_NAVBAR />
        <C02_SIDEBAR extendedSideBar={extendedSideBar} set_extendedSideBar={set_extendedSideBar} />
        <div className='p04-center-section'>
            <div className='p04-main-section' id='main-section' name='main-section'>
                {manageEmployees_modalToogle ?
                    <P04_C01_MANAGE_EMPLOYEES
                        selectedEmployee={selectedEmployee}
                        // activeMilestoneItem={activeMilestoneItem}
                        fetchEmployees={fetchEmployees}
                        fetchEmployee={fetchEmployee}
                        employees={employees}
                        set_employees={set_employees}
                        // activeProject={activeProject}
                        userGroups={userGroups}
                        toogleVisibility={set_manageEmployees_modalToogle}
                    />
                    :
                    ""}
                <div className='p04-nav-bar'>
                    <div className='p04-nav-bar-left'>
                        {/* <img 
                            className='p04-icons' 
                            src={delete_cross} 
                            alt=''
                            // onClick={showState}
                        /> */}
                        {userPermissions.find(elem => elem === 'all_permissions') ?
                        <img 
                            className='p04-icons' 
                            src={create_new} alt='' 
                            onClick={() => {
                                set_selectedEmployee(undefined);
                                set_manageEmployees_modalToogle(true);
                            }} 
                        /> :
                        <div></div>
                        }
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
                        <img 
                            className='p04-icons' 
                            src={questionmark_blue} 
                            alt='' 
                            onClick={() => showState()}
                        />
                        {/* <input 
                            type='button' 
                            className='p04-button' 
                            value={'X'} 
                            onClick={() => props.toogleVisibility(false)} 
                        /> */}
                    </div>
                </div>
                <div className='p04-content'>
                    <table className='p04-table-01'>
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
                    <table className='p04-table-02'>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>username</th>
                                <th>firstname</th>
                                <th>lastname</th>
                                <th>email</th>
                                <th>department</th>
                                <th>pensum</th>
                                <th className='p04-access-icons'> 
                                    <img 
                                        className='p04-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p04-access-icons'>
                                    <img 
                                        className='p04-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p04-access-icons'>
                                    <img 
                                        className='p04-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p04-access-icons'>
                                    <img 
                                        className='p04-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th className='p04-access-icons'>
                                    <img 
                                        className='p04-access-icon'
                                        src={create_new} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={pencil_edit} 
                                        alt=''
                                    />
                                    <img 
                                        className='p04-access-icon'
                                        src={delete_cross} 
                                        alt=''
                                    />
                                </th>
                                <th>All Perm.</th>
                                <th>Permissions per project</th>
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
                                    <td className='p04-checkboxes'>
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'create_project') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'edit_project') ? checkbox_checked : checkbox}
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'delete_project') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                    </td>
                                    <td className='p04-checkboxes'>
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'create_monument') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'edit_monument') ? checkbox_checked : checkbox}
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'delete_monument') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                    </td>
                                    <td className='p04-checkboxes'>
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'create_document') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'edit_document') ? checkbox_checked : checkbox}
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'delete_document') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                    </td>
                                    <td className='p04-checkboxes'>
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'create_milestone_item') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'edit_milestone_item') ? checkbox_checked : checkbox}
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'delete_milestone_item') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                    </td>
                                    <td className='p04-checkboxes'>
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'create_task') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'edit_task') ? checkbox_checked : checkbox}
                                            alt='' 
                                        />
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'delete_task') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                    </td>
                                    <td className='p04-checkboxes'>
                                        <img 
                                            className='p04-checkbox' 
                                            src={groupsNames.find(elem => elem === 'all_permissions') ? checkbox_checked : checkbox} 
                                            alt='' 
                                        />
                                    </td>
                                    <td>{employee.comment}</td>
                                    <td>
                                        {userPermissions.find(elem => elem === 'all_permissions') ?
                                        <img 
                                            className='p04-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => {
                                                set_selectedEmployee(employee);
                                                set_manageEmployees_modalToogle(true);
                                            }} 
                                        /> :
                                        <div></div>
                                        }
                                        {userPermissions.find(elem => elem === 'all_permissions') ?
                                        <img 
                                            className='p04-icons' 
                                            src={delete_cross} 
                                            alt='' 
                                            onClick={() => deleteEmployee(employee)} 
                                        /> :
                                        <div></div>
                                        }
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