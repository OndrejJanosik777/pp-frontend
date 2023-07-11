import React, { Component, useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';
import moment from 'moment';

const P02_C02_C01_TASK_TAG = (props) => {
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
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);

    const showState = () => {
        console.log('props: ', props);
        console.log('offsetTask: ', offsetTask / 8);
        console.log('difference: ', difference);
        console.log('leftOffsetMilestone: ', leftOffsetMilestone);
        console.log('taskWidth: ', taskWidth);
        // console.log('initialClickDistance: ', initialClickDistance);
    }

    useEffect(() => {
        let taskDeadline = moment(props.task.task_deadline);
        let milestoneDeadline = moment(props.milestoneItem.date);
        let difference = taskDeadline.diff(milestoneDeadline, "days");
        let taskWidth = Math.ceil(props.task.task_estimated_hours / 8);

        set_offsetTask((difference - taskWidth) * 16);
        set_initialOffsetTask((difference - taskWidth) * 16);
        set_difference(difference);
        set_taskWidth(taskWidth);
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
                props.updateTaskDeadline(task, deltaDays);
            }
        }
    }, [taskIsMoving])

    const taskClicked = (event) => {
        if (userPermissions.findIndex(elem => elem === "all_permissions" || elem === "edit_task" ) !== -1) {

            let distance = event.clientX - leftOffsetMilestone - (50 + 8*16);
    
            // console.log('event.clientX - leftOffsetMilestone: ', distance);
    
            set_taskIsMoving(!taskIsMoving);
        }
    }

    const TaskTag = {
        marginLeft: `${leftOffsetMilestone + offsetTask}px`,
        marginTop: `${10 * index}px`,
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
        backgroundColor: props.milestoneItem.color,
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