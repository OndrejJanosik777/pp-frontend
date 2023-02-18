import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

const MilestoneTag = (props) => {
    const [loaded, setLoaded] = useState([]);
    const [leftOffset, setLeftOffset] = useState(0);
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // console.log('component Milestonetag loaded/updated')

        let date_now = moment().add(props.dateOffset, 'days');
        let eventDate = moment(props.milestoneItem.date);
        let difference = eventDate.diff(date_now, "days");

        // console.log('difference: ', difference);
        // console.log('KW: ', moment('2023-02-13').isoWeek());            // week starting with Monday
        // console.log('Weekday: ', moment('2023-02-13').isoWeekday());    // week starting with Monday

        if (difference >= 0 && difference < props.displayLimit - 1) {
            setVisible(true);
            setLeftOffset(difference + 1);
        }



    }, [loaded, props.dateOffset]);

    const Tag = styled.strong`
    padding-left: ${leftOffset}rem
    `

    return (<div>
        {visible ?
            <Tag>
                <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top!!">
                    {props.milestoneItem.milestone_item_type.short_name}
                    {/* test */}
                </button>
            </Tag>
            :
            <div></div>
        }
    </div>);
}

export default MilestoneTag;