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

const P02_C02_MANAGE_PROJECTS = (props) => {
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
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions])
    

    useEffect(() => {
        console.log('props.projects: ', props.projects);

        set_projects(props.projects);
    }, []);

    const checkboxChanged = (project) => {
        console.log('checkbox checked...', project);

        let updatedProjects = [...projects];

        let index = updatedProjects.findIndex((elem) => elem.id === project.id);

        updatedProjects[index].displayed = !updatedProjects[index].displayed;

        set_projects(updatedProjects);
    }

    const deleteProject = (project) => {

        let index = projects.findIndex(elem => elem.id === project.id)

        let updatedProjects = [...projects];

        updatedProjects.splice(index, 1);

        set_projects(updatedProjects);

        props.set_projects(updatedProjects);

        axios({
            method: 'delete',
            url: baseUrl + `/company/projects/${project.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            console.log("projects deleted sucessfully");
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with creating project')
        })
    }

    const createNewProject = () => {
        let name = document.getElementById('name').value;
        let number = document.getElementById('number').value;
        let short_name = document.getElementById('short_name').value;

        console.log('name: ', name);
        console.log('number: ', number);
        console.log('short_name: ', short_name);

        if (name == "" || short_name == "" || number == "")  {
            return alert('Missing input: name, number or short name')
        }

        set_showSpinner_CreateUpdateProject(true);

        axios({
            method: 'post',
            url: baseUrl + '/company/projects/',
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                number: number,
                short_name: short_name,
                milestone_items: [],
                monuments: []
            }
        })
        .then((response => {
            console.log("projects created sucessfully");

            let newProject = {...response.data, displayed: true};

            let updatedProjects = [...projects, newProject];

            set_projects(updatedProjects);

            props.set_projects(updatedProjects);

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with creating project')
        })
    }

    const switchToUpdateMode = (project) => {
        set_updateMode(true);
        set_selectedItem(project);

        document.getElementById('name').value = project.name;
        document.getElementById('number').value = project.number;
        document.getElementById('short_name').value = project.short_name;

    }

    const updateProject = () => {
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

    return ( <div className='p02-c02-manage-projects'>
        <div className='p02-c02-background'></div>
        <div className='p02-c02-window'>
            <div className='p02-c02-nav-bar'>
                <div className='p02-c02-nav-bar-left'>
                    {/* <img className='p02-c02-icons' src={delete_cross} alt='' /> */}
                    {userPermissions.findIndex(elem => elem === "create_project") !== -1 ?
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
                    <img className='p02-c02-icons' src={questionmark_blue} alt='' />
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
                        {projects.map((project) => {
                            return <tr key={Math.random() * 100000}>
                                <td><input type='checkbox' checked={project.displayed} onChange={() => checkboxChanged(project)} /></td>
                                <td>{project.name}</td>
                                <td>{project.number}</td>
                                <td>{project.short_name}</td>
                                <td>
                                    {userPermissions.find(elem => elem === "edit_project") ?
                                        <img className='p02-c02-icons' src={pencil_edit} alt='' onClick={() => switchToUpdateMode(project)} />
                                        :
                                        <div></div>
                                    }
                                    {userPermissions.find(elem => elem === "delete_project") ? 
                                        <img className='p02-c02-icons' src={delete_cross} alt='' onClick={() => deleteProject(project)} />
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
                                    onClick={updateMode ? updateProject : createNewProject} 
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