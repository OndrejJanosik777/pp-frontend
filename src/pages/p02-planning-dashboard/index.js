import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
// icons, pictures
import planeSVG from './assets/airplane.svg';
import MilestoneTag from './milestone-tag';
import home from './assets/home.png';
import small_arrow_down from './assets/small_arrow_down.png';
import arrow_left from './assets/arrow_left.png';
import magnifier_dark from './assets/magnifier_dark.png';
import questionmark_blue from './assets/questionmark_blue.png';
// general components
import C01_NAVBAR from '../../components/c01-nav-bar'
import C02_SIDEBAR from '../../components/c02-side-bar';
// page specific components
import P02_C01_TIMELINE from './p02-c01-timeline';
import P02_C02_MANAGE_PROJECTS from './p02-c02-manage-projects';
import P02_C03_MANAGE_MILESTONE_TYPES from './p02-c03-manage-milestone-types';
import P02_C04_MANAGE_TASK_TYPES from './p02-c04-manage-tasks-types';
import P02_C05_PROJECT from './p02-c05-project';
import P02_C06_MANAGE_MILESTONES from './p02-c06-manage-milestones';
import P02_C07_MANAGE_MILESTONE_TASKS from './p02-c07-manage-milestone-tasks';
import P02_C08_MANAGE_MONUMENTS from './p02-c08-manage-monuments';
import P02_C09_MANAGE_DOCUMENTS from './p02-c09-manage-documents';
import P02_C10_MANAGE_PROJECT_TASKS from './p02-c10-manage-project-tasks';
// styles
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

    // 
    const [projects, set_projects] = useState([]);
    const [milestoneTypes, set_milestoneTypes] = useState([]);
    const [taskTypes, set_taskTypes] = useState([]);
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
    const [manageMilestoneTasks_modalToogle, set_manageMilestoneTasks_modalToogle] = useState(false);
    const [manageMonuments_modalToogle, set_manageMonuments_modalToogle] = useState(false);
    const [manageDocuments_modalToogle, set_manageDocuments_modalToogle] = useState(false);
    const [manageProjectTasks_modalToogle, set_manageProjectTasks_modalToogle] = useState(false);
    // rest
    const [activeProject, set_activeProject] = useState(undefined);
    const [activeMilestoneItem, set_activeMilestoneItem] = useState(undefined);
    const [warningText, set_warningText] = useState('');
    const [showSpinner_FetchingProjects, set_showSpinner_FetchingProjects] = useState(false);
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

        fetchUserData();

        fetchProjects();

        fetchMilestoneTypes();

        fetchTaskTypes();
    }, []);

    const showState = () => {
        console.log('state of p02-planning-dashboard: ');
        console.log('projects: ', projects);
        console.log('loggedUser: ', loggedUser);
        console.log('userPermissions: ', userPermissions);
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
                console.log("error: ", error);

                let message = error.message + "\n" + error.response.data;
    
                alert(message);

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
                console.log("error: ", error);

                let message = error.message + "\n" + error.response.data;
    
                alert(message);
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
        set_showSpinner_FetchingProjects(true);

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
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
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
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
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
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    return (
        <div className='p02-dashboard'>
            <C01_NAVBAR />
            <C02_SIDEBAR extendedSideBar={extendedSideBar} set_extendedSideBar={set_extendedSideBar} /> 
            <div className='p02-center-section'>
                <img className='p02-img-home' src={home} alt='' />
                <button className='p02-button-container'>
                    <div className='p02-button-name'>Quick Links</div>
                    <img className='p02-img' src={small_arrow_down} alt='' />
                </button>
                <div className='p02-main-section' id='main-section' name='main-section'>
                    {/* MODAL COMPONENTS IN MAIN SECTION */}
                    {manageProjects_modalToogle ?
                    <P02_C02_MANAGE_PROJECTS 
                        projects={projects}
                        set_projects={set_projects}
                        userPermissions={userPermissions}
                        toogleVisibility={set_manageProjects_modalToogle} 
                    />
                    : ""}
                    {manageMilestoneTypes_modalToogle ?
                    <P02_C03_MANAGE_MILESTONE_TYPES
                        milestoneTypes={milestoneTypes}
                        set_milestoneTypes={set_milestoneTypes}
                        userPermissions={userPermissions}
                        toogleVisibility={set_manageMilestoneTypes_modalToogle}
                    />
                    :
                    ""}
                    {manageTasksTypes_modalToogle ?
                    <P02_C04_MANAGE_TASK_TYPES
                        taskTypes={taskTypes}
                        set_taskTypes={set_taskTypes}
                        userPermissions={userPermissions}
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
                        userPermissions={userPermissions}
                        toogleVisibility={set_manageMilestones_modalToogle}
                    />
                    :
                    ""}
                    {manageMilestoneTasks_modalToogle ?
                    <P02_C07_MANAGE_MILESTONE_TASKS
                        activeProject={activeProject}
                        activeMilestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        // updateProjectInState={updateProjectInState}
                        // milestoneTypes={milestoneTypes}
                        taskTypes={taskTypes}
                        userPermissions={userPermissions}
                        toogleVisibility={set_manageMilestoneTasks_modalToogle}
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
                        userPermissions={userPermissions}
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
                        userPermissions={userPermissions}
                        toogleVisibility={set_manageDocuments_modalToogle}
                    />
                    :
                    ""}
                    {manageProjectTasks_modalToogle ?
                    <P02_C10_MANAGE_PROJECT_TASKS
                        activeProject={activeProject}
                        // activeMilestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        userPermissions={userPermissions}
                        // updateProjectInState={updateProjectInState}
                        // milestoneTypes={milestoneTypes}
                        // taskTypes={taskTypes}
                        toogleVisibility={set_manageProjectTasks_modalToogle}
                    />
                    :
                    ""}
                    <div className='p02-nav-bar'>
                        <div className='p02-nav-bar-left'>
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
                                onClick={() => fetchProjects()}
                            >Refresh Projects</div>
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
                        <div className='p02-nav-bar-right'>
                            <img 
                                className='p02-icons' 
                                onClick={showState}
                                src={questionmark_blue} 
                                alt='' 
                            />
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
                                    set_manageMilestoneTasks_modalToogle={set_manageMilestoneTasks_modalToogle}
                                    set_manageMonuments_modalToogle={set_manageMonuments_modalToogle}
                                    set_manageDocuments_modalToogle={set_manageDocuments_modalToogle}
                                    set_manageProjectTasks_modalToogle={set_manageProjectTasks_modalToogle}
                                    userPermissions={userPermissions}
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