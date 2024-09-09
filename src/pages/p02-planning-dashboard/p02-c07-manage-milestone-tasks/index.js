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
// styles
import './index.scss';
import * as dashboardActions from '../../../app/features/dashboardSlice';
import * as apiActions from '../../../app/features/api/apiSlice';

const P02_C07_MANAGE_MILESTONE_TASKS = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    const baseUrl = useSelector(state => state.api.baseUrl);
    const userPermissions = useSelector(state => state.api.userProfile.groups);
    const taskTypes = useSelector(state => state.api.taskTypes);
    const activeMilestone = useSelector(state => state.dashboard.activeMilestone);
    const activeProject = useSelector(state => state.dashboard.activeProject);
    const activeTask = useSelector(state => state.dashboard.activeTask);

    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    //
    const [tasks, set_tasks] = useState([...activeMilestone.tasks]);
    const [activeTaskType, set_activeTaskType] = useState('');
    const [certificationDocuments, set_certificationDocuments] = useState([]);
    const [certificationDocumentsNoTask, set_certificationDocumentsNoTask] = useState([]);
    // 
    const [selectedItem, set_selectedItem] = useState({...activeTask});
    const [selectedMilestone, set_selectedMilestone] = useState(-1);
    const [updateMode, set_updateMode] = useState(selectedItem.task_id != undefined);
    const [createMode, set_createMode] = useState(false);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);

    //
    // const [taskStatus, set_taskStatus] = useState(selectedItem.task_status_percentage);
    // const [taskEstimatedHours, set_taskEstimatedHours] = useState(selectedItem.task_estimated_hours);
    // const [taskBookedHours, set_taskBookedHours] = useState(selectedItem.task_booked_hours);
    // const [taskComment, set_taskComment] = useState(selectedItem.task_comment);

    const showState = () => {
        // console.log('props: ', props);
        console.log('tasks: ', tasks);
        console.log('selectedItem: ', selectedItem);
        console.log('activeTask: ', activeTask.id);
        console.log('activeProject: ', activeProject);
        console.log('selectedMilestone: ', selectedMilestone);
    }

    useEffect(() => {
        // console.log('component ManageTasks loaded: ... ');
        // console.log('props: ', props);

        fetchProjectDocuments();

        // fetchTasks(props.activeMilestoneItem);

        if (selectedItem.task_id != undefined) {
            document.getElementById('status').value = selectedItem.task_status_percentage;
            document.getElementById('estimated_hours').value = selectedItem.task_estimated_hours;
            document.getElementById('booked_hours').value = selectedItem.task_booked_hours;
            document.getElementById('comment').value = selectedItem.task_comment;
            document.getElementById('deadline').value = selectedItem.task_deadline;
        }
    }, []);

    const createNewItem = () => {
        // 1 - create in backend
        // 2 - create in redux state & update project ...
        // console.log('activeTaskType: ', document.getElementById('task_type').value);

        const task_type = taskTypes.find(
            elem => elem.name === document.getElementById('task_type').value).id;
        const estimated_hours = document.getElementById('estimated_hours').value;
        const booked_hours = document.getElementById('booked_hours').value;
        const comment = document.getElementById('comment').value;
        // const milestone_item = props.activeMilestoneItem.id;
        const milestone_item = activeMilestone.id;
        // const deadline = props.activeMilestoneItem.date;
        const deadline = activeMilestone.date;
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
                task_deadline: deadline
            }
        })
        .then((response => {
            console.log('task created succesfully: ', response.data);

            set_tasks([...tasks, response.data]);

            dispatch(apiActions.fetch_projects());

            // props.updateProject(props.activeProject);

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
            url: baseUrl + `/company/tasks/${task.task_id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            fetchProjectDocuments();

            let updatedTasks = [...tasks];

            let index =  updatedTasks.findIndex(elem => elem.id === task.task_id);

            updatedTasks.splice(index, 1);

            set_tasks([...updatedTasks]);

            // props.updateProject(props.activeProject);

            dispatch(apiActions.fetch_projects());
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
            url: baseUrl + `/company/certification-documents/?project=${activeProject.id}`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log('project documents fetched succesfully: ', response.data);

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

    const fetchTasks = (milestoneItem) => {
        axios({
            method: 'get',
            url: baseUrl + `/company/get-tasks/?milestone_id=${milestoneItem.id}`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log('milestone tasks fetched succesfully: ', response.data);

            set_tasks([...response.data]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item, index) => {
        console.log('switchToUpdateMode: ', item)

        document.getElementById('status').value = item.task_status_percentage;
        document.getElementById('estimated_hours').value = item.task_estimated_hours;
        document.getElementById('booked_hours').value = item.task_booked_hours;
        document.getElementById('comment').value = item.task_comment;
        document.getElementById('deadline').value = selectedItem.task_deadline;

        set_updateMode(true);
        set_selectedItem(item);
    }

    const updateItem = (item) => {
        // get the data from input form and send API request...
        // console.log('item: ', item);
        // console.log('activeMilestone: ', activeMilestone);
        // console.log('activeTask: ', activeTask);

        const id = activeTask.task_id;
        const status = document.getElementById('status').value;
        const estimated_hours = document.getElementById('estimated_hours').value;
        const booked_hours = document.getElementById('booked_hours').value;
        const comment = document.getElementById('comment').value;
        const milestone_id = document.getElementById('milestone').value;
        const deadline = document.getElementById('deadline').value;

        // console.log("id: ", id);
        // console.log("status: ", status);
        // console.log("estimated_hours: ", estimated_hours);
        // console.log("booked_hours: ", booked_hours);
        // console.log("comment: ", comment);
        // console.log("milestone: ", milestone_id);
        // console.log("deadline: ", deadline);

        set_showSpinner_CreateUpdateItem(true);

        if (id === "") return alert('missing id');
        if (status === "") return alert('missing status');
        if (estimated_hours === "") return alert('missing estimated_hours');
        if (booked_hours === "") return alert('missing booked_hours');
        if (comment === "") return alert('missing comment');
        if (milestone_id === "") return alert('missing milestone_id');
        if (deadline === "") return alert('missing deadline');

        axios({
            method: 'put',
            url: baseUrl + `/company/tasks/${id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                id: id,
                estimated_hours: estimated_hours,
                task_type: activeTask.task_type_id,
                booked_hours: booked_hours,
                comment: comment,
                milestone_item: milestone_id,
                // users: users,
                // certification_document: certification_document,
                status: status,
                task_deadline: deadline
            }
        })
        .then((response => {
            // console.log('task updated succesfully: ', response.data);

            let index = tasks.findIndex(elem => elem.task_id === response.data.task_id);

            let updatedTasks = [...tasks];

            updatedTasks.splice(index, 1, {...response.data});

            set_tasks([...updatedTasks]);

            // props.updateProject(props.activeProject);

            set_showSpinner_CreateUpdateItem(false);

            // update all projects
            dispatch(apiActions.fetch_projects());
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    return (<div className='P02_C07_MANAGE_MILESTONE_TASKS'>
        <div className='P02_C07_MANAGE_MILESTONE_TASKS-background'></div>
        <div className='P02_C07_MANAGE_MILESTONE_TASKS-window'>
            <div className='P02_C07_MANAGE_MILESTONE_TASKS-nav-bar'>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-nav-bar-left'>
                    {/* <img 
                        className='P02_C07_MANAGE_MILESTONE_TASKS-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    /> */}
                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "create_task" ) !== -1 ?
                        <img 
                            className='P02_C07_MANAGE_MILESTONE_TASKS-icons' 
                            src={create_new} alt='' 
                            onClick={() => set_createMode(!createMode)} 
                        /> : 
                        <div></div>
                    }
                </div>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-nav-bar-right'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                        <input 
                            className='P02_C07_MANAGE_MILESTONE_TASKS-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img 
                            className='P02_C07_MANAGE_MILESTONE_TASKS-img' 
                            src={magnifier} 
                            alt='' 
                        />
                    </div>
                    <img className='P02_C07_MANAGE_MILESTONE_TASKS-icons' src={edit_panels} alt='' />
                    <img 
                        className='P02_C07_MANAGE_MILESTONE_TASKS-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input 
                        type='button' 
                        className='P02_C07_MANAGE_MILESTONE_TASKS-button' 
                        value={'X'} 
                        onClick={() => dispatch(dashboardActions.set_showModal_manageTasks(false))} 
                    />
                </div>
            </div>
            <div className='P02_C07_MANAGE_MILESTONE_TASKS-content'>
                <table>
                    <thead>
                        <tr>
                            <th>task</th>
                            <th>milestone</th>
                            <th>hours</th>
                            <th>task</th>
                            <th>document</th>
                            <th>possible</th>
                        </tr>
                        <tr>
                            <th>id</th>
                            <th>type</th>
                            <th>status (%)</th>
                            <th>deadline</th>
                            <th>deadline</th>
                            <th>name</th>
                            <th>estimated</th>
                            <th>booked</th>
                            <th>comment</th>
                            <th>number</th>
                            <th>status</th>
                            <th>status updated</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {tasks.map((task, index) => {
                            let certificationDocument = undefined;

                            if (task.certification_document !== null) {
                                // certificationDocument = certificationDocuments.find(elem => elem.id === task.certification_document).number;
                            }

                            // console.log("certificationDocuments: ", certificationDocuments.length);
                            // console.log("certificationDocuments: ", task.certification_document);
                            // console.log("certificationDocuments: ", certificationDocuments.find((elem) => elem.id === task.certification_document).number);

                            return <tr key={Math.random() * 100000}>
                                <td>{task.task_id}</td>
                                <td>{task.task_type_name}</td>
                                <td>{task.task_status_percentage}</td>
                                <td>{task.task_deadline != null ? moment(task.task_deadline).format("DD-MMM-YYYY") : ''}</td>
                                <td>{task.milestone_deadline != null ? moment(task.milestone_deadline).format("DD-MMM-YYYY") : ''}</td>
                                <td>{task.milestone_short_name}</td>
                                <td>{task.task_estimated_hours}</td>
                                <td>{task.task_booked_hours}</td>
                                <td>{task.task_comment}</td>
                                <td>{task.document_number}</td>
                                <td>{task.document_acceptance_status}</td>
                                <td>{task.document_last_status_update}</td>
                                <td>
                                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_task" ) !== -1 ?
                                        <img 
                                            className='P02_C07_MANAGE_MILESTONE_TASKS-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(task, index)} 
                                        /> :
                                        <div></div>
                                    } 
                                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "delete_task" ) !== -1 ?
                                        <img 
                                            className='P02_C07_MANAGE_MILESTONE_TASKS-icons' 
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
            <div className={createMode || updateMode ? 'P02_C07_MANAGE_MILESTONE_TASKS-win-footer' : 'P02_C07_MANAGE_MILESTONE_TASKS-win-footer-hidden'}>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row1'>
                    { updateMode ? 
                        <div></div> :
                        <label 
                            htmlFor='milestone_item_type' 
                            className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1'
                        >task type</label>

                    }
                    { updateMode ?
                        <div></div> :
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                            <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                                <select 
                                    id="task_type" 
                                    // value={'hello world'}
                                >
                                    <option value='' id='default-milestonetype'>--Please choose an option--</option>
                                    {taskTypes.map((item) => {
                                        return <option 
                                            key={Math.random() * 100000} 
                                            id={`task_type_${item.id}`} 
                                            value={`${item.name}`}
                                            // onClick={() => set_activeTaskType(item)}
                                            onChange={() => set_activeTaskType(item)}
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
                            className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1-w2'
                        >certification document</label>
                    }
                    { updateMode ?
                        <div></div> :
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                            <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
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
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row1'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1'>status (%)</div>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                            <input 
                                className='P02_C07_MANAGE_MILESTONE_TASKS-textbox' 
                                type='number' 
                                id='status' 
                                placeholder='...' 
                                // value={taskStatus}
                                // onChange={(e) => set_taskStatus(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row1'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1'>estimated hours</div>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                            <input 
                                className='P02_C07_MANAGE_MILESTONE_TASKS-textbox' 
                                type='number' 
                                id='estimated_hours' 
                                placeholder='...' 
                                // value={taskEstimatedHours}
                                // onChange={(e) => set_taskEstimatedHours(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row1'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1'>booked hours</div>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                            <input 
                                className='P02_C07_MANAGE_MILESTONE_TASKS-textbox' 
                                type='number' 
                                id='booked_hours' 
                                placeholder='...'
                                // value={taskBookedHours}
                                // onChange={(e) => set_taskBookedHours(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row1'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1'>comment</div>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                            <input 
                                className='P02_C07_MANAGE_MILESTONE_TASKS-textbox' 
                                type='text' 
                                id='comment' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row1'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1'>milestone</div>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                            <select // TODO:
                                    id="milestone" 
                                >
                                    <option value='' id='default-milestonetype'>--Please choose an option--</option>
                                    {activeProject.milestone_items.map((item, index) => {
                                        return <option 
                                            key={Math.random() * 100000} 
                                            id={`${item.id}`} 
                                            value={`${item.id}`}
                                            selected={item.id === activeMilestone.id}
                                        >{`${item.name}`}
                                        </option>
                                    })}
                                </select>
                        </div>
                    </div>
                </div>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row1'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col1'>deadline</div> 
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row1-col2'>
                        <div className='P02_C07_MANAGE_MILESTONE_TASKS-textbox-container'>
                            <input 
                                className='P02_C07_MANAGE_MILESTONE_TASKS-textbox' 
                                type='date' 
                                id='deadline' 
                                // placeholder='...' 
                                // value={'1.1.2024'}
                            />
                        </div>
                    </div>
                </div>
                <div className='P02_C07_MANAGE_MILESTONE_TASKS-footer-row2'>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border P02_C07_MANAGE_MILESTONE_TASKS-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='P02_C07_MANAGE_MILESTONE_TASKS-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='P02_C07_MANAGE_MILESTONE_TASKS-row2-col2'>
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