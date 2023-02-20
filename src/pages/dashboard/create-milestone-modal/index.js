import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.scss';

const AddMilestoneModal = (props) => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [loaded, setLoaded] = useState([]);
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [milestoneItemTypes, setmilestoneItemTypes] = useState([]);

    useEffect(() => {
        fetchMilestoneItemTypes();
    }, [loaded]);

    const fetchMilestoneItemTypes = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/milestone-item-type/',
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                setmilestoneItemTypes([...response.data]);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching milestone item types')
            })
    }

    const createNewMilestone = async () => {
        const nameElement = document.getElementById('name')
        const typesElement = document.getElementById('type-select')
        const deadlineElement = document.getElementById('deadline')
        const commentElement = document.getElementById('comment')

        if (nameElement.value === "" || typesElement.value === "" || deadlineElement.value === "" || commentElement.value === "") {
            return alert('missing input!')
        }

        const selectedMilestoneItemType = milestoneItemTypes.find((element) => element.name === typesElement.value)

        let newMilestoneItemId = {};

        props.toogleVisibility();

        // first create a milestone
        try {
            const response = await axios({
                method: 'post',
                url: baseUrl + '/company/milestone-item/',
                headers: {
                    "Authorization": token
                },
                data: {
                    name: nameElement.value,
                    milestone_item_type: selectedMilestoneItemType.id,
                    date: deadlineElement.value,
                    comment: commentElement.value
                }
            })

            // console.log('response.data: ', response.data)
            newMilestoneItemId = response.data.id;
        }
        catch (error) {
            console.log(error);

            alert('problem with creating new milestone item')
        }

        // now assign new milestone to project
        axios({
            method: 'post',
            url: baseUrl + `/company/register-milestone`,
            headers: {
                "Authorization": token
            },
            data: {
                projectId: props.project.id,
                newMilestoneItemId: newMilestoneItemId
            }
        })
            .then((response => {
                // console.log('succesfully assigned to project: ', response.data);

                props.updateProject(props.project.id);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching milestone item types')
            })
    }

    const showState = () => {
        console.log('milestoneItemTypes: ', milestoneItemTypes);
    }

    return (<div className='milestone-info'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4' onClick={showState}>NEW MILESTONE</div>
            <div>{props.project.short_name}</div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" />
                <label htmlFor="name">name</label>
            </div>
            <div className='row'>
                <label for="type-select">Choose a Milestone type:</label>
                <select name="types" id="type-select">
                    <option value="">--Please choose an option--</option>
                    {milestoneItemTypes.map((type) => {
                        return <option>{`${type.name}`}</option>;
                    })}
                </select>
            </div>
            <div className='row'>
                <label for="deadline">Milestone deadline:</label>
                <input type="date" id="deadline" name="deadline" />
            </div>
            <div className="btn-group">
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="comment" />
                <label htmlFor="name">comment</label>
            </div>
            <div className='actions'>
                <button type="button" className="btn btn-primary close" onClick={createNewMilestone}>CREATE</button>
                <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
            </div>
        </div>
    </div>);
}

export default AddMilestoneModal;