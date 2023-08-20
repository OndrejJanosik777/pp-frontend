import React, { Component, useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './index.scss';
import moment from 'moment';
import * as apiActions from '../../../../../app/features/api/apiSlice';

const P02_C02_C01_TASK_TAG = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let baseUrl = useSelector(state => state.api.baseUrl);
    let userPermissions = useSelector(state => state.api.userProfile.groups);

    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [leftOffsetMilestone, set_leftOffsetMilestone] = useState(props.leftOffsetMilestone);
    const [offsetTask, set_offsetTask] = useState(0);   // task offset in px from milestone
    const [initialOffsetTask, set_initialOffsetTask] = useState(0);   // task offset in px from milestone
    const [difference, set_difference] = useState(0);
    const [taskWidth, set_taskWidth] = useState(0);
    const [taskIsMoving, set_taskIsMoving] = useState(false);   
    const [index, set_index] = useState(props.index);
    const [task, set_task] = useState(props.task);
    const [taskDisplayed, set_taskDisplayed] = useState(true)
    const [initialClickDistance, set_initialClickDistance] = useState(10);
    const [milestone_item, set_milestone_item] = useState({
        tasks: []
    })

    const showState = () => {
        console.log('props: ', props);
        console.log('offsetTask: ', offsetTask / 8);
        console.log('difference: ', difference);
        console.log('leftOffsetMilestone: ', leftOffsetMilestone);
        console.log('taskWidth: ', taskWidth);
    }

    useEffect(() => {
        let taskDeadline = moment(props.task.task_deadline);
        let milestoneDeadline = moment(props.milestone_item.date);
        let difference = taskDeadline.diff(milestoneDeadline, "days");
        let taskWidth = Math.ceil(props.task.task_estimated_hours / 8);

        set_offsetTask((difference - taskWidth) * 16);
        set_initialOffsetTask((difference - taskWidth) * 16);
        set_difference(difference);
        set_taskWidth(taskWidth);
        set_milestone_item(props.milestone_item);
    }, []);

    const handleTaskTagMove = useRef((event) => {
        // console.log('initialClickDistance: ', initialClickDistance);

        let newOffsetTask = event.clientX - leftOffsetMilestone - (50 + 8*16) - initialClickDistance; 
        // 50 + 8*16 => distance screen left edge to beginning project center section

        set_offsetTask(newOffsetTask);
    })

    useEffect(() => {
        if (taskIsMoving) {
            // console.log('listener is active ...');

            window.addEventListener('mousemove', handleTaskTagMove.current);
        }
        else {
            // console.log('listener is not active ...');

            window.removeEventListener('mousemove', handleTaskTagMove.current);

            // update date in dashboard component
            let deltaDays = parseInt((offsetTask - initialOffsetTask) / 16);
            // console.log('deltaDays: ', deltaDays) // second day from dateOffset

            if (deltaDays !== 0) {
                updateTaskDeadline(deltaDays);

                console.log('task moved...');
                console.log('props.project: ', props.project);
                console.log('props.milestone_item: ', props.milestone_item);
                console.log('props.task: ', props.task);
            }
        }
    }, [taskIsMoving])

    const updateTaskDeadline = (deltaDays) => {
        let new_task_deadline = moment(task.task_deadline).add(deltaDays, 'days').format("YYYY-MM-DD");

        // 1 - update in redux ...
        // 2 - update in database ...


        // 2 - 
        axios({
            method: 'patch',
            url: baseUrl + '/company/tasks/' + props.task.task_id + '/',
            headers: {
                "Authorization": token
            },
            data: {
                task_deadline: new_task_deadline,
            }
        })
        .then((response => {
            // console.log('tasks deadline updated in database: ', response.data);

            // 1 - 
            dispatch(apiActions.fetch_projects());
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            // set_tasks([...backupTasks]);
        });
    }

    const taskClicked = (event) => {
        if (userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_task" ) !== -1) {

            let distance = event.clientX - leftOffsetMilestone - (50 + 8*16);
    
            // console.log('event.clientX - leftOffsetMilestone: ', distance);
    
            set_taskIsMoving(!taskIsMoving);
        }
    }

    const TaskTag = {
        marginLeft: `${leftOffsetMilestone + offsetTask}px`,
        marginTop: `${10 * index - 10 * milestone_item.tasks.length}px`,
    }

    const TaskTagHidden = {
        display: "none",
    }

    const TaskBar = {
        width: `${taskWidth}rem`,
        borderWidth: `2px`,
        borderColor: 'black',
        borderStyle: `solid`,
    }

    const BarProgress = {
        width: `${task.task_status_percentage}%`,
    }

    const TaskLabel = {
        color: 'black',
        backgroundColor: props.milestone_item.color,
        height: '100%',
        marginLeft: '4px',
        lineHeight: '9px',
    }

    return ( <div 
                style={ taskDisplayed ? TaskTag : TaskTagHidden }
                className='p02-c05-c01-task-tag'
                onClick={(e) => taskClicked(e)}
                // onClick={() => showState()}
                title={`task deadline: \n${task.task_deadline} \n(${task.task_status_percentage}%)`}
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
            <div
                // onClick={() => showState()}
                className='p02-c05-c01-task-label'
                style={TaskLabel}
            >
                {task.document_number === null ?
                    `${task.task_comment}` :
                    // "" :
                    `${task.document_number} : ${task.document_name}`
                }
            </div>
    </div> );
}
 
export default P02_C02_C01_TASK_TAG;