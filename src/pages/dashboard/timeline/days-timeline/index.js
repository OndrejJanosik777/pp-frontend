import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import DayCell from './dayCell';
import moment from 'moment';

// startDate, endDate
const DaysTimeLine = (props) => {
    const [loaded, setLoaded] = useState([]);
    const [days, setDays] = useState([]);
    const [intervals, setIntervals] = useState('')

    useEffect(() => {
        // console.log('---------------------------------------');
        // console.log('*** COMPONENT WEEKS-TIMELINE LOADED ***');
        // console.log('---------------------------------------');
        // console.log('props.startDate: ', props.startDate);
        // console.log('props.endDate: ', props.endDate);

        let startingDay = props.startDate.format('D');
        let endingDay = props.endDate.format('D');
        // console.log('startingDay: ', startingDay);
        // console.log('endingDay: ', endingDay);

        // let numberOfDays = endingDay - startingDay + 1;
        let numberOfDays = props.endDate.diff(props.startDate, 'days') + 1;
        // console.log('numberOfDays: ', numberOfDays);

        let _days = [];

        props.startDate.subtract(1, 'days');

        for (let i = 0; i < numberOfDays; i++) {
            let _day = props.startDate.add(1, 'days').format('D');
            // console.log('day: ', _day);
            _days.push(_day);
        }

        let _intervals = '';

        for (let i = 0; i < numberOfDays; i++) {
            _intervals = _intervals + `${1}rem `;
        }

        // console.log('_days: ', _days);
        // console.log('_intervals: ', _intervals);
        setDays([..._days]);
        setIntervals(_intervals);

    }, [loaded, props.startDate]);

    const WeeksContainer = styled.div`
        color: green;
        display: grid;
        grid-template-columns: ${intervals};
        padding-left: ${5}rem;
        position: relative;
        font-size: 0.5rem;
        align-items: center;
    `

    return (<WeeksContainer>
        {days.map((day) => {
            return <DayCell key={Math.random() * 100000} label={day} />
        })}
    </WeeksContainer>);
}

export default DaysTimeLine;