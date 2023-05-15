import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import MilestoneTag from './milestone-tag';
import home from './assets/home.png';
import small_arrow_down from './assets/small_arrow_down.png';
import arrow_left from './assets/arrow_left.png';
import magnifier_dark from './assets/magnifier_dark.png';
// pages
import C01_NAVBAR from '../../components/c01-nav-bar'
import C02_SIDEBAR from '../../components/c02-side-bar';
// components
import P02_C01_TIMELINE from './p02-c01-timeline';
import P02_C02_MANAGE_PROJECTS from './p02-c02-manage-projects';
import P02_C03_MANAGE_MILESTONE_TYPES from './p02-c03-manage-milestone-types';
import P02_C04_MANAGE_TASK_TYPES from './p02-c04-manage-tasks-types';
import P02_C05_PROJECT from './p02-c05-project';
import P02_C06_MANAGE_MILESTONES from './p02-c06-manage-milestones';
import P02_C07_MANAGE_TASKS from './p02-c07-manage-tasks';
import P02_C08_MANAGE_MONUMENTS from './p02-c08-manage-monuments';
import P02_C09_MANAGE_DOCUMENTS from './p02-c09-manage-documents';
// components

import './index.scss';

const P02_PLANNING_DASHBOARD = () => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    // data from backend
    const [projects, set_projects] = useState([]);
    const [milestoneTypes, set_milestoneTypes] = useState([]);
    const [taskTypes, set_taskTypes] = useState([]);
    // 
    const [dateOffset, set_dateOffset] = useState(0);    // offset from today...
    const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [displayedDays, set_displayedDays] = useState(parseInt((window.innerWidth - 8 * 16 - 0 * 16 - 4 * 16) / 16));
    // modal toogles
    const [createProject_toogle, set_createProject_toogle] = useState(false);
    const [deleteProjectWarning_toogle, set_deleteProjectWarning_toogle] = useState(false);
    const [deleteMilestoneWarning_toogle, set_deleteMilestoneWarning_toogle] = useState(false);
    const [createMilestone_toogle, set_createMilestone_toogle] = useState(false);
    const [createTask_toogle, set_createTask_toogle] = useState(false);
    const [editMilestone_toogle, set_editMilestone_toogle] = useState(false);
    const [manageMonuments_toogle, set_manageMonuments_toogle] = useState(false);
    const [manageCertificationDocuments_toogle, set_manageCertificationDocuments_toogle] = useState(false);
    // after refactoring
    const [manageMilestoneTypes_modalToogle, set_manageMilestoneTypes_modalToogle] = useState(false);
    const [manageProjects_modalToogle, set_manageProjects_modalToogle] = useState(false);
    const [manageTasksTypes_modalToogle, set_manageTasksTypes_modalToogle] = useState(false);
    const [manageMilestones_modalToogle, set_manageMilestones_modalToogle] = useState(false);
    const [manageTasks_modalToogle, set_manageTasks_modalToogle] = useState(false);
    const [manageMonuments_modalToogle, set_manageMonuments_modalToogle] = useState(false);
    const [manageDocuments_modalToogle, set_manageDocuments_modalToogle] = useState(false);
    // rest
    const [activeProject, set_activeProject] = useState(undefined);
    const [activeMilestoneItem, set_activeMilestoneItem] = useState(undefined);
    const [warningText, set_warningText] = useState('');
    const [showSpinner_FetchingProjects, set_showSpinner_FetchingProjects] = useState(true);
    const [extendedSideBar, set_extendedSideBar] = useState(false);

    const handleResize = useRef((event) => {
        console.log('event.target.innerWidth', event.target.innerWidth);

        let availableWidth = event.target.innerWidth;
        availableWidth = availableWidth - 5 * 16 - 8 * 16 - 4 * 16;

        let daysToDisplay = parseInt(availableWidth / 16);
        // console.log('daysToDisplay: ', daysToDisplay);
        set_displayedDays(daysToDisplay);
    })
    // hook to run while loading component
    useEffect(() => {
        console.log('dashboard Projects loaded...');

        window.addEventListener('resize', handleResize.current);

        fetchProjects();

        fetchMilestoneTypes();

        fetchTaskTypes();
    }, []);

    const showState = () => {
        console.log('state of p02-planning-dashboard: ');
        console.log('projects: ', projects);
    }

    // functions for managing projects
    const addNewProjectToState = (project) => {
        set_projects([...projects, project]);
        set_createProject_toogle(!createProject_toogle);
    }

    const deleteMilestoneItem = (project, milestoneItem) => {
        console.log(`deleting item: ${milestoneItem.id}`);

        // update in component state
        let projectIndex = projects.findIndex(elem => elem.id === project.id)
        let milestoneItemIndex = projects[projectIndex].milestone_items.findIndex(elem => elem.id === milestoneItem.id)

        // console.log(`projectIndex: ${projectIndex}`);
        // console.log(`milestoneItemIndex: ${milestoneItemIndex}`);

        let originalProjects = [...projects];
        let updatedProjects = [...projects];

        updatedProjects[projectIndex].milestone_items.splice(milestoneItemIndex, 1);
        console.log(`updatedProjects:`, updatedProjects);

        set_projects([...updatedProjects]);

        // update in database
        axios({
            method: 'delete',
            url: baseUrl + '/company/milestone-items/' + milestoneItem.id + "/",
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                console.log('milestone deleted from database: ', response.data);

                set_deleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle);
            }))
            .catch((error) => {
                console.log('problem with deleting milestone item: ', error);

                set_projects([...originalProjects]);
            })
    }

    const deleteProject = (project) => {
        const index = projects.findIndex(elem => elem.id === project.id)

        let modifiedProjects = [...projects];
        modifiedProjects.splice(index, 1);

        set_projects([...modifiedProjects]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/projects/${project.id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                set_deleteProjectWarning_toogle(!deleteProjectWarning_toogle);
            }))
            .catch((error) => {
                console.log(error);

                alert('Error: Project cannot be deleted.')
            })
    }

    const display_modal_warning_deleteMilestoneItem = (project, milestone) => {
        set_activeProject(project);
        set_activeMilestoneItem(milestone);
        set_warningText(`Are you sure to delete milestone ${milestone.name} from project ${project.name}?`);
        // setDeleteFunction(deleteProject(project));
        set_deleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle);
    }

    const fetchProjects = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/projects/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            let newProjects = [];

            response.data.map((item) => {
                newProjects.push({...item, displayed: true})
            })

            console.log('projects: ', newProjects);

            set_showSpinner_FetchingProjects(false);

            // set_projects(response.data);
            set_projects(newProjects);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching projects')
        })
    }

    const fetchMilestoneTypes = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/milestone-item-types/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            let milestoneTypes = response.data;
            milestoneTypes.sort((a, b) => a.id - b.id);

            set_milestoneTypes([...milestoneTypes]);

            // set_showSpinner_FetchingItems(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching milestone item types')
        })
    }

    const fetchTaskTypes = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/task-types/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            console.log('fetch tasks types: ', response.data);

            let tasksTypes = response.data;

            tasksTypes.sort((a, b) => a.id - b.id);

            set_taskTypes([...tasksTypes]);

            // set_showSpinner_FetchingItems(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching tasks types');
        })
    }

    const updateProjectInState = (project) => {
        let index = projects.findIndex(element => element.id === project.id);
        let newProjects = [...projects];
        newProjects[index] = { ...project };
        set_projects([...newProjects]);
        // set_createProject_toogle(!createProject_toogle);
    }

    const updateProject = (project) => {
        let displayed = project.displayed;

        axios({
            method: 'get',
            url: baseUrl + `/company/projects/${project.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            const index = projects.findIndex((elem) => elem.id === project.id);

            let newArray = [...projects];
            newArray[index] = { ...response.data, displayed: displayed };

            set_projects([...newArray]);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching projects')
        })
    }

    return (
        <div className='p02-dashboard'>
            <C01_NAVBAR />
            <C02_SIDEBAR extendedSideBar={extendedSideBar} set_extendedSideBar={set_extendedSideBar} /> 
            <div className='p02-center-section'>
                <img className='p02-img-home' src={home} alt='' />
                <button className='button-container'>
                    <div className='button-name'>Quick Links</div>
                    <img className='img' src={small_arrow_down} alt='' />
                </button>

                <div className='p02-main-section' id='main-section' name='main-section'>
                    {/* MODAL COMPONENTS IN MAIN SECTION */}
                    {manageProjects_modalToogle ?
                    <P02_C02_MANAGE_PROJECTS 
                        projects={projects}
                        set_projects={set_projects}
                        toogleVisibility={set_manageProjects_modalToogle} 
                    />
                    : ""}
                    {manageMilestoneTypes_modalToogle ?
                    <P02_C03_MANAGE_MILESTONE_TYPES
                        milestoneTypes={milestoneTypes}
                        set_milestoneTypes={set_milestoneTypes}
                        toogleVisibility={set_manageMilestoneTypes_modalToogle}
                    />
                    :
                    ""}
                    {manageTasksTypes_modalToogle ?
                    <P02_C04_MANAGE_TASK_TYPES
                        taskTypes={taskTypes}
                        set_taskTypes={set_taskTypes}
                        toogleVisibility={set_manageTasksTypes_modalToogle}
                    />
                    :
                    ""}
                    {manageMilestones_modalToogle ?
                    <P02_C06_MANAGE_MILESTONES
                        activeProject={activeProject}
                        updateProject={updateProject}
                        updateProjectInState={updateProjectInState}
                        milestoneTypes={milestoneTypes}
                        toogleVisibility={set_manageMilestones_modalToogle}
                    />
                    :
                    ""}
                    {manageTasks_modalToogle ?
                    <P02_C07_MANAGE_TASKS
                        activeProject={activeProject}
                        activeMilestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        // updateProjectInState={updateProjectInState}
                        // milestoneTypes={milestoneTypes}
                        taskTypes={taskTypes}
                        toogleVisibility={set_manageTasks_modalToogle}
                    />
                    :
                    ""}
                    {manageMonuments_modalToogle ?
                    <P02_C08_MANAGE_MONUMENTS
                        activeProject={activeProject}
                        // activeMilestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        // updateProjectInState={updateProjectInState}
                        // milestoneTypes={milestoneTypes}
                        // taskTypes={taskTypes}
                        toogleVisibility={set_manageMonuments_modalToogle}
                    />
                    :
                    ""}
                    {manageDocuments_modalToogle ?
                    <P02_C09_MANAGE_DOCUMENTS
                        activeProject={activeProject}
                        // activeMilestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        // updateProjectInState={updateProjectInState}
                        // milestoneTypes={milestoneTypes}
                        // taskTypes={taskTypes}
                        toogleVisibility={set_manageDocuments_modalToogle}
                    />
                    :
                    ""}
                    
                    <div className='p02-nav-bar'>
                        <div 
                            className='p02-item' 
                            onClick={() => set_manageProjects_modalToogle(!manageProjects_modalToogle)}
                        >Projects</div>
                        <div className='p02-item'>|</div>
                        <div 
                            className='p02-item' 
                            onClick={() => set_manageMilestoneTypes_modalToogle(!manageMilestoneTypes_modalToogle)} 
                        >Milestone Types</div>
                        <div className='p02-item'>|</div>
                        <div 
                            className='p02-item'
                            onClick={() => set_manageTasksTypes_modalToogle(true)}
                        >Task types</div>
                        <div className='p02-item'>|</div>
                        <div 
                            className='p02-item'
                            onClick={() => set_dateOffset(0)}
                        >Today</div>
                        <div className='p02-item'>|</div>
                        <div 
                            className='p02-item'
                            onClick={showState}
                        >Show state</div>
                        <div className={
                            showSpinner_FetchingProjects ?
                            'p02-fetching-displayed' :
                            'p02-fetching-hidden'
                            }>
                            loading projects from database ...
                            <div className="spinner-border p02-spinner" role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    </div>
                    <main className='p02-main'>
                    {
                        projects.map((project) => {
                            project.milestone_items.sort((a, b) => {
                                return moment(a.date) - moment(b.date);
                            })

                            let achievedMilestones = project.milestone_items.filter(elem => {
                                let now = moment();
                                let m_date = moment(elem.date);

                                return m_date.diff(now, 'days') < 0;
                            })

                            let totalTasks = 0;
                            let completedTasks = 0;

                            project.milestone_items.map((milestoneItem) => {
                                totalTasks += milestoneItem.tasks.length;

                                milestoneItem.tasks.map((task) => {
                                    if (task.status === 100) {
                                        completedTasks += 1;
                                    }
                                })
                            })

                            let certificationDocumentIds = [];

                            project.monuments.map((monument) => {
                                monument.certification_documents.map((document) => {
                                    // console.log('document: ', document);
                                    let index = certificationDocumentIds.findIndex((elem) => elem === document.id);

                                    if (index === -1) {
                                        certificationDocumentIds.push(document.id)
                                    }
                                })
                            })

                            const middleStyle = {
                                display: 'flex',
                                flexDirection: 'column',
                                height: `${project.milestone_items.length * 50}px`,
                                minHeight: '10rem',
                                borderWidth: '1px',
                                borderColor: 'black',
                                borderStyle: 'solid',
                                position: 'relative',
                                // backgroundColor: 'green',
                                width: '100%',
                            }
                            
                            if (project.displayed) {
                                return <P02_C05_PROJECT 
                                    key={Math.random() * 100000}
                                    createTask_toogle={createTask_toogle}
                                    dateOffset={dateOffset}
                                    displayedDays={displayedDays}
                                    display_modal_warning_deleteMilestoneItem={display_modal_warning_deleteMilestoneItem}
                                    editMilestone_toogle={editMilestone_toogle}
                                    project={project} 
                                    projects={projects}
                                    set_projects={set_projects}
                                    set_activeProject={set_activeProject}
                                    set_activeMilestoneItem={set_activeMilestoneItem}
                                    set_editMilestone_toogle={set_editMilestone_toogle}
                                    set_createTask_toogle={set_createTask_toogle}
                                    set_manageMilestones_modalToogle={set_manageMilestones_modalToogle}
                                    set_manageTasks_modalToogle={set_manageTasks_modalToogle}
                                    set_manageMonuments_modalToogle={set_manageMonuments_modalToogle}
                                    set_manageDocuments_modalToogle={set_manageDocuments_modalToogle}
                                />
                            }
                        })
                    }
                    </main>
                    <footer className='p02-footer'>
                        <div className='p02-timeline-controls-left'>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                onClick={() => set_dateOffset(dateOffset - 1)}
                            >- 1 DAY</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                onClick={() => set_dateOffset(dateOffset - 7)}
                            >- 7 DAYS</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                onClick={() => set_dateOffset(dateOffset - 30)}
                            >- 30 DAYS</div>
                        </div>
                        <P02_C01_TIMELINE
                            dateOffset={dateOffset}
                            displayLimit={displayedDays}
                            // displayLimit={100}
                        />
                        <div className='p02-timeline-controls-right'>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                onClick={() => set_dateOffset(dateOffset + 1)}
                            >+ 1 DAY</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                onClick={() => set_dateOffset(dateOffset + 7)}
                            >+ 7 DAYS</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                onClick={() => set_dateOffset(dateOffset + 30)}
                            >+ 30 DAYS</div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default P02_PLANNING_DASHBOARD;