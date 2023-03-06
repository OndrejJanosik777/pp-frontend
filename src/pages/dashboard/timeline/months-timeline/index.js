import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import MonthCell from './monthCell';
import moment from 'moment';

// startDate, endDate
const MonthTimeLine = (props) => {
    const [months, setMonths] = useState([]);
    const [intervals, setIntervals] = useState('')
    const [paddingLeft, setPaddingLeft] = useState(0);

    useEffect(() => {
        let startingMonth = props.startDate.format('M');
        let endingMonth = props.endDate.format('M');
        let normalizedEndDate = props.endDate.format('YYYY-MM');
        let normalizedStartDate = props.startDate.format('YYYY-MM');
        let monthsDifference = moment(normalizedEndDate).diff(moment(normalizedStartDate), 'months') + 1;

        // if (parseInt(startingMonth) > parseInt(endingMonth)) {
        //     monthsDifference = endingMonth - startingMonth + 1 + 12;
        // }
        // else {
        //     monthsDifference = endingMonth - startingMonth + 1;
        // }

        // console.log('starting date: ', moment(props.startDate.format('YYYY-MM')));
        // console.log('ending date: ', props.endDate.format('YYYY-MM'));
        // console.log('new monthdifference: ', props.endDate.diff(props.startDate, 'months') + 2);

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
        // console.log('_months: ', _months);
        // console.log('_intervals: ', _intervals);
        setMonths([..._months]);
        setIntervals(_intervals);

    }, [props.startDate]);

    const monthTimeLineStyle = {
        color: 'green',
        display: 'grid',
        gridTemplateColumns: `${intervals}`,
        paddingLeft: `${paddingLeft}rem`,
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