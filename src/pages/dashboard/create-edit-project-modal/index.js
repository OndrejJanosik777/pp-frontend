import React, { Component } from 'react';
import { useState } from 'react';
import axios from 'axios';
import './index.scss';

const CreateEditProjectModal = (props) => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [name, setName] = useState(props.project.name ? props.project.name : "");
    const [shortName, setShortName] = useState(props.project.short_name ? props.project.short_name : "");
    const [number, setNumber] = useState(props.project.number ? props.project.number : "");
    const [showSpinnerCreateProject, setShowSpinnerCreateProject] = useState(false);

    const createNewProject = () => {
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

    const updateNewProject = () => {
        if (name !== "" && shortName !== "" && number !== "") {
            setShowSpinnerCreateProject(true);

            axios({
                method: 'put',
                url: baseUrl + `/company/project/${props.project.id}/`,
                headers: {
                    "Authorization": token
                },
                data: {
                    name: name,
                    number: number,
                    short_name: shortName,
                    // milestone_items: [],
                    // monuments: []
                }
            })
                .then((response => {
                    // console.log("projects created sucessfully");
                    props.updateProject(response.data);
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

    return (<div className='create-edit-project-modal'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4'>{props.project.name !== undefined ? `Updating: ${props.project.name}` : 'NEW PROJECT'}</div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="project_name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">name</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="project_number" value={number} onChange={(e) => setNumber(e.target.value)} />
                <label htmlFor="name">number</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="project_shortName" value={shortName} onChange={(e) => setShortName(e.target.value)} />
                <label htmlFor="name">short name</label>
            </div>
            <div className='actions'>
                {showSpinnerCreateProject ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                    :
                    <button
                        type="button"
                        className="btn btn-primary close"
                        onClick={props.project.name !== undefined ? updateNewProject : createNewProject}>
                        {props.project.name !== undefined ? 'UPDATE' : 'CREATE'}
                    </button>
                }
                <button
                    type="button"
                    className="btn btn-danger close"
                    onClick={props.toogleVisibility}>
                    CANCEL
                </button>
            </div>
        </div>
    </div>);
}

export default CreateEditProjectModal;