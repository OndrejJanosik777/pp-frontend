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

const P02_C06_MANAGE_MILESTONES = (props) => {
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
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);
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

        const milestoneTypeIndex = props.milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)

        console.log('creating new milestone...');
        console.log('name...', name);
        console.log('milestone_item_type...', props.milestoneTypes[milestoneTypeIndex].id);
        console.log('date...', date);
        console.log('comment...', comment);
        console.log('tasks...', tasks);
        console.log('props.activeProject.id...', props.activeProject.id);

        set_showSpinner_CreateUpdateItem(true);

        if (name === "") return alert('missing input');
        if (props.milestoneTypes[milestoneTypeIndex].id === "") return alert('missing input');
        if (date === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (tasks === "") return alert('missing input');
        if (props.activeProject.id === "") return alert('missing input');

        let newMilestone = {
            name: name,
            milestone_item_type: {...props.milestoneTypes[milestoneTypeIndex]},
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
                milestone_item_type: props.milestoneTypes[milestoneTypeIndex].id,
                date: date,
                comment: comment,
                project: props.activeProject.id,
            }
        })
        .then((response => {
            console.log('milestone created succesfully: ', response.data);

            let updatedItem = {...props.activeProject};

            let newItem = { ...response.data, tasks: [] };

            // let newItem = { ...response.data };

            newItem.milestone_item_type = {...props.milestoneTypes[milestoneTypeIndex]};

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
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            set_showSpinner_CreateUpdateItem(false);
        })
    }

    const deleteItem = (milestone) => {
        // update in local state

        const milestoneIndex = props.activeProject.milestone_items.findIndex(elem => elem.id === milestone.id)

        let updatedProject = {...props.activeProject};
        let updatedMilestones = [...milestones];

        updatedProject.milestone_items.splice(milestoneIndex, 1);
        updatedMilestones.splice(milestoneIndex, 1);

        props.updateProjectInState(updatedProject);

        set_milestones([...updatedMilestones]);

        // update in backend

        axios({
            method: 'delete',
            url: baseUrl + `/company/milestone-items/${milestone.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item, index) => {
        console.log('function : switchToUpdateMode');
        console.log('updating item: ', item);
        console.log('updating index: ', index);

        document.getElementById('name').value = item.name;
        document.getElementById('comment').value = item.comment;
        document.getElementById('date').value = item.date;
        // document.getElementById(`milestonetypes-container`).selectedIndex = index;
        // let containerElem = document.getElementById(`milestonetypes-container`);
        let firstElem = document.getElementById(`default-milestonetype`);

        // containerElem.selectedIndex = 1;
        // containerElem

        firstElem.innerHTML = `${item.milestone_item_type.short_name} : ${item.milestone_item_type.name}`;
        firstElem.value = `${item.milestone_item_type.short_name} : ${item.milestone_item_type.name}`;

        // console.log('containerElem: ', containerElem);

        // console.log('containerElem.selectedIndex: ', containerElem.selectedIndex);

        set_updateMode(true);

        set_selectedItem(item);
    }

    const updateItem = (milestoneItem) => {
        // console.log('function : updateItem');

        const name = document.getElementById('name').value;
        const milestone_item_type = document.getElementById('milestone_item_type').value;
        const date = document.getElementById('date').value;
        const comment = document.getElementById('comment').value;
        const tasks = milestoneItem.tasks;

        // console.log('milestone_item_type: ', milestone_item_type);

        const milestoneTypeIndex = props.milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)
        const milestoneIndex = props.activeProject.milestone_items.findIndex(elem => elem.id === milestoneItem.id)

        // console.log('index: ', index);

        // console.log('creating new milestone...');
        // console.log('name...', name);
        // console.log('milestone_item_type...', props.milestoneTypes[index].id);
        // console.log('date...', date);
        // console.log('comment...', comment);
        // console.log('tasks...', tasks);
        // console.log('props.activeProject.id...', props.activeProject.id);

        set_showSpinner_CreateUpdateItem(true);

        if (name === "") return alert('missing input');
        if (props.milestoneTypes[milestoneTypeIndex].id === "") return alert('missing input');
        if (date === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (tasks === "") return alert('missing input');
        if (props.activeProject.id === "") return alert('missing input');

        // update in backend

        axios({
            method: 'put',
            url: baseUrl + `/company/milestone-items/${milestoneItem.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                milestone_item_type: props.milestoneTypes[milestoneTypeIndex].id,
                date: date,
                comment: comment,
                project: props.activeProject.id,
            }
        })
        .then((response => {
            // console.log('milestone updated succesfully: ', response.data);

            let updatedProject = {...props.activeProject};

            let updatedItem = { ...response.data, tasks: tasks };

            updatedItem.milestone_item_type = {...props.milestoneTypes[milestoneTypeIndex]};

            updatedProject.milestone_items.splice(milestoneIndex, 1, updatedItem);

            updatedProject.milestone_items.sort((a, b) => {
                return moment(a.date) - moment(b.date);
            });

            props.updateProjectInState(updatedProject);

            set_milestones([...updatedProject.milestone_items]);

            // console.log('milestone updated succesfully: ', updatedItem);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    return ( <div className='p02-c06-manage-milestones'>
        <div className='p02-c06-background'></div>
        <div className='p02-c06-window'>
            <div className='p02-c06-nav-bar'>
                <div className='p02-c06-nav-bar-left'>
                    {/* <img 
                        className='p02-c06-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    /> */}
                    {  userPermissions.findIndex(elem => elem === "all_permissions" || elem === "create_milestone_item" ) !== -1 ?
                        <img 
                            className='p02-c06-icons' 
                            src={create_new} alt='' 
                            onClick={() => set_createMode(!createMode)} 
                        /> :
                        <div></div>
                    }
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
                        {milestones.map((milestone, index) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{milestone.id}</td>
                                <td>{milestone.milestone_item_type.short_name}</td>
                                <td>{milestone.name}</td>
                                <td>{milestone.date}</td>
                                <td>{milestone.comment}</td>
                                <td>
                                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "edit_milestone_item" ) !== -1 ? 
                                        <img 
                                            className='p02-c06-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(milestone, index)} 
                                        /> :
                                        <div></div>
                                    }
                                    { userPermissions.findIndex(elem => elem === "all_permissions" || elem === "delete_milestone_item" ) !== -1 ?
                                        <img 
                                            className='p02-c06-icons' 
                                            src={delete_cross} 
                                            alt='' 
                                            onClick={() => deleteItem(milestone)} 
                                        /> :
                                        <div></div>
                                    }
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
                            <select 
                                id="milestone_item_type" 
                                // selectedIndex={selectedIndex}
                                // onClick={() => console.log('option clicked')}
                                // onChange={document.getElementById(`${item.short_name} : ${item.name}`).selected = true}
                            >
                                <option value="" id='default-milestonetype'>--Please choose an option--</option>
                                {props.milestoneTypes.map((item) => {
                                    return <option 
                                        key={Math.random() * 100000} 
                                        id={`${item.short_name} : ${item.name}`} 
                                        value={`${item.short_name} : ${item.name}`}
                                        // onClick={() => console.log('option clicked.. ')}
                                    >{`${item.short_name} : ${item.name}`}
                                    </option>
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
 
export default P02_C06_MANAGE_MILESTONES;