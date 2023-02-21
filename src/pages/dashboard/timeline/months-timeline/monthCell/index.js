import React, { Component } from 'react';
import styled from 'styled-components';

// label
const MonthCell = (props) => {
    const MonthCellComponent = styled.div`
    border: 1px solid black;
    width: 100%;
    height: 2rem;
    display: flex;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`

    return (<div>
        <MonthCellComponent>{props.label}</MonthCellComponent>
    </div>);
}

export default MonthCell;