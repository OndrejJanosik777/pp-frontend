import React, { Component, useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';
import moment from 'moment';

const P02_C05_C01_MILESTONE_TAG = (props) => {
    const getStartPosition = () => {
        if (document.getElementById('milestone-tag') === null) {
            return 0;
        }
        else {
            return document.getElementById('milestone-tag').getBoundingClientRect().left - leftOffsetMilestone;
        }
    }

    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    // const [loaded, setLoaded] = useState([]);
    const [leftOffsetMilestone, set_leftOffsetMilestone] = useState(0);
    const [leftOffsetTasks, set_leftOffsetTasks] = useState([]); // relative offset vs. milestone item
    const [originalLeftOffset, set_originalLeftOffset] = useState(0);
    const [milestoneIsMoving, set_milestoneIsMoving] = useState(false);
    const [milestoneTag_visibility, set_milestoneTag_visibility] = useState(false);
    const [contextMenu_visibility, set_contextMenu_visibility] = useState(false);
    const [deltaTag, set_deltaTag] = useState(10);
    const [deltaStart, set_deltaStart] = useState(props.deltaStart);
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);
    const [tasks, set_tasks] = useState([]);
    const [tasksDisplayed, set_tasksDisplayed] = useState(true);

    const showState = () => {
        console.log('props: ', props);
        console.log('tasks: ', tasks);
        console.log('leftOffset: ', leftOffsetMilestone);
        console.log('leftOffsetTasks: ', leftOffsetTasks);
    }

    useEffect(() => {
        let id = props.milestoneItem.id;

        // console.log('props: ', props);

        fetchTasks(id);
    }, [])

    useEffect(() => {
        // console.log('props.dateOffset: ', props.dateOffset);
        let date_now = moment().add(props.dateOffset, 'days');
        let eventDate = moment(props.milestoneItem.date);
        let difference = eventDate.diff(date_now, "days");
        // console.log('difference: ', difference);

        if (date_now.year() <= eventDate.year() && date_now.dayOfYear() < eventDate.dayOfYear()) {
            difference = difference + 1;
        }

        if (difference >= 0 && difference < props.displayLimit - 1) {
            // if (difference < props.displayLimit - 1) {
            set_milestoneTag_visibility(true);
            set_leftOffsetMilestone(difference * 16);
            set_originalLeftOffset(difference * 16);
        }
    }, [props.dateOffset]);

    const handleMilestoneTagMove = useRef((event) => {
        // let newLeftOffset = event.clientX - 9 * 16;
        // let newLeftOffset = event.clientX - 22 * 10;
        let newLeftOffset = event.clientX - deltaTag - deltaStart;
        // console.log("event.clientX: ", event.clientX);
        // console.log("startingX: ", startingX);
        // console.log("leftOffset: ", leftOffset);
        // console.log("newLeftOffset: ", newLeftOffset);
        // console.log('event.clientX: ', event.clientX);
        // console.log('leftOffset: ', leftOffset);
        // console.log('deltaTag: ', deltaTag);
        // console.log('deltaStart: ', deltaStart);
        // console.log('newLeftOffset: ', newLeftOffset);

        set_leftOffsetMilestone(newLeftOffset);
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
            let deltaDays = parseInt((leftOffsetMilestone - originalLeftOffset) / 16);
            // console.log('deltaDays: ', deltaDays) // second day from dateOffset

            if (deltaDays !== 0) {
                console.log('delta is not zero');

                props.updateMilestoneItemDeadline(deltaDays, props.project, props.milestoneItem);

                tasks.map((task) => {
                    props.updateTaskDeadline(deltaDays, task);
                })
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
            let milestoneDeadline = moment(props.milestoneItem.date);

            newTasks.map((newTask, index) => {
                let taskDeadline = moment(newTask.task_deadline);
                let difference = taskDeadline.diff(milestoneDeadline, "days");
                let taskWidth = Math.ceil(newTask.task_estimated_hours / 8);

                newleftOffsetTasks.push(`${leftOffsetMilestone + (difference - taskWidth) * 16}px`);
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

    const ContextMenuStyle = {
        position: 'absolute',
        marginLeft: `${leftOffsetMilestone}px`,
        marginTop: `${-25}px`,
        zIndex: `15`,
        // width: `100px`,
    }

    const TaskNumberCircle = {
        position: 'absolute',
        marginLeft: `${leftOffsetMilestone - 18}px`,
        marginTop: `${-32}px`,
        backgroundColor: `lightgreen`,
        width: `20px`,
        height: `20px`,
        borderRadius: `50%`,
        zIndex: `10`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
    }

    const MilestoneTagStyle = {
        paddingLeft: `${leftOffsetMilestone}px`,
        paddingTop: `${10}px`,
        zIndex: `10`,
    }

    return (<div className='p02-c05-c01-milestone-tag' id='milestone-tag'>
        {milestoneTag_visibility ?
            <div style={MilestoneTagStyle}>
                <button
                    type="button"
                    className={ userPermissions.findIndex(elem => elem === "all_permissions" || elem === "edit_milestone_item" ) !== -1 ?
                        "p02-c05-c01-dragable" :
                        "p02-c05-c01-not-dragable"
                    }
                    title={props.milestoneItem.milestone_item_type.name + '\n' + props.milestoneItem.date}
                    onContextMenu={(e) => contextMenuClicked(e)}
                    onClick={ userPermissions.findIndex(elem => elem === "all_permissions" || elem === "edit_milestone_item" ) !== -1 ? 
                    (e) => mouseOverMilestoneClicked(e) :
                    () => console.log('no permission to edit milestone') }
                >
                    {props.milestoneItem.milestone_item_type.short_name}
                </button>
            </div>
            :
            <div style={{ height: '30px' }}></div>
        }
        {contextMenu_visibility ?
            <div 
                style={ContextMenuStyle}
            >
                <ul 
                    className='p02-c05-c01-context-container' 
                    onMouseLeave={() => set_contextMenu_visibility(!contextMenu_visibility)}
                >
                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "create_document" ) !== -1 ?
                        <li className='p02-c05-c01-context-item'>
                            <span
                                className="p02-c05-c01-badge"
                                onClick={() => props.updateMilestoneItem(props.project, props.milestoneItem)}
                            >
                                Edit Milestone
                            </span>
                        </li> :
                        <div></div>
                    }
                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "create_document" ) !== -1 ?
                        <li className='p02-c05-c01-context-item'>
                            <span
                                className="p02-c05-c01-badge"
                                onClick={() => props.deleteMilestoneItem(props.project, props.milestoneItem)}
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
                                props.set_activeMilestoneItem(props.milestoneItem)
                                props.set_manageMilestoneTasks_modalToogle(true)
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
            <div></div>}
        {milestoneTag_visibility ?
            <div 
                style={TaskNumberCircle}
                onClick={() => showState()}
            >
                {props.milestoneItem.tasks.length}
            </div>
            :
            <div></div>
        }
        {tasks.map((task, index) => {
            let taskDeadline = moment(task.task_deadline);
            let milestoneDeadline = moment(props.milestoneItem.date);
            let difference = taskDeadline.diff(milestoneDeadline, "days");
            let taskWidth = Math.ceil(task.task_estimated_hours / 8);

            // console.log('difference tags: ', difference);

            const TaskTag = {
                marginLeft: `${leftOffsetMilestone + (difference - taskWidth) * 16}px`,
                // marginLeft: `${leftOffsetTasks[index]}`,
                marginTop: `${10 * index}px`,
            }

            const TaskBar = {
                width: `${taskWidth}rem`,
            }

            const BarProgress = {
                width: `${task.task_status_percentage}%`,
            }
            
            if (tasksDisplayed && milestoneTag_visibility) {


                return <div
                        style={TaskTag}
                        // onClick={() => showState()}
                        className='p02-c05-c01-tasks'
                        key={Math.random() * 100000}
                        // onClick={() => console.log('task clicked...')}
                        onClick={() => props.updateTaskDeadline(-1, task)}
                    >
                        <div 
                            className='p02-c05-c01-task-bar' 
                            style={TaskBar}
                        >
                        <div 
                            className='p02-c05-c01-bar-progress'
                            style={BarProgress}
                        ></div>
                        </div>
                        <div>
                            {task.document_number === null ?
                                task.task_comment :
                                `${task.document_number} : ${task.document_name}`
                            }
                        </div>
                </div>
            }
        })}
        {/* {milestoneTag_visibility ?
            {tasks.map((task))}
            <div 
                style={TaskTag}
                // className='p02-c05-c01-tasks'
                onClick={() => showState()}
            >
                task
            </div>
            :
            <div></div>
        } */}
    </div>);
}

export default P02_C05_C01_MILESTONE_TAG;