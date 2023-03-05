import React, { Component, useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import './index.scss';
import moment from 'moment';

const MilestoneTag = (props) => {
    // const [loaded, setLoaded] = useState([]);
    const [leftOffset, setLeftOffset] = useState(0);
    const [originalLeftOffset, setOriginalLeftOffset] = useState(0);
    const [startingX, setStartingX] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [deadlineUpdated, setDeadLineUpdate] = useState(false);
    const [deltaX, setDeltaX] = useState(0);
    const [visible, setVisible] = useState(false);

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
            setLeftOffset(difference * 16);
            setOriginalLeftOffset(difference * 16);
        }
    }, [props.dateOffset]);

    const handleMouseMove = useRef((event) => {
        let newLeftOffset = event.clientX - 9 * 16;
        // console.log("event.clientX: ", event.clientX);
        // console.log("startingX: ", startingX);
        // console.log("leftOffset: ", leftOffset);
        // console.log("newLeftOffset: ", newLeftOffset);

        setDeltaX(newLeftOffset);
        setLeftOffset(newLeftOffset);
    })



    useEffect(() => {
        if (isMoving) {
            // console.log('listener is active ...');

            window.addEventListener('mousemove', handleMouseMove.current);
        }
        else {
            // console.log('listener is not active ...');

            window.removeEventListener('mousemove', handleMouseMove.current);

            // update date in dashboard component
            let deltaDays = parseInt((leftOffset - originalLeftOffset) / 16);
            // console.log('deltaDays: ', deltaDays) // second day from dateOffset

            if (deltaDays !== 0) {
                props.setNewDeadline(deltaDays, props.project.id, props.milestoneItem.id);
            }
        }
    }, [isMoving])

    const mouseDown = (event) => {
        console.log('mouseDown function called: ');
    }

    const mouseClicked = (event) => {
        console.log('mouse clicked: ');

        setIsMoving(!isMoving);
    }

    const mouseUp = (event) => {
        console.log('mouseUp function called: ');

    }

    const TagStyle = {
        paddingLeft: `${leftOffset}px`,
    }

    return (<div className='milestone-tag'>
        {visible ?
            <div style={TagStyle}>
                <button
                    type="button"
                    className="dragable"
                    title={props.milestoneItem.milestone_item_type.name}
                    // onMouseDown={(e) => mouseDown(e)}
                    // onMouseUp={(e) => mouseUp(e)}
                    onClick={(e) => mouseClicked(e)}
                >
                    {props.milestoneItem.milestone_item_type.short_name}
                </button>
            </div>
            :
            <div style={{ height: '30px' }}></div>
        }
    </div>);
}

export default MilestoneTag;