import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';  
// icons, pictures
import planeSVG from './assets/airplane.svg';
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
import { useSelector, useDispatch } from 'react-redux';
// styles   
import './index.scss';
import * as apiActions from '../../app/features/api/apiSlice';
import * as dashboardActions from '../../app/features/dashboardSlice';

const P02_PLANNING_DASHBOARD = () => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let baseUrl = useSelector(state => state.api.baseUrl);
    let projects = useSelector(state => state.api.projects);

    // local state of component
    // const [projects, set_projects] = useState([]);
    const [milestoneTypes, set_milestoneTypes] = useState([]);
    const [taskTypes, set_taskTypes] = useState([]);
    const [userPermissions, set_userPermissions] = useState([]);
    // 
    const [dateOffset, set_dateOffset] = useState(0);    // offset from today...
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
    const [activeTask, set_activeTask] = useState(undefined);
    const [warningText, set_warningText] = useState('');
    const [showSpinner_FetchingProjects, set_showSpinner_FetchingProjects] = useState(false);
    const [extendedSideBar, set_extendedSideBar] = useState(false);
    // 

    const handleResize = useRef((event) => {
        console.log('event.target.innerWidth', event.target.innerWidth);

        let availableWidth = event.target.innerWidth;
        availableWidth = availableWidth - 5 * 16 - 8 * 16 - 4 * 16;

        let daysToDisplay = parseInt(availableWidth / 16);
        // console.log('daysToDisplay: ', daysToDisplay);
        set_displayedDays(daysToDisplay);
        dispatch(dashboardActions.set_displayedDays(daysToDisplay));
    })

    // hook to run while loading component
    useEffect(() => {
        // console.log('dashboard Projects loaded...');

        window.addEventListener('resize', handleResize.current);

        // fetchProjects();

        // fetchMilestoneTypes();

        // fetchTaskTypes();

        // fetching data from backend database to redux store (api)
            dispatch(apiActions.set_BaseUrl());
            dispatch(apiActions.fetch_userProfile());
            dispatch(apiActions.fetch_taskTypes());
            dispatch(apiActions.fetch_milestoneTypes());
            dispatch(apiActions.fetch_projects());
            dispatch(apiActions.fetch_Employees());
            dispatch(dashboardActions.set_displayedDays(
            parseInt((window.innerWidth - 8 * 16 - 0 * 16 - 4 * 16) / 16)
        ));
    }, []);

    const showState = () => {
        console.log('state of p02-planning-dashboard: ');
        console.log('projects: ', projects);
        console.log('userPermissions: ', userPermissions);

        let element = document.getElementById("p02-main");
        console.log("element: ", element);
        element.scrollTop = 125;
    }

    const display_modal_warning_deleteMilestoneItem = (project, milestone) => {
        set_activeProject(project);
        set_activeMilestoneItem(milestone);
        set_warningText(`Are you sure to delete milestone ${milestone.name} from project ${project.name}?`);
        // setDeleteFunction(deleteProject(project));
        set_deleteMilestoneWarning_toogle(!deleteMilestoneWarning_toogle);
    }

    return (
        <div className='p02-dashboard'>
            <C01_NAVBAR />
            <C02_SIDEBAR /> 
            <div className='p02-center-section'>
                <img className='p02-img-home' src={home} alt='' />
                <button className='p02-button-container'>
                    <div className='p02-button-name'>Quick Links</div>
                    <img className='p02-img' src={small_arrow_down} alt='' />
                </button>
                <div className='p02-main-section' id='main-section' name='main-section'>
                    {/* MODAL COMPONENTS IN MAIN SECTION */}
                    {useSelector(state => state.dashboard.showModal_manageProjects) ? <P02_C02_MANAGE_PROJECTS /> : ""}
                    {useSelector(state => state.dashboard.showModal_manageMilestoneTypes) ? <P02_C03_MANAGE_MILESTONE_TYPES /> : ""}
                    {useSelector(state => state.dashboard.showModal_manageTaskTypes) ? <P02_C04_MANAGE_TASK_TYPES /> : ""}
                    {useSelector(state => state.dashboard.showModal_manageMilestones) ? <P02_C06_MANAGE_MILESTONES /> : ""}
                    {useSelector(state => state.dashboard.showModal_manageTasks) ? <P02_C07_MANAGE_MILESTONE_TASKS /> : ""}
                    {useSelector(state => state.dashboard.showModal_manageMonuments) ? <P02_C08_MANAGE_MONUMENTS /> : ""}
                    {useSelector(state => state.dashboard.showModal_manageDocuments) ? <P02_C09_MANAGE_DOCUMENTS /> : ""}
                    {useSelector(state => state.dashboard.showModal_manageProjectTasks) ? <P02_C10_MANAGE_PROJECT_TASKS /> : ""}
                    <div className='p02-nav-bar'>
                        <div className='p02-nav-bar-left'>
                            <div 
                                className='p02-item' 
                                onClick={() => dispatch(dashboardActions.set_showModal_manageProjects(true))}
                            >Projects</div>
                            <div className='p02-item'>|</div>
                            <div 
                                className='p02-item' 
                                onClick={() => dispatch(dashboardActions.set_showModal_manageMilestoneTypes(true))} 
                            >Milestone Types</div>
                            <div className='p02-item'>|</div>
                            <div 
                                className='p02-item'
                                onClick={() => dispatch(dashboardActions.set_showModal_manageTaskTypes(true))}
                            >Task types</div>
                            <div className='p02-item'>|</div>
                            <div 
                                className='p02-item'
                                // onClick={() => set_dateOffset(0)}
                                onClick={() => dispatch(dashboardActions.reset_dateOffset())}
                            >Reset timeline</div>
                            <div className='p02-item'>|</div>
                            <div 
                                className='p02-item'
                                onClick={() => {
                                    dispatch(dashboardActions.set_spinnerFetchingProjects(true));
                                    dispatch(apiActions.fetch_projects());
                                }}
                            >Refresh Projects</div>
                            <div className={
                                // showSpinner_FetchingProjects ?
                                useSelector(state => state.dashboard.spinnerFetchingProjects) ?
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
                    <main className='p02-main' id="p02-main">
                    {
                        projects.map((project) => {
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
                                    project={project} 
                                    //
                                    createTask_toogle={createTask_toogle}
                                    dateOffset={dateOffset}
                                    displayedDays={displayedDays}
                                    display_modal_warning_deleteMilestoneItem={display_modal_warning_deleteMilestoneItem}
                                    editMilestone_toogle={editMilestone_toogle}
                                    projects={projects}
                                    // set_projects={set_projects}
                                    set_activeProject={set_activeProject}
                                    set_activeMilestoneItem={set_activeMilestoneItem}
                                    set_activeTask= {set_activeTask}
                                    set_editMilestone_toogle={set_editMilestone_toogle}
                                    set_createTask_toogle={set_createTask_toogle}
                                    set_manageMilestones_modalToogle={set_manageMilestones_modalToogle}
                                    set_manageMilestoneTasks_modalToogle={set_manageMilestoneTasks_modalToogle}
                                    set_manageMonuments_modalToogle={set_manageMonuments_modalToogle}
                                    set_manageDocuments_modalToogle={set_manageDocuments_modalToogle}
                                    set_manageProjectTasks_modalToogle={set_manageProjectTasks_modalToogle}
                                />
                            }
                        })
                    }
                    </main>
                    <footer className='p02-footer'>
                        <div className='p02-timeline-controls-left'>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                // onClick={() => set_dateOffset(dateOffset - 1)}
                                onClick={() => dispatch(dashboardActions.set_dateOffset(-1))}
                            >- 1 DAY</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                // onClick={() => set_dateOffset(dateOffset - 7)}
                                onClick={() => dispatch(dashboardActions.set_dateOffset(-7))}
                            >- 7 DAYS</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                // onClick={() => set_dateOffset(dateOffset - 30)}
                                onClick={() => dispatch(dashboardActions.set_dateOffset(-30))}
                            >- 30 DAYS</div>
                        </div>
                        <P02_C01_TIMELINE />
                        <div className='p02-timeline-controls-right'>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                // onClick={() => set_dateOffset(dateOffset + 1)}
                                onClick={() => dispatch(dashboardActions.set_dateOffset(1))}
                            >+ 1 DAY</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                // onClick={() => set_dateOffset(dateOffset + 7)}
                                onClick={() => dispatch(dashboardActions.set_dateOffset(7))}
                            >+ 7 DAYS</div>
                            <div 
                                className='p02-cell-footer clicable starting' 
                                // onClick={() => set_dateOffset(dateOffset + 30)}
                                onClick={() => dispatch(dashboardActions.set_dateOffset(30))}
                            >+ 30 DAYS</div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default P02_PLANNING_DASHBOARD;