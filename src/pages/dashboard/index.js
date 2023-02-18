import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import MilestoneTag from './milestone-tag';
import Timeline from './timeline';
import CreateProjectModal from './create-project-modal';
import AddMilestoneModal from './create-milestone-modal';
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
    const [addMilestone_toogle, setAddMilestone_toogle] = useState(false);
    const [manageMilestoneTypes_toogle, setManageMilestoneTypes_toogle] = useState(true);
    const [activeProject, setActiveProject] = useState({});
    // const moment = require('moment');

    useEffect(() => {
        // console.log('page DASHBOARD loaded')
        // fetchUser();
        fetchProjects();
    }, [loaded]);

    const fetchUser = () => {
        console.log('displaying user info')

        // let token = "Bearer " + localStorage.getItem('PP-token');

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
                console.log(response.data);
                console.log(response.data);

                // setDisplayProjects([...displayedProjects, response.data]);
                setDisplayProjects(response.data);
            }))
            .catch((error) => {
                console.log(error);
            })
    }

    const fetchProjects = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/project/',
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                // console.log("projects fetched sucessfully");
                // console.log(response.data);

                // setDisplayProjects([...displayedProjects, response.data]);
                // setDisplayProjects(...displayedProjects, response.data);
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

    const createNewProject = (name, shortName, number) => {
        alert('creating new project');

        axios({
            method: 'post',
            url: baseUrl + '/company/project/',
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                number: number,
                short_name: shortName,
                milestone_items: [],
                monuments: []
            }
        })
            .then((response => {
                // console.log("projects created sucessfully");
                let newProject = response.data;

                setDisplayProjects([...displayedProjects, newProject]);

                setCreateProject_toogle(!createProject_toogle);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with creating project')
            })


    }

    const createMilestone = () => {
        alert('creating milestone...')
    }

    const displayNewMilestone = (project) => {
        setActiveProject(project);

        setAddMilestone_toogle(!addMilestone_toogle);
    }

    const updateProject = (projectId) => {
        console.log('caling method: updateProject')

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
                    createNewProject={createNewProject}
                    toogleVisibility={() => setCreateProject_toogle(!createProject_toogle)}
                />
                : ""}
            {addMilestone_toogle ?
                <AddMilestoneModal
                    project={activeProject}
                    updateProject={updateProject}
                    createNewMilestone={createNewProject}
                    toogleVisibility={() => setAddMilestone_toogle(!addMilestone_toogle)}
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
                    // displayedProjects.isArray() ?
                    // displayedProjects !== undefined ?
                    typeof displayedProjects.map === "function" ?
                        displayedProjects.map((project) => {
                            return <main className='wrapper-project' key={Math.random() * 100000}>
                                <div className='cell starting'><div className='rotate'>{project.short_name}</div></div>
                                <div className='middle'>
                                    {
                                        project.milestone_items.map((milestoneItem) => {
                                            return < MilestoneTag key={Math.random() * 100000} dateOffset={dateOffset} milestoneItem={milestoneItem} displayLimit={100} />
                                        })
                                    }
                                </div>
                                <div className='cell-ending'>
                                    <span className="badge bg-primary" onClick={() => displayNewMilestone(project)}>Add Milestone</span>
                                    <span className="badge bg-secondary">Update</span>
                                    <span className="badge bg-danger">delete</span>
                                </div>
                            </main>
                        })
                        :
                        ""
                }
                <Timeline dateOffset={dateOffset} />
                <footer className='wrapper-footer'>
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset - 1)}>previous</div>
                    {/* <div className='cell-footer'>{moment().add(dateOffset - 1, 'M').format('MMMM YYYY')}</div>
                    <div className='cell-footer'>{moment().add(dateOffset, 'M').format('MMMM YYYY')}</div>
                    <div className='cell-footer'>{moment().add(dateOffset + 1, 'M').format('MMMM YYYY')}</div>
                    <div className='cell-footer'>{moment().add(dateOffset + 2, 'M').format('MMMM YYYY')}</div>
                    <div className='cell-footer'>{moment().add(dateOffset + 3, 'M').format('MMMM YYYY')}</div>
                    <div className='cell-footer'>{moment().add(dateOffset + 4, 'M').format('MMMM YYYY')}</div> */}
                    <div className='cell-footer clicable starting' onClick={() => setDateOffset(dateOffset + 1)}>next</div>
                </footer>
            </main>
        </div>);
}

export default Dashboard;