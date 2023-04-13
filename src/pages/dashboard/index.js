import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import MilestoneTag from './milestone-tag';
import Timeline from './timeline';
import home from './assets/home.png';
import small_arrow_down from './assets/small_arrow_down.png';
import arrow_left from './assets/arrow_left.png';
import magnifier_dark from './assets/magnifier_dark.png';
// modal components
import CreateEditProjectModal from './create-edit-project-modal';
import EditMilestoneItemModal from './edit-milestoneItem-modal';
import CreateMilestoneItemModal from './create-milestone-modal';
import CreateTaskModal from './create-task-modal';
import ManageMilestoneTypes from './manage-milestone-types';
import ManageTasksTypes from './manage-tasks-types';
import ManageMonuments from './manage-monuments';
import ManageCertificationDocuments from './manage-certification-documents';
import DeleteWarning from './delete-warning-modal';
// components
import NavBar from '../../components/nav-bar';

import './index.scss';

const Dashboard = () => {

    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [displayedProjects, set_displayedProjects] = useState([]);
    const [dateOffset, set_dateOffset] = useState(0);    // offset from today...
    const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [displayedDays, set_displayedDays] = useState(parseInt((window.innerWidth - 8 * 16 - 8 * 16 - 4 * 16) / 16));
    // modal toogles
    const [createProject_toogle, set_createProject_toogle] = useState(false);
    const [deleteProjectWarning_toogle, set_deleteProjectWarning_toogle] = useState(false);
    const [deleteMilestoneWarning_toogle, set_deleteMilestoneWarning_toogle] = useState(false);
    const [createMilestone_toogle, set_createMilestone_toogle] = useState(false);
    const [createTask_toogle, set_createTask_toogle] = useState(false);
    const [editMilestone_toogle, set_editMilestone_toogle] = useState(false);
    const [manageMilestoneTypes_toogle, set_manageMilestoneTypes_toogle] = useState(false);
    const [manageTasksTypes_toogle, set_manageTasksTypes_toogle] = useState(false);
    const [manageMonuments_toogle, set_manageMonuments_toogle] = useState(false);
    const [manageCertificationDocuments_toogle, set_manageCertificationDocuments_toogle] = useState(false);
    // rest
    const [activeProject, set_activeProject] = useState(undefined);
    const [activeMilestoneItem, set_activeMilestoneItem] = useState(undefined);
    const [warningText, set_warningText] = useState('');

    const handleResize = useRef((event) => {
        // console.log('event.target.innerWidth', event.target.innerWidth);

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
                set_displayedProjects(response.data);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching projects')
            })
    }, []);
    // functions for managing projects
    const addNewProjectToState = (project) => {
        set_displayedProjects([...displayedProjects, project]);
        set_createProject_toogle(!createProject_toogle);
    }

    const createTask = (milestoneItem) => {
        console.log('creating task for milestone item nr: ', milestoneItem.id)
    }

    const deleteMilestoneItem = (project, milestoneItem) => {
        console.log(`deleting item: ${milestoneItem.id}`);

        // update in component state
        let projectIndex = displayedProjects.findIndex(elem => elem.id === project.id)
        let milestoneItemIndex = displayedProjects[projectIndex].milestone_items.findIndex(elem => elem.id === milestoneItem.id)

        // console.log(`projectIndex: ${projectIndex}`);
        // console.log(`milestoneItemIndex: ${milestoneItemIndex}`);

        let originalProjects = [...displayedProjects];
        let updatedProjects = [...displayedProjects];

        updatedProjects[projectIndex].milestone_items.splice(milestoneItemIndex, 1);
        console.log(`updatedProjects:`, updatedProjects);

        set_displayedProjects([...updatedProjects]);

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

                set_displayedProjects([...originalProjects]);
            })
    }

    const deleteProject = (project) => {
        const index = displayedProjects.findIndex(elem => elem.id === project.id)

        let modifiedProjects = [...displayedProjects];
        modifiedProjects.splice(index, 1);

        set_displayedProjects([...modifiedProjects]);

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
        let index = displayedProjects.findIndex(element => element.id === project.id);
        let newProjects = [...displayedProjects];
        newProjects[index] = { ...project };
        set_displayedProjects([...newProjects]);
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

        let projectIndex = displayedProjects.findIndex(element => element.id === project.id);
        let milestoneIndex = displayedProjects[projectIndex].milestone_items.findIndex(element => element.id === milestoneItem.id);
        let originalDate = displayedProjects[projectIndex].milestone_items[milestoneIndex].date;
        // console.log('originalDate: ', originalDate);

        let newDate = moment(originalDate).add(days, 'days').format("YYYY-MM-DD");
        // console.log('newDate: ', newDate);

        let originalProjects = [...displayedProjects];
        let updatedProjects = [...displayedProjects];
        updatedProjects[projectIndex].milestone_items[milestoneIndex].date = newDate;
        // console.log('updateddisplayedProjects: ', updateddisplayedProjects);
        // updateMilestoneItem({ ...updateddisplayedProjects[projectIndex].milestone_items[milestoneIndex] })
        set_displayedProjects([...updatedProjects]);

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

                set_displayedProjects([...originalProjects]);
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
                const index = displayedProjects.findIndex((elem) => elem.id === projectId);

                let newArray = [...displayedProjects];
                newArray[index] = { ...response.data };

                set_displayedProjects([...newArray]);
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
        console.log('displayedProjects: ', displayedProjects);
    }

    return (
        <div className='dashboard'>
            <div className='modals-container'>
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
                {manageMilestoneTypes_toogle ?
                    <ManageMilestoneTypes
                        project={activeProject}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => set_manageMilestoneTypes_toogle(!manageMilestoneTypes_toogle)}
                    />
                    :
                    ""}
                {manageTasksTypes_toogle ?
                    <ManageTasksTypes
                        project={activeProject}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => set_manageTasksTypes_toogle(!manageTasksTypes_toogle)}
                    />
                    :
                    ""}
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
            <div className='center-section'>
                <div className='upper-part'>
                    <img className='img-home' src={home} alt='' />
                    <button className='button-container'>
                        <div className='button-name'>Quick Links</div>
                        <img className='img' src={small_arrow_down} alt='' />
                    </button>
                </div>
                <div className='bottom-part'>

                </div>
            </div>
            <div  className='left-section'>
                <img className='img' src={arrow_left} alt='' />
                <img className='img' src={magnifier_dark} alt='' />
            </div>
            {/* <header className='header'>
                <nav className="navbar navbar-expand-lg bg-body-tertiary bg-primary" data-bs-theme="dark" onClick={showState}>
                    <div className="container-fluid">
                        <div className="navbar-brand">Dashboard</div>
                        <div className="navbar-brand">Months / Weeks / Days</div>
                        <div className="navbar-brand clicable" onClick={() => set_dateOffset(0)}>{moment().format('LLLL')}</div>
                        <div className="navbar-brand">username</div>
                    </div>
                </nav>
                <nav className='nav-buttons'>
                    <button type="button" className="btn btn-success slight-side-margin" onClick={() => showModal_ManageProject()} >Create New Project</button>
                    <button type="button" className="btn btn-success slight-side-margin" onClick={() => set_manageMilestoneTypes_toogle(!manageMilestoneTypes_toogle)} >Manage Milestone Types</button>
                    <button type="button" className="btn btn-success slight-side-margin" onClick={() => set_manageTasksTypes_toogle(!manageTasksTypes_toogle)} >Manage Task Types</button>
                </nav>
            </header>
            <main className='main'>
                {
                    displayedProjects.map((project) => {
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

                        return <main className='wrapper-project' key={Math.random() * 100000}>
                            <div className='left-container'>
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
                                <div className='row-left'>
                                    {`Milestones: ${achievedMilestones.length}/${project.milestone_items.length}`}
                                </div>
                                <div className='row-left'>
                                    {`Tasks: ${completedTasks}/${totalTasks}`}
                                </div>
                                <div className='row-left'>
                                    {`Monuments: ${project.monuments.length}`}
                                </div>
                                <div className='row-left'>
                                    {`Documents: ${certificationDocumentIds.length}`}
                                </div>
                            </div>
                            <div style={middleStyle}>
                                {
                                    project.milestone_items.map((milestoneItem, index) => {
                                        // console.log('drawing milestone items: ', index)

                                        return < MilestoneTag
                                            key={Math.random() * 100000}
                                            dateOffset={dateOffset}
                                            topOffset={(index - 1) * 30}  // offset in px from top
                                            project={project}
                                            milestoneItem={milestoneItem}
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
                            <div className='right-container'>
                                <span
                                    className="badge bg-primary"
                                    onClick={() => display_modal_createNewMilestone(project)}
                                >
                                    Create Milestone
                                </span>
                                <span
                                    className="badge bg-warning"
                                    onClick={() => showModal_ManageProject(project)}
                                >
                                    Update Project
                                </span>
                                <span
                                    className="badge bg-info"
                                    // onClick={console.log('managing certification documents')}
                                    onClick={() => showModal_ManageCertificationDocuments(project)}
                                >
                                    Certification Doc.
                                </span>
                                <span
                                    className="badge bg-info"
                                    // onClick={console.log('managing monuments')}
                                    onClick={() => showModal_ManageMonuments(project)}
                                >
                                    Monuments
                                </span>
                                <span
                                    className="badge bg-danger"
                                    onClick={() => displayWarning_DeleteProject(project)}
                                >
                                    Delete Project
                                </span>
                            </div>
                        </main>
                    })
                }
            </main>
            <footer className='footer'>
                <div className='timeline-controls'>
                    <div className='cell-footer clicable starting' onClick={() => set_dateOffset(dateOffset - 1)}>- 1 DAY</div>
                    <div className='cell-footer clicable starting' onClick={() => set_dateOffset(dateOffset - 7)}>- 7 DAYS</div>
                    <div className='cell-footer clicable starting' onClick={() => set_dateOffset(dateOffset - 30)}>- 30 DAYS</div>
                </div>
                <Timeline
                    dateOffset={dateOffset}
                    displayLimit={displayedDays}
                />
                <div className='timeline-controls'>
                    <div className='cell-footer clicable starting' onClick={() => set_dateOffset(dateOffset + 1)}>+ 1 DAY</div>
                    <div className='cell-footer clicable starting' onClick={() => set_dateOffset(dateOffset + 7)}>+ 7 DAYS</div>
                    <div className='cell-footer clicable starting' onClick={() => set_dateOffset(dateOffset + 30)}>+ 30 DAYS</div>
                </div>

            </footer> */}
        </div>);
}

export default Dashboard;