import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import WeekCell from './weekCell';
import './index.scss';

const Timeline = (props) => {
    const [loaded, setLoaded] = useState([]);
    // const [startingDay, setStartingDay] = useState(moment().add(props.dateOffset))
    const [weekOffset, setWeekOffset] = useState(5);
    const [visibleWeeks, setVisibleWeeks] = useState([]);
    const [dates, setDates] = useState([])

    useEffect(() => {
        console.log('component Timeline loaded/updated')

        let _dates = [];
        let date_now = moment().add(props.dateOffset, 'days');

        for (let i = 0; i < 100; i++) {
            let dd = moment().add(i + props.dateOffset, 'days').format("D");
            _dates.push(dd);
        }

        let _isoWeekDay = moment().add(props.dateOffset).isoWeekday();
        // console.log('_isoWeekDay: ', _isoWeekDay);

        console.log(`props.dateOffset: ${props.dateOffset}`);
        console.log(`date_now: ${date_now}`);
        console.log(`date_now.isoWeekday(): ${date_now.isoWeekday()}`);
        console.log(`date_now.isoWeeks(): ${date_now.isoWeeks()}`);

        let daysToNextKW = 8 - date_now.isoWeekday();
        let nextKWNumber = date_now.isoWeeks() + 1;

        // do correction if (7)
        if (daysToNextKW === 7) {
            daysToNextKW = 0;
            nextKWNumber = date_now.isoWeeks();
        }

        let weeksCount = Math.floor((props.displayLimit - daysToNextKW) / 7);

        console.log(`daysToNextKW: ${daysToNextKW}`);
        console.log(`nextKWNumber: ${nextKWNumber}`);
        console.log(`weeksCount: ${weeksCount}`);

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

    const WeekTimeLine = styled.strong`
        color: green;
        display: flexbox;
        // grid-template-columns: repeat(2, 7rem);
        padding-left: ${weekOffset + 5}rem;
        position: relative;
        font-size: 0.5rem;
        align-items: center;
    `

    return (<div>
        <DayTimeLine>
            <div></div>
            {dates.map((day) => {
                return <DayCell key={Math.random() * 100000}>{day}</DayCell>;
            })}
            <div></div>
        </DayTimeLine>
        <WeekTimeLine>
            {visibleWeeks.map((weekNumber) => {
                return <WeekCell key={Math.random() * 100000} weekNumber={weekNumber} />
            })}
            {/* <WeekCell weekNumber={9} /> */}
            {/* <WeekCell weekNumber={10} /> */}
        </WeekTimeLine>
    </div>);
}

export default Timeline;