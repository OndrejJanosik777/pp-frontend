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
            console.log(error);
    
            alert('problem with fetching documents')
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
                                <th>Certification Document</th>
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
                                <th>Last Change</th>
                                <th>Deadline</th>
                                <th>Responsible</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((project) => {
                                return <tr key={Math.random() * 100000}>
                                    {/* <td><input type='checkbox' checked={project.displayed} onChange={() => checkboxChanged(project)} /></td> */}
                                    <td>{project.project_number[0]}</td>
                                    <td>{project.project_name[0]}</td>
                                    <td>{project.monument_numbers}</td>
                                    <td>{project.monument_names}</td>
                                    <td>{project.number}</td>
                                    <td>{project.name}</td>
                                    <td>{project.revision}</td>
                                    <td>{project.status}</td>
                                    <td>{project.last_change}</td>
                                    <td>{project.deadline}</td>
                                    <td>{project.responsible}</td>
                                    <td>{project.comment}</td>
                                    
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