import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import YearCell from './yearCell';
import moment from 'moment';

// startDate, endDate
const YearsTimeLine = (props) => {
    const [loaded, setLoaded] = useState([]);
    const [years, setYears] = useState(['2021']);
    const [intervals, setIntervals] = useState('100rem')

    useEffect(() => {
        let startingYear = props.startDate.format('YYYY');
        let endingYear = props.endDate.format('YYYY');

        let numberOfYears = endingYear - startingYear + 1;

        let _years = [];
        let startingDayOfYear = props.startDate.dayOfYear();
        let middlePoint = moment(`${startingYear}-12-31`).dayOfYear();
        let endingDayOfYear = props.endDate.dayOfYear();

        for (let i = 0; i < numberOfYears; i++) {
            let _year = moment().year(parseInt(startingYear) + i).format('YYYY');
            _years.push(_year);
        }

        let _intervals = '';

        for (let i = 0; i < numberOfYears; i++) {
            let _month = moment().week(parseInt(startingYear) + i);

            if (i === 0) {
                _intervals = _intervals + `${middlePoint - startingDayOfYear + 1}rem `;
            }
            else if (i === numberOfYears - 1) {
                _intervals = _intervals + `${endingDayOfYear}rem`;
            }
            else {
                _intervals = _intervals + `${7}rem `;
            }
        }

        setYears([..._years]);
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
        {years.map((week) => {
            return <YearCell key={Math.random() * 100000} label={week} />
        })}
    </WeeksContainer>);
}

export default YearsTimeLine;