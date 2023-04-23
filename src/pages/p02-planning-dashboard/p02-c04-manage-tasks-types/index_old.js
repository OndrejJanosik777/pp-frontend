import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import editSVG from './assets/pencil-square.svg';
import deleteSVG from './assets/trash3.svg';
import axios from 'axios';
import './index.scss';

const ManageTasksTypes_old = (props) => {
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
    const [tasksTypes, setTasksTypes] = useState([]);
    const [fetchingTasksTypes, setFetchingTasksTypes] = useState(true);
    const [creatingNewMilestoneType, setCreatingNewTaskType] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [updatedId, setUpdatedId] = useState(0);
    const [updatingTaskType, setUpdatingTaskType] = useState(false);

    useEffect(() => {
        fetchTasksTypes();
    }, []);

    const fetchTasksTypes = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/task-types/',
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                console.log('fetch tasks types: ', response.data);
                let tasksTypes = response.data;
                tasksTypes.sort((a, b) => a.id - b.id);

                setTasksTypes([...tasksTypes]);
                setFetchingTasksTypes(false);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching tasks types');
            })
    }

    const createNewTasksType = () => {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        setCreatingNewTaskType(true);

        if (name === "" && description === "")
            return alert('missing input');

        axios({
            method: 'post',
            url: baseUrl + '/company/task-types/',
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                description: description
            }
        })
            .then((response => {
                const newTasksType = response.data;

                setTasksTypes([...tasksTypes, newTasksType]);
                setCreatingNewTaskType(false);
            }))
            .catch((error) => {
                console.log(error);

                let updatedTaskType = [...tasksTypes];

                updatedTaskType.pop();

                setTasksTypes([...updatedTaskType]);

                alert('problem with creating new milestone Item Types');

                setCreatingNewTaskType(false);
            })

    }

    const showState = () => {
        console.log('milestoneTypes: ', tasksTypes)
    }

    const editTaskType = (id) => {
        // alert(`updating milestoneType ${id}`);

        const index = tasksTypes.findIndex(elem => elem.id === id);
        let selectedTaskType = tasksTypes[index];

        document.getElementById('name').value = selectedTaskType.name;
        document.getElementById('description').value = selectedTaskType.description;

        setUpdateMode(true);
        setUpdatedId(id);
    }

    const deleteTaskType = (id) => {
        // alert(`deleting milestoneType ${id}`);

        const index = tasksTypes.findIndex(elem => elem.id === id)

        let updatedMilestoneTypes = [...tasksTypes];
        updatedMilestoneTypes.splice(index, 1);

        setTasksTypes([...updatedMilestoneTypes]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/task-types/${id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {

            }))
            .catch((error) => {
                console.log(error);

                alert('cannot delete this task type. It is used in Project.')

                let updatedTaskTypes = [...tasksTypes];

                setTasksTypes([...updatedTaskTypes]);
            })
    }

    const updateTaskType = () => {
        // alert(`updating milestoneType ${id}`);
        let newName = document.getElementById('name').value;
        let newDescription = document.getElementById('description').value;

        const index = tasksTypes.findIndex(elem => elem.id === updatedId)
        let updatedTasksType = tasksTypes[index];
        updatedTasksType.id = updatedId;
        updatedTasksType.name = newName;
        updatedTasksType.description = newDescription;

        let updatedMilestoneTypes = [...tasksTypes];
        updatedMilestoneTypes.splice(index, 1, updatedTasksType);

        setTasksTypes([...updatedMilestoneTypes]);
        setUpdatingTaskType(true);

        axios({
            method: 'put',
            url: baseUrl + `/company/task-types/${updatedId}/`,
            headers: {
                "Authorization": token
            },
            data: {
                id: updatedTasksType.id,
                name: updatedTasksType.name,
                description: updatedTasksType.description,
            }
        })
            .then((response => {
                setUpdatingTaskType(false);
                setUpdateMode(false);
                document.getElementById('name').value = "";
                document.getElementById('description').value = "";
            }))
            .catch((error) => {
                console.log(error);
                alert('problem with updating Milestone Type.')
            })
    }

    return (<div className='manage-milestone-types'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4' onClick={showState}>MANAGE TASK TYPES</div>
            {fetchingTasksTypes ?
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
                :
                <div>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">name</th>
                                <th scope="col">description</th>
                                <th scope="col">edit</th>
                                <th scope="col">delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasksTypes.map((taskType) => {
                                return <tr key={Math.random() * 100000}>
                                    <th scope="row">{taskType.id}</th>
                                    <td>{taskType.name}</td>
                                    <td>{taskType.description}</td>
                                    <td><img className='icons' src={editSVG} alt='' onClick={() => editTaskType(taskType.id)} /></td>
                                    <td><img className='icons' src={deleteSVG} alt='' onClick={() => deleteTaskType(taskType.id)} /></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="name" />
                        <label htmlFor="name">name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="description" />
                        <label htmlFor="description">description</label>
                    </div>
                    {updateMode ?
                        <div className='actions'>
                            {updatingTaskType ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <button type="button" className="btn btn-primary close" onClick={updateTaskType}>UPDATE</button>
                            }
                            <button type="button" className="btn btn-danger close" onClick={() => setUpdateMode(false)}>CANCEL UPDATE</button>
                        </div>
                        :
                        <div className='actions'>
                            {creatingNewMilestoneType ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <button type="button" className="btn btn-primary close" onClick={createNewTasksType}>CREATE</button>
                            }
                            <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
                        </div>
                    }
                </div>
            }
        </div>
    </div>);
}

export default ManageTasksTypes_old;