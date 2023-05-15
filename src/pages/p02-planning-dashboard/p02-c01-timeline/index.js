import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import moment from 'moment';
import YearsTimeLine from './years-timeline';
import MonthTimeLine from './months-timeline';
import WeeksTimeLine from './weeks-timeline';
import DaysTimeLine from './days-timeline';
import './index.scss';

//dateOffset, displayLimit
const P02_C01_TIMELINE = (props) => {


    useEffect(() => {
        console.log('timeline created...');
        // console.log('box width: ', props.box.clientWidth);
    }, []);

    return (<div>
        <DaysTimeLine
            startDate={moment().add(props.dateOffset, 'days')}
            endDate={moment().add(props.dateOffset + props.displayLimit - 1, 'days')}
        />
        <WeeksTimeLine
            startDate={moment().add(props.dateOffset, 'days')}
            endDate={moment().add(props.dateOffset + props.displayLimit - 1, 'days')}
        />
        <MonthTimeLine
            startDate={moment().add(props.dateOffset, 'days')}
            endDate={moment().add(props.dateOffset + props.displayLimit - 1, 'days')}
        />
        <YearsTimeLine
            startDate={moment().add(props.dateOffset, 'days')}
            endDate={moment().add(props.dateOffset + props.displayLimit - 1, 'days')}
        />
    </div>);
}

export default P02_C01_TIMELINE;