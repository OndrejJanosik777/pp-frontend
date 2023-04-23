import React, { Component, useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import './index.scss';
import moment from 'moment';

const MilestoneTag = (props) => {
    // const [loaded, setLoaded] = useState([]);
    const [leftOffset, set_LeftOffset] = useState(0);
    const [originalLeftOffset, setOriginalLeftOffset] = useState(0);
    const [isMoving, set_isMoving] = useState(false);
    const [visible, setVisible] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [deltaTag, set_deltaTag] = useState(10);
    const [deltaStart, set_deltaStart] = useState(document.getElementById('milestone-tag').getBoundingClientRect().left - leftOffset);

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
            setVisible(true);
            set_LeftOffset(difference * 16);
            setOriginalLeftOffset(difference * 16);
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
        console.log('event.clientX: ', event.clientX);
        console.log('leftOffset: ', leftOffset);
        console.log('deltaTag: ', deltaTag);
        console.log('deltaStart: ', deltaStart);
        console.log('newLeftOffset: ', newLeftOffset);

        set_LeftOffset(newLeftOffset);
        // setLeftOffset(16);
    })

    useEffect(() => {
        if (isMoving) {
            // console.log('listener is active ...');

            window.addEventListener('mousemove', handleMilestoneTagMove.current);
        }
        else {
            // console.log('listener is not active ...');

            window.removeEventListener('mousemove', handleMilestoneTagMove.current);

            // update date in dashboard component
            let deltaDays = parseInt((leftOffset - originalLeftOffset) / 16);
            // console.log('deltaDays: ', deltaDays) // second day from dateOffset

            if (deltaDays !== 0) {
                props.updateMilestoneItemDeadline(deltaDays, props.project, props.milestoneItem);
            }
        }
    }, [isMoving])

    const mouseClicked = (event) => {
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
        set_isMoving(!isMoving);
    }

    const contextMenuClicked = (event) => {
        event.preventDefault();

        // setMouseX(event.clientX);
        // setMouseY(event.clientY);
        setContextMenuVisible(!contextMenuVisible);
        // console.log(`context menu clicked: ${event.clientX} ${event.clientY}`);
    }

    const ContextMenuStyle = {
        position: 'absolute',
        marginLeft: `${leftOffset}px`,
        marginTop: `${0}px`,
        zIndex: `25`,
    }

    const TasksStyle = {
        position: 'absolute',
        marginLeft: `${leftOffset - 18}px`,
        marginTop: `${-32}px`,
        zIndex: `0`,
        backgroundColor: `lightgreen`,
        width: `25px`,
        textAlign: `center`,
        borderRadius: `50%`,
    }

    const TagStyle = {
        paddingLeft: `${leftOffset}px`,
        paddingTop: `${20}px`,
    }

    return (<div className='milestone-tag' id='milestone-tag'>
        {visible ?
            <div style={TagStyle}>
                <button
                    type="button"
                    className="dragable"
                    title={props.milestoneItem.milestone_item_type.name + '\n' + props.milestoneItem.date}
                    onContextMenu={(e) => contextMenuClicked(e)}
                    onClick={(e) => mouseClicked(e)}
                >
                    {props.milestoneItem.milestone_item_type.short_name}
                </button>
            </div>
            :
            <div style={{ height: '30px' }}></div>
        }
        {contextMenuVisible ?
            <div style={ContextMenuStyle}>
                <ul className='context-container' onMouseLeave={() => setContextMenuVisible(!contextMenuVisible)}>
                    <li className='context-item'>
                        <span
                            className="badge bg-warning"
                            onClick={() => props.updateMilestoneItem(props.project, props.milestoneItem)}
                        >
                            Edit Milestone
                        </span>
                    </li>
                    <li className='context-item'>
                        <span
                            className="badge bg-danger"
                            onClick={() => props.deleteMilestoneItem(props.project, props.milestoneItem)}
                        >
                            Delete Milestone
                        </span>
                    </li>
                    <li className='context-item'>
                        <span
                            className="badge bg-primary"
                            onClick={() => props.display_modal_createNewTask(props.project, props.milestoneItem)}
                        >
                            Add Task
                        </span>
                    </li>
                    <li className='context-item'>
                        <span
                            className="badge bg-secondary"
                        // onClick={() => displayNewMilestone(project)}
                        >
                            Display Tasks
                        </span>
                    </li>
                </ul>
            </div>
            :
            <div></div>}
        {visible ?
            <div style={TasksStyle}>
                {props.milestoneItem.tasks.length}
            </div>
            :
            <div></div>
        }
    </div>);
}

export default MilestoneTag;