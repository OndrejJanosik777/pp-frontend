import React, { Component, useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './index.scss';
import moment from 'moment';
import P02_C02_C01_TASK_TAG from './p02-c05-c01-task-tag';
import * as dashboardActions from '../../../../app/features/dashboardSlice';
import * as apiActions from '../../../../app/features/api/apiSlice';
// '../../app/features/dashboardSlice';
 
const P02_C05_C01_MILESTONE_TAG = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let baseUrl = useSelector(state => state.api.baseUrl);
    const userPermissions = useSelector(state => state.api.userProfile.groups);

    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [dateOffset, set_dateOffset] = useState(useSelector(state => state.dashboard.dateOffset));
    // const [loaded, setLoaded] = useState([]);
    // distance from beginning of left center edge to milestone in px
    const [leftOffset_milestone, set_leftOffset_milestone] = useState(0);  
    // relative offset vs. milestone item per task   
    const [leftOffsetTasks, set_leftOffsetTasks] = useState([]);        
    // used to calculate delta-days    
    const [initialLeftOffset, set_initialLeftOffset] = useState(0);         
    const [milestoneIsMoving, set_milestoneIsMoving] = useState(false);     
    const [milestoneTag_visibility, set_milestoneTag_visibility] = useState(false);
    const [contextMenu_visibility, set_contextMenu_visibility] = useState(false);
    const [tasks, set_tasks] = useState([]);
    const [tasksDisplayed, set_tasksDisplayed] = useState(true);
    const [milestone_item, set_milestone_item] = useState({
        tasks: []
    })

    const showState = () => {
        console.log('props: ', props);
        console.log('tasks: ', tasks);
        console.log('leftOffsetMilestone: ', leftOffset_milestone);
        console.log('leftOffsetTasks: ', leftOffsetTasks);
    }

    useEffect(() => {
        if (props.milestone_item.tasks !== undefined) {
            let newTasks = [...props.milestone_item.tasks];

            
            newTasks.sort((a, b) => {
                return moment(a.task_deadline) - moment(b.task_deadline);
            });
            
            set_tasks([...newTasks]);
        }

        set_milestone_item(props.milestone_item);
        // fetchTasks(id);
    }, [])

    useEffect(() => {
        let date_now = moment().add(dateOffset, 'days');
        let eventDate = moment(props.milestone_item.date);
        let difference = eventDate.diff(date_now, "days");
        // console.log('difference: ', difference);

        if (date_now.year() <= eventDate.year() && date_now.dayOfYear() < eventDate.dayOfYear()) {
            difference = difference + 1;
        }

        if (difference >= -1) {
            set_milestoneTag_visibility(true);
            set_initialLeftOffset(difference * 16);
        }

        set_leftOffset_milestone(difference * 16);

    }, [dateOffset]);

    const handleMilestoneTagMove = useRef((event) => {
        // let newLeftOffset = event.clientX - 9 * 16;
        // let newLeftOffset = event.clientX - 22 * 10;
        let newLeftOffset = event.clientX - 10 - (50 + 8*16); // 50 + 8*16 => distance screen left edge to beginning project center section
        // console.log("event.clientX: ", event.clientX);
        // console.log("startingX: ", startingX);
        // console.log("leftOffset: ", leftOffset);
        // console.log("newLeftOffset: ", newLeftOffset);
        // console.log('event.clientX: ', event.clientX);
        // console.log('leftOffset: ', leftOffset);
        // console.log('deltaTag: ', deltaTag);
        // console.log('deltaStart: ', deltaStart);
        // console.log('newLeftOffset: ', newLeftOffset);

        set_leftOffset_milestone(newLeftOffset);
        // setLeftOffset(16);
    })

    useEffect(() => {
        if (milestoneIsMoving) {
            // console.log('listener is active ...');

            window.addEventListener('mousemove', handleMilestoneTagMove.current);
        }
        else {
            // console.log('listener is not active ...');

            window.removeEventListener('mousemove', handleMilestoneTagMove.current);

            // update date in dashboard component
            let deltaDays = parseInt((leftOffset_milestone - initialLeftOffset) / 16);
            // console.log('deltaDays: ', deltaDays) // second day from dateOffset

            if (deltaDays !== 0) {
                // console.log('delta is not zero', deltaDays);

                let taskToUpdate = [];

                tasks.map((task) => {
                    taskToUpdate.push(task.task_id);
                })

                updateMilestoneItemDeadlineWithTasks(deltaDays);

                // console.log('')
            }
        }
    }, [milestoneIsMoving])

    const fetchTasks = (id) => {
        axios({
            method: 'get',
            url: baseUrl + '/company/get-tasks/?milestone_id=' + id,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log('milestone deadline updated in database: ', response.data);
            let newTasks = [...response.data];

            newTasks.sort((a, b) => {
                return moment(a.task_deadline) - moment(b.task_deadline);
            });

            let newleftOffsetTasks = [];
            let milestoneDeadline = moment(props.milestone_item.date);

            newTasks.map((newTask, index) => {
                let taskDeadline = moment(newTask.task_deadline);
                let difference = taskDeadline.diff(milestoneDeadline, "days");
                let taskWidth = Math.ceil(newTask.task_estimated_hours / 8);

                newleftOffsetTasks.push(`${leftOffset_milestone + (difference - taskWidth) * 16}px`);
            });

            set_tasks([...newTasks]);
            set_leftOffsetTasks([...newleftOffsetTasks]);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        });
    }

    const mouseOverMilestoneClicked = (event) => {
        // console.log('mouse clicked: ');
        // console.log('leftOffset: ', leftOffset);
        // console.log('originalLeftOffset: ', originalLeftOffset);
        // console.log('event.clientX: ', event.clientX);
        // console.log('document.getElementById: ', document.getElementById('milestone-tag'));
       
        // let bounds = event.target.getBoundingClientRect();
        // console.log('bounds: ', bounds.left);
        // console.log('deltaTag: ', event.clientX - bounds.left);
        // console.log('deltaStart: ', bounds.left - leftOffset);

        // set_deltaTag(event.clientX - bounds.left);
        // set_deltaStart(bounds.left - leftOffset);
        set_milestoneIsMoving(!milestoneIsMoving);
    }

    const contextMenuClicked = (event) => {
        event.preventDefault();

        // setMouseX(event.clientX);
        // setMouseY(event.clientY);
        set_contextMenu_visibility(!contextMenu_visibility);
        // console.log(`context menu clicked: ${event.clientX} ${event.clientY}`);
    }

    const updateMilestoneItemDeadlineWithTasks = (deltaDays) => {
        let new_milestone_deadline = moment(props.milestone_item.date).add(deltaDays, 'days').format("YYYY-MM-DD");

        // 1 - update in redux store ... TODO:
        // 2 - update in database


        // 2 - 
        axios({
            method: 'patch',
            url: baseUrl + '/company/milestone-items/' + props.milestone_item.id + "/",
            headers: {
                "Authorization": token
            },
            data: {
                // tasks: [...props.milestone_item.tasks],
                date: new_milestone_deadline
            }
        })
        .then((response => {
            props.milestone_item.tasks.map((task, index) => {
                updateTasks(deltaDays, task);

                // 1 -
            });
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const updateTasks = (deltaDays, task) => {
        let new_task_deadline = moment(task.task_deadline).add(deltaDays, 'days').format("YYYY-MM-DD");

        // 1 - update in redux ... TODO:
        // 2 - update in database ...


        // 2 - 
        axios({
            method: 'patch',
            url: baseUrl + '/company/tasks/' + task.task_id + '/',
            headers: {
                "Authorization": token
            },
            data: {
                task_deadline: new_task_deadline,
            }
        })
        .then((response => {
            // console.log('tasks deadline updated in database: ', response.data);

            dispatch(apiActions.fetch_projects());
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            // set_tasks([...backupTasks]);
        });
    }

    const ContextMenuStyle = {
        position: 'absolute',
        marginLeft: `${leftOffset_milestone}px`,
        marginTop: `${-25 - 10 * milestone_item.tasks.length}px`,
        zIndex: `15`,
    }

    const TaskNumberCircle = {
        position: 'absolute',
        marginLeft: `${leftOffset_milestone - 20}px`,
        marginTop: `${1}px`,
        backgroundColor: props.milestone_item.color,
        borderWidth: `1px`,
        borderColor: `grey`,
        borderStyle: `solid`,
        width: `20px`,
        height: `20px`,
        borderRadius: `50%`,
        zIndex: `10`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        color: 'grey',
    }

    const MilestoneTagStyle = {
        paddingLeft: `${leftOffset_milestone}px`,
        zIndex: `10`,
        position: 'absolute',
    }

    const MilestoneLowerMargin = {
        marginBottom: `${10 * milestone_item.tasks.length}px`,
    }

    return (<div 
                className='p02-c05-c01-milestone-tag' 
                style={{height: `${tasks.length * 10 + 23}px`}} 
                id='milestone-tag'
            >
        {/* LINE */}
        <div className='p02-c05-c01-milestone-line' >{
            milestone_item.milestone_item_type !== undefined ?
            `${milestone_item.milestone_item_type.short_name} : ${moment(milestone_item.date).format('D-MMM-YY')}(KW${moment(milestone_item.date).format('WW')})` :
            ''
        }</div>
        {/* MILESTONE TAG */}
        {milestoneTag_visibility ?
            <div style={MilestoneTagStyle}>
                <button
                    type="button"
                    className={ userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_milestone_item" ) !== -1 ?
                        "p02-c05-c01-dragable" :
                        "p02-c05-c01-not-dragable"
                    }
                    title={props.milestone_item.milestone_item_type.name + '\n' + moment(props.milestone_item.date).format('D-MMM-YYYY')}
                    onContextMenu={(e) => contextMenuClicked(e)}
                    onClick={ userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_milestone_item" ) !== -1 ? 
                    (e) => mouseOverMilestoneClicked(e) :
                    () => console.log('no permission to edit milestone') }
                >
                    {props.milestone_item.milestone_item_type.short_name}
                </button>
                <div style={MilestoneLowerMargin}></div>
            </div>
            :
            // <div style={{ height: '30px' }}></div>
            <div style={{ height: `${30 + 10 * milestone_item.tasks.length}px` }}></div>
        }
        {/* CONTEXT MENU */}
        {contextMenu_visibility ?
            <div 
                style={ContextMenuStyle}
            >
                <ul 
                    className='p02-c05-c01-context-container' 
                    onMouseLeave={() => set_contextMenu_visibility(!contextMenu_visibility)}
                >
                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_milestone_item" ) !== -1 ?
                        <li className='p02-c05-c01-context-item'>
                            <span
                                className="p02-c05-c01-badge"
                                // onClick={() => props.updateMilestoneItem(props.project, props.milestone_item)}
                                // onClick={() => props.set_manageMilestones_modalToogle(true)}
                            >
                                Edit Milestone
                            </span>
                        </li> :
                        <div></div>
                    }
                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "delete_milestone_item" ) !== -1 ?
                        <li className='p02-c05-c01-context-item'>
                            <span
                                className="p02-c05-c01-badge"
                                // onClick={() => props.deleteMilestoneItem(props.project, props.milestone_item)}
                            >
                                Delete Milestone
                            </span>
                        </li> :
                        <div></div>
                    }
                    <li className='p02-c05-c01-context-item'>
                        <span
                            className="p02-c05-c01-badge"
                            onClick={() => {
                                props.set_activeProject(props.project)
                                props.set_activeMilestoneItem(props.milestone_item)
                                // props.set_manageMilestoneTasks_modalToogle(true)
                                dispatch(dashboardActions.set_activeProject({...props.project}))
                                dispatch(dashboardActions.set_activeMilestone({...props.milestone_item}))
                                dispatch(dashboardActions.set_activeTask({undefined}))
                                dispatch(dashboardActions.set_showModal_manageTasks(true))
                            }}
                            >
                                Manage Tasks
                        </span>
                    </li>
                    <li className='p02-c05-c01-context-item'>
                        <span
                            className="p02-c05-c01-badge"
                            onClick={() => set_tasksDisplayed(!tasksDisplayed)}
                        >
                            {tasksDisplayed ? 'Hide Tasks' : "Show Tasks"}
                        </span>
                    </li>
                </ul>
            </div>
            :
            <div></div>
        }
        {/* CIRCLE WITH NUMBER OF TASKS */}
        {milestoneTag_visibility ?
            <div 
                style={TaskNumberCircle}
                onClick={() => showState()}
            >
                {milestone_item.tasks.length}
            </div>
            :
            <div></div>
        }
        {/* CONTAINER WITH TASKS */}
        {milestone_item.tasks.map((task, index) => {
            // if (tasksDisplayed && milestoneTag_visibility) {
            if (tasksDisplayed) {
                // return <P02_C02_C01_TASK_TAG 
                //         key={Math.random() * 100000}
                //         project = {props.project}
                //         milestone_item = {props.milestone_item}
                //         task = {task}
                //         // 
                //         index = {index}
                //         leftOffsetMilestone = {leftOffset_milestone}
                //         // leftOffsetMilestone = {leftOffsetTasks}
                //         // updateTaskDeadline = {updateTaskDeadline}
                //         userPermissions = {userPermissions}
                //     />
                return <div 
                    key={Math.random() * 100000}
                    className='p02-c05-c01-test'
                >
                    <P02_C02_C01_TASK_TAG 
                        key={Math.random() * 100000}
                        project = {props.project}
                        milestone_item = {props.milestone_item}
                        task = {task}
                        // 
                        index = {index}
                        leftOffsetMilestone = {leftOffset_milestone}
                        // leftOffsetMilestone = {leftOffsetTasks}
                        // updateTaskDeadline = {updateTaskDeadline}
                        userPermissions = {userPermissions}
                    />
                </div>
                }
            })
        }
    </div>);
}

export default P02_C05_C01_MILESTONE_TAG;