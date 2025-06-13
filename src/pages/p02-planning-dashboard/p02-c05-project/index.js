import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import P02_C05_C01_MILESTONE_TAG from './p02-c05-c01-milestone-tag';
import './index.scss';
import * as dashboardActions from '../../../app/features/dashboardSlice';
import { hover } from '@testing-library/user-event/dist/hover';
 
const P02_C05_PROJECT = (props) => { 
    const dispatch = useDispatch();

    // pick the data from the redux store
    const baseUrl = useSelector(state => state.api.baseUrl);
    const userPermissions = useSelector(state => state.api.userProfile.groups);
    const dateOffset = useSelector(state => state.dashboard.dateOffset);

    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [achievedMilestones, set_achievedMilestones] = useState({});
    const [completedTasks, set_completedTasks] = useState(0);
    const [totalTasks, set_totalTasks] = useState(0);
    const [nrOfMilestones, set_nrOfMilestones] = useState(0);
    const [nrOfTasks, set_nrOfTasks] = useState(0);
    const [documents, set_documents] = useState([]);

    useEffect(() => {
        console.log('P02_C05_PROJECT: ', props);

        let achievedMilestones = props.project.milestone_items.filter(elem => {
            let now = moment();
            let m_date = moment(elem.date);

            return m_date.diff(now, 'days') < 0;
        })

        set_achievedMilestones(achievedMilestones);

        let newTotalTasks = 0;
        let newCompletedTasks = 0;

        if (props.project.documents !== undefined) {
            set_documents([...props.project.documents]);
        }

        // calculate number of completed tasks
        props.project.milestone_items.map((milestoneItem) => {
            newTotalTasks += milestoneItem.tasks.length;

            milestoneItem.tasks.map((task) => {
                if (task.task_status_percentage === 100) {
                    newCompletedTasks += 1;
                }
            })
        })

        // calculate height of project stripe
        let nrOfMilestones = 0;
        let nrOfTasks = 0;

        props.project.milestone_items.map((item) => {
            nrOfMilestones += 1;

            item.tasks.map((task) => {
                nrOfTasks += 1;
            })
        });

        set_totalTasks(newTotalTasks);
        set_completedTasks(newCompletedTasks);
        set_nrOfMilestones(nrOfMilestones);
        set_nrOfTasks(nrOfTasks);
    }, []);

    const showState = (e) => {
        console.log('nrOfMilestones', nrOfMilestones);
        console.log('nrOfTasks', nrOfTasks);
        // let projectElement = document.getElementById('p02-c05-project');
        // console.log('top', projectElement.getBoundingClientRect().top);
        // console.log('left', projectElement.getBoundingClientRect().left);
        console.log('e', e);
        console.log('e.clientX', e.clientX);
        console.log('e.clientX', e.clientY);
        // projectElement.getBoundingClientRect().top;
        // projectElement.getBoundingClientRect().left;
    }

    const display_modal_createNewTask = (project, milestoneItem) => {
        // console.log(`creating new Task for milestone ${milestoneItem.id} within project ${project.id}`);

        props.set_activeProject(project);
        props.set_activeMilestoneItem(milestoneItem);

        props.set_createTask_toogle(!props.createTask_toogle);
    }

    const updateMilestoneItem = (project, milestoneItem) => {
        console.log(`updating milestone item ${milestoneItem.name} within project ${project.name}`);

        props.set_activeProject(project);
        props.set_activeMilestoneItem(milestoneItem);

        props.set_editMilestone_toogle(!props.editMilestone_toogle);
    }

    const updateMilestoneItemDeadline = (days, project, milestoneItem) => {
        // update in component state
        // console.log(`moving milestone with id ${milestoneItemId} within project with id ${projectId} by ${days}... `);

        let projectIndex = props.projects.findIndex(element => element.id === project.id);
        let milestoneIndex = props.projects[projectIndex].milestone_items.findIndex(element => element.id === milestoneItem.id);
        let currentDeadline = props.projects[projectIndex].milestone_items[milestoneIndex].date;
        // console.log('originalDate: ', originalDate);

        let newDeadline = moment(currentDeadline).add(days, 'days').format("YYYY-MM-DD");
        // console.log('newDate: ', newDate);

        let originalProjects = [...props.projects];
        let updatedProjects = [...props.projects];
        updatedProjects[projectIndex].milestone_items[milestoneIndex].date = newDeadline;
        // console.log('updateddisplayedProjects: ', updateddisplayedProjects);
        // updateMilestoneItem({ ...updateddisplayedProjects[projectIndex].milestone_items[milestoneIndex] })
        // props.set_projects([...updatedProjects]);

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
            // console.log('milestone deadline updated in database: ', response.data);

            // props.updateProject(props.project);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            // props.set_projects([...originalProjects]);
        })
    }

    const updateTaskDeadline = (days, task) => {
        // console.log('updating deadline: ', task);
        // console.log('with days: ', days);

        let currentDeadline = moment(task.task_deadline);

        let newDeadline = moment(currentDeadline).add(days, 'days').format("YYYY-MM-DD");

        axios({
            method: 'patch',
            url: baseUrl + '/company/tasks/' + task.task_id + "/",
            headers: {
                "Authorization": token
            },
            data: {
                id: task.task_id,
                // name: updatedMilestoneItem.name,
                // milestone_item_type: milestoneItem.id,
                deadline: newDeadline,
                // comment: updatedMilestoneItem.comment
            }
        })
        .then((response => {
            // console.log('milestone deadline updated in database: ', response.data);

            // props.updateProject(props.project);

            
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        });
    }

    const middleStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: `${props.project.milestone_items.length * 35 + 10 * totalTasks}px`,
        minHeight: '100%',
        borderWidth: '1px',
        borderColor: 'black',
        borderStyle: 'solid',
        position: 'relative',
        // backgroundColor: 'green',
        width: '100%',
        // zIndex: -10,
    }

    const todayColumn = {
        width: '1rem',
        height: '100%',
        backgroundColor: 'greenyellow',
        backgroundColor: 'rgba(64, 184, 34, 0.432)',
        position: 'absolute',
        left: `${useSelector(state => state.dashboard.dateOffset) * -1}rem`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // transform: 'rotate(90deg)',
        textOrientation: 'upright',
        writingMode: 'vertical-rl',
        zIndex: 0,
    }

    const getDaysMarkers = () => {
        let result

        for (let i=0; i<props.displayedDays; i++) {
            
            const dayMarkers = {
                width: '1rem',
                height: '100%',
                borderLeftColor: "lightgrey",
                borderLeftWidth: '1px',
                borderLeftStyle: 'solid',
                zIndex: 1,
                position: 'absolute',
                left: `${16 * 2 - 1}px`,
            }
    
            let test = 
                <div id='test-element' style={{dayMarkers}}>
                    {/* <div style={dayMarkers}></div> */}
                    {/* <div style={dayMarkers}></div> */}
                    {/* <div style={dayMarkers}></div> */}
                </div>
            ;

            // document.getElementById('test-element').appendChild(<div style={{dayMarkers}}></div>)
            // document.getElementById('test-element').appendChild(<div style={{dayMarkers}}></div>)
            // document.getElementById('test-element').appendChild(<div style={{dayMarkers}}></div>)

            return test;
        }
    }

    const style_leftContainer = {
        border: '1px solid black',
        minHeight: '170px',
        Height: `${20 * nrOfMilestones + 10 * nrOfTasks}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
        width: '8rem',
        // maxWidth: '8rem',
        overflow: 'hidden',
        zIndex: 14,
    }

    return ( <div className='p02-c05-project' id={`#${props.project.id} : ${props.project.number}`}>
        <div className='p02-c05-left-container' style={style_leftContainer}>
            <div style={{ borderBottom: "1px solid gray", width: "100%", textAlign: "center", fontWeight: "bold" }} onClick={(e) => showState(e)}>
                {`#${props.project.id} : ${props.project.number}`}
            </div>
            <div style={{ textAlign: "center", width: "100%", paddingTop: "0.2rem"}}>
                {props.project.name}
            </div>
            <div style={{ textAlign: "center", width: "100%", borderBottom: "1px solid gray", borderTop: "1px solid gray", margin: "0.2rem 0"}}>
                {props.project.short_name}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.2rem" }}>
                <div>
                    {`CVE LEAD: `}
                </div>
                <div>
                    {`${props.project.cve_lead === null ? "..." : props.project.cve_lead.employee_initials}`}
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.2rem" }}>
                <div>
                    {`ENV LEAD: `}
                </div>
                <div>
                    {`${props.project.enviromental_lead === null ? "..." : props.project.enviromental_lead.employee_initials}`}
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.2rem" }}>
                <div>
                    {`STRESS LEAD: `}
                </div>
                <div>
                    {`${props.project.stress_lead === null ? "..." : props.project.stress_lead.employee_initials}`}
                </div>
            </div>
            <div style={{ width: "100%", borderBottom: "1px solid gray", margin: "0.5rem 0" }}></div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img style={{ maxWidth: '90%', maxHeight: '2rem', margin: '0.2rem 0.2rem' }} src={`https://res.cloudinary.com/dpdthtsnm/${props.project.logo_2}`} alt='' onClick={(e) => showState(e)} />
            </div>
            {/* <div>
                <img
                    className='plane-icons'
                    src={planeSVG}
                    alt=''
                    onClick={() => showState()} 
                />
            </div> */}
            <div className='p02-c05-row-left'
                style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.2rem", cursor: "pointer", borderTop: "1px solid gray", marginTop: "0.2rem" }}
                onClick={
                    () => {
                        dispatch(dashboardActions.set_activeProject(props.project));
                        dispatch(dashboardActions.set_showModal_manageMonuments(true));
                    }
                }
            >
                <div>
                    {`Monuments:`}
                </div>
                <div>
                    {`${props.project.monuments.length}`}
                </div>
            </div>
            <div 
                className='p02-c05-row-left'
                style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.2rem", cursor: "pointer" }}
                onClick={
                    () => {
                        dispatch(dashboardActions.set_activeProject(props.project));
                        dispatch(dashboardActions.set_activeMilestone([]));
                        dispatch(dashboardActions.set_activeTask([]));
                        dispatch(dashboardActions.set_showModal_manageDocuments(true));
                    }
                }
            >
                <div>
                    {`Documents:`}
                </div>
                <div>
                    {`${documents.length}`}
                </div>
            </div>
            <div 
                className='p02-c05-row-left'
                style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.2rem", cursor: "pointer" }}
                onClick={
                    () => {
                        dispatch(dashboardActions.set_activeProject(props.project));
                        dispatch(dashboardActions.set_showModal_manageMilestones(true));
                    }
                }
            >
                <div>
                    {`Milestones:`}
                </div>
                <div>
                    {`${achievedMilestones.length}/${props.project.milestone_items.length}`}
                </div>
            </div>
            <div 
                className='p02-c05-row-left'
                style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 0.2rem", cursor: "pointer" }}
                onClick={
                    () => {
                        dispatch(dashboardActions.set_activeProject(props.project));
                        dispatch(dashboardActions.set_showModal_manageProjectTasks(true))
                    }
                }
            >
                <div>
                    {`Tasks:`}
                </div>
                <div>
                    {`${completedTasks}/${totalTasks}`}
                </div>
            </div>
        </div>
        <div style={middleStyle}>
            { 
            props.project.milestone_items.map((milestone_item, index) => {
                // console.log('drawing milestone items: ', index)
 
                return < P02_C05_C01_MILESTONE_TAG
                    key={Math.random() * 100000}
                    project={props.project}
                    projectId={`#${props.project.id} : ${props.project.number}`}
                    milestone_item={milestone_item}
                    milestone_offsetTop={index * 30}  // offset in px from top
                    milestone_offsetLeft={moment().diff(moment(milestone_item.date), 'days') + dateOffset - 1}
                    updateTaskDeadline={updateTaskDeadline}
                    display_modal_createNewTask={display_modal_createNewTask}
                    set_manageMilestoneTasks_modalToogle={props.set_manageMilestoneTasks_modalToogle}
                    set_manageMilestones_modalToogle={props.set_manageMilestones_modalToogle}
                    set_activeProject={props.set_activeProject}
                    set_activeMilestoneItem={props.set_activeMilestoneItem}
                    set_activeTask={props.set_activeTask}
                />
            })
            }
            <div style={todayColumn}>TODAY</div>
            {getDaysMarkers()}
        </div>
    </div> );
}
 
export default P02_C05_PROJECT;