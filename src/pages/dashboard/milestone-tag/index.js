import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

const MilestoneTag = (props) => {
    const [loaded, setLoaded] = useState([]);
    const [leftOffset, setLeftOffset] = useState(0);
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        let date_now = moment().add(props.dateOffset, 'days');
        let eventDate = moment(props.milestoneItem.date);
        let difference = eventDate.diff(date_now, "days");

        if (date_now.year() <= eventDate.year() && date_now.dayOfYear() < eventDate.dayOfYear()) {
            difference = difference + 1;
        }

        // console.log('KW: ', moment('2023-02-13').isoWeek());            // week starting with Monday
        // console.log('Weekday: ', moment('2023-02-13').isoWeekday());    // week starting with Monday

        if (difference >= 0 && difference < props.displayLimit - 1) {
            setVisible(true);
            setLeftOffset(difference);
        }



    }, [loaded, props.dateOffset]);

    const TagStyle = {
        paddingLeft: `${leftOffset}rem`
    }

    return (<div>
        {visible ?
            <div style={TagStyle}>
                <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top!!">
                    {props.milestoneItem.milestone_item_type.short_name}
                    {/* test */}
                </button>
            </div>
            :
            <div></div>
        }
    </div>);
}

export default MilestoneTag;