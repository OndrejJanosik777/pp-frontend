import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import './index.scss';

const PLAYGROUND_03 = () => {

    // loading the component
    useEffect(() => {
        // fetch employee data for drop down menu
        console.log('playground_03 loaded...');

        // const canvas = document.querySelector("canvas");
        // const ctx = canvas.getContext("2d");
        // ctx.fillStyle = "red";
        // ctx.fillRect(10, 10, 150, 100);

        const canvas = document.querySelector("canvas");
        const gl = canvas.getContext("webgl");

        if (gl === null) {
            alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
            );
            return;
        }

    }, []);

    return( <div className='PLAYGROUND_03'>
        <h1>welcome back</h1>
        <canvas className='PLAYGROUND_03_CANVAS'></canvas>
    </div>

    );
}

export default PLAYGROUND_03;