import React, { Component } from 'react';
import styled from 'styled-components';

// label
const DayCell = (props) => {
    const DayCellComponent = styled.div`
    border: 1px solid black;
    width: 100%;
    height: 1rem;
    display: flex;
    font-size: 0.5rem;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`

    return (<div>
        <DayCellComponent>{props.label}</DayCellComponent>
    </div>);
}

export default DayCell;