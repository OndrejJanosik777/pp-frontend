import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import MilestoneTag from './milestone-tag';
import Timeline from './timeline';
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

    // const moment = require('moment');

    useEffect(() => {
        console.log('page DASHBOARD loaded')
        // fetchUser();
        fetchProject(1);
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

                // setDisplayProjects([...displayedProjects, response.data]);
                setDisplayProjects([response.data]);
            }))
            .catch((error) => {
                console.log(error);
            })
    }

    const showState = () => {
        console.log('displayedProjects: ', displayedProjects);
    }

    return (
        <div className='dashboard'>
            <nav className="navbar navbar-expand-lg bg-body-tertiary bg-primary" data-bs-theme="dark" onClick={showState}>
                <div className="container-fluid">
                    <div className="navbar-brand">Dashboard</div>
                    <div className="navbar-brand">Months / Weeks / Days</div>
                    <div className="navbar-brand clicable" onClick={() => setDateOffset(0)}>{moment().format('LLLL')}</div>
                    <div className="navbar-brand">username</div>
                </div>
            </nav>
            <main>
                {displayedProjects.map((project) => {
                    return <main className='wrapper-project' key={Math.random() * 100000}>
                        <div className='cell starting'><div className='rotate'>{project.name}</div></div>
                        <div className='middle'>
                            {project.milestone_plan.milestone_items.map((milestoneItem) => {
                                return < MilestoneTag dateOffset={dateOffset} milestoneItem={milestoneItem} displayLimit={100} />
                            })}
                        </div>
                        <div className='cell starting'></div>
                    </main>
                })}
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