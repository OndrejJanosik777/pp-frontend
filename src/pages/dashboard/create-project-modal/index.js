import React, { Component } from 'react';
import { useState } from 'react';
import axios from 'axios';
import './index.scss';

const CreateProjectModal = (props) => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [name, setName] = useState('');
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [shortName, setShortName] = useState('');
    const [number, setNumber] = useState('');
    const [showSpinnerCreateProject, setShowSpinnerCreateProject] = useState(false);

    const checkInputData = () => {
        if (name !== "" && shortName !== "" && number !== "") {
            setShowSpinnerCreateProject(true);

            axios({
                method: 'post',
                url: baseUrl + '/company/project/',
                headers: {
                    "Authorization": token
                },
                data: {
                    name: name,
                    number: number,
                    short_name: shortName,
                    milestone_items: [],
                    monuments: []
                }
            })
                .then((response => {
                    // console.log("projects created sucessfully");
                    props.addNewProject(response.data);
                    setShowSpinnerCreateProject(false);
                }))
                .catch((error) => {
                    console.log(error);

                    alert('problem with creating project')
                })

        }
        else {
            alert('Invalid Data');
        }
    }

    return (<div className='project-info'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4'>NEW PROJECT</div>
            <div className="form-floating mb-3">
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
            </div>
            <div className='actions'>
                {showSpinnerCreateProject ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                    :
                    <button type="button" className="btn btn-primary close" onClick={checkInputData}>CREATE</button>
                }
                <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
            </div>
        </div>
    </div>);
}

export default CreateProjectModal;