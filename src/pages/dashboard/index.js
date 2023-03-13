import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import MilestoneTag from './milestone-tag';
import Timeline from './timeline';
// modal components
import CreateEditProjectModal from './create-edit-project-modal';
import EditMilestoneItemModal from './edit-milestoneItem-modal';
import CreateMilestoneItemModal from './create-milestone-modal';
import ManageMilestoneTypes from './manage-milestone-types';
import DeleteWarning from './delete-warning-modal';
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

    const [displayedProjects, setDisplayProjects] = useState([]);
    const [dateOffset, setDateOffset] = useState(0);    // offset from today...
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [displayedDays, setDisplayedDays] = useState(parseInt((window.innerWidth - 8 * 16 - 8 * 16 - 4 * 16) / 16));
    // modal toogles
    const [createProject_toogle, setCreateProject_toogle] = useState(false);
    const [deleteProjectWarning_toogle, setDeleteProjectWarning_toogle] = useState(false);
    const [deleteMilestoneWarning_toogle, setDeleteMilestoneWarning_toogle] = useState(false);
    const [createMilestone_toogle, setCreateMilestone_toogle] = useState(false);
    const [editMilestone_toogle, setEditMilestone_toogle] = useState(false);
    const [manageMilestoneTypes_toogle, setManageMilestoneTypes_toogle] = useState(false);
    // rest
    const [activeProject, setActiveProject] = useState(undefined);
    const [activeMilestoneItem, setActiveMilestoneItem] = useState(undefined);
    const [warningText, setWarningText] = useState('');

    const handleResize = useRef((event) => {
        // console.log('event.target.innerWidth', event.target.innerWidth);

        let availableWidth = event.target.innerWidth;
        availableWidth = availableWidth - 5 * 16 - 8 * 16 - 4 * 16;

        let daysToDisplay = parseInt(availableWidth / 16);
        // console.log('daysToDisplay: ', daysToDisplay);
        setDisplayedDays(daysToDisplay);
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
                setDisplayProjects(response.data);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching projects')
            })
    }, []);
    // functions for managing projects
    const addNewProjectToState = (project) => {
        setDisplayProjects([...displayedProjects, project]);
        setCreateProject_toogle(!createProject_toogle);
    }

    const updateExistingProjectInState = (project) => {
        let index = displayedProjects.findIndex(element => element.id === project.id);
        let newProjects = [...displayedProjects];
        newProjects[index] = { ...project };
        setDisplayProjects([...newProjects]);
        setCreateProject_toogle(!createProject_toogle);
    }

    const displayWarning_DeleteProject = (project) => {
        setActiveProject(project);
        setWarningText(`Are you sure to delete project: ${project.name}?`);
        // setDeleteFunction(deleteProject(project));
        setDeleteProjectWarning_toogle(!deleteProjectWarning_toogle);
    }

    const deleteProject = (project) => {
        const index = displayedProjects.findIndex(elem => elem.id === project.id)

        let modifiedProjects = [...displayedProjects];
        modifiedProjects.splice(index, 1);

        setDisplayProjects([...modifiedProjects]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/projects/${project.id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                setDeleteProjectWarning_toogle(!deleteProjectWarning_toogle);
            }))
            .catch((error) => {
                console.log(error);

                alert('Error: Project cannot be deleted.')
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

                setDisplayProjects([...newArray]);
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

            setActiveProject({});
        }
        else {
            // alert('showing modify existing project')

            setActiveProject(project);
        }

        setCreateProject_toogle(!createProject_toogle)
    }
    // functions for manageing milestones
    const displayNewMilestone = (project) => {
        setActiveProject(project);
        setActiveMilestoneItem(undefined);

        setCreateMilestone_toogle(!createMilestone_toogle);
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
        setDisplayProjects([...updatedProjects]);

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

                setDisplayProjects([...originalProjects]);
            })
    }

    const updateMilestoneItem = (project, milestoneItem) => {
        console.log(`updating milestone item ${milestoneItem.name} within project ${project.name}`);

        setActiveProject(project);
        setActiveMilestoneItem(milestoneItem);

        setEditMilestone_toogle(!editMilestone_toogle);
    }

    const displayWarning_DeleteMilestoneItem = (project, milestone) => {
        setActiveProject(project);
        setActiveMilestoneItem(milestone);
        setWarningText(`Are you sure to delete milestone ${milestone.name} from project ${project.name}?`);
        // setDeleteFunction(deleteProject(project));
        setDeleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle);
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

        setDisplayProjects([...updatedProjects]);

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

                setDeleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle);
            }))
            .catch((error) => {
                console.log('problem with deleting milestone item: ', error);

                setDisplayProjects([...originalProjects]);
            })
    }
    // displaying state in console window
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
                        toogleVisibility={() => setCreateProject_toogle(!createProject_toogle)}
                    />
                    : ""}
                {deleteProjectWarning_toogle ?
                    <DeleteWarning
                        // project={activeProject}
                        text={warningText}
                        action={() => deleteProject(activeProject)}
                        toogleVisibility={() => setDeleteProjectWarning_toogle(!deleteProjectWarning_toogle)}
                    />
                    : ""}
                {editMilestone_toogle ?
                    <EditMilestoneItemModal
                        project={activeProject}
                        milestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => setEditMilestone_toogle(!editMilestone_toogle)}
                    />
                    :
                    ""}
                {createMilestone_toogle ?
                    <CreateMilestoneItemModal
                        project={activeProject}
                        // milestoneItem={activeMilestoneItem}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => setCreateMilestone_toogle(!createMilestone_toogle)}
                    />
                    :
                    ""}
                {deleteMilestoneWarning_toogle ?
                    <DeleteWarning
                        // project={activeProject}
                        text={warningText}
                        action={() => deleteMilestoneItem(activeProject, activeMilestoneItem)}
                        toogleVisibility={() => setDeleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle)}
                    />
                    : ""}
                {manageMilestoneTypes_toogle ?
                    <ManageMilestoneTypes
                        project={activeProject}
                        updateProject={updateProject}
                        createNewMilestone={addNewProjectToState}
                        toogleVisibility={() => setManageMilestoneTypes_toogle(!manageMilestoneTypes_toogle)}
                    />
                    :
                    ""}
            </div>
            <header className='header'>
                <nav className="navbar navbar-expand-lg bg-body-tertiary bg-primary" data-bs-theme="dark" onClick={showState}>
                    <div className="container-fluid">
                        <div className="navbar-brand">Dashboard</div>
                        <div className="navbar-brand">Months / Weeks / Days</div>
                        <div className="navbar-brand clicable" onClick={() => setDateOffset(0)}>{moment().format('LLLL')}</div>
                        <div className="navbar-brand">username</div>
                    </div>
                </nav>
                <nav>
                    <button type="button" className="btn btn-success slight-side-margin" onClick={() => showModal_ManageProject()} >Create New Project</button>
                    <button type="button" className="btn btn-success slight-side-margin" onClick={() => setManageMilestoneTypes_toogle(!manageMilestoneTypes_toogle)} >Manage Milestone Types</button>
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

                        const middleStyle = {
                            display: 'flex',
                            flexDirection: 'column',
                            height: `${project.milestone_items.length * 30}px`,
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
                                            // updateMilestoneItem={() => createEditMilestone_toogle(project, milestoneItem)}
                                            deleteMilestoneItem={() => displayWarning_DeleteMilestoneItem(project, milestoneItem)}
                                        />
                                    })
                                }
                            </div>
                            <div className='right-container'>
                                <span
                                    className="badge bg-primary"
                                    onClick={() => displayNewMilestone(project)}
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
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset - 1)}>- 1 DAY</div>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset - 7)}>- 7 DAYS</div>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset - 30)}>- 30 DAYS</div>
                </div>
                <Timeline
                    dateOffset={dateOffset}
                    displayLimit={displayedDays}
                />
                <div className='timeline-controls'>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset + 1)}>+ 1 DAY</div>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset + 7)}>+ 7 DAYS</div>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset + 30)}>+ 30 DAYS</div>
                </div>

            </footer>
        </div>);
}

export default Dashboard;