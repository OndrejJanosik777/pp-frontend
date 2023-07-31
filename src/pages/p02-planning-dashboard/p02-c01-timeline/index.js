import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import moment from 'moment';
import YearsTimeLine from './years-timeline';
import MonthTimeLine from './months-timeline';
import WeeksTimeLine from './weeks-timeline';
import DaysTimeLine from './days-timeline';
import { useSelector, useDispatch } from 'react-redux';
import './index.scss';

//dateOffset, displayLimit
const P02_C01_TIMELINE = (props) => {


    useEffect(() => {
        // console.log('timeline created...');
        // console.log('box width: ', props.box.clientWidth);
    }, []);

    return (<div>
        <DaysTimeLine
            startDate={moment().add(useSelector(state => state.dashboard.dateOffset), 'days')}
            endDate={moment().add(
                useSelector(state => state.dashboard.dateOffset) + 
                useSelector(state => state.dashboard.displayedDays) - 1, 'days')}
        />
        <WeeksTimeLine
            startDate={moment().add(useSelector(state => state.dashboard.dateOffset), 'days')}
            endDate={moment().add(
                useSelector(state => state.dashboard.dateOffset) + 
                useSelector(state => state.dashboard.displayedDays) - 1, 'days')}
        />
        <MonthTimeLine
            startDate={moment().add(useSelector(state => state.dashboard.dateOffset), 'days')}
            endDate={moment().add(
                useSelector(state => state.dashboard.dateOffset) + 
                useSelector(state => state.dashboard.displayedDays) - 1, 'days')}
        />
        <YearsTimeLine
            startDate={moment().add(useSelector(state => state.dashboard.dateOffset), 'days')}
            endDate={moment().add(
                useSelector(state => state.dashboard.dateOffset) + 
                useSelector(state => state.dashboard.displayedDays) - 1, 'days')}
        />
    </div>);
}

export default P02_C01_TIMELINE;