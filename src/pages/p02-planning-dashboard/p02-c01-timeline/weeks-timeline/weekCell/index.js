import React, { Component } from 'react';
import styled from 'styled-components';

// label
const WeekCell = (props) => {

    const componentStyle = {
        border: '1px solid black',
        width: '100%',
        height: '2rem',
        display: 'flex',
        fontSize: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }

    return (<div style={componentStyle}>
        <div>KW{props.label}</div>
    </div>);
}

export default WeekCell;