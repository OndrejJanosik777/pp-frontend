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

const P02_C10_MANAGE_PROJECT_TASKS = (props) => {
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
    const [tasks, set_tasks] = useState([]);
    const [taskTypes, set_taskTypes] = useState([]);
    const [certificationDocuments, set_certificationDocuments] = useState([]);
    const [certificationDocumentsNoTask, set_certificationDocumentsNoTask] = useState([]);
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);

    useEffect(() => {
        console.log('component P02_C10_MANAGE_PROJECT_TASKS loaded: ... ');
        // console.log('props: ', props);

        fetchProjectDocuments();

        fetchTasks(props.activeProject);
    }, []);

    const showState = () => {
        console.log('...local state of component P02_C10_MANAGE_PROJECT_TASKS...');
        console.log('props: ', props);
        console.log('tasks: ', tasks);
        console.log('certificationDocuments: ', certificationDocuments);
        // console.log('props.activeMilestoneItem: ', props.activeMilestoneItem);
        // console.log('props.activeMilestoneItem.tasks: ', props.activeMilestoneItem.tasks);
        // console.log('createMode: ', createMode);
        // console.log('certificationDocuments: ', certificationDocuments);
        // console.log('certificationDocumentsNoTask: ', certificationDocumentsNoTask);
    }

    const createNewItem = () => {
        // update in local state - no
        // console.log('creating new task')
        // const task_type = props.taskTypes.find(
        //     elem => elem.name === document.getElementById('task_type').value).id;
        // const estimated_hours = document.getElementById('estimated_hours').value;
        // const booked_hours = document.getElementById('booked_hours').value;
        // const comment = document.getElementById('comment').value;
        // const milestone_item = props.activeMilestoneItem.id;
        // const deadline = props.activeMilestoneItem.date;
        // const status = document.getElementById('status').value;
        // const users = [];
        // let certification_document = document.getElementById('certification-document').value;

        // const milestoneTypeIndex = props.milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)

        // console.log('task_type...', task_type);
        // console.log('estimated_hours...', estimated_hours);
        // console.log('booked_hours...', booked_hours);
        // console.log('comment...', comment);
        // console.log('milestone_item...', milestone_item);
        // console.log('status...', status);
        // console.log('users...', users);
        // console.log('certification_document...', certification_document);

        // set_showSpinner_CreateUpdateItem(true);

        // if (task_type === "") return alert('missing task_type');
        // if (estimated_hours === "") return alert('missing estimated_hours');
        // if (booked_hours === "") return alert('missing booked_hours');
        // if (comment === "") return alert('missing comment');
        // if (milestone_item === "") return alert('missing milestone_item');
        // if (status === "") return alert('missing status');
        // if (deadline === "") return alert('missing deadline');
        // // if (users === "") return alert('missing users');
        // if (certification_document === "") return alert('missing certification_document');
        // if (certification_document === "-1") certification_document = null;

        // axios({
        //     method: 'post',
        //     url: baseUrl + `/company/tasks/`,
        //     headers: {
        //         "Authorization": token
        //     },
        //     data: {
        //         task_type: task_type,
        //         estimated_hours: estimated_hours,
        //         booked_hours: booked_hours,
        //         comment: comment,
        //         milestone_item: milestone_item,
        //         status: status,
        //         users: users,
        //         certification_document: certification_document,
        //         deadline: deadline
        //     }
        // })
        // .then((response => {
        //     console.log('task created succesfully: ', response.data);

        //     set_tasks([...tasks, response.data]);

        //     props.updateProject(props.activeProject);

        //     set_showSpinner_CreateUpdateItem(false);

        //     // 
        //     fetchProjectDocuments();
        // }))
        // .catch((error) => {
            // console.log("error: ", error);

            // let message = error.message + "\n" + error.response.data;

            // alert(message);
        // })
    }

    const deleteItem = (task) => {
        // console.log('deleting task: ', task);

        // // update in backend

        // axios({
        //     method: 'delete',
        //     url: baseUrl + `/company/tasks/${task.id}/`,
        //     headers: {
        //         "Authorization": token
        //     }
        // })
        // .then((response => {
        //     fetchProjectDocuments();

        //     let updatedTasks = [...tasks];

        //     let index =  updatedTasks.findIndex(elem => elem.id === task.id);

        //     updatedTasks.splice(index, 1);

        //     set_tasks([...updatedTasks]);

        //     props.updateProject(props.activeProject);
        // }))
        // .catch((error) => {
            // console.log("error: ", error);

            // let message = error.message + "\n" + error.response.data;

            // alert(message);
        // })
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

    const fetchTasks = (project) => {
        axios({
            method: 'get',
            url: baseUrl + `/company/get-tasks/?project_id=${project.id}`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            console.log('project tasks fetched succesfully: ', response.data);

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
        // console.log('Manage Tasks - switchToUpdateMode function');
        // console.log('updating item: ', item);
        // console.log('updating index: ', index);

        // console.log('item.tasktype: ', item.task_type);

        // document.getElementById('task_type').value = newLabel.name;

        // document.getElementById(`milestonetypes-container`).selectedIndex = index;
        // let containerElem = document.getElementById(`milestonetypes-container`);
        // let firstElem = document.getElementById(`default-milestonetype`);

        // containerElem.selectedIndex = 1;
        // containerElem

        // firstElem.innerHTML = `${item.milestone_item_type.short_name} : ${item.milestone_item_type.name}`;
        // firstElem.value = `${item.milestone_item_type.short_name} : ${item.milestone_item_type.name}`;

        // console.log('containerElem: ', containerElem);

        // console.log('containerElem.selectedIndex: ', containerElem.selectedIndex);

        // set_updateMode(true);

        // set_selectedItem(item);
    }

    const updateItem = (milestoneItem) => {
        // // console.log('function : updateItem');

        // const name = document.getElementById('name').value;
        // const milestone_item_type = document.getElementById('milestone_item_type').value;
        // const date = document.getElementById('date').value;
        // const comment = document.getElementById('comment').value;
        // const tasks = milestoneItem.tasks;

        // // console.log('milestone_item_type: ', milestone_item_type);

        // const milestoneTypeIndex = props.milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)
        // const milestoneIndex = props.activeProject.milestone_items.findIndex(elem => elem.id === milestoneItem.id)

        // // console.log('index: ', index);

        // // console.log('creating new milestone...');
        // // console.log('name...', name);
        // // console.log('milestone_item_type...', props.milestoneTypes[index].id);
        // // console.log('date...', date);
        // // console.log('comment...', comment);
        // // console.log('tasks...', tasks);
        // // console.log('props.activeProject.id...', props.activeProject.id);

        // set_showSpinner_CreateUpdateItem(true);

        // if (name === "") return alert('missing input');
        // if (props.milestoneTypes[milestoneTypeIndex].id === "") return alert('missing input');
        // if (date === "") return alert('missing input');
        // if (comment === "") return alert('missing input');
        // if (tasks === "") return alert('missing input');
        // if (props.activeProject.id === "") return alert('missing input');

        // // update in backend

        // axios({
        //     method: 'put',
        //     url: baseUrl + `/company/milestone-items/${milestoneItem.id}/`,
        //     headers: {
        //         "Authorization": token
        //     },
        //     data: {
        //         name: name,
        //         milestone_item_type: props.milestoneTypes[milestoneTypeIndex].id,
        //         date: date,
        //         comment: comment,
        //         project: props.activeProject.id,
        //     }
        // })
        // .then((response => {
        //     // console.log('milestone updated succesfully: ', response.data);

        //     let updatedProject = {...props.activeProject};

        //     let updatedItem = { ...response.data, tasks: tasks };

        //     updatedItem.milestone_item_type = {...props.milestoneTypes[milestoneTypeIndex]};

        //     updatedProject.milestone_items.splice(milestoneIndex, 1, updatedItem);

        //     updatedProject.milestone_items.sort((a, b) => {
        //         return moment(a.date) - moment(b.date);
        //     });

        //     props.updateProjectInState(updatedProject);

        //     set_milestones([...updatedProject.milestone_items]);

        //     // console.log('milestone updated succesfully: ', updatedItem);

        //     set_showSpinner_CreateUpdateItem(false);
        // }))
        // .catch((error) => {
            // console.log("error: ", error);

            // let message = error.message + "\n" + error.response.data;

            // alert(message);
        // })
    }

    return (<div className='p02-c10-manage-project-tasks'>
        <div className='p02-c10-background'></div>
        <div className='p02-c10-window'>
            <div className='p02-c10-nav-bar'>
                <div className='p02-c10-nav-bar-left'>
                    {/* <img 
                        className='p02-c10-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    /> */}
                    {/* { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "create_task" ) !== -1 ?
                        <img 
                            className='p02-c10-icons' 
                            src={create_new} alt='' 
                            onClick={() => set_createMode(!createMode)} 
                        /> : 
                        <div></div>
                    } */}
                </div>
                <div className='p02-c10-nav-bar-right'>
                    <div className='p02-c10-textbox-container'>
                        <input 
                            className='p02-c10-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img 
                            className='p02-c10-img' 
                            src={magnifier} 
                            alt='' 
                        />
                    </div>
                    <img className='p02-c10-icons' src={edit_panels} alt='' />
                    <img 
                        className='p02-c10-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input 
                        type='button' 
                        className='p02-c10-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
                    />
                </div>
            </div>
            <div className='p02-c10-content'>
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

                            console.log("certificationDocuments: ", certificationDocuments.length);
                            // console.log("certificationDocuments: ", task.certification_document);
                            // console.log("certificationDocuments: ", certificationDocuments.find((elem) => elem.id === task.certification_document).number);

                            return <tr key={Math.random() * 100000}>
                                <td>{task.task_id}</td>
                                <td>{task.task_type_name}</td>
                                <td>{task.task_status_percentage}</td>
                                <td>{task.task_deadline}</td>
                                <td>{task.milestone_deadline}</td>
                                <td>{task.milestone_short_name}</td>
                                <td>{task.task_estimated_hours}</td>
                                <td>{task.task_booked_hours}</td>
                                <td>{task.task_comment}</td>
                                <td>{task.document_number}</td>
                                <td>{task.document_acceptance_status}</td>
                                <td>{task.document_last_status_update}</td>
                                <td>
                                    {/* { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "edit_task" ) !== -1 ?
                                        <img 
                                            className='p02-c10-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(task, index)} 
                                        /> :
                                        <div></div>
                                    } 
                                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "delete_task" ) !== -1 ?
                                        <img 
                                            className='p02-c10-icons' 
                                            src={delete_cross} 
                                            alt='' 
                                            onClick={() => deleteItem(task)} 
                                        /> :
                                        <div></div>
                                    } */}
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={createMode || updateMode ? 'p02-c10-win-footer' : 'p02-c10-win-footer-hidden'}>
                <div className='p02-c10-footer-row1'>
                    { updateMode ? 
                        <div></div> :
                        <label 
                            htmlFor='milestone_item_type' 
                            className='p02-c10-row1-col1'
                        >task type</label>

                    }
                    { updateMode ?
                        <div></div> :
                        <div className='p02-c10-row1-col2'>
                            <div className='p02-c10-textbox-container'>
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
                            className='p02-c10-row1-col1-w2'
                        >certification document</label>
                    }
                    { updateMode ?
                        <div></div> :
                        <div className='p02-c10-row1-col2'>
                            <div className='p02-c10-textbox-container'>
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
                <div className='p02-c10-footer-row1'>
                    <div className='p02-c10-row1-col1'>status (%)</div>
                    <div className='p02-c10-row1-col2'>
                        <div className='p02-c10-textbox-container'>
                            <input 
                                className='p02-c10-textbox' 
                                type='number' 
                                id='status' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c10-footer-row1'>
                    <div className='p02-c10-row1-col1'>estimated hours</div>
                    <div className='p02-c10-row1-col2'>
                        <div className='p02-c10-textbox-container'>
                            <input 
                                className='p02-c10-textbox' 
                                type='number' 
                                id='estimated_hours' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c10-footer-row1'>
                    <div className='p02-c10-row1-col1'>booked hours</div>
                    <div className='p02-c10-row1-col2'>
                        <div className='p02-c10-textbox-container'>
                            <input 
                                className='p02-c10-textbox' 
                                type='number' 
                                id='booked_hours' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c10-footer-row1'>
                    <div className='p02-c10-row1-col1'>comment</div>
                    <div className='p02-c10-row1-col2'>
                        <div className='p02-c10-textbox-container'>
                            <input 
                                className='p02-c10-textbox' 
                                type='text' 
                                id='comment' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                {/* <div className='p02-c10-footer-row1'>
                    <div className='p02-c10-row1-col1'>date</div>
                    <div className='p02-c10-row1-col2'>
                        <div className='p02-c10-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c10-date' 
                                id='date' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div> */}
                <div className='p02-c10-footer-row2'>
                    <div className='p02-c10-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border p02-c10-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='p02-c10-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='p02-c10-row2-col2'>
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
 
export default P02_C10_MANAGE_PROJECT_TASKS;