import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment'; 
// assets
import editSVG from './assets/pencil-square.svg';
import deleteSVG from './assets/trash3.svg';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import pencil_edit from './assets/pencil_edit.png';
import magnifier from './assets/magnifier.png';
import filter from './assets/filter-svgrepo-com.svg';
import arrow_up from './assets/arrow-up-svgrepo-com.svg';
import arrow_down from './assets/arrow-down-svgrepo-com.svg';
// actions to dispatch
import * as apiActions from '../../../app/features/api/apiSlice';
import * as dashboardActions from '../../../app/features/dashboardSlice';
// styles
import './index.scss'; 

const P02_C09_MANAGE_DOCUMENTS = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let userPermissions = useSelector(state => state.api.userProfile.groups);
    let baseUrl = useSelector(state => state.api.baseUrl);
    let activeProject = useSelector(state => state.dashboard.activeProject);
    const activeMilestone = useSelector(state => state.dashboard.activeMilestone);
    const activeTask = useSelector(state => state.dashboard.activeTask);

    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    // local state of array of document to be displayed in component
    const [documents_localStateFormat, set_documents_localStateFormat] = useState([{
        document_id: null,
        document_name: null,
        document_number: null,
        document_revision: null,
        document_deadline: null,
        document_deadline_second: null,
        document_sended_on: null,
        document_acceptance_status: null,
        document_last_status_update: null,
        document_comment: null,
        document_author_username: null,
        document_cmit_short_name: null,
        document_cmi_deadline: null,
        document_status: null,
        document_monuments: []
    }]);
    // local state of array of documents to dispatch to project in redux store 
    const [documents_reduxStateFormat, set_documents_reduxStateFormat] = useState([{
        id: null,
        acceptance_status: null,
        project_id: null,
    }])
    // local state of array of documents to be displayed in component, extended with isSelected
    const [monuments, set_monuments] = useState([{
        id: null,
        name: null,
        part_number: null,
        hours_D: 0,
        hours_K: 0,
        hours_S: 0,
        hours_Z: 0,
        isSelected: false
    }]);
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [updateTask, set_updateTask] = useState(true);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [selectedItemIndex, set_selectedItemIndex] = useState(undefined);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);
    const [showSpinner_FetchingDocuments, set_showSpinner_FetchingDocuments] = useState(true);
    const [icon_sortDeadlineAscending, set_icon_sortDeadlineAscending] = useState(true);
    const [icon_sortDeadlineDescending, set_icon_sortDeadlineDescending] = useState(false);
    const [showFilterDeadline, set_showFilterDeadline] = useState(false);
    const [filteredMilestones, set_filteredMilestones] = useState([]);
    const [cmit_short_names, set_cmit_short_names] = useState([]);
    const [task_types, set_task_types] = useState([{ "task_type_id": null, "task_type_name": null }])
    const [milestone_items, set_milestone_items] = useState([{ "milestone_item_id": null, "milestone_item_name": null }])
    const [employees, set_employees] = useState([{ "employee_id": null, "employee_initials": null }])

    useEffect(() => {
        set_documents_reduxStateFormat([...activeProject.documents]);

        set_monuments(() => {
            let monuments = [];

            activeProject.monuments.map((monument) => {
                monuments.push({ ...monument, isSelected: false })
            })

            return [...monuments];
        });

        fetchDocuments();

        let activeProjectId = 24;

        // dispatch(dashboardActions.fetch_documents());

        // set_updateMode(activeTask.task_id != undefined);
    }, []);
    
    const showState = () => {
        console.log('props: ', props);
        console.log('documents: ', documents_localStateFormat);
        console.log('monuments: ', monuments);
        console.log('cmit_short_names: ', cmit_short_names);
        console.log('filteredMilestones: ', filteredMilestones);
        console.log('showSpinner_CreateUpdateItem: ', showSpinner_CreateUpdateItem);
        console.log('task_types: ', task_types);
        console.log('milestone_items: ', milestone_items);
        console.log('employees: ', employees);
    }

    const clearForm = () => {
        document.getElementById('name').value = '...';
        document.getElementById('number').value = '...';
        document.getElementById('revision').value = '...';
        document.getElementById('deadline').value = '';
        document.getElementById('acceptance_status').value = '';
        document.getElementById('comment').value = '...';

        let updatedMonuments = [...monuments];

        updatedMonuments.map((monument) => {
            monument.isSelected = false;
        })

        set_monuments([...updatedMonuments]);
    }

    const createNewItem = () => {
        if (updateTask) {
            createDocumentAndTask();
        } 
        else {
            createDocument();
        }
    }

    const createDocumentAndTask = () => {
        // get data from form for Document
        let document_name = document.getElementById('name').value;
        let document_number = document.getElementById('number').value;
        let document_revision = document.getElementById('revision').value;
        let document_deadline = document.getElementById('deadline').value;
        let document_deadline_second = document.getElementById('deadline_second').value;
        let document_sended_on = document.getElementById('sended_on').value;
        let document_acceptance_status = document.getElementById('acceptance_status').value;
        let document_comment = document.getElementById('comment').value;
        let document_monuments = [];
        let document_project = activeProject.id;
        let document_author = null;
        // get data from form for Task
        let task_type = document.getElementById('task_type').value;
        let task_estimated_hours = document.getElementById('task_estimated_hours').value;
        let task_booked_hours = document.getElementById('task_booked_hours').value;
        let task_comment = document.getElementById('task_comment').value;
        let task_milestone_item = parseInt(document.getElementById('task_milestone_item').value);
        let task_status = document.getElementById('task_status').value;
        let task_employee = parseInt(document.getElementById('task_employee').value);
        let task_deadline = document.getElementById('task_deadline').value;
        //
        monuments.map((monument) => {
            if (monument.isSelected) {
                document_monuments.push(monument.id);
            }
        })
        // check required data
        if (document_name === "") return alert('missing "document_name"');
        if (document_number === "") return alert('missing "document_number"');
        if (document_revision === "") return alert('missing "revision"');
        if (document_deadline === "") document_deadline = null;        
        if (document_deadline_second === "") document_deadline_second = null;        
        if (document_sended_on === "") document_sended_on = null;        
        if (document_acceptance_status === "") return alert('missing "acceptance_status"');
        if (document_comment === "") return alert('missing "comment"');
        if (document_monuments.length === 0) return alert('missing "monuments"');

        set_showSpinner_CreateUpdateItem(true);


        axios({
            method: 'post',
            url: baseUrl + `/company/create-document-and-task/`,
            headers: {
                "Authorization": token
            },
            data: {
                // document data
                document_name: document_name,
                document_number: document_number,
                document_revision: document_revision,
                document_last_status_update: moment().format('YYYY-MM-DD'),
                document_deadline: document_deadline_second,
                document_deadline_second: document_sended_on,
                document_sended_on: document_sended_on,
                document_acceptance_status: document_acceptance_status,
                document_comment: document_comment,
                document_monuments: document_monuments,
                document_project: document_project,
                document_author: document_author,
                // task data
                task_task_type: activeProject.id,
                task_estimated_hours: activeProject.id,
                task_booked_hours: activeProject.id,
                task_comment: activeProject.id,
                task_milestone_item: activeProject.id,
                task_status: activeProject.id,
                task_employee: activeProject.id,
                task_task_deadline: activeProject.id,
            }
        })
        .then((response) => {

        })
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            set_showSpinner_CreateUpdateItem(false);
        })
    }

    const createDocument = () => {
        // 1 - create new item in database
        // 2 - create new item in local state
        // 3 - create new item in redux store (...update project)

        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;
        const revision = document.getElementById('revision').value;
        let deadline = document.getElementById('deadline').value;
        let deadline_second = document.getElementById('deadline_second').value;
        let sended_on = document.getElementById('sended_on').value;
        const acceptance_status = document.getElementById('acceptance_status').value;
        const comment = document.getElementById('comment').value;
        const selectedMonuments = [];

        monuments.map((monument) => {
            if (monument.isSelected) {
                selectedMonuments.push(monument.id);
            }
        })

        if (name === "") return alert('missing input');
        if (number === "") return alert('missing input');
        if (revision === "") return alert('missing input');
        if (deadline === "") deadline = null;        
        if (deadline_second === "") deadline_second = null;        
        if (sended_on === "") sended_on = null;        
        if (acceptance_status === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (selectedMonuments.length === 0) return alert('missing input');

        set_showSpinner_CreateUpdateItem(true);

        // 1 - 
        axios({
            method: 'post',
            url: baseUrl + `/company/certification-documents/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                number: number,
                revision: revision,
                deadline: deadline,
                deadline_second: deadline_second,
                sended_on: sended_on,
                last_status_update: moment().format('YYYY-MM-DD'),
                acceptance_status: acceptance_status,
                comment: comment,
                monuments: selectedMonuments,
                project: activeProject.id,
            }
        })
        .then((response => {
            // new item created succesfully
            let newDocument_localStateFormat = {
                document_id: response.data.id,
                document_name: name,
                document_number: number,
                document_revision: revision,
                document_deadline: deadline,
                document_deadline_second: deadline_second,
                document_sended_on: sended_on,
                document_acceptance_status: acceptance_status,
                document_last_status_update: moment().format('YYYY-MM-DD'),
                document_comment: comment,
                document_author_username: response.data.author,
                document_cmit_short_name: null,
                document_cmi_deadline: null,
                document_status: null,
                document_monuments: selectedMonuments
            }

            let newDocument_reduxProjectFormat = {
                id: response.data.id,
                acceptance_status: response.data.acceptance_status,
                project_id: response.data.project
            }

            // 2 - 
            let updatedDocuments_localStateFormat = [...documents_localStateFormat, newDocument_localStateFormat];
            set_documents_localStateFormat([...updatedDocuments_localStateFormat]);

            // 3 -
            let updatedProject = {...activeProject};
            let newDocuments_reduxProjectFormat = [...documents_reduxStateFormat, newDocument_reduxProjectFormat];
            updatedProject.documents = [...newDocuments_reduxProjectFormat];
            dispatch(apiActions.update_project(updatedProject));
            set_documents_reduxStateFormat([...newDocuments_reduxProjectFormat]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            set_showSpinner_CreateUpdateItem(false);
        })
    }

    const deleteItem = (item, index) => {
        // 1 - delete item in database
        // 2 - delete item in local state
        // 3 - delete item in redux store

        let updatedItems = [...documents_localStateFormat];
        let originalItems = [...documents_localStateFormat];

        updatedItems.splice(index, 1);

        // 2 - 
        set_documents_localStateFormat([...updatedItems]);

        // 3 - 


        // 1 -
        axios({
            method: 'delete',
            url: baseUrl + `/company/certification-documents/${item.document_id}/`,
            headers: {
                "Authorization": token
            }
        })
        // delete succesfull
        .then((response => {
            // 3 - 
            let updatedProject = {...activeProject};
            let updateDocuments_inReduxState = [...updatedProject.documents];
            let index = updateDocuments_inReduxState.findIndex(elem => elem.id === item.document_id);

            updateDocuments_inReduxState.splice(index, 1);

            updatedProject.documents = [...updateDocuments_inReduxState];

            dispatch(apiActions.update_project(updatedProject));
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
            // 2 - in case update in database fails
            set_documents_localStateFormat([...originalItems]);
        })
    }

    const fetchDocuments = () => {
        // fetch documents to local state of component
        axios({
            method: 'get', 
            url: baseUrl + `/company/get-documents-for-project-dashboard/?project_id=${activeProject.id}`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            let new_documents = [...response.data.documents];

            let new_document_cmit_short_names = [];

            new_documents.map((item, index) => {
                if (!new_document_cmit_short_names.includes(item.document_cmit_short_name)) {
                    new_document_cmit_short_names.push(item.document_cmit_short_name);
                }

                if (activeTask.document_id === item.document_id) {
                    switchToUpdateMode(item, index);
                }
            })

            sortDeadlineAscending(new_documents);

            set_showSpinner_FetchingDocuments(false);

            set_cmit_short_names([...new_document_cmit_short_names]);

            set_task_types([...response.data.task_types]);

            set_milestone_items([...response.data.milestone_items]);

            set_employees([...response.data.employees]);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            set_showSpinner_FetchingDocuments(false);
        })
    }

    // TODO:
    const reviseDocument = (item, index) => {
        console.log('revising document (item): ', item);
        console.log('revising document (index): ', index);

        // 1 - update item in backend 
        // 2 - update item in local state
        // 3 - update item in redux store
        // console.log('updateItem function');

        // item.document_name = document.getElementById('name').value;
        // item.document_number = document.getElementById('number').value;
        // item.document_revision = document.getElementById('revision').value;
        // item.document_deadline = document.getElementById('deadline').value;
        // item.document_deadline_second = document.getElementById('deadline_second').value;
        // item.document_sended_on = document.getElementById('sended_on').value;
        // item.document_acceptance_status = document.getElementById('acceptance_status').value;
        // item.document_comment = document.getElementById('comment').value;
        // const selectedMonuments = [];

        // monuments.map((monument) => {
        //     if (monument.isSelected) {
        //         selectedMonuments.push(monument.id);
        //     }
        // })

        // if (document.getElementById('name').value === "") return alert('missing input');
        // if (document.getElementById('number').value === "") return alert('missing input');
        // if (document.getElementById('revision').value === "") return alert('missing input');
        // if (document.getElementById('deadline').value === "") item.document_deadline = null;
        // if (document.getElementById('deadline_second').value === "") item.document_deadline_second = null;
        // if (document.getElementById('sended_on').value === "") item.document_sended_on = null;
        // if (document.getElementById('acceptance_status').value === "") return alert('missing input');
        // if (document.getElementById('comment').value === "") return alert('missing input');
        // if (selectedMonuments.length === 0) return alert('missing input');

        // set_showSpinner_CreateUpdateItem(true);

        // // 1 - 
        axios({
            method: 'post',
            url: baseUrl + `/company/revise-document/?documentId=${item.document_id}`,
            headers: {
                "Authorization": token
            }
            // data: {
            //     name: item.document_name,
            //     number: item.document_number,
            //     revision: item.document_revision,
            //     deadline: item.document_deadline,
            //     deadline_second: item.document_deadline_second,
            //     sended_on: item.document_sended_on,
            //     acceptance_status: item.document_acceptance_status,
            //     comment: item.document_comment,
            //     monuments: selectedMonuments,
            //     project: activeProject.id,
            // }
        })
        .then((response => {
            // 2 - 
            // let updatedDocuments = [...documents_localStateFormat];
            // updatedDocuments.splice(index, 1, item)
            // set_documents_localStateFormat([...updatedDocuments]);

            // // 3 - 
            // let updateDocument_inReduxState = {
            //     id: response.data.id,
            //     acceptance_status: response.data.acceptance_status,
            //     project_id: response.data.project
            // }

            // let updatedProject = {...activeProject};
            // let updateDocuments_inReduxState = [...updatedProject.documents];
            // let index_inReduxState = updateDocuments_inReduxState.findIndex(elem => elem.id === item.document_id);

            // updateDocuments_inReduxState.splice(index_inReduxState, 1, updateDocument_inReduxState);

            // updatedProject.documents = [...updateDocuments_inReduxState];

            // dispatch(apiActions.update_project(updatedProject));

            // // set_monuments([...monuments]);

            // set_showSpinner_CreateUpdateItem(false);

            fetchDocuments();
        }))
        .catch((error) => {
            console.log("error while revising document: ", error);

            // let message = error.message + "\n" + error.response.data;

            // alert(message);

            // set_showSpinner_CreateUpdateItem(false);
        })
    }

    const switchToUpdateMode = (item, index) => {
        console.log('Manage Documents - switchToUpdateMode function');
        console.log('item: ', item);
        console.log('index: ', index);

        document.getElementById('name').value = item.document_name;
        document.getElementById('number').value = item.document_number;
        document.getElementById('revision').value = item.document_revision;
        document.getElementById('deadline').value = item.document_deadline;
        document.getElementById('deadline_second').value = item.document_deadline_second;
        document.getElementById('sended_on').value = item.document_sended_on;
        document.getElementById('acceptance_status').value = item.document_acceptance_status;
        document.getElementById('comment').value = item.document_comment;

        let updatedMonuments = [];

        activeProject.monuments.map((monument) => {
            updatedMonuments.push({ ...monument, isSelected: false })
        })

        // let updatedMonuments = [...monuments];

        item.document_monuments.map((monumentId) => {
            let monument = updatedMonuments.find(elem => elem.id === monumentId);

            if (monument !== undefined) {
                monument.isSelected = true;
            }

            console.log('updatedMonuments: ', updatedMonuments);
        })

        set_monuments([...updatedMonuments]);

        set_updateMode(true);

        set_selectedItem(item);

        set_selectedItemIndex(index);
    }

    const sortDeadlineAscending = (originalDocuments) => {
        // 1 - get actual array of documents from local state
        // 2 - sort array 
        // 3 - update local state
        // 4 - set colors

        // 1 -
        let documents = [...originalDocuments];

        // 2 -
        documents.sort((a, b) => {
            let deadline_a = null;
            let deadline_b = null;

            a.document_deadline_second != null ? deadline_a = a.document_deadline_second : deadline_a = a.document_deadline;
            b.document_deadline_second != null ? deadline_b = b.document_deadline_second : deadline_b = b.document_deadline;

            return moment(deadline_a) - moment(deadline_b);
            // return moment(a.document_deadline) - moment(b.document_deadline);
        });

        // 3 - 
        set_documents_localStateFormat([...documents]);

        // 4 - 
        set_icon_sortDeadlineAscending(true);
        set_icon_sortDeadlineDescending(false);
    }

    const sortDeadlineDescending = () => {
        // 1 - get actual array of documents from local state
        // 2 - sort array 
        // 3 - update local state
        // 4 - set colors

        // 1 -
        let documents = [...documents_localStateFormat];

        // 2 -
        documents.sort((a, b) => {
            let deadline_a = null;
            let deadline_b = null;

            a.document_deadline_second != null ? deadline_a = a.document_deadline_second : deadline_a = a.document_deadline;
            b.document_deadline_second != null ? deadline_b = b.document_deadline_second : deadline_b = b.document_deadline;

            return moment(deadline_b) - moment(deadline_a);
            // return moment(a.document_deadline) - moment(b.document_deadline);
        });

        // 3 - 
        set_documents_localStateFormat([...documents]);

        // 4 - 
        set_icon_sortDeadlineAscending(false);
        set_icon_sortDeadlineDescending(true);
    }

    const updateItem = (item, index) => {
        // 1 - update item in backend 
        // 2 - update item in local state
        // 3 - update item in redux store
        console.log('updateItem function');

        item.document_name = document.getElementById('name').value;
        item.document_number = document.getElementById('number').value;
        item.document_revision = document.getElementById('revision').value;
        item.document_deadline = document.getElementById('deadline').value;
        item.document_deadline_second = document.getElementById('deadline_second').value;
        item.document_sended_on = document.getElementById('sended_on').value;
        item.document_acceptance_status = document.getElementById('acceptance_status').value;
        item.document_comment = document.getElementById('comment').value;
        const selectedMonuments = [];

        monuments.map((monument) => {
            if (monument.isSelected) {
                selectedMonuments.push(monument.id);
            }
        })

        if (document.getElementById('name').value === "") return alert('missing input');
        if (document.getElementById('number').value === "") return alert('missing input');
        if (document.getElementById('revision').value === "") return alert('missing input');
        if (document.getElementById('deadline').value === "") item.document_deadline = null;
        if (document.getElementById('deadline_second').value === "") item.document_deadline_second = null;
        if (document.getElementById('sended_on').value === "") item.document_sended_on = null;
        if (document.getElementById('acceptance_status').value === "") return alert('missing input');
        if (document.getElementById('comment').value === "") return alert('missing input');
        if (selectedMonuments.length === 0) return alert('missing input');

        set_showSpinner_CreateUpdateItem(true);

        // 1 - 
        axios({
            method: 'patch',
            url: baseUrl + `/company/certification-documents/${item.document_id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: item.document_name,
                number: item.document_number,
                revision: item.document_revision,
                deadline: item.document_deadline,
                deadline_second: item.document_deadline_second,
                sended_on: item.document_sended_on,
                acceptance_status: item.document_acceptance_status,
                comment: item.document_comment,
                monuments: selectedMonuments,
                project: activeProject.id,
            }
        })
        .then((response => {
            // 2 - 
            let updatedDocuments = [...documents_localStateFormat];
            updatedDocuments.splice(index, 1, item)
            set_documents_localStateFormat([...updatedDocuments]);

            // 3 - 
            let updateDocument_inReduxState = {
                id: response.data.id,
                acceptance_status: response.data.acceptance_status,
                project_id: response.data.project
            }

            let updatedProject = {...activeProject};
            let updateDocuments_inReduxState = [...updatedProject.documents];
            let index_inReduxState = updateDocuments_inReduxState.findIndex(elem => elem.id === item.document_id);

            updateDocuments_inReduxState.splice(index_inReduxState, 1, updateDocument_inReduxState);

            updatedProject.documents = [...updateDocuments_inReduxState];

            dispatch(apiActions.update_project(updatedProject));

            // set_monuments([...monuments]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            set_showSpinner_CreateUpdateItem(false);
        })
    }

    const updateFilterMilestones = (item) => {
        if (item === 'all') {
            if (filteredMilestones.length != cmit_short_names.length) {
                set_filteredMilestones([...cmit_short_names]);
            }
            else {
                set_filteredMilestones([]);
            }
        }
        else {
            if (filteredMilestones.includes(item)) {

                let index = filteredMilestones.indexOf(item);

                filteredMilestones.splice(index, 1);
            }
            else {
                set_filteredMilestones([...filteredMilestones, item]);
            }
        }

        console.log(item);

        set_documents_localStateFormat([...documents_localStateFormat]);
    }

    return ( <div className='p02-c09-manage-documents'>
        <div className='p02-c09-background'></div>
        <div className='p02-c09-window'>
            <div className='p02-c09-nav-bar'>
                <div className='p02-c09-nav-bar-left'>
                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "create_document" ) !== -1 ?
                        <img 
                            className='p02-c09-icons' 
                            src={create_new} alt='' 
                            onClick={() => set_createMode(!createMode)} 
                        /> :
                        <div></div>
                    }
                    <div className={
                        showSpinner_FetchingDocuments ?
                        'p02-c09-fetching-displayed' :
                        'p02-c09-fetching-hidden'
                        }>
                        loading documents from database ...
                        <div className="spinner-border p02-c09-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                </div>
                <div className='p02-c09-nav-bar-right'>
                    <div className='p02-c09-textbox-container'>
                        <input 
                            className='p02-c09-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c09-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c09-icons' src={edit_panels} alt='' />
                    <img 
                        className='p02-c09-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input 
                        type='button' 
                        className='p02-c09-button' 
                        value={'X'} 
                        onClick={() => dispatch(dashboardActions.set_showModal_manageDocuments(false))} 
                    />
                </div>
            </div>
            <div className='p02-c09-content p02-c09-content-nav-bar'>
                <table>
                    <thead>
                        <tr>
                            <th>id
                                <div className='p02-c09-icon'>
                                    {/* <img src={arrow_up} alt='' className='p02-c09-img-inactive' ></img> */}
                                    {/* <img src={arrow_down} alt='' className='p02-c09-img-inactive' ></img> */}
                                </div>
                            </th>
                            <th>name</th>
                            <th>nr.</th>
                            <th>rev.</th>
                            <th>deadline 1
                                <div className='p02-c09-icon'>
                                    <img 
                                        src={arrow_up} 
                                        alt='' 
                                        className={icon_sortDeadlineAscending ? 'p02-c09-img-active' : 'p02-c09-img-inactive'} 
                                        onClick={() => sortDeadlineAscending(documents_localStateFormat)}
                                    ></img>
                                    <img 
                                        src={arrow_down} 
                                        alt='' 
                                        className={icon_sortDeadlineDescending ? 'p02-c09-img-active' : 'p02-c09-img-inactive'} 
                                        onClick={() => sortDeadlineDescending()}
                                    ></img>
                                    {/* <img 
                                        src={filter} 
                                        alt='' 
                                        className={icon_filterDeadline ? 'p02-c09-img-active' : 'p02-c09-img-inactive'} 
                                    ></img> */}
                                </div>
                            </th>
                            <th>deadline 2</th>
                            <th>sended on</th>
                            <th>status</th>
                            <th>last update</th>
                            <th>comment</th>
                            <th>author</th>
                            <th>milestone
                                <div className='p02-c09-icon'>
                                    <img 
                                        src={filter} 
                                        alt='' 
                                        className={filteredMilestones.length != 0 ? 'p02-c09-img-active' : 'p02-c09-img-inactive'} 
                                        onClick={() => set_showFilterDeadline(!showFilterDeadline)}
                                    ></img>
                                </div>
                                {showFilterDeadline ?
                                    <ul 
                                        className='p02-c09-filter-choises' 
                                        onMouseLeave={() => set_showFilterDeadline(false)
                                    }>
                                        <li>
                                            <input 
                                                type='checkbox' 
                                                id='all' 
                                                name='all' 
                                                checked={filteredMilestones.length == 0} 
                                                
                                                // onChange={() => console.log('changed')}
                                                onChange={() => updateFilterMilestones('all')}
                                            />
                                            <label for='all'>all</label>
                                        </li>
                                        {cmit_short_names.map((item) => {
                                            let isFiltered = filteredMilestones.includes(item);

                                            return <li>
                                                <input 
                                                    type='checkbox' 
                                                    id={item} 
                                                    name={item} 
                                                    checked={!isFiltered}
                                                    onChange={() => updateFilterMilestones(item)} 
                                                />
                                                <label for={item}>{item}</label>
                                            </li>
                                        })}
                                    </ul>
                                    :
                                    <div></div>
                                }
                            </th>
                            <th>deadline</th>
                            <th>status</th>
                            <th>action</th>
                        </tr>
                    </thead>   
                </table>
            </div>
            <div className='p02-c09-content'>
                <table>
                    <tbody>
                        {documents_localStateFormat.map((document, index) => {
                            let documentStyle = null;
                            let documentDeadline = null;

                            if (document.document_deadline_second !== null) 
                                documentDeadline = document.document_deadline_second;
                            else 
                                documentDeadline = document.document_deadline;
                            

                            let difference = moment(documentDeadline).diff(moment(), 'days');
                            
                            if (difference < 14) {
                                if ( document.document_acceptance_status !== "sended" &&
                                    document.document_acceptance_status !== "accepted" &&
                                    document.document_acceptance_status !== "rejected" ) {
                                        documentStyle = { color: "orange" };
                                    }
                            }
                            
                            if (difference < 0) {
                                if ( document.document_acceptance_status !== "sended" &&
                                document.document_acceptance_status !== "accepted" &&
                                document.document_acceptance_status !== "rejected" ) {
                                    documentStyle = { color: "red" };
                                }
                            }

                            if ( document.document_acceptance_status === "accepted") {
                                documentStyle = { color: "green" };
                            }

                            if ( document.document_acceptance_status === "rejected") {
                                documentStyle = { color: "#d4d4d4" };
                            }

                            let filtered = false;

                            // filters
                            if (filteredMilestones.length != 0) {
                                filtered = filteredMilestones.includes(document.document_cmit_short_name);
                            }


                            if (!filtered) {
                                return <tr key={Math.random() * 100000}>
                                    <td>{document.document_id}</td>
                                    <td>{document.document_name}</td>
                                    <td style={documentStyle}>{document.document_number}</td>
                                    <td>{document.document_revision}</td>
                                    <td>{document.document_deadline != null ? moment(document.document_deadline).format("DD-MMM-YYYY") : ''}</td>
                                    <td>{document.document_deadline_second != null ? moment(document.document_deadline_second).format("DD-MMM-YYYY") : ''}</td>
                                    <td>{document.document_sended_on != null ? moment(document.document_sended_on).format("DD-MMM-YYYY") : ''}</td>
                                    <td>{document.document_acceptance_status}</td>
                                    <td>{document.document_last_status_update != null ? moment(document.document_last_status_update).format("DD-MMM-YYYY") : ''}</td>
                                    <td>{document.document_comment}</td>
                                    <td>{document.document_author_username}</td>
                                    <td>{document.document_cmit_short_name}</td>
                                    <td>{document.document_cmi_deadline != null ? moment(document.document_cmi_deadline).format("DD-MMM-YYYY") : ''}</td>
                                    <td>{`${document.document_status}%`}</td>
                                    <td>
                                        { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_document" ) !== -1 ? 
                                            <img 
                                                className='p02-c09-icons' 
                                                src={pencil_edit} 
                                                alt='' 
                                                onClick={() => {
                                                    clearForm();

                                                    switchToUpdateMode(document, index);
                                                }} 
                                            /> : 
                                            <div></div>
                                        }
                                        { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "delete_document" ) !== -1 ? 
                                            <img 
                                                className='p02-c09-icons' 
                                                src={delete_cross} 
                                                alt='' 
                                                onClick={() => deleteItem(document, index)} 
                                            /> : 
                                            <div></div>
                                        }
                                    </td>
                                </tr>
                            }
                        })}
                    </tbody>
                </table>
            </div>
            <div className={createMode || updateMode ? 'p02-c09-win-footer' : 'p02-c09-win-footer-hidden'}>
                <div className='p02-c09-footer-row1' style={{ width: "100%", display: "flex", justifyContent: "center" }}>DOCUMENT DATA:</div>
                <div className='p02-c09-footer-row1'>
                    <div className='p02-c09-row1-col1'>name</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='name' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>doc. nr.</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='number' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>rev.</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='revision' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>deadline 1</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c09-date' 
                                id='deadline' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>deadline 2</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c09-date' 
                                id='deadline_second' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>sended on</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c09-date' 
                                id='sended_on' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <label 
                        htmlFor='milestone_item_type' 
                        className='p02-c09-row1-col1'
                    >status</label>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <select 
                                id="acceptance_status" 
                            >
                                <option value="" id='default-milestonetype'>--select--</option>
                                <option id='in_work' value='in work'>in work</option>
                                <option id='check_loop' value='check loop'>check loop</option>
                                <option id='approved' value='approved'>approved</option>
                                <option id='sended' value='sended'>sended</option>
                                <option id='accepted' value='accepted'>accepted</option>
                                <option id='rejected' value='rejected'>rejected</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='p02-c09-footer-row1'>
                    <div >Select monuments affected with document:</div>
                    <div className='p02-c09-monument-container'>
                        {monuments.map((monument, index) => {
                            return <div 
                                key={Math.random() * 100000} 
                                className={monument.isSelected ? 'p02-c09-monument-selected' : 'p02-c09-monument-not-selected'}
                                onClick={() => {
                                    let updatedMonuments = [...monuments];
                                    updatedMonuments[index].isSelected = !updatedMonuments[index].isSelected;
                                    set_monuments([...updatedMonuments]);
                                }}
                            >{`${monument.name} : ${monument.part_number}`}</div>
                        })}
                    </div>
                </div>
                <div className='p02-c09-footer-row1'>
                    <div className='p02-c09-row1-col1'>comment</div>
                    <div className='p02-c09-row1-col2' style={{ width: "100%" }}>
                        <div className='p02-c09-textbox-container' style={{ width: "100%" }}>
                            <input 
                                type='text' 
                                // className='p02-c09-textbox' 
                                style={{ height: "20px", width: "100%" }}
                                id='comment' 
                                defaultValue={"..."}
                            />
                        </div>
                    </div>
                </div>
                {/* TASK DATA SECTION */}
                <div className='p02-c09-footer-row1' style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <input type='checkbox' id="checkbox" name="checkbox" onChange={ () => set_updateTask(!updateTask) } checked={updateTask} />
                    <div style={{ paddingLeft: "2px" }}>TASK DATA:</div>
                </div>
                <div className='p02-c09-footer-row1' style={updateTask ? { visibility: "visible" } : { visibility: "hidden" }}>
                    <div className='p02-c09-row1-col1'>estimated hours</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='task_estimated_hours' 
                                defaultValue={40}
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>booked hours</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='task_booked_hours' 
                                defaultValue={0}
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>status (%)</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='task_status' 
                                defaultValue={0}
                            />
                        </div>
                    </div>
                    <label 
                            htmlFor='milestone_item_type' 
                            className='p02-c09-row1-col1'
                    >task type</label>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <select 
                                id="task_type" 
                            >
                                <option value="" id='task_type'>--select--</option>
                                {task_types.map((item) => {
                                    return <option id={item.task_type_id} value={item.task_type_id}>{item.task_type_name}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <label 
                            htmlFor='milestone_item_type' 
                            className='p02-c09-row1-col1'
                    >milestone item</label>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <select 
                                id="task_milestone_item" 
                            >
                                <option value="" id='task_milestone_item'>--select--</option>
                                {milestone_items.map((item) => {
                                    return <option id={item.milestone_item_id} value={item.milestone_item_id}>{item.milestone_item_name}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <label 
                            htmlFor='milestone_item_type' 
                            className='p02-c09-row1-col1'
                    >employee</label>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <select 
                                id="task_employee" 
                            >
                                <option value="" id='task_employee'>--select--</option>
                                {employees.map((item) => {
                                    return <option id={item.employee_id} value={item.employee_id}>{item.employee_initials}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>deadline</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c09-date' 
                                id='task_deadline' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c09-footer-row1' style={updateTask ? { visibility: "visible" } : { visibility: "hidden" }}>
                    <div className='p02-c09-row1-col1'>comment</div>
                    <div className='p02-c09-row1-col2' style={{ width: "100%" }}>
                        <div className='p02-c09-textbox-container' style={{ width: "100%" }}>
                            <input 
                                type='text' 
                                // className='p02-c09-textbox' 
                                style={{ height: "20px", width: "100%" }}
                                id='task_comment' 
                                defaultValue={"..."}
                            />
                        </div>
                    </div>
                </div>
                {/* BUTTON SECTION */}
                <div className='p02-c09-footer-row2'>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <div className='p02-c09-row2-col1'>
                            {showSpinner_CreateUpdateItem ?
                            <div className="spinner-border p02-c09-spinner" role="status">
                                <span className="sr-only"></span>
                            </div>
                            :
                            <input 
                                type='button' 
                                className='p02-c09-button' 
                                value={updateMode ? 'Update' : 'Create'} 
                                onClick={updateMode ? 
                                    () => updateItem(selectedItem, selectedItemIndex) 
                                    : 
                                    createNewItem} 
                            />
                            }
                        </div>
                        <div className='p02-c09-row2-col2'>
                            <input 
                                type='button' 
                                className='p02-c09-button' 
                                value={updateMode ? 'Cancel' : 'Close'} 
                                onClick={updateMode ? () => {
                                    // clearForm();
                                    set_updateMode(false);
                                    // set_createMode(true);
                                } : () => set_createMode(false)} 
                            />
                        </div>
                    </div>
                    {
                        updateMode ?
                        <div className='p02-c09-row2-col1'>
                            {showSpinner_CreateUpdateItem ?
                            <div className="spinner-border p02-c09-spinner" role="status">
                                <span className="sr-only"></span>
                            </div>
                            :
                            <input 
                                type='button' 
                                className='p02-c09-button' 
                                value={'Revise'}
                                onClick={() => reviseDocument(selectedItem, selectedItemIndex)} 
                            />
                            }
                        </div> :
                        <div></div>
                    }
                </div>
                
            </div>
        </div>

    </div> );
}
 
export default P02_C09_MANAGE_DOCUMENTS;