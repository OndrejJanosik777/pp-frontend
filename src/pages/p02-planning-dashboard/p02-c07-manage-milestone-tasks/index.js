import React, { Component } from 'react';
import { useState, useEffect } from 'react';
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
// styles
import './index.scss';

const P02_C07_MANAGE_MILESTONE_TASKS = (props) => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    // 
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    //
    const [tasks, set_tasks] = useState([...props.activeMilestoneItem.tasks]);
    const [taskTypes, set_taskTypes] = useState([...props.taskTypes]);
    const [certificationDocuments, set_certificationDocuments] = useState([]);
    const [certificationDocumentsNoTask, set_certificationDocumentsNoTask] = useState([]);
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);

    useEffect(() => {
        console.log('component ManageTasks loaded: ... ');
        // console.log('props.activeProject: ', props.activeProject);

        fetchProjectDocuments();
    }, []);

    const showState = () => {
        // console.log('props: ', props);
        // console.log('props.activeProject: ', props.activeProject);
        // console.log('props.taskTypes: ', props.taskTypes);
        // console.log('props.activeMilestoneItem: ', props.activeMilestoneItem);
        // console.log('props.activeMilestoneItem.tasks: ', props.activeMilestoneItem.tasks);
        // console.log('createMode: ', createMode);
        // console.log('certificationDocuments: ', certificationDocuments);
        console.log('tasks: ', tasks);
    }

    const createNewItem = () => {
        // update in local state - no
        console.log('creating new task')
        const task_type = props.taskTypes.find(
            elem => elem.name === document.getElementById('task_type').value).id;
        const estimated_hours = document.getElementById('estimated_hours').value;
        const booked_hours = document.getElementById('booked_hours').value;
        const comment = document.getElementById('comment').value;
        const milestone_item = props.activeMilestoneItem.id;
        const deadline = props.activeMilestoneItem.date;
        const status = document.getElementById('status').value;
        const users = [];
        let certification_document = document.getElementById('certification_document').value;

        if (task_type === "") return alert('missing task_type');
        if (estimated_hours === "") return alert('missing estimated_hours');
        if (booked_hours === "") return alert('missing booked_hours');
        if (comment === "") return alert('missing comment');
        if (milestone_item === "") return alert('missing milestone_item');
        if (status === "") return alert('missing status');
        if (deadline === "") return alert('missing deadline');
        // if (users === "") return alert('missing users');
        if (certification_document === "") return alert('missing certification_document');
        if (certification_document === "-1") certification_document = null;

        set_showSpinner_CreateUpdateItem(true);

        axios({
            method: 'post',
            url: baseUrl + `/company/tasks/`,
            headers: {
                "Authorization": token
            },
            data: {
                task_type: task_type,
                estimated_hours: estimated_hours,
                booked_hours: booked_hours,
                comment: comment,
                milestone_item: milestone_item,
                status: status,
                users: users,
                certification_document: certification_document,
                deadline: deadline
            }
        })
        .then((response => {
            console.log('task created succesfully: ', response.data);

            set_tasks([...tasks, response.data]);

            props.updateProject(props.activeProject);

            set_showSpinner_CreateUpdateItem(false);

            // 
            fetchProjectDocuments();
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const deleteItem = (task) => {
        console.log('deleting task: ', task);

        // update in backend

        axios({
            method: 'delete',
            url: baseUrl + `/company/tasks/${task.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            fetchProjectDocuments();

            let updatedTasks = [...tasks];

            let index =  updatedTasks.findIndex(elem => elem.id === task.id);

            updatedTasks.splice(index, 1);

            set_tasks([...updatedTasks]);

            props.updateProject(props.activeProject);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const fetchProjectDocuments = () => {
        axios({
            method: 'get',
            url: baseUrl + `/company/certification-documents/?project=${props.activeProject.id}`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            console.log('project documents fetched succesfully: ', response.data);

            let certDocumentsNoTask = [];

            response.data.map((document) => {
                if (document.task === null) {
                    certDocumentsNoTask.push(document);
                }


            })

            set_certificationDocumentsNoTask([...certDocumentsNoTask]);
            set_certificationDocuments([...response.data]);

            // props.updateProject(props.activeProject);

            // set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item, index) => {
        document.getElementById('status').value = item.status;
        document.getElementById('estimated_hours').value = item.estimated_hours;
        document.getElementById('booked_hours').value = item.booked_hours;
        document.getElementById('comment').value = item.comment;

        set_updateMode(true);

        set_selectedItem(item);
    }

    const updateItem = (item) => {
        console.log('updateItem: ', item);

        const booked_hours = document.getElementById('booked_hours').value;
        const certification_document = item.certification_document;
        const comment = document.getElementById('comment').value;
        const deadline = item.deadline;
        const estimated_hours = document.getElementById('estimated_hours').value;
        const id = item.id;
        const milestone_item = item.milestone_item;
        const status = document.getElementById('status').value;
        const task_type = item.task_type;
        const users = [...item.users];

        set_showSpinner_CreateUpdateItem(true);

        if (estimated_hours === "") return alert('missing estimated_hours');
        if (booked_hours === "") return alert('missing booked_hours');
        if (comment === "") return alert('missing comment');
        if (status === "") return alert('missing status');

        axios({
            method: 'put',
            url: baseUrl + `/company/tasks/${id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                id: id,
                task_type: task_type,
                estimated_hours: estimated_hours,
                booked_hours: booked_hours,
                comment: comment,
                milestone_item: milestone_item,
                status: status,
                users: users,
                certification_document: certification_document,
                deadline: deadline
            }
        })
        .then((response => {
            console.log('task updated succesfully: ', response.data);

            let index = tasks.findIndex(elem => elem.id === response.data.id);

            let updatedTasks = [...tasks];

            updatedTasks.splice(index, 1, response.data);

            set_tasks([...updatedTasks]);

            // props.updateProject(props.activeProject);

            set_showSpinner_CreateUpdateItem(false);

            // 
            // fetchProjectDocuments();
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })

    }

    return (<div className='p02-c07-manage-milestone-tasks'>
        <div className='p02-c07-background'></div>
        <div className='p02-c07-window'>
            <div className='p02-c07-nav-bar'>
                <div className='p02-c07-nav-bar-left'>
                    {/* <img 
                        className='p02-c07-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    /> */}
                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "create_task" ) !== -1 ?
                        <img 
                            className='p02-c07-icons' 
                            src={create_new} alt='' 
                            onClick={() => set_createMode(!createMode)} 
                        /> : 
                        <div></div>
                    }
                </div>
                <div className='p02-c07-nav-bar-right'>
                    <div className='p02-c07-textbox-container'>
                        <input 
                            className='p02-c07-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img 
                            className='p02-c07-img' 
                            src={magnifier} 
                            alt='' 
                        />
                    </div>
                    <img className='p02-c07-icons' src={edit_panels} alt='' />
                    <img 
                        className='p02-c07-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input 
                        type='button' 
                        className='p02-c07-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
                    />
                </div>
            </div>
            <div className='p02-c07-content'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>task type</th>
                            <th>status (%)</th>
                            <th>milestone item</th>
                            <th>estimated hours</th>
                            <th>booked hours</th>
                            <th>document</th>
                            <th>comment</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {tasks.map((task, index) => {
                            let certificationDocument = undefined;

                            if (task.certification_document !== null) {
                                // certificationDocument = certificationDocuments.find(elem => elem.id === task.certification_document).number;
                            }

                            console.log("certificationDocuments: ", certificationDocuments.length);
                            // console.log("certificationDocuments: ", task.certification_document);
                            // console.log("certificationDocuments: ", certificationDocuments.find((elem) => elem.id === task.certification_document).number);

                            return <tr key={Math.random() * 100000}>
                                <td>{task.id}</td>
                                <td>{taskTypes.find(elem => elem.id === task.task_type).name}</td>
                                <td>{task.status}</td>
                                <td>{props.activeMilestoneItem.milestone_item_type.short_name}</td>
                                <td>{task.estimated_hours}</td>
                                <td>{task.booked_hours}</td>
                                <td>{certificationDocument}</td>
                                <td>{task.comment}</td>
                                <td>
                                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "edit_task" ) !== -1 ?
                                        <img 
                                            className='p02-c07-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(task, index)} 
                                        /> :
                                        <div></div>
                                    } 
                                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "delete_task" ) !== -1 ?
                                        <img 
                                            className='p02-c07-icons' 
                                            src={delete_cross} 
                                            alt='' 
                                            onClick={() => deleteItem(task)} 
                                        /> :
                                        <div></div>
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={createMode || updateMode ? 'p02-c07-win-footer' : 'p02-c07-win-footer-hidden'}>
                <div className='p02-c07-footer-row1'>
                    { updateMode ? 
                        <div></div> :
                        <label 
                            htmlFor='milestone_item_type' 
                            className='p02-c07-row1-col1'
                        >task type</label>

                    }
                    { updateMode ?
                        <div></div> :
                        <div className='p02-c07-row1-col2'>
                            <div className='p02-c07-textbox-container'>
                                <select 
                                    id="task_type" 
                                >
                                    <option value="" id='default-milestonetype'>--Please choose an option--</option>
                                    {taskTypes.map((item) => {
                                        return <option 
                                            key={Math.random() * 100000} 
                                            id={`task_type_${item.id}`} 
                                            value={`${item.name}`}
                                            // onClick={() => console.log('option clicked.. ')}
                                        >{`${item.name}`}
                                        </option>
                                    })}
                                </select>
                            </div>
                        </div>
                    }
                    { updateMode ?
                        <div></div> :
                        <label 
                            htmlFor='milestone_item_type' 
                            className='p02-c07-row1-col1-w2'
                        >certification document</label>
                    }
                    { updateMode ?
                        <div></div> :
                        <div className='p02-c07-row1-col2'>
                            <div className='p02-c07-textbox-container'>
                                <select 
                                    id="certification_document" 
                                >
                                    <option value="-1" id='empty-documents'>--no document--</option>
                                    {certificationDocumentsNoTask.map((item) => {
                                        return <option 
                                            key={Math.random() * 100000} 
                                            id={`${item.id}`} 
                                            value={`${item.id}`}
                                            // onClick={() => console.log('option clicked.. ')}
                                        >{`${item.number}, ${item.revision}, ${item.name}`}
                                        </option>
                                    })}
                                </select>
                            </div>
                        </div>
                    }
                </div>
                <div className='p02-c07-footer-row1'>
                    <div className='p02-c07-row1-col1'>status (%)</div>
                    <div className='p02-c07-row1-col2'>
                        <div className='p02-c07-textbox-container'>
                            <input 
                                className='p02-c07-textbox' 
                                type='number' 
                                id='status' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c07-footer-row1'>
                    <div className='p02-c07-row1-col1'>estimated hours</div>
                    <div className='p02-c07-row1-col2'>
                        <div className='p02-c07-textbox-container'>
                            <input 
                                className='p02-c07-textbox' 
                                type='number' 
                                id='estimated_hours' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c07-footer-row1'>
                    <div className='p02-c07-row1-col1'>booked hours</div>
                    <div className='p02-c07-row1-col2'>
                        <div className='p02-c07-textbox-container'>
                            <input 
                                className='p02-c07-textbox' 
                                type='number' 
                                id='booked_hours' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c07-footer-row1'>
                    <div className='p02-c07-row1-col1'>comment</div>
                    <div className='p02-c07-row1-col2'>
                        <div className='p02-c07-textbox-container'>
                            <input 
                                className='p02-c07-textbox' 
                                type='text' 
                                id='comment' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                {/* <div className='p02-c07-footer-row1'>
                    <div className='p02-c07-row1-col1'>date</div>
                    <div className='p02-c07-row1-col2'>
                        <div className='p02-c07-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c07-date' 
                                id='date' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div> */}
                <div className='p02-c07-footer-row2'>
                    <div className='p02-c07-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border p02-c07-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='p02-c07-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='p02-c07-row2-col2'>
                        <input 
                            type='button' 
                            className='p02-c06-button' 
                            value={updateMode ? 'Cancel' : 'Close'} 
                            onClick={updateMode ? () => set_updateMode(false) : () => set_createMode(false)} 
                        />
                    </div>
                </div>
            </div>
        </div>

    </div> );
}
 
export default P02_C07_MANAGE_MILESTONE_TASKS;