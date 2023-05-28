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
    const [initialClickDistance, set_initialClickDistance] = useState(10);

    const showState = () => {
        console.log('props: ', props);
        console.log('offsetTask: ', offsetTask);
        console.log('initialClickDistance: ', initialClickDistance);
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
        console.log('initialClickDistance: ', initialClickDistance);

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
            console.log('deltaDays: ', deltaDays) // second day from dateOffset

            if (deltaDays !== 0) {
                props.updateTaskDeadline(task, deltaDays);
            }
        }
    }, [taskIsMoving])

    const updateTaskDeadline = (task, days) => {
        let newTask = {...task};

        newTask.task_deadline = moment(task.task_deadline).add(days, 'days').format("YYYY-MM-DD");

        set_task({...newTask});
    }

    const taskClicked = (event) => {
        let distance = event.clientX - leftOffsetMilestone - (50 + 8*16);

        console.log('event.clientX - leftOffsetMilestone: ', distance);

        set_taskIsMoving(!taskIsMoving);
    }

    const TaskTag = {
        marginLeft: `${leftOffsetMilestone + offsetTask}px`,
        marginTop: `${10 * index}px`,
    }

    const TaskBar = {
        width: `${taskWidth}rem`,
    }

    const BarProgress = {
        width: `${task.task_status_percentage}%`,
    }

    return ( <div 
        style={TaskTag}
        className='p02-c05-c01-task-tag'
        onClick={(e) => taskClicked(e)}
        // title={props.milestoneItem.milestone_item_type.name + '\n' + props.milestoneItem.date}
        title={`task deadline: \n${task.task_deadline}`}
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
        >
            {task.document_number === null ?
                task.task_comment :
                `${task.document_number} : ${task.document_name}`
            }
        </div>
    </div> );
}
 
export default P02_C02_C01_TASK_TAG;