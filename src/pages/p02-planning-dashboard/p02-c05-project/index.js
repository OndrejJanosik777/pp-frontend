import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import P02_C05_C01_MILESTONE_TAG from './p02-c05-c01-milestone-tag';
import './index.scss';
 
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
    const [documents, set_documents] = useState([]);

    useEffect(() => {
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

        props.project.milestone_items.map((milestoneItem) => {
            newTotalTasks += milestoneItem.tasks.length;

            milestoneItem.tasks.map((task) => {
                if (task.task_status_percentage === 100) {
                    newCompletedTasks += 1;
                }
            })
        })

        set_totalTasks(newTotalTasks);
        set_completedTasks(newCompletedTasks);
    }, []);

    const showState = () => {
        console.log('showing state of component: ""P02_C05_PROJECT"', props);
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

            props.updateProject(props.project);
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
        height: `${props.project.milestone_items.length * 35 + 50}px`,
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

    return ( <div className='p02-c05-project'>
        <div className='p02-c05-left-container'>
            <div>{`#${props.project.id} : ${props.project.number}`}</div>
            <div>{props.project.short_name}</div>
            <div>{`CVE: ${props.project.cve_lead_id}`}</div>
            <div>{`ENVIRO: ${props.project.enviromental_lead_id}`}</div>
            <div>{`STRESS: ${props.project.stress_lead_id}`}</div>
            <div>
                <img
                    className='plane-icons'
                    src={planeSVG}
                    alt=''
                    onClick={() => showState()} 
                />
            </div>
            <div 
                className='p02-c05-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        props.set_manageMonuments_modalToogle(true);
                    }
                }
            >
                {`Monuments: ${props.project.monuments.length}`}
            </div>
            <div 
                className='p02-c05-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        props.set_manageDocuments_modalToogle(true);
                    }
                }
            >
                {`Documents: ${documents.length}`}
            </div>
            <div 
                className='p02-c05-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        props.set_manageMilestones_modalToogle(true);
                    }
                }
            >
                {`Milestones: ${achievedMilestones.length}/${props.project.milestone_items.length}`}
            </div>
            <div 
                className='p02-c05-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        props.set_manageProjectTasks_modalToogle(true);
                    }
                }
            >
                {`Tasks: ${completedTasks}/${totalTasks}`}
            </div>
        </div>
        <div style={middleStyle}>
            {
            props.project.milestone_items.map((milestone_item, index) => {
                // console.log('drawing milestone items: ', index)

                return < P02_C05_C01_MILESTONE_TAG
                    key={Math.random() * 100000}
                    project={props.project}
                    milestone_item={milestone_item}
                    milestone_offsetTop={index * 30}  // offset in px from top
                    milestone_offsetLeft={moment().diff(moment(milestone_item.date), 'days') + dateOffset - 1}
                    updateTaskDeadline={updateTaskDeadline}
                    display_modal_createNewTask={display_modal_createNewTask}
                    set_manageMilestoneTasks_modalToogle={props.set_manageMilestoneTasks_modalToogle}
                    set_manageMilestones_modalToogle={props.set_manageMilestones_modalToogle}
                    set_activeMilestoneItem={props.set_activeMilestoneItem}
                    set_activeProject={props.set_activeProject}
                />
            })
            }
            <div style={todayColumn}>TODAY</div>
            {getDaysMarkers()}
        </div>
    </div> );
}
 
export default P02_C05_PROJECT;