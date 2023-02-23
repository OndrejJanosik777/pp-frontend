import React, { Component } from 'react';
import { useState } from 'react';
import './index.scss';

//project, text, action
const DeleteWarning = (props) => {
    const [name, setName] = useState('');
    const [shortName, setShortName] = useState('');
    const [number, setNumber] = useState('');
    const [showSpinnerDelete, setShowSpinnerDelete] = useState(false);

    const activateAction = () => {
        setShowSpinnerDelete(true);

        props.action();
    }

    return (<div className='delete-warning'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4'>{props.text}</div>
            <div className='text-center fs-4'>{props.project.name}</div>
            <div className='actions'>
                {showSpinnerDelete ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                    :
                    <button type="button" className="btn btn-danger close" onClick={activateAction}>DELETE</button>
                }
                <button type="button" className="btn btn-primary close" onClick={props.toogleVisibility}>CANCEL</button>
            </div>
        </div>
    </div>);
}

export default DeleteWarning;