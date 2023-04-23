import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import WeekCell from './weekCell';
import moment from 'moment';

// startDate, endDate
const WeeksTimeLine = (props) => {
    const [loaded, setLoaded] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [intervals, setIntervals] = useState('');
    const [paddingLeft, setPaddingLeft] = useState(0);

    useEffect(() => {
        let startingWeek = props.startDate.isoWeek();
        let endingWeek = props.endDate.isoWeek();

        let numberOfWeeks = 0;

        if (startingWeek > endingWeek) {
            numberOfWeeks = endingWeek - startingWeek + 1 + 52;
        }
        else {
            numberOfWeeks = endingWeek - startingWeek + 1;
        }

        let startDay = props.startDate.isoWeekday();
        let endDay = props.endDate.isoWeekday();

        let _weeks = [];

        for (let i = 0; i < numberOfWeeks; i++) {
            let _week = moment().week(parseInt(startingWeek) + i).isoWeek();
            _weeks.push(_week);
        }

        let _intervals = '';

        for (let i = 0; i < numberOfWeeks; i++) {
            let _month = moment().week(parseInt(startingWeek) + i);

            if (i === 0) {
                _intervals = _intervals + `${7 - startDay + 1}rem `;
            }
            else if (i === numberOfWeeks - 1) {
                _intervals = _intervals + `${endDay}rem`;
            }
            else {
                _intervals = _intervals + `${7}rem `;
            }
        }

        setWeeks([..._weeks]);
        setIntervals(_intervals);

    }, [loaded, props.startDate]);

    const weeksTimeLineStyle = {
        color: 'green',
        display: 'grid',
        gridTemplateColumns: `${intervals}`,
        paddingLeft: `${paddingLeft}rem`,
        position: 'relative',
        fontSize: '0.5rem',
        alignItems: 'center',
    }

    return (<div style={weeksTimeLineStyle}>
        {weeks.map((week) => {
            return <WeekCell key={Math.random() * 100000} label={week} />
        })}
    </div>);
}

export default WeeksTimeLine;