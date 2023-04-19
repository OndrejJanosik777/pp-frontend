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

const ManageProjects = (props) => {
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
    const [selectedProject, set_selectedProject] = useState({});

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
        set_selectedProject(project);

        document.getElementById('name').value = project.name;
        document.getElementById('number').value = project.number;
        document.getElementById('short_name').value = project.short_name;

    }

    const updateProject = () => {
        let updateProject = {...selectedProject};

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

    return ( <div className='c1-manage-projects'>
        <div className='c1-background'></div>
        <div className='c1-window'>
            <div className='c1-nav-bar'>
                <div className='c1-nav-bar-left'>
                    <img className='c1-icons' src={delete_cross} alt='' />
                    <img className='c1-icons' src={create_new} alt='' onClick={() => set_createMode(!createMode)} />
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
                        {projects.map((project) => {
                            return <tr key={Math.random() * 100000}>
                                <td><input type='checkbox' checked={project.displayed} onChange={() => checkboxChanged(project)} /></td>
                                <td>{project.name}</td>
                                <td>{project.number}</td>
                                <td>{project.short_name}</td>
                                <td>
                                    <img className='c1-icons' src={pencil_edit} alt='' onClick={() => switchToUpdateMode(project)} />
                                    <img className='c1-icons' src={delete_cross} alt='' onClick={() => deleteProject(project)} />
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            {createMode || updateMode ? 
                <div className='c1-win-footer'>
                    <div className='c1-footer-row1'>
                        <div className='c1-row1-col1'>name</div>
                        <div className='c1-row1-col2'>
                            <div className='c1-textbox-container'>
                                <input className='c1-textbox' type='text' id='name' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='c1-footer-row1'>
                        <div className='c1-row1-col1'>number</div>
                        <div className='c1-row1-col2'>
                            <div className='c1-textbox-container'>
                                <input className='c1-textbox' type='text' id='number' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='c1-footer-row1'>
                        <div className='c1-row1-col1'>short name</div>
                        <div className='c1-row1-col2'>
                            <div className='c1-textbox-container'>
                                <input className='c1-textbox' type='text' id='short_name' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='c1-footer-row2'>
                        <div className='c1-row2-col1'>
                            {showSpinner_CreateUpdateProject ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <input type='button' className='button' value={updateMode ? 'Update' : 'Create'} onClick={updateMode ? updateProject : createNewProject} />
                            }
                        </div>
                        <div className='c1-row2-col2'>
                            <input type='button' className='button' value={updateMode ? 'Cancel' : 'Close'} onClick={updateMode ? () => set_updateMode(false) : () => props.set_manageProjects_toogle(false)} />
                        </div>
                    </div>
                </div>
                :
                <span></span>
            }
        </div>
    </div> );
}
 
export default ManageProjects;