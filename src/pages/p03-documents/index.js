import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import './index.scss';
// import tempProjects from './data';
// components
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
import axios from 'axios';

const tempBackend = require('./data');

const P03_DOCUMENTS = () => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [extendedSideBar, set_extendedSideBar] = useState(false);
    const [documents, set_documents] = useState([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const showState = () => {
        console.log('documents: ', documents);
    }

    const fetchDocuments = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/get-documents-detailed/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            console.log("documents loadded sucessfully", response.data);
    
            // let newProject = {...response.data, displayed: true};
    
            // let updatedProjects = [...projects, newProject];
    
            set_documents(response.data);
    
            // props.set_projects(updatedProjects);
    
            // set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    return ( <div className='p03-documents'>
        <C01_NAVBAR />
        <C02_SIDEBAR extendedSideBar={extendedSideBar} set_extendedSideBar={set_extendedSideBar} />
        <div className='p03-center-section'>
            <div className='p03-main-section' id='main-section' name='main-section'>
                <div className='p03-content'>
                    <table className='p03-table-01'>
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Monument</th>
                                <th onClick={() => showState()}>Certification Document</th>
                            </tr>
                        </thead>
                    </table>
                    <table className='p03-table-02'>
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Name</th>
                                <th>Number</th>
                                <th>Name</th>
                                <th>Number</th>
                                <th>Name</th>
                                <th>Rev.</th>
                                <th>Status</th>
                                <th>Status Updated</th>
                                <th>Deadline</th>
                                <th>Responsible</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((document) => {
                                return <tr key={Math.random() * 100000}>
                                    {/* <td><input type='checkbox' checked={project.displayed} onChange={() => checkboxChanged(project)} /></td> */}
                                    <td>{document.project_number[0]}</td>
                                    <td>{document.project_name[0]}</td>
                                    <td>{document.monument_numbers}</td>
                                    <td>{document.monument_names}</td>
                                    <td>{document.number}</td>
                                    <td>{document.name}</td>
                                    <td>{document.revision}</td>
                                    <td>{document.status}</td>
                                    <td>{document.last_change}</td>
                                    <td>{document.deadline}</td>
                                    <td>{document.responsible}</td>
                                    <td>{document.comment}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div> );
}
 
export default P03_DOCUMENTS;