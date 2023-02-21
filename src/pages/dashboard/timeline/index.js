import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import MonthTimeLine from './months-timeline';
import WeeksTimeLine from './weeks-timeline';
import DaysTimeLine from './days-timeline';
import './index.scss';

//dateOffset, displayLimit
const Timeline = (props) => {
    const [loaded, setLoaded] = useState([]);
    // const [startingDay, setStartingDay] = useState(moment().add(props.dateOffset))
    const [weekOffset, setWeekOffset] = useState(5);
    const [visibleWeeks, setVisibleWeeks] = useState([]);
    const [dates, setDates] = useState([])

    useEffect(() => {
        console.log('---------------------------------')
        console.log('*** COMPONENT TIMELINE LOADED ***')
        console.log('---------------------------------')

        let _dates = [];
        let startDate = moment().add(props.dateOffset, 'days');
        // console.log(`startDate: ${startDate}`);
        let endDate = moment().add(props.dateOffset + props.displayLimit - 1, 'days');
        // console.log(`endDate: ${endDate}`);


        let startDay = startDate.format('D')
        // console.log(`startDay: ${startDay}`);
        let startWeek = startDate.format('WW')
        // console.log(`startWeek: ${startWeek}`);
        let startMonth = startDate.format('MMMM')
        // console.log(`startMonth: ${startMonth}`);
        let startYear = startDate.format('YYYY')
        // console.log(`startYear: ${startYear}`);
        let dayInMonths = startDate.daysInMonth();
        // console.log(`dayInMonths: ${dayInMonths}`);

        for (let i = 0; i < 100; i++) {
            let dd = moment().add(i + props.dateOffset, 'days').format("D");
            _dates.push(dd);
        }

        let _isoWeekDay = moment().add(props.dateOffset).isoWeekday();
        // console.log('_isoWeekDay: ', _isoWeekDay);

        // console.log(`props.dateOffset: ${props.dateOffset}`);
        // console.log(`props.displayLimit: ${props.displayLimit}`);

        // console.log(`date_now.isoWeekday(): ${startDate.isoWeekday()}`);
        // console.log(`date_now.isoWeeks(): ${startDate.isoWeeks()}`);

        let daysToNextKW = 8 - startDate.isoWeekday();
        let nextKWNumber = startDate.isoWeeks() + 1;

        // do correction if (7)
        if (daysToNextKW === 7) {
            daysToNextKW = 0;
            nextKWNumber = startDate.isoWeeks();
        }

        let weeksCount = Math.floor((props.displayLimit - daysToNextKW) / 7);

        // console.log(`daysToNextKW: ${daysToNextKW}`);
        // console.log(`nextKWNumber: ${nextKWNumber}`);
        // console.log(`weeksCount: ${weeksCount}`);

        let KWNumbers = [];

        for (let i = 0; i < weeksCount; i++) {
            KWNumbers.push(nextKWNumber + i);
        }

        setVisibleWeeks([...KWNumbers])
        setWeekOffset(daysToNextKW);
        setDates([..._dates]);

    }, [loaded, props.dateOffset]);

    const DayTimeLine = styled.strong`
        color: red;
        display: grid;
        grid-template-columns: 5rem repeat(100, 1rem) 5rem;
        position: relative;
        font-size: 0.5rem;
        align-items: center;
    `
    const DayCell = styled.div`
        border: 1px solid black;
        width: 1rem;
        height: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
    `
    return (<div>
        {/* <DayTimeLine>
            <div></div>
            {dates.map((day) => {
                return <DayCell key={Math.random() * 100000}>{day}</DayCell>;
            })}
            <div></div>
        </DayTimeLine> */}
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
    </div>);
}

export default Timeline;