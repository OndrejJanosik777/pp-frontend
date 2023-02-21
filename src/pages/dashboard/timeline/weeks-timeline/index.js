import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import WeekCell from './weekCell';
import moment from 'moment';

// startDate, endDate
const WeeksTimeLine = (props) => {
    const [loaded, setLoaded] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [intervals, setIntervals] = useState('')

    useEffect(() => {
        // console.log('---------------------------------------');
        // console.log('*** COMPONENT WEEKS-TIMELINE LOADED ***');
        // console.log('---------------------------------------');
        // console.log('props.startDate: ', props.startDate);
        // console.log('props.endDate: ', props.endDate);

        let startingWeek = props.startDate.isoWeek();
        let endingWeek = props.endDate.isoWeek();
        // console.log('startingWeek: ', startingWeek);
        // console.log('endingWeek: ', endingWeek);

        let numberOfWeeks = endingWeek - startingWeek + 1;
        // console.log('numberOfWeeks: ', numberOfWeeks);

        let startDay = props.startDate.isoWeekday();
        let endDay = props.endDate.isoWeekday();
        // console.log('startDay (isoWeekday()): ', startDay);
        // console.log('endDay (isoWeekday()): ', endDay);

        let _weeks = [];

        for (let i = 0; i < numberOfWeeks; i++) {
            let _week = moment().week(parseInt(startingWeek) + i).isoWeek();
            console.log('week: ', _week);
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

        // console.log('_weeks: ', _weeks);
        // console.log('_intervals: ', _intervals);
        setWeeks([..._weeks]);
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
        {weeks.map((week) => {
            return <WeekCell key={Math.random() * 100000} label={week} />
        })}
    </WeeksContainer>);
}

export default WeeksTimeLine;