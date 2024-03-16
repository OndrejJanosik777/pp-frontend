import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './index.scss';
// import tempProjects from './data';
// components
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
import C03_FILTER from '../../components/c03-filter';
import axios from 'axios';
import moment from 'moment';
import * as documentsActions from '../../app/features/documentsSlice';

const tempBackend = require('./data');

const P03_DOCUMENTS = () => {
    const dispatch = useDispatch();
 
    // pick the data from the redux store
    let baseUrl = useSelector(state => state.api.baseUrl);

    // local state of component
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [extendedSideBar, set_extendedSideBar] = useState(false);
    // fetched documents already filtered and sorted
    const [documents, set_documents] = useState([...useSelector(state => state.documents.documents)]);
        // arrays to track filters
    const [projectNumber_filter, set_projectNumber_filter] = useState([...useSelector(state => state.documents.projectNumber_filter)]);
    const [milestoneType_filter, set_milestoneType_filter] = useState([...useSelector(state => state.documents.milestoneType_filter)]);
    const [certificationDocument_deadline_from, set_certificationDocument_deadline_from] = useState(useSelector(state => state.documents.certificationDocument_deadline_from));
    const [certificationDocument_deadline_to, set_certificationDocument_deadline_to] = useState(useSelector(state => state.documents.certificationDocument_deadline_to));
    const [certificationDocument_status, set_certificationDocument_status] = useState([...useSelector(state => state.documents.certificationDocument_status)]);
    const [certificationDocument_author, set_certificationDocument_author] = useState([...useSelector(state => state.documents.certificationDocument_author)]);
        // arrays to 
    const [projectNumbersFilter_items, set_projectNumbersFilter_items] = useState([]);
    const [milestoneTypes, set_milestoneTypes] = useState([]);
    const [statusesFilter_items, set_statusesFilter_items] = useState([]);
    const [authors, set_authors] = useState([]);

    useEffect(() => {
        fetchDocuments();
        // dispatch(documentsActions.fetch_Documents());
    }, []);

    const showState = () => {
        console.log('documents: ', documents);
        console.log('projectNumbersFilter_items: ', projectNumbersFilter_items);
    }

    const fetchDocuments = () => {
        // dispatch(documentsActions.fetch_Documents());

        axios({
            method: 'get',
            url: baseUrl + '/company/get-documents-for-project-dashboard/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            console.log("fetched documents succesfully: ", response.data);
            
            // filter document that have not been accepted or rejected
            // sort documents according deadline 1
            let documents = response.data
                .sort((a, b) => moment(a.document_deadline) - moment(b.document_deadline))
                .filter((elem) => elem.document_acceptance_status !== "rejected" && elem.document_acceptance_status !== "accepted")
                // .filter((elem) => elem.document_acceptance_status !== "accepted")
    
            console.log("filtered documents: ", documents);

            // let newProject = {...response.data, displayed: true};
    
            // let updatedProjects = [...projects, newProject];

            // let newDocuments = [...response.data];

            // newDocuments.sort((a, b) => {
            //     let aDeadline = a.deadline;
            //     let bDeadline = b.deadline;

            //     if (aDeadline === null) aDeadline = '2999-01-01';
            //     if (bDeadline === null) bDeadline = '2999-01-01';
                
            //     return moment(aDeadline).diff(moment(bDeadline), 'days');
            // });
    
            // console.log("sorted documents: ", newDocuments);

            // console.log("test moments: ", moment('2023-06-18').diff(moment('2023-07-18'), 'days'));

            set_documents(documents);

            // dispatch all documents into state...
            // dispatch(documentsActions.set_Documents([...response.data]));
            // dispatch(documentsActions.set_Documents([...filteredDocuments]));
            // dispatch(documentsActions.set_Documents([...newDocuments]));

            // set_documents([...response.data]);

            // filterDocuments([...response.data]);

            // filterOptions([...response.data]);
    
            // props.set_projects(updatedProjects);
    
            // set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const filterOptions = (documents) => {
        // const [projectNumbers, set_projectNumbers] = useState([]);
        // const [milestoneTypes, set_milestoneTypes] = useState([]);
        // const [statuses, set_statuses] = useState([]);
        // const [authors, set_authors] = useState([]);

        let new_projectNumbers = [];
        let new_milestoneTypes = [];
        let new_statuses = [];
        let new_authors = [];

        documents.map((item) => {
            if (new_projectNumbers.findIndex(elem => elem === item.project_number) === -1) new_projectNumbers.push(item.project_number);
            if (new_milestoneTypes.findIndex(elem => elem === item.document_cmit_short_name) === -1) new_milestoneTypes.push(item.document_cmit_short_name);
            if (new_statuses.findIndex(elem => elem === item.document_acceptance_status) === -1) new_statuses.push(item.document_acceptance_status);
            if (new_authors.findIndex(elem => elem === item.document_author_username) === -1) new_authors.push(item.document_author_username);
        })

        new_projectNumbers.sort();
        new_milestoneTypes.sort();
        new_statuses.sort();
        new_authors.sort();

        console.log("new_projectNumbers: ", new_projectNumbers);
        console.log("new_milestoneTypes: ", new_milestoneTypes);
        console.log("new_statuses: ", new_statuses);
        console.log("new_authors: ", new_authors);

        set_projectNumbersFilter_items([...new_projectNumbers]);
        set_statusesFilter_items([...new_statuses]);

        set_documents([...documents]);
    }

    const filterDocuments = (documents) => {
        // funtion that will take all document from global state, filter it, sort it and save it to local state of component

        let filtered_documents = [];

        documents.map((item) => {
            if (projectNumber_filter.findIndex(elem => elem === item.project_number) !== -1) return 0;
            if (milestoneType_filter.findIndex(elem => elem === item.document_cmit_short_name) !== -1) return 0;

            if (certificationDocument_deadline_from !== undefined) {
                if (item.document_deadline_second !== null) {
                    if (moment(item.document_deadline_second).diff(moment(certificationDocument_deadline_from), 'days') < 0) return 0;
                }
                if (item.document_deadline !== null && item.document_deadline_second === null) {
                    if (moment(item.document_deadline).diff(moment(certificationDocument_deadline_from), 'days') < 0) return 0;
                }
            } 

            if (certificationDocument_deadline_to !== undefined) {
                if (item.document_deadline_second !== null) {
                    if (moment(item.document_deadline_second).diff(moment(certificationDocument_deadline_to), 'days') > 0) return 0;
                }
                if (item.document_deadline !== null && item.document_deadline_second === null) {
                    if (moment(item.document_deadline).diff(moment(certificationDocument_deadline_to), 'days') > 0) return 0;
                }
            } 

            // if (projectNumber_filter.findIndex(elem => elem === item.project_number) !== -1) return 0;
            if (certificationDocument_status.findIndex(elem => elem === item.document_acceptance_status) !== -1) return 0;
            if (certificationDocument_author.findIndex(elem => elem === item.document_author_username) !== -1) return 0;

            filtered_documents.push({...item});
        })

        set_documents(filtered_documents);
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
                                <th onClick={() => showState()}>Project</th>
                                <th>Certification Document</th>
                                <th>Milestone</th>
                                <th></th>
                            </tr>
                        </thead>
                    </table>
                    <table className='p03-table-02'>
                        <thead>
                            <tr>
                                <th>
                                    number
                                    <C03_FILTER 
                                        // items={['a', 'b', 'c', 'd', 'e']}
                                        items={[...projectNumbersFilter_items]}
                                        filteredItems={[]}
                                        set_filteredItems={() => {}}
                                    />
                                </th>
                                <th>name</th>
                                <th>id</th>
                                <th>name</th>
                                <th>number</th>
                                <th>rev.</th>
                                <th>deadline 1</th>
                                <th>deadline 2</th>
                                <th>sended on</th>
                                <th>
                                    status
                                    <C03_FILTER 
                                        items={[...statusesFilter_items]}
                                        filteredItems={[]}
                                        set_filteredItems={() => {}}
                                    />
                                </th>
                                <th>last update</th>
                                <th>comment</th>
                                <th>
                                    author
                                    <C03_FILTER 
                                        items={['a', 'b', 'c', 'd', 'e']}
                                        filteredItems={['a']}
                                        set_filteredItems={() => {}}
                                    />
                                </th>
                                <th>
                                    type
                                    <C03_FILTER 
                                        items={['a', 'b', 'c', 'd', 'e']}
                                        filteredItems={['a']}
                                        set_filteredItems={() => {}}
                                    />
                                </th>
                                <th>deadline</th>
                                {/* <th>status</th> */}
                                <th>action</th>
                            </tr>
                        </thead>
                    </table>
                    <table className='p03-table-03'>
                        <tbody>
                            {documents.map((document) => {
                                return <tr key={Math.random() * 100000}>
                                    {/* <td><input type='checkbox' checked={project.displayed} onChange={() => checkboxChanged(project)} /></td> */}
                                    <td>{document.project_number}</td>
                                    <td>{document.project_name}</td>
                                    <td>{document.document_id}</td>
                                    <td>{document.document_name}</td>
                                    <td>{document.document_number}</td>
                                    <td>{document.document_revision}</td>
                                    <td>{document.document_deadline ? moment(document.document_deadline).format("D-MMM-YYYY") : ""}</td>
                                    <td>{document.document_deadline_second ? moment(document.document_deadline_second).format("D-MMM-YYYY") : ""}</td>
                                    <td>{document.document_sended_on ? moment(document.document_sended_on).format("D-MMM-YYYY") : ""}</td>
                                    <td>{document.document_acceptance_status}</td>
                                    <td>{document.document_last_status_update ? moment(document.document_last_status_update).format("D-MMM-YYYY") : ""}</td>
                                    <td>{document.document_comment}</td>
                                    <td>{document.document_author_username}</td>
                                    <td>{document.document_cmit_short_name}</td>
                                    <td>{document.document_cmi_deadline}</td>
                                    {/* <td>{document.document_comment}</td> */}
                                    {/* <td>{moment(document.last_change).format("D MMM YYYY")}</td> */}
                                    {/* <td>{document.deadline === null ? "not set" : moment(document.deadline).format("D MMM YYYY")}</td> */}
                                    {/* <td>{document.responsible}</td> */}
                                    {/* <td>{document.comment}</td> */}
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