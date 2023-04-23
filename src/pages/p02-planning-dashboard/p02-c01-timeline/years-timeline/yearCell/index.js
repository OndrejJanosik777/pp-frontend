import React, { Component } from 'react';
import styled from 'styled-components';

const WeekCellComponent = styled.div`
    border: 1px solid black;
    width: 100%;
    height: 2rem;
    display: flex;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`

// label
const YearCell = (props) => {

    return (<div>
        <WeekCellComponent>{props.label}</WeekCellComponent>
    </div>);
}

export default YearCell;