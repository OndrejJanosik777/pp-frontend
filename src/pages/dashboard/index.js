import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import MilestoneTag from './milestone-tag';
import Timeline from './timeline';
// modal components
import ManageProjectModal from './manage-project-modal';
import AddMilestoneModal from './create-milestone-modal';
import ManageMilestoneTypes from './manage-milestone-types';
import DeleteWarning from './delete-warning';
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
    const [deleteWarning_toogle, setDeleteWarning_toogle] = useState(false);
    const [addMilestone_toogle, setAddMilestone_toogle] = useState(false);
    const [manageMilestoneTypes_toogle, setManageMilestoneTypes_toogle] = useState(false);
    // rest
    const [activeProject, setActiveProject] = useState({});
    const [warningText, setWarningText] = useState('');

    const handleResize = useRef((event) => {
        // console.log('event.target.innerWidth', event.target.innerWidth);

        let availableWidth = event.target.innerWidth;
        availableWidth = availableWidth - 5 * 16 - 8 * 16 - 4 * 16;

        let daysToDisplay = parseInt(availableWidth / 16);
        // console.log('daysToDisplay: ', daysToDisplay);
        setDisplayedDays(daysToDisplay);
    })

    useEffect(() => {
        window.addEventListener('resize', handleResize.current);
        fetchProjects();
    }, []);

    const updateMilestoneItem = (milestoneItem) => {
        // console.log('updating milestone item with id: ', milestoneItem.id);

        axios({
            method: 'put',
            url: baseUrl + '/company/milestone-item/' + milestoneItem.id + "/",
            headers: {
                "Authorization": token
            },
            data: {
                // id: milestoneItem.id,
                name: milestoneItem.name,
                // milestone_item_type: milestoneItem.id,
                date: milestoneItem.date,
                comment: milestoneItem.comment
            }
        })
            .then((response => {
                console.log('milestone updated: ', response.data);
            }))
            .catch((error) => {
                console.log('problem with updating milestone item: ', error);
            })
    }

    const fetchProjects = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/project/',
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
    }

    const showState = () => {
        console.log('displayedProjects: ', displayedProjects);
    }

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

    const displayDeleteProjectWarning = (project) => {
        setActiveProject(project);
        setWarningText('Are you sure to delete following project?')
        setDeleteWarning_toogle(!deleteWarning_toogle);
    }

    const deleteProject = () => {
        const index = displayedProjects.findIndex(elem => elem.id === activeProject.id)

        let modifiedProjects = [...displayedProjects];
        modifiedProjects.splice(index, 1);

        setDisplayProjects([...modifiedProjects]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/project/${activeProject.id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                setDeleteWarning_toogle(!deleteWarning_toogle);
            }))
            .catch((error) => {
                console.log(error);

                alert('Error: Project cannot be deleted.')
            })
    }

    const displayNewMilestone = (project) => {
        setActiveProject(project);

        setAddMilestone_toogle(!addMilestone_toogle);
    }

    const updateProject = (projectId) => {
        axios({
            method: 'get',
            url: baseUrl + `/company/project/${projectId}/`,
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

    const setNewDeadline = (days, projectId, milestoneItemId) => {
        // console.log(`moving milestone with id ${milestoneItemId} within project with id ${projectId} by ${days}... `);

        let projectIndex = displayedProjects.findIndex(element => element.id === projectId);
        let milestoneIndex = displayedProjects[projectIndex].milestone_items.findIndex(element => element.id === milestoneItemId);
        let originalDate = displayedProjects[projectIndex].milestone_items[milestoneIndex].date;
        // console.log('originalDate: ', originalDate);

        let newDate = moment(originalDate).add(days, 'days').format("YYYY-MM-DD");
        // console.log('newDate: ', newDate);

        let updateddisplayedProjects = [...displayedProjects];
        updateddisplayedProjects[projectIndex].milestone_items[milestoneIndex].date = newDate;
        // console.log('updateddisplayedProjects: ', updateddisplayedProjects);
        updateMilestoneItem({ ...updateddisplayedProjects[projectIndex].milestone_items[milestoneIndex] })
        setDisplayProjects([...updateddisplayedProjects]);
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

    return (
        <div className='dashboard'>
            {createProject_toogle ?
                <ManageProjectModal
                    project={activeProject}
                    addNewProject={addNewProjectToState}
                    updateProject={updateExistingProjectInState}
                    toogleVisibility={() => setCreateProject_toogle(!createProject_toogle)}
                />
                : ""}
            {deleteWarning_toogle ?
                <DeleteWarning
                    project={activeProject}
                    text={warningText}
                    action={deleteProject}
                    toogleVisibility={() => setDeleteWarning_toogle(!deleteWarning_toogle)}
                />
                : ""}
            {addMilestone_toogle ?
                <AddMilestoneModal
                    project={activeProject}
                    updateProject={updateProject}
                    createNewMilestone={addNewProjectToState}
                    toogleVisibility={() => setAddMilestone_toogle(!addMilestone_toogle)}
                />
                :
                ""}
            {manageMilestoneTypes_toogle ?
                <ManageMilestoneTypes
                    project={activeProject}
                    updateProject={updateProject}
                    createNewMilestone={addNewProjectToState}
                    toogleVisibility={() => setManageMilestoneTypes_toogle(!manageMilestoneTypes_toogle)}
                />
                :
                ""}
            <header>
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
            <main>
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
                                <div className='row-left'>{`Reports: ${5}`}</div>
                                <div className='row-left'>{`Monuments: ${project.monuments.length}`}</div>
                            </div>
                            <div style={middleStyle}>
                                {
                                    project.milestone_items.map((milestoneItem, index) => {
                                        // console.log('drawing milestone items: ', index)

                                        return < MilestoneTag
                                            key={Math.random() * 100000}
                                            dateOffset={dateOffset}
                                            topOffset={(index - 1) * 30}  // offset in px from top
                                            milestoneItem={milestoneItem}
                                            project={project}
                                            displayLimit={displayedDays}
                                            setNewDeadline={setNewDeadline}
                                        />
                                    })
                                }
                            </div>
                            <div className='right-container'>
                                <span
                                    className="badge bg-primary"
                                    onClick={() => displayNewMilestone(project)}
                                >
                                    Add Milestone
                                </span>
                                <span
                                    className="badge bg-warning"
                                    // onClick={() => displayNewMilestone(project)}
                                    onClick={() => showModal_ManageProject(project)}
                                >
                                    Update Project
                                </span>
                                <span
                                    className="badge bg-danger"
                                    onClick={() => displayDeleteProjectWarning(project)}
                                >
                                    Delete Project
                                </span>
                            </div>
                        </main>
                    })
                }
                <Timeline
                    dateOffset={dateOffset}
                    displayLimit={displayedDays}
                />
                <footer className='wrapper-footer'>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset - 1)}>- 1 DAY</div>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset + 1)}>+ 1 DAY</div>
                </footer>
                <footer className='wrapper-footer'>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset - 7)}>- 7 DAYS</div>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset + 7)}>+ 7 DAYS</div>
                </footer>
                <footer className='wrapper-footer'>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset - 30)}>- 30 DAYS</div>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset + 30)}>+ 30 DAYS</div>
                </footer>
            </main>
        </div>);
}

export default Dashboard;