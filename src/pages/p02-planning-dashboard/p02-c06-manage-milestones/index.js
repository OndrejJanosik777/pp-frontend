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

const ManageMilestones = (props) => {
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
    const [milestones, set_milestones] = useState([...props.activeProject.milestone_items]);
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);

    useEffect(() => {
        console.log('component ManageMilestones loaded: ... ');
        console.log('props.activeProject: ', props.activeProject);
    }, []);

    
    const showState = () => {
        console.log('props: ', props);
        console.log('milestones: ', milestones);
    }

    const createNewItem = () => {
        // update in local state - no

        const name = document.getElementById('name').value;
        const milestone_item_type = document.getElementById('milestone_item_type').value;
        const date = document.getElementById('date').value;
        const comment = document.getElementById('comment').value;
        const tasks = [];

        const index = props.milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)

        console.log('creating new milestone...');
        console.log('name...', name);
        console.log('milestone_item_type...', props.milestoneTypes[index].id);
        console.log('date...', date);
        console.log('comment...', comment);
        console.log('tasks...', tasks);
        console.log('props.activeProject.id...', props.activeProject.id);

        set_showSpinner_CreateUpdateItem(true);

        if (name === "") return alert('missing input');
        if (props.milestoneTypes[index].id === "") return alert('missing input');
        if (date === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (tasks === "") return alert('missing input');
        if (props.activeProject.id === "") return alert('missing input');

        let newMilestone = {
            name: name,
            milestone_item_type: {...props.milestoneTypes[index]},
            date: date,
            comment: comment,
            tasks: tasks,
            project: props.activeProject.id
        }

        // update project in backend

        axios({
            method: 'post',
            url: baseUrl + `/company/milestone-items/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                milestone_item_type: props.milestoneTypes[index].id,
                date: date,
                comment: comment,
                project: props.activeProject.id,
            }
        })
        .then((response => {
            console.log('milestone created succesfully: ', response.data);

            let updatedItem = {...props.activeProject};

            let newItem = { ...response.data, tasks: [] };

            newItem.milestone_item_type = {...props.milestoneTypes[index]};

            updatedItem.milestone_items = [...milestones, newItem];

            updatedItem.milestone_items.sort((a, b) => {
                return moment(a.date) - moment(b.date);
            })

            props.updateProjectInState(updatedItem);

            set_milestones([...updatedItem.milestone_items]);

            set_showSpinner_CreateUpdateItem(false);

            // props.toogleVisibility();
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with creating new milestone ')

            // set_showSpinner_CreateUpdateItem(false);

            // props.toogleVisibility();
        })
    }

    const deleteItem = (item) => {
        // update in local state

        console.log('deleting milestone...', item.id);

        console.log('props.activeProject: ', props.activeProject);

        const index = props.activeProject.milestone_items.findIndex(elem => elem.id === item.id)

        console.log('index: ', index);

        let updatedItem = {...props.activeProject};

        updatedItem.milestone_items.splice(index, 1);

        console.log('updatedItem: ', updatedItem);

        props.updateProjectInState(updatedItem);

        set_milestones([...updatedItem.milestone_items]);

        // update in backend

        axios({
            method: 'delete',
            url: baseUrl + `/company/milestone-items/${item.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with deleting milestone from backend: ', error);

            // let updatedItems = [...taskTypes];

            // set_taskTypes([...updatedItems]);
        })
    }

    const switchToUpdateMode = (item) => {
        console.log('updating item: ', item);

        set_updateMode(true);
        set_selectedItem(item);

        // document.getElementById('name').value = item.name;
        // document.getElementById('description').value = item.description;
    }

    const updateItem = (item) => {
        

        // let name = document.getElementById('name').value;
        // let description = document.getElementById('description').value;

        // if (name === "" && description === "")
        // return alert('missing input');

        // const index = taskTypes.findIndex(elem => elem.id === item.id)
        // let updatedItem = taskTypes[index];

        // updatedItem.id = item.id;
        // updatedItem.name = name;
        // updatedItem.description = description;

        // let updatedItems = [...taskTypes];
        // updatedItems.splice(index, 1, updatedItem);

        // set_taskTypes([...updatedItems]);
        // set_showSpinner_CreateUpdateItem(true);

        // axios({
        //     method: 'put',
        //     url: baseUrl + `/company/task-types/${item.id}/`,
        //     headers: {
        //         "Authorization": token
        //     },
        //     data: {
        //         id: updatedItem.id,
        //         name: updatedItem.name,
        //         description: updatedItem.description,
        //     }
        // })
        //     .then((response => {
        //         set_showSpinner_CreateUpdateItem(false);

        //         document.getElementById('name').value = "";

        //         document.getElementById('description').value = "";

        //         set_updateMode(false);
        //     }))
        //     .catch((error) => {
        //         console.log(error);
        //         alert('problem with updating Milestone Type.')
        //     })
    }

    return ( <div className='p02-c06-manage-milestones'>
        <div className='p02-c06-background'></div>
        <div className='p02-c06-window'>
            <div className='p02-c06-nav-bar'>
                <div className='p02-c06-nav-bar-left'>
                    <img 
                        className='p02-c06-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    />
                    <img 
                        className='p02-c06-icons' 
                        src={create_new} alt='' 
                        onClick={() => set_createMode(!createMode)} 
                    />
                </div>
                <div className='p02-c06-nav-bar-right'>
                    <div className='p02-c06-textbox-container'>
                        <input 
                            className='p02-c06-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c06-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c06-icons' src={edit_panels} alt='' />
                    <img className='p02-c06-icons' src={questionmark_blue} alt='' />
                    <input 
                        type='button' 
                        className='p02-c06-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
                    />
                </div>
            </div>
            <div className='p02-c06-content'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>type</th>
                            <th>name</th>
                            <th>date</th>
                            <th>comment</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {milestones.map((item) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{item.id}</td>
                                <td>{item.milestone_item_type.short_name}</td>
                                <td>{item.name}</td>
                                <td>{item.date}</td>
                                <td>{item.comment}</td>
                                <td>
                                    <img 
                                        className='p02-c06-icons' 
                                        src={pencil_edit} 
                                        alt='' 
                                        onClick={() => switchToUpdateMode(item)} 
                                    />
                                    <img 
                                        className='p02-c06-icons' 
                                        src={delete_cross} 
                                        alt='' 
                                        onClick={() => deleteItem(item)} 
                                    />
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={createMode || updateMode ? 'p02-c06-win-footer' : 'p02-c06-win-footer-hidden'}>
                <div className='p02-c06-footer-row1'>
                    <div className='p02-c06-row1-col1'>name</div>
                    <div className='p02-c06-row1-col2'>
                        <div className='p02-c06-textbox-container'>
                            <input 
                                className='p02-c06-textbox' 
                                type='text' 
                                id='name' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c06-footer-row1'>
                    <div className='p02-c06-row1-col1'>comment</div>
                    <div className='p02-c06-row1-col2'>
                        <div className='p02-c06-textbox-container'>
                            <input 
                                type='text' 
                                className='p02-c06-textbox' 
                                id='comment' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c06-footer-row1'>
                    <div className='p02-c06-row1-col1'>date</div>
                    <div className='p02-c06-row1-col2'>
                        <div className='p02-c06-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c06-date' 
                                id='date' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c06-footer-row1'>
                    <label 
                        htmlFor='milestone_item_type' 
                        className='p02-c06-row1-col1'
                    >type</label>
                    <div className='p02-c06-row1-col2'>
                        <div className='p02-c06-textbox-container'>
                            <select id="milestone_item_type">
                                <option value="">--Please choose an option--</option>
                                {props.milestoneTypes.map((item) => {
                                    return <option value={`${item.short_name} : ${item.name}`} key={Math.random() * 100000} >{`${item.short_name} : ${item.name}`}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='p02-c06-footer-row2'>
                    <div className='p02-c06-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border p02-c06-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='p02-c06-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='p02-c06-row2-col2'>
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
 
export default ManageMilestones;