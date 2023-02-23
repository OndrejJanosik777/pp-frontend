import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import MilestoneTag from './milestone-tag';
import Timeline from './timeline';
// modal components
import CreateProjectModal from './create-project-modal';
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
    // page loaded - fake state - just to run first hook at start...
    const [loaded, setLoaded] = useState(0);
    const [displayedProjects, setDisplayProjects] = useState([]);
    const [dateOffset, setDateOffset] = useState(0);    // offset from today...
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    // modal toogles
    const [createProject_toogle, setCreateProject_toogle] = useState(false);
    const [deleteWarning_toogle, setDeleteWarning_toogle] = useState(false);
    const [addMilestone_toogle, setAddMilestone_toogle] = useState(false);
    const [manageMilestoneTypes_toogle, setManageMilestoneTypes_toogle] = useState(false);
    // rest
    const [activeProject, setActiveProject] = useState({});
    const [warningText, setWarningText] = useState('');

    useEffect(() => {
        fetchProjects();
    }, [loaded]);

    const fetchUser = () => {


        axios({
            method: 'post',
            url: baseUrl + '/auth/users/me',
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                // alert('account created succesfully');
                console.log(response.data);
                // localStorage.setItem('PP-token', response.data.access);

                // navigate('/dashboard/');
            }))
            .catch((error) => {
                console.log(error);
            })
    }

    const fetchProject = (projectId) => {
        console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/project/' + projectId + "/",
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                setDisplayProjects(response.data);
            }))
            .catch((error) => {
                console.log(error);
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

    const addNewProject = (project) => {
        setDisplayProjects([...displayedProjects, project]);
        setCreateProject_toogle(!createProject_toogle);
    }

    const createMilestone = () => {
        alert('creating milestone...')
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

    return (
        <div className='dashboard'>
            {createProject_toogle ?
                <CreateProjectModal
                    addNewProject={addNewProject}
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
                    createNewMilestone={addNewProject}
                    toogleVisibility={() => setAddMilestone_toogle(!addMilestone_toogle)}
                />
                :
                ""}
            {manageMilestoneTypes_toogle ?
                <ManageMilestoneTypes
                    project={activeProject}
                    updateProject={updateProject}
                    createNewMilestone={addNewProject}
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
                    <button type="button" className="btn btn-success slight-side-margin" onClick={() => setCreateProject_toogle(!createProject_toogle)} >Add Project</button>
                    <button type="button" className="btn btn-success slight-side-margin" onClick={() => setManageMilestoneTypes_toogle(!manageMilestoneTypes_toogle)} >Manage Milestone Types</button>
                </nav>
            </header>
            <main>
                {
                    displayedProjects.map((project) => {
                        project.milestone_items.sort((a, b) => {
                            return moment(a.date) - moment(b.date);
                        })

                        return <main className='wrapper-project' key={Math.random() * 100000}>
                            <div className='cell starting'><div className='rotate'>{project.short_name}</div></div>
                            <div className='middle'>
                                {
                                    project.milestone_items.map((milestoneItem) => {
                                        return < MilestoneTag
                                            key={Math.random() * 100000}
                                            dateOffset={dateOffset}
                                            milestoneItem={milestoneItem}
                                            displayLimit={100}
                                        />
                                    })
                                }
                            </div>
                            <div className='cell-ending'>
                                <span
                                    className="badge bg-primary"
                                    onClick={() => displayNewMilestone(project)}>
                                    Add Milestone
                                </span>
                                <span className="badge bg-secondary">Update</span>
                                <span
                                    className="badge bg-danger"
                                    onClick={() => displayDeleteProjectWarning(project)} >
                                    delete
                                </span>
                            </div>
                        </main>
                    })
                }
                <Timeline
                    dateOffset={dateOffset}
                    displayLimit={100}
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