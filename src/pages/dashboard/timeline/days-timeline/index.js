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
        let numberOfDays = props.endDate.diff(props.startDate, 'days') + 1;

        let _days = [];

        props.startDate.subtract(1, 'days');

        for (let i = 0; i < numberOfDays; i++) {
            let _day = props.startDate.add(1, 'days').format('D');
            _days.push(_day);
        }

        let _intervals = '';

        for (let i = 0; i < numberOfDays; i++) {
            _intervals = _intervals + `${1}rem `;
        }

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