import React, { Component } from 'react';
import { useState, useEffect } from 'react';
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
        console.log('startingMonth: ', startingMonth);
        console.log('endingMonth: ', endingMonth);

        let monthsDifference = 0;

        if (parseInt(startingMonth) > parseInt(endingMonth)) {
            monthsDifference = endingMonth - startingMonth + 1 + 12;
        }
        else {
            monthsDifference = endingMonth - startingMonth + 1;
        }

        console.log('monthsDifference: ', monthsDifference);

        let startDay = props.startDate.format('D');
        let endDay = props.endDate.format('D');

        let _months = [];


        for (let i = 0; i < monthsDifference; i++) {
            let _month = moment().month(parseInt(startingMonth) + i - 1).format('MMMM');
            _months.push(_month);
        }

        let _intervals = '';

        for (let i = 0; i < monthsDifference; i++) {
            let _month = moment(props.startDate.format('YYYY')).month(parseInt(startingMonth) + i - 1);

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

    const monthTimeLineStyle = {
        color: 'green',
        display: 'grid',
        gridTemplateColumns: `${intervals}`,
        paddingLeft: `${5}rem`,
        position: 'relative',
        fontSize: '0.5rem',
        alignItems: 'center',
    }

    return (<div style={monthTimeLineStyle}>
        {months.map((month) => {
            return <MonthCell key={Math.random() * 100000} label={month} />
        })}
    </div>);
}

export default MonthTimeLine;