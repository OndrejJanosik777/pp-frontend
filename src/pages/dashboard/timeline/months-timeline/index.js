import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import MonthCell from './monthCell';
import moment from 'moment';

// startDate, endDate
const MonthTimeLine = (props) => {
    const [loaded, setLoaded] = useState([]);
    const [months, setMonths] = useState([]);
    const [intervals, setIntervals] = useState('')

    useEffect(() => {
        let startingMonth = props.startDate.format('M');
        let endingMonth = props.endDate.format('M');

        let monthsDifference = endingMonth - startingMonth + 1;

        let startDay = props.startDate.format('D');
        let endDay = props.endDate.format('D');

        let _months = [];


        for (let i = 0; i < monthsDifference; i++) {
            let _month = moment().month(parseInt(startingMonth) + i - 1).format('MMMM');
            _months.push(_month);
        }

        let _intervals = '';

        for (let i = 0; i < monthsDifference; i++) {
            let _month = moment().month(parseInt(startingMonth) + i - 1);

            if (i === 0) {
                _intervals = _intervals + `${_month.daysInMonth() - startDay + 1}rem `;
            }
            else if (i === monthsDifference - 1) {
                _intervals = _intervals + `${endDay}rem`;
            }
            else {
                _intervals = _intervals + `${_month.daysInMonth()}rem `;
            }
        }

        setMonths([..._months]);
        setIntervals(_intervals);

    }, [loaded, props.startDate]);

    const MonthContainer = styled.div`
        color: green;
        display: grid;
        grid-template-columns: ${intervals};
        padding-left: ${5}rem;
        position: relative;
        font-size: 0.5rem;
        align-items: center;
    `

    return (<MonthContainer>
        {months.map((month) => {
            return <MonthCell key={Math.random() * 100000} label={month} />
        })}
    </MonthContainer>);
}

export default MonthTimeLine;