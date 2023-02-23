import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import DayCell from './dayCell';

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

    const daysTimeLineStyle = {
        color: 'green',
        display: 'grid',
        gridTemplateColumns: `${intervals}`,
        paddingLeft: `${5}rem`,
        position: 'relative',
        fontSize: '0.5rem',
        alignItems: 'center',
    }

    return (<div style={daysTimeLineStyle}>
        {days.map((day) => {
            return <DayCell key={Math.random() * 100000} label={day} />
        })}
    </div>);
}

export default DaysTimeLine;