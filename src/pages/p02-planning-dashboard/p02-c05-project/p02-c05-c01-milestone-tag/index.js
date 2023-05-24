import React, { Component, useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import './index.scss';
import moment from 'moment';

const P02_C05_C01_MILESTONE_TAG = (props) => {
    const getStartPosition = () => {
        if (document.getElementById('milestone-tag') === null) {
            return 0;
        }
        else {
            return document.getElementById('milestone-tag').getBoundingClientRect().left - leftOffset;
        }
    }

    // const [loaded, setLoaded] = useState([]);
    const [leftOffset, set_LeftOffset] = useState(0);
    const [originalLeftOffset, set_originalLeftOffset] = useState(0);
    const [isMoving, set_isMoving] = useState(false);
    const [milestoneTag_visibility, set_milestoneTag_visibility] = useState(false);
    const [contextMenu_visibility, set_contextMenu_visibility] = useState(false);
    const [deltaTag, set_deltaTag] = useState(10);
    const [deltaStart, set_deltaStart] = useState(props.deltaStart);
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);

    useEffect(() => {
        // console.log('props.deltaStart: ', props.deltaStart)
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
            set_LeftOffset(difference * 16);
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
        set_contextMenu_visibility(!contextMenu_visibility);
        // console.log(`context menu clicked: ${event.clientX} ${event.clientY}`);
    }

    const ContextMenuStyle = {
        position: 'absolute',
        marginLeft: `${leftOffset}px`,
        marginTop: `${-25}px`,
        zIndex: `15`,
        // width: `100px`,
    }

    const TaskNumberCircle = {
        position: 'absolute',
        marginLeft: `${leftOffset - 18}px`,
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
        paddingLeft: `${leftOffset}px`,
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
                    (e) => mouseClicked(e) :
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
                        // onClick={() => displayNewMilestone(project)}
                        >
                            Display Tasks
                        </span>
                    </li>
                </ul>
            </div>
            :
            <div></div>}
        {milestoneTag_visibility ?
            <div style={TaskNumberCircle}>
                {props.milestoneItem.tasks.length}
            </div>
            :
            <div></div>
        }
    </div>);
}

export default P02_C05_C01_MILESTONE_TAG;