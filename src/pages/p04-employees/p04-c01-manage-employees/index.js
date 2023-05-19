import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import pencil_edit from './assets/pencil_edit.png';
import magnifier from './assets/magnifier.png';
import './index.scss';
import axios from 'axios';
import { useAsyncError } from 'react-router-dom';

const P04_C01_MANAGE_EMPLOYEES = (props) => {
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
    const [projects, set_projects] = useState([]);
    const [showSpinner_CreateUpdateProject, set_showSpinner_CreateUpdateProject] = useState(false);
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState({});
    const [userPermissions, set_userPermissions] = useState([]);
    const [userGroups, set_userGroups] = useState([]);
    
    useEffect(() => {
        console.log('props.projects: ', props.projects);

        if (props.userPermissions !== undefined) {
            set_userPermissions([...props.userPermissions]);
        }

        if (props.userGroups !== undefined) {
            set_userGroups([...props.userGroups]);
        }
    }, []);

    const showState = () => {
        console.log('userPermissions: ', userPermissions);
        console.log('userGroups: ', userGroups);
    }

    const checkbox_changed = (checkbox) => {
        console.log('checkbox checked...', checkbox);

        let index = userPermissions.findIndex(elem => elem === checkbox.id)

        if (index !== -1) {
            let newPermissions = [...userPermissions];

            newPermissions.splice(index, 1);

            set_userPermissions(newPermissions);
        } 
        else {
            let newPermissions = [...userPermissions, checkbox.id];

            set_userPermissions(newPermissions);
        }
    }

    const createNewEmployee = () => {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let first_name = document.getElementById('firstName').value;
        let last_name = document.getElementById('lastName').value;
        let email = document.getElementById('email').value;
        let department = document.getElementById('department').value;
        let pensum = document.getElementById('pensum').value;

        let groups = [];

        userPermissions.map((groupName) => {
            let index = userGroups.findIndex(elem => elem.name === groupName);

            groups.push(userGroups[index].id);
        })

        if (username == "" || 
            first_name == "" || 
            last_name == "" || 
            email == "" || 
            department == "" || 
            pensum == ""
            )  {
            return alert('Missing input: name, number or short name')
        }

        set_showSpinner_CreateUpdateProject(true);

        axios({
            method: 'post',
            url: baseUrl + '/company/register-employee/',
            headers: {
                "Authorization": token
            },
            data: {
                username: username,
                password: password,
                first_name: first_name,
                last_name: last_name,
                email: email,
                email: email,
                department: department,
                pensum: pensum,
                groups: groups,
            }
        })
        .then((response => {
            console.log("employee created sucessfully");

            props.set_employees([...props.employees, response.data]);

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with creating employee')
        })
    }

    const switchToUpdateMode = (project) => {
        set_updateMode(true);
        set_selectedItem(project);

        document.getElementById('name').value = project.name;
        document.getElementById('number').value = project.number;
        document.getElementById('short_name').value = project.short_name;

    }

    const updateEmployee = (employee) => {
        let updateProject = {...selectedItem};

        updateProject.name = document.getElementById('name').value;
        updateProject.number = document.getElementById('number').value;
        updateProject.short_name = document.getElementById('short_name').value;

        if (updateProject.name == "" || updateProject.number == "" || updateProject.short_name == "")  {
            return alert('Missing input: name, number or short name')
        }

        set_showSpinner_CreateUpdateProject(true);

        axios({
            method: 'put',
            url: baseUrl + `/company/projects/${updateProject.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: updateProject.name,
                number: updateProject.number,
                short_name: updateProject.short_name,
                // milestone_items: [],
                // monuments: []
            }
        })
        .then((response => {
            console.log("projects updated sucessfully");

            let index = projects.findIndex(elem => elem.id === response.data.id);

            let updatedProjects = [...projects];

            updatedProjects[index] = {...response.data, displayed: updateProject.displayed};

            set_projects(updatedProjects);

            props.set_projects(updatedProjects);

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with creating project')
        })
    }

    return ( <div className='p04-c01-manage-employees'>
        <div className='p04-c01-background'></div>
        <div className='p04-c01-window'>
            <div className='p04-c01-nav-bar'>
                <div className='p04-c01-nav-bar-left'>
                    {/* <img className='p04-c01-icons' src={delete_cross} alt='' /> */}
                    {/* {userPermissions.findIndex(elem => elem === "create_project") !== -1 ?
                    <img className='p04-c01-icons' src={create_new} alt='' onClick={() => set_createMode(!createMode)} />
                    :
                    <div></div>
                    } */}
                </div>
                <div className='p04-c01-nav-bar-right'>
                    <div className='p04-c01-input-container'>
                        <input className='p04-c01-textbox' type='text' placeholder='Search ...' />
                        <img className='p04-c01-img' src={magnifier} alt='' />
                    </div>
                    <img className='p04-c01-icons' src={edit_panels} alt='' />
                    <img 
                        className='p04-c01-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input type='button' className='button' value={'X'} onClick={() => props.toogleVisibility(false)} />
                </div>
            </div>
            <div className='p04-c01-content'>
                <div className='p04-c01-row'>
                    <div className='p04-c01-row-left-col'>Username</div>
                    <div className='p04-c01-row-right-col'>
                        <div className='p04-c01-input-container'>
                            <input id='username' className='p04-c01-textbox' type='text' placeholder='...' />
                        </div>
                    </div>
                </div>
                <div className='p04-c01-row'>
                    <div className='p04-c01-row-left-col'>Password</div>
                    <div className='p04-c01-row-right-col'>
                        <div className='p04-c01-input-container'>
                            <input id='password' className='p04-c01-textbox' type='password' placeholder='...' />
                        </div>
                    </div>
                </div>
                <div className='p04-c01-row'>
                    <div className='p04-c01-row-left-col'>First name</div>
                    <div className='p04-c01-row-right-col'>
                        <div className='p04-c01-input-container'>
                            <input id='firstName' className='p04-c01-textbox' type='text' placeholder='...' />
                        </div>
                    </div>
                </div>
                <div className='p04-c01-row'>
                    <div className='p04-c01-row-left-col'>Last name</div>
                    <div className='p04-c01-row-right-col'>
                        <div className='p04-c01-input-container'>
                            <input id='lastName' className='p04-c01-textbox' type='text' placeholder='...' />
                        </div>
                    </div>
                </div>
                <div className='p04-c01-row'>
                    <div className='p04-c01-row-left-col'>Email</div>
                    <div className='p04-c01-row-right-col'>
                        <div className='p04-c01-input-container'>
                            <input id='email' className='p04-c01-email' type='email' placeholder='...' />
                        </div>
                    </div>
                </div>
                <div className='p04-c01-row'>
                    <div className='p04-c01-row-left-col'>Department</div>
                    <div className='p04-c01-row-right-col'>
                        <div className='p04-c01-input-container'>
                            <select 
                                id="department" 
                                // className='p02-c09-textbox-short'
                                // selectedIndex={selectedIndex}
                                // onClick={() => console.log('option clicked')}
                                // onChange={document.getElementById(`${item.short_name} : ${item.name}`).selected = true}
                            >
                                <option id='default-department' value="">--Please choose an option--</option>
                                <option id='certification' value='certification'>certification</option>
                                <option id='design' value='design'>design</option>
                                <option id='documentation' value='documentation'>documentation</option>
                                <option id='systems' value='systems'>systems</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='p04-c01-row'>
                    <div className='p04-c01-row-left-col'>Pensum</div>
                    <div className='p04-c01-row-right-col'>
                        <div className='p04-c01-input-container'>
                            <input 
                            id='pensum' 
                            className='p04-c01-number' 
                            type='number' 
                            placeholder='...' 
                            min={0}
                            max={100}
                            />
                        </div>
                    </div>
                </div>
                <table className='p04-c01-table-01'>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Monument</th>
                            <th>Document</th>
                            <th>Milestone</th>
                            <th>Task</th>
                            <th>All</th>
                        </tr>
                    </thead>                    
                </table>
                <table className='p04-c01-table-02'>
                    <thead>
                        <tr>
                            <th className='p04-c01-access-icons'> 
                                <img 
                                    className='p04-c01-access-icon'
                                    src={create_new} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={pencil_edit} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={delete_cross} 
                                    alt=''
                                />
                            </th>
                            <th className='p04-c01-access-icons'> 
                                <img 
                                    className='p04-c01-access-icon'
                                    src={create_new} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={pencil_edit} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={delete_cross} 
                                    alt=''
                                />
                            </th>
                            <th className='p04-c01-access-icons'> 
                                <img 
                                    className='p04-c01-access-icon'
                                    src={create_new} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={pencil_edit} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={delete_cross} 
                                    alt=''
                                />
                            </th>
                            <th className='p04-c01-access-icons'> 
                                <img 
                                    className='p04-c01-access-icon'
                                    src={create_new} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={pencil_edit} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={delete_cross} 
                                    alt=''
                                />
                            </th>
                            <th className='p04-c01-access-icons'> 
                                <img 
                                    className='p04-c01-access-icon'
                                    src={create_new} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={pencil_edit} 
                                    alt=''
                                />
                                <img 
                                    className='p04-c01-access-icon'
                                    src={delete_cross} 
                                    alt=''
                                />
                            </th>
                            <th>Permissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input id="create_project" type='checkbox' checked={userPermissions.find(elem => elem === "create_project")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="edit_project" type='checkbox' checked={userPermissions.find(elem => elem === "edit_project")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="delete_project" type='checkbox' checked={userPermissions.find(elem => elem === "delete_project")} onChange={(e) => checkbox_changed(e.target)} />
                            </td>
                            <td>
                                <input id="create_monument" type='checkbox' checked={userPermissions.find(elem => elem === "create_monument")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="edit_monument" type='checkbox' checked={userPermissions.find(elem => elem === "edit_monument")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="delete_monument" type='checkbox' checked={userPermissions.find(elem => elem === "delete_monument")} onChange={(e) => checkbox_changed(e.target)} />
                            </td>
                            <td>
                                <input id="create_document" type='checkbox' checked={userPermissions.find(elem => elem === "create_document")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="edit_document" type='checkbox' checked={userPermissions.find(elem => elem === "edit_document")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="delete_document" type='checkbox' checked={userPermissions.find(elem => elem === "delete_document")} onChange={(e) => checkbox_changed(e.target)} />
                            </td>
                            <td>
                                <input id="create_milestone_item" type='checkbox' checked={userPermissions.find(elem => elem === "create_milestone_item")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="edit_milestone_item" type='checkbox' checked={userPermissions.find(elem => elem === "edit_milestone_item")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="delete_milestone_item" type='checkbox' checked={userPermissions.find(elem => elem === "delete_milestone_item")} onChange={(e) => checkbox_changed(e.target)} />
                            </td>
                            <td>
                                <input id="create_task" type='checkbox' checked={userPermissions.find(elem => elem === "create_task")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="edit_task" type='checkbox' checked={userPermissions.find(elem => elem === "edit_task")} onChange={(e) => checkbox_changed(e.target)} />
                                <input id="delete_task" type='checkbox' checked={userPermissions.find(elem => elem === "delete_task")} onChange={(e) => checkbox_changed(e.target)} />
                            </td>
                            <td>
                                <input id="all_permissions" type='checkbox' checked={userPermissions.find(elem => elem === "all_permissions")} onChange={(e) => checkbox_changed(e.target)} />
                            </td>
                        </tr>
                        {/* {projects.map((project) => {
                            return <tr key={Math.random() * 100000}>
                                <td><input type='checkbox' checked={project.displayed} onChange={() => checkboxChanged(project)} /></td>
                                <td>{project.name}</td>
                                <td>{project.number}</td>
                                <td>{project.short_name}</td>
                                <td>
                                    {userPermissions.find(elem => elem === "edit_project") ?
                                        <img className='p04-c01-icons' src={pencil_edit} alt='' onClick={() => switchToUpdateMode(project)} />
                                        :
                                        <div></div>
                                    }
                                    {userPermissions.find(elem => elem === "delete_project") ? 
                                        <img className='p04-c01-icons' src={delete_cross} alt='' onClick={() => deleteProject(project)} />
                                        :
                                        <div></div>
                                    }
                                </td>
                            </tr>
                        })} */}
                    </tbody>
                </table>
            </div>
                <div className='p04-c01-win-footer'>
                    <div className='p04-c01-footer-row2'>
                        <div className='p04-c01-row2-col1'>
                            {showSpinner_CreateUpdateProject ?
                                <div className="spinner-border p04-c01-spinner" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <input 
                                    type='button' 
                                    className='button' 
                                    value={updateMode ? 'Update' : 'Create'} 
                                    onClick={updateMode ? updateEmployee : createNewEmployee} 
                                />
                            }
                        </div>
                        <div className='p04-c01-row2-col2'>
                            <input 
                                type='button' 
                                className='button' 
                                value={updateMode ? 'Cancel' : 'Close'} 
                                onClick={updateMode ? () => set_updateMode(false) : () => set_createMode(false)} 
                            />
                        </div>
                    </div>
                </div>
        </div>
    </div> );
}
 
export default P04_C01_MANAGE_EMPLOYEES;