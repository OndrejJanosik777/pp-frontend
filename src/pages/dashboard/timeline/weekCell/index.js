import React, { Component } from 'react';
import styled from 'styled-components';

const WeekCell = (props) => {
    const WeekCellComponent = styled.div`
    border: 1px solid black;
    width: 7rem;
    height: 2rem;
    // margin-left: ${props.paddingLeft}rem;
    display: flex;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
`

    return (<div>
        <WeekCellComponent>KW {props.weekNumber}</WeekCellComponent>
    </div>);
}

export default WeekCell;