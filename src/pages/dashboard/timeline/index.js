import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import './index.scss';

const Timeline = (props) => {
    const [loaded, setLoaded] = useState([]);
    // const [startingDay, setStartingDay] = useState(moment().add(props.dateOffset))
    const [weekOffset, setWeekOffset] = useState(5);
    const [dates, setDates] = useState([])

    useEffect(() => {
        // console.log('component Timeline loaded/updated')
        let _dates = [];

        for (let i = 0; i < 100; i++) {
            let dd = moment().add(i + props.dateOffset, 'days').format("D");
            _dates.push(dd);
        }

        let _isoWeekDay = moment().add(props.dateOffset).isoWeekday();
        // console.log('_isoWeekDay: ', _isoWeekDay);

        if (_isoWeekDay !== 1) {

            // console.log('offset: ', 5 + 8 - _isoWeekDay);
            setWeekOffset(5 + 8 - _isoWeekDay);
        }

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
        display: grid;
        grid-template-columns: repeat(2, 7rem);
        padding-left: ${9}rem;
        position: relative;
        font-size: 0.5rem;
        align-items: center;
    `

    const WeekCell = styled.div`
        border: 1px solid black;
        width: 7rem;
        height: 2rem;
        display: flex;
        font-size: 1rem;
        justify-content: center;
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
            <WeekCell>KW</WeekCell>
        </WeekTimeLine>
    </div>);
}

export default Timeline;