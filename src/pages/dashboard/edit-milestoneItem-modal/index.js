import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.scss';

const EditMilestoneItemModal = (props) => {
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
    const [milestoneItemTypes, setmilestoneItemTypes] = useState([]);
    const [showSpinnerCreate, setShowSpinnerCreate] = useState(false);

    useEffect(() => {
        fetchMilestoneItemTypes();

        if (props.milestoneItem !== undefined) {
            document.getElementById('name').value = props.milestoneItem.name;
            document.getElementById('deadline').value = props.milestoneItem.date;
            document.getElementById('comment').value = props.milestoneItem.comment;
        }

    }, []);

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

        setShowSpinnerCreate(true);

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

            setShowSpinnerCreate(false);

            props.toogleVisibility();
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

                setShowSpinnerCreate(false);

                props.toogleVisibility();
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching milestone item types')

                setShowSpinnerCreate(false);

                props.toogleVisibility();
            })
    }

    const saveChanges = () => {
        const nameElement = document.getElementById('name')
        const typesElement = document.getElementById('type-select')
        const deadlineElement = document.getElementById('deadline')
        const commentElement = document.getElementById('comment')

        console.log(`nameElement: ${nameElement.value}`);
        console.log(`typesElement: ${typesElement.value}`);
        console.log(`deadlineElement: ${deadlineElement.value}`);
        console.log(`commentElement: ${commentElement.value}`);

        let milestoneItemType = milestoneItemTypes.find(elem => elem.name === typesElement.value);

        if (nameElement.value === "" || typesElement.value === "" || deadlineElement.value === "" || commentElement.value === "") {
            return alert('missing input!')
        }

        let updateMilestoneItem = { ...props.milestoneItem }
        updateMilestoneItem.name = nameElement.value;
        updateMilestoneItem.date = deadlineElement.value;
        updateMilestoneItem.comment = commentElement.value;
        updateMilestoneItem.milestone_item_type = milestoneItemType;


        setShowSpinnerCreate(true);

        console.log(`sending put request: `);
        console.log(`name: ${nameElement.value}`);
        console.log(`milestone_item_type: `, milestoneItemType);
        console.log(`date: ${deadlineElement.value}`);
        console.log(`comment: ${commentElement.value}`);
        console.log(`updateMilestoneItem: `, updateMilestoneItem);

        // update milestoneItem in state (not implemented yet, .. instead fetching of whole project... TODO: better solution?)
        props.toogleVisibility();
        setShowSpinnerCreate(false);

        // update milestoneItem in database
        axios({
            method: 'put',
            url: baseUrl + `/company/milestone-item/${updateMilestoneItem.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: updateMilestoneItem.name,
                milestone_item_type: updateMilestoneItem.milestone_item_type.id,
                date: updateMilestoneItem.date,
                comment: updateMilestoneItem.comment,
            }
        })
            .then((response => {
                console.log('succesfully updated milestoneItem: ');

                props.updateProject(props.project.id);

                // setShowSpinnerCreate(false);

                // props.toogleVisibility();
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with updating milestoneItem.');

                // setShowSpinnerCreate(false);

                // props.toogleVisibility();
            })
    }

    const showState = () => {
        console.log('milestoneItemTypes: ', milestoneItemTypes);
    }

    return (<div className='edit-milestoneItem-modal'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4' onClick={showState}>EDIT MILESTONE</div>
            <div className='text-center fs-4'>({props.project.short_name})</div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" />
                <label htmlFor="name">name</label>
            </div>
            <div className='row'>
                <label htmlFor="type-select">Choose a Milestone type:</label>
                <select name="types" id="type-select">
                    <option value="">{'--Please choose an option--'}</option>
                    {milestoneItemTypes.map((type) => {
                        if (props.milestoneItem.milestone_item_type.name === type.name) {
                            return <option key={Math.random() * 100000} selected>{`${type.name}`}</option>;
                        }
                        else {
                            return <option key={Math.random() * 100000}>{`${type.name}`}</option>;
                        }
                    })}
                </select>
            </div>
            <div className='row'>
                <label htmlFor="deadline">Milestone deadline:</label>
                <input type="date" id="deadline" name="deadline" />
            </div>
            <div className="btn-group">
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" id="comment" />
                <label htmlFor="name">comment</label>
            </div>
            <div className='actions'>
                {showSpinnerCreate ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                    :
                    <button
                        type="button"
                        className="btn btn-primary close"
                        onClick={saveChanges}
                    >
                        SAVE
                    </button>
                }
                <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
            </div>
        </div>
    </div>);
}

export default EditMilestoneItemModal;