import React, { Component } from 'react';
import { useState } from 'react';
import './index.scss';

//project, text, action
const DeleteWarning = (props) => {
    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [number, setNumber] = useState('');

    const checkInputData = () => {
        // if (name !== "" && shortName !== "" && number !== "") {
        //     props.createNewProject(name, shortName, number);
        // }
        // else {
        //     alert('Invalid Data');
        // }
    }

    return (<div className='delete-warning'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4'>{props.text}</div>
            <div className='text-center fs-4'>{props.project.name}</div>
            {/* <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">name</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" value={number} onChange={(e) => setNumber(e.target.value)} />
                <label htmlFor="name">number</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" value={shortName} onChange={(e) => setShortName(e.target.value)} />
                <label htmlFor="name">short name</label>
            </div> */}
            <div className='actions'>
                <button type="button" className="btn btn-danger close" onClick={props.action}>DELETE</button>
                <button type="button" className="btn btn-primary close" onClick={props.toogleVisibility}>CANCEL</button>
            </div>
        </div>
    </div>);
}

export default DeleteWarning;