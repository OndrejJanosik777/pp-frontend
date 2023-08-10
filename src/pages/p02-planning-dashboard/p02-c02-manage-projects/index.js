import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import pencil_edit from './assets/pencil_edit.png';
import magnifier from './assets/magnifier.png';
import * as apiActions from '../../../app/features/api/apiSlice';
import './index.scss';
import axios from 'axios'; 

const P02_C02_MANAGE_PROJECTS = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let projects = useSelector(state => state.api.projects);
    let userPermissions = useSelector(state => state.api.userProfile.groups);
    let baseUrl = useSelector(state => state.api.baseUrl);

    // const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    // const [projects, set_projects] = useState([]);
    const [showSpinner_CreateUpdateProject, set_showSpinner_CreateUpdateProject] = useState(false);
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState({});
    // const [userPermissions, set_userPermissions] = useState([...props.userPermissions])
    
    useEffect(() => {
        // console.log('props.projects: ', props.projects);

        // set_projects(props.projects);
    }, []);

    const showState = () => {
        console.log('userPermissions: ', userPermissions);
    }

    const checkboxChanged = (item) => {
        let updatedItem = { ...item };

        updatedItem.displayed = !updatedItem.displayed;

        dispatch(apiActions.update_project(updatedItem));
    }

    const deleteItem = (item) => {
        let index = projects.findIndex(elem => elem.id === item.id)
        let originalItems = [...projects];
        let updatedItems = [...projects];

        updatedItems.splice(index, 1);

        // set_projects(updatedProjects);

        dispatch(apiActions.update_projects(updatedItems));

        // props.set_projects(updatedProjects);

        axios({
            method: 'delete',
            url: baseUrl + `/company/projects/${item.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log("projects deleted sucessfully");
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            dispatch(apiActions.update_projects(originalItems));
        })
    }

    const createItem = () => {
        // function will create new item in redux state and backend database
        let name = document.getElementById('name').value;
        let number = document.getElementById('number').value;
        let short_name = document.getElementById('short_name').value;

        if (name == "" || short_name == "" || number == "")  {
            return alert('Missing input: name, number or short name')
        }

        set_showSpinner_CreateUpdateProject(true);

        // update in backend database and after success in redux state
        axios({
            method: 'post',
            url: baseUrl + '/company/projects/',
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                number: number,
                short_name: short_name
            }
        })
        .then((response => {
            console.log("projects created sucessfully");

            let newProject = {...response.data, displayed: true, milestone_items: [], monuments: [] };

            let updatedProjects = [...projects, newProject];

            dispatch(apiActions.update_projects(updatedProjects))

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item) => {
        set_updateMode(true);
        set_selectedItem(item);

        document.getElementById('name').value = item.name;
        document.getElementById('number').value = item.number;
        document.getElementById('short_name').value = item.short_name;

    }

    const updateItem = (item) => {
        // function will update item in state and database
        let updateProject = {...item};

        updateProject.name = document.getElementById('name').value;
        updateProject.number = document.getElementById('number').value;
        updateProject.short_name = document.getElementById('short_name').value;

        if (updateProject.name == "" || updateProject.number == "" || updateProject.short_name == "")  {
            return alert('Missing input: name, number or short name')
        }

        const index = projects.findIndex(elem => elem.id === item.id);

        set_showSpinner_CreateUpdateProject(true);

        // update item in database and in redux store
        axios({
            method: 'put',
            url: baseUrl + `/company/projects/${updateProject.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: updateProject.name,
                number: updateProject.number,
                short_name: updateProject.short_name
                // milestone_items: [],
                // monuments: []
            }
        })
        .then((response => {
            console.log("projects updated sucessfully");

            // let index = projects.findIndex(elem => elem.id === response.data.id);

            let updatedItems = [...projects];

            updatedItems[index] = {
                ...response.data, 
                displayed: updateProject.displayed, 
                milestone_items: [...updateProject.milestone_items],
                monuments: [...updateProject.monuments]
            };

            dispatch(apiActions.update_projects(updatedItems));

            // set_updateMode(false);

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    return ( <div className='p02-c02-manage-projects'>
        <div className='p02-c02-background'></div>
        <div className='p02-c02-window'>
            <div className='p02-c02-nav-bar'>
                <div className='p02-c02-nav-bar-left'>
                    {/* <img className='p02-c02-icons' src={delete_cross} alt='' /> */}
                    {userPermissions.findIndex(elem => elem.name === "create_project" || elem.name ===  "all_permissions") !== -1 ?
                    <img className='p02-c02-icons' src={create_new} alt='' onClick={() => set_createMode(!createMode)} />
                    :
                    <div></div>
                    }
                </div>
                <div className='p02-c02-nav-bar-right'>
                    <div className='p02-c02-textbox-container'>
                        <input className='p02-c02-textbox' type='text' placeholder='Search ...' />
                        <img className='p02-c02-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c02-icons' src={edit_panels} alt='' />
                    <img 
                        className='p02-c02-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input type='button' className='button' value={'X'} onClick={() => props.toogleVisibility(false)} />
                </div>
            </div>
            <div className='p02-c02-content'>
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
                        {projects.map((item) => {
                            return <tr key={Math.random() * 100000}>
                                <td><input type='checkbox' checked={item.displayed} onChange={() => checkboxChanged(item)} /></td>
                                <td>{item.name}</td>
                                <td>{item.number}</td>
                                <td>{item.short_name}</td>
                                <td>
                                    {userPermissions.find(elem => elem.name === "edit_project"  || elem.name ===  "all_permissions") ?
                                        <img className='p02-c02-icons' src={pencil_edit} alt='' onClick={() => switchToUpdateMode(item)} />
                                        :
                                        <div></div>
                                    }
                                    {userPermissions.find(elem => elem.name === "delete_project"  || elem.name ===  "all_permissions") ? 
                                        <img className='p02-c02-icons' src={delete_cross} alt='' onClick={() => deleteItem(item)} />
                                        :
                                        <div></div>
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
                <div className={createMode || updateMode ? 'p02-c02-win-footer' : 'p02-c02-win-footer-hidden'}>
                    <div className='p02-c02-footer-row1'>
                        <div className='p02-c02-row1-col1'>name</div>
                        <div className='p02-c02-row1-col2'>
                            <div className='p02-c02-textbox-container'>
                                <input className='p02-c02-textbox' type='text' id='name' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='p02-c02-footer-row1'>
                        <div className='p02-c02-row1-col1'>number</div>
                        <div className='p02-c02-row1-col2'>
                            <div className='p02-c02-textbox-container'>
                                <input className='p02-c02-textbox' type='text' id='number' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='p02-c02-footer-row1'>
                        <div className='p02-c02-row1-col1'>short name</div>
                        <div className='p02-c02-row1-col2'>
                            <div className='p02-c02-textbox-container'>
                                <input className='p02-c02-textbox' type='text' id='short_name' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='p02-c02-footer-row2'>
                        <div className='p02-c02-row2-col1'>
                            {showSpinner_CreateUpdateProject ?
                                <div className="spinner-border p02-c02-spinner" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <input 
                                    type='button' 
                                    className='button' 
                                    value={updateMode ? 'Update' : 'Create'} 
                                    onClick={updateMode ? () => updateItem(selectedItem) : createItem} 
                                />
                            }
                        </div>
                        <div className='p02-c02-row2-col2'>
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
 
export default P02_C02_MANAGE_PROJECTS;