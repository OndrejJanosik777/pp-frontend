import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.scss';

const CreateTaskModal = (props) => {
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
    const [taskTypes, setTaskTypes] = useState([]);
    const [showSpinnerCreate, setShowSpinnerCreate] = useState(false);

    useEffect(() => {
        fetchTasksTypes();

        // if (props.milestoneItem !== undefined) {
        //     document.getElementById('name').value = props.milestoneItem.name;
        //     document.getElementById('deadline').value = props.milestoneItem.date;
        //     document.getElementById('comment').value = props.milestoneItem.comment;
        // }

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
                setTaskTypes([...response.data]);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching milestone item types');
            })
    }

    const createNewTask = async () => {
        console.log('inside function createNewTask');

        const taskType = document.getElementById('taskType')
        const estimatedHours = document.getElementById('estimatedHours')
        const bookedHours = document.getElementById('bookedHours')
        const status = document.getElementById('status')
        const comment = document.getElementById('comment')
        // const commentElement = document.getElementById('status')

        if (taskType.value === "") return alert('task type is missing');
        if (estimatedHours.value === "") return alert('estimated hours is missing');
        if (bookedHours.value === "") return alert('booked hours is missing');
        if (status.value === "") return alert('status is missing');
        if (comment.value === "") return alert('comment is missing');

        const selectedTaskType = taskTypes.find((element) => element.name === taskType.value)

        let newMilestoneItemId = {};

        setShowSpinnerCreate(true);

        console.log(`task type id: ${selectedTaskType.id} milestone item id: ${props.milestoneItem.id}`);

        // first create a milestone
        // try {
        //     const response = await axios({
        //         method: 'post',
        //         url: baseUrl + '/company/milestone-items/',
        //         headers: {
        //             "Authorization": token
        //         },
        //         data: {
        //             name: nameElement.value,
        //             milestone_item_type: selectedMilestoneItemType.id,
        //             date: deadlineElement.value,
        //             comment: commentElement.value,
        //             project: props.project.id,
        //         }
        //     })

        //     // console.log('response.data: ', response.data)
        //     newMilestoneItemId = response.data.id;
        // }
        // catch (error) {
        //     console.log(error);

        //     alert('problem with creating new milestone item')

        //     setShowSpinnerCreate(false);

        //     props.toogleVisibility();
        // }

        // create a milestone
        axios({
            method: 'post',
            url: baseUrl + `/company/tasks/`,
            headers: {
                "Authorization": token
            },
            data: {
                task_type: selectedTaskType.id,
                estimated_hours: estimatedHours.value,
                booked_hours: bookedHours.value,
                comment: comment.value,
                milestone_item: props.milestoneItem.id,
                status: status.value,
                users: [],
                certification_document: null,
            }
        })
            .then((response => {
                console.log('task created sucesfully: ', response.data);

                props.updateProject(props.project.id);

                setShowSpinnerCreate(false);

                props.toogleVisibility();
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with creating new task')

                setShowSpinnerCreate(false);

                props.toogleVisibility();
            })
    }

    const handleChanges = () => {
        if (props.project !== undefined && props.milestoneItem !== undefined) {
            createNewTask();
        }
        else {
            console.log('updating existing milestone item')
        }
    }

    const showState = () => {
        console.log('milestoneItemTypes: ', taskTypes);
    }

    return (<div className='create-milestoneItem-modal'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4' onClick={showState}>NEW TASK FOR {props.milestoneItem.milestone_item_type.short_name}</div>
            <div className='row'>
                <label htmlFor="taskType">Choose a task type:</label>
                <select id="taskType" name="taskType" >
                    <option value="">--Please choose an option--</option>
                    {taskTypes.map((type) => {
                        return <option key={Math.random() * 100000}>{`${type.name}`}</option>;
                    })}
                </select>
            </div>
            <div>{props.project.short_name}</div>
            <div className="form-floating mb-3">
                <input type="number" className="form-control" id="estimatedHours" min={0} defaultValue={40} />
                <label htmlFor="estimatedHours">estimated hours</label>
            </div>
            <div className="form-floating mb-3">
                <input type="number" className="form-control" id="bookedHours" min={0} defaultValue={0} />
                <label htmlFor="bookedHours">booked hours</label>
            </div>
            <div className="form-floating mb-3">
                <input type="number" className="form-control" id="status" min={0} max={100} defaultValue={0} />
                <label htmlFor="status">{'status (%)'}</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="comment" />
                <label htmlFor="comment">comment</label>
            </div>
            {/* TODO: add fields for users and certification documents */}
            <div className='actions'>
                {showSpinnerCreate ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                    :
                    <button type="button" className="btn btn-primary close" onClick={createNewTask}>CREATE</button>
                }
                <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
            </div>
        </div>
    </div>);
}

export default CreateTaskModal;