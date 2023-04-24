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
// components
import Timeline from './p02-c01-timeline';
import ManageProjects from './p02-c02-manage-projects';
import ManageMilestoneTypes from './p02-c03-manage-milestone-types';
import ManageTasksTypes from './p02-c04-manage-tasks-types';
import CreateEditProjectModal from './create-edit-project-modal';
import EditMilestoneItemModal from './edit-milestoneItem-modal';
import CreateMilestoneItemModal from './create-milestone-modal';
import CreateTaskModal from './create-task-modal';
import ManageMonuments from './manage-monuments';
import ManageCertificationDocuments from './manage-certification-documents';
import DeleteWarning from './delete-warning-modal';
// import Project from './p02-c05-project';
// components
import NavBar from '../../components/c01-nav-bar'
import SideBar from '../../components/c02-side-bar';

import './index.scss';

const PlanningDashboard = () => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [projects, set_projects] = useState([]);
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
    const [manageMilestoneTypes_toogle, set_manageMilestoneTypes_toogle] = useState(false);
    const [manageProjects_toogle, set_manageProjects_toogle] = useState(false);
    const [manageTasksTypes_toogle, set_manageTasksTypes_toogle] = useState(false);
    // rest
    const [activeProject, set_activeProject] = useState(undefined);
    const [activeMilestoneItem, set_activeMilestoneItem] = useState(undefined);
    const [warningText, set_warningText] = useState('');

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
        window.addEventListener('resize', handleResize.current);

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

                // set_projects(response.data);
                set_projects(newProjects);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching projects')
            })
    }, []);
    // functions for managing projects
    const addNewProjectToState = (project) => {
        set_projects([...projects, project]);
        set_createProject_toogle(!createProject_toogle);
    }

    const createTask = (milestoneItem) => {
        console.log('creating task for milestone item nr: ', milestoneItem.id)
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

    const displayWarning_DeleteProject = (project) => {
        set_activeProject(project);
        set_warningText(`Are you sure to delete project: ${project.name}?`);
        // setDeleteFunction(deleteProject(project));
        set_deleteProjectWarning_toogle(!deleteProjectWarning_toogle);
    }

    const display_modal_warning_deleteMilestoneItem = (project, milestone) => {
        set_activeProject(project);
        set_activeMilestoneItem(milestone);
        set_warningText(`Are you sure to delete milestone ${milestone.name} from project ${project.name}?`);
        // setDeleteFunction(deleteProject(project));
        set_deleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle);
    }

    const display_modal_createNewMilestone = (project) => {
        // console.log(`creating new Milestone for project ${project.id}`);

        set_activeProject(project);
        set_activeMilestoneItem(undefined);

        set_createMilestone_toogle(!createMilestone_toogle);
    }

    const display_modal_createNewTask = (project, milestoneItem) => {
        console.log(`creating new Task for milestone ${milestoneItem.id} within project ${project.id}`);

        set_activeProject(project);
        set_activeMilestoneItem(milestoneItem);

        set_createTask_toogle(!createTask_toogle);
    }

    const updateExistingProjectInState = (project) => {
        let index = projects.findIndex(element => element.id === project.id);
        let newProjects = [...projects];
        newProjects[index] = { ...project };
        set_projects([...newProjects]);
        set_createProject_toogle(!createProject_toogle);
    }

    const updateMilestoneItem = (project, milestoneItem) => {
        console.log(`updating milestone item ${milestoneItem.name} within project ${project.name}`);

        set_activeProject(project);
        set_activeMilestoneItem(milestoneItem);

        set_editMilestone_toogle(!editMilestone_toogle);
    }

    const updateMilestoneItemDeadline = (days, project, milestoneItem) => {
        // update in component state
        // console.log(`moving milestone with id ${milestoneItemId} within project with id ${projectId} by ${days}... `);

        let projectIndex = projects.findIndex(element => element.id === project.id);
        let milestoneIndex = projects[projectIndex].milestone_items.findIndex(element => element.id === milestoneItem.id);
        let originalDate = projects[projectIndex].milestone_items[milestoneIndex].date;
        // console.log('originalDate: ', originalDate);

        let newDate = moment(originalDate).add(days, 'days').format("YYYY-MM-DD");
        // console.log('newDate: ', newDate);

        let originalProjects = [...projects];
        let updatedProjects = [...projects];
        updatedProjects[projectIndex].milestone_items[milestoneIndex].date = newDate;
        // console.log('updateddisplayedProjects: ', updateddisplayedProjects);
        // updateMilestoneItem({ ...updateddisplayedProjects[projectIndex].milestone_items[milestoneIndex] })
        set_projects([...updatedProjects]);

        let updatedMilestoneItem = { ...updatedProjects[projectIndex].milestone_items[milestoneIndex] };

        // update in database
        axios({
            method: 'patch',
            url: baseUrl + '/company/milestone-items/' + updatedMilestoneItem.id + "/",
            headers: {
                "Authorization": token
            },
            data: {
                // id: milestoneItem.id,
                name: updatedMilestoneItem.name,
                // milestone_item_type: milestoneItem.id,
                date: updatedMilestoneItem.date,
                comment: updatedMilestoneItem.comment
            }
        })
            .then((response => {
                console.log('milestone deadline updated in database: ', response.data);
            }))
            .catch((error) => {
                console.log('problem with updating milestone item: ', error);

                set_projects([...originalProjects]);
            })
    }

    const updateProject = (projectId) => {
        axios({
            method: 'get',
            url: baseUrl + `/company/projects/${projectId}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                const index = projects.findIndex((elem) => elem.id === projectId);

                let newArray = [...projects];
                newArray[index] = { ...response.data };

                set_projects([...newArray]);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching projects')
            })
    }

    const showModal_ManageProject = (project) => {
        // creating new project or updating existing project

        if (project === undefined) {
            // alert('showing create new project');

            set_activeProject({});
        }
        else {
            // alert('showing modify existing project')

            set_activeProject(project);
        }

        set_createProject_toogle(!createProject_toogle)
    }

    const showModal_ManageMonuments = (project) => {
        set_activeProject(project);

        set_manageMonuments_toogle(!manageMonuments_toogle);
    }

    const showModal_ManageCertificationDocuments = (project) => {
        set_activeProject(project);

        set_manageCertificationDocuments_toogle(!manageCertificationDocuments_toogle);
    }

    const showState = () => {
        console.log('displayedProjects: ', projects);
    }

    return (
        <div className='p02-dashboard'>
            <div className='p02-modals-container'>
                {createProject_toogle ?
                    <CreateEditProjectModal
                        project={activeProject}
                        addNewProject={addNewProjectToState}
                        updateProject={updateExistingProjectInState}
                        toogleVisibility={() => set_createProject_toogle(!createProject_toogle)}
                    />
                    : ""}
                {deleteProjectWarning_toogle ?
                    <DeleteWarning
                        // project={activeProject}
                        text={warningText}
                        action={() => deleteProject(activeProject)}
                        toogleVisibility={() => set_deleteProjectWarning_toogle(!deleteProjectWarning_toogle)}
                    />
                    : ""}
                {editMilestone_toogle ?
                    <EditMilestoneItemModal
                        project={activeProject}
                        milestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => set_editMilestone_toogle(!editMilestone_toogle)}
                    />
                    :
                    ""}
                {createMilestone_toogle ?
                    <CreateMilestoneItemModal
                        project={activeProject}
                        // milestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => set_createMilestone_toogle(!createMilestone_toogle)}
                    />
                    :
                    ""}
                {createTask_toogle ?
                    <CreateTaskModal
                        project={activeProject}
                        milestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => set_createTask_toogle(!createTask_toogle)}
                    />
                    :
                    ""}
                {deleteMilestoneWarning_toogle ?
                    <DeleteWarning
                        // project={activeProject}
                        text={warningText}
                        action={() => deleteMilestoneItem(activeProject, activeMilestoneItem)}
                        toogleVisibility={() => set_deleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle)}
                    />
                    : ""}
                {manageMonuments_toogle ?
                    <ManageMonuments
                        project={activeProject}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => set_manageMonuments_toogle(!manageMonuments_toogle)}
                    />
                    :
                    ""}
                {manageCertificationDocuments_toogle ?
                    <ManageCertificationDocuments
                        project={activeProject}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => set_manageCertificationDocuments_toogle(!manageCertificationDocuments_toogle)}
                    />
                    :
                    ""}
            </div>
            <NavBar />
            <SideBar />
            <div className='p02-center-section'>
                <div className='p02-main-section' id='main-section' name='main-section'>
                    {manageProjects_toogle ?
                    <ManageProjects 
                        set_manageProjects_toogle={set_manageProjects_toogle} 
                        projects={projects}
                        set_projects={set_projects}
                    />
                    : ""}
                    {manageMilestoneTypes_toogle ?
                    <ManageMilestoneTypes
                        toogleVisibility={set_manageMilestoneTypes_toogle}
                    />
                    :
                    ""}
                    {manageTasksTypes_toogle ?
                    <ManageTasksTypes
                        toogleVisibility={set_manageTasksTypes_toogle}
                    />
                    :
                    ""}
                    <img className='p02-img-home' src={home} alt='' />
                    <button className='button-container'>
                        <div className='button-name'>Quick Links</div>
                        <img className='img' src={small_arrow_down} alt='' />
                    </button>
                    <div className='p02-nav-bar'>
                        <div 
                            className='p02-item' 
                            onClick={() => set_manageProjects_toogle(!manageProjects_toogle)}
                        >Projects</div>
                        <div className='p02-item'>|</div>
                        <div 
                            className='p02-item' 
                            onClick={() => set_manageMilestoneTypes_toogle(!manageMilestoneTypes_toogle)} 
                        >Milestone Types</div>
                        <div className='p02-item'>|</div>
                        <div 
                            className='p02-item'
                            onClick={() => set_manageTasksTypes_toogle(true)}
                        >Task types</div>
                        <div className='p02-item'>|</div>
                        <div 
                            className='p02-item'
                            onClick={() => set_dateOffset(0)}
                        >Today</div>
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
                                    console.log('document: ', document);
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
                                return <main className='p02-wrapper-project' key={Math.random() * 100000}>
                                    <div className='p02-left-container'>
                                        <div>{`#${project.id} : ${project.number}`}</div>
                                        <div>{project.short_name}</div>
                                        <div>
                                            <img
                                                className='plane-icons'
                                                src={planeSVG}
                                                alt=''
                                            // onClick={() => editMilestoneType(milestoneType.id)} 
                                            />
                                        </div>
                                        <div className='p02-row-left'>
                                            {`Milestones: ${achievedMilestones.length}/${project.milestone_items.length}`}
                                        </div>
                                        <div className='p02-row-left'>
                                            {`Tasks: ${completedTasks}/${totalTasks}`}
                                        </div>
                                        <div className='p02-row-left'>
                                            {`Monuments: ${project.monuments.length}`}
                                        </div>
                                        <div className='p02-row-left'>
                                            {`Documents: ${certificationDocumentIds.length}`}
                                        </div>
                                    </div>
                                    <div style={middleStyle} id='p02-milestone-container'>
                                        {
                                            project.milestone_items.map((milestoneItem, index) => {
                                                // console.log('drawing milestone items: ', index)

                                                return < MilestoneTag
                                                    key={Math.random() * 100000}
                                                    dateOffset={dateOffset}
                                                    topOffset={(index - 1) * 30}  // offset in px from top
                                                    project={project}
                                                    milestoneItem={milestoneItem}
                                                    deltaStart={50 + 8*16}
                                                    displayLimit={displayedDays}
                                                    updateMilestoneItemDeadline={updateMilestoneItemDeadline}
                                                    updateMilestoneItem={updateMilestoneItem}
                                                    display_modal_createNewTask={display_modal_createNewTask}
                                                    // popUpCreateTaskModal={setCreateTask_toogle(!createTask_toogle)}
                                                    // updateMilestoneItem={() => createEditMilestone_toogle(project, milestoneItem)}
                                                    deleteMilestoneItem={() => display_modal_warning_deleteMilestoneItem(project, milestoneItem)}
                                                />
                                            })
                                        }
                                    </div>
                                </main>
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
                        <Timeline
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

export default PlanningDashboard;