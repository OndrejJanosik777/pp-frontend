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
// actions to dispatch
import * as apiActions from '../../../app/features/api/apiSlice';
import * as dashboardActions from '../../../app/features/dashboardSlice';
// styles
import './index.scss';
 
const P02_C06_MANAGE_MILESTONES = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    const userPermissions = useSelector(state => state.api.userProfile.groups);
    const baseUrl = useSelector(state => state.api.baseUrl);
    const milestoneTypes = useSelector(state => state.api.milestoneTypes);
    const activeProject = useSelector(state => state.dashboard.activeProject);
    // 
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    // array to store milestones in project format
    const [milestones_reduxFormat, set_milestones_reduxFormat] = useState([{
        id: null,
        name: null,
        milestone_item_type: {
            id: null,
            name: null,
            short_name: null,
            color: null
        },
        date: null,
        comment: null,
        color: null,
        tasks: []
    }]);
    // array to store milestones in local state format (not all attributes are shown )
    const [milestones_localStateFormat ,set_milestones_localStateFormat] = useState([{
        milestone_id: null,
        milestone_type: {
            id: null,
            name: null,
            short_name: null,
            color: null
        },
        milestone_name: null,
        milestone_date: null,
        milestone_comment: null,
    }]);
    // object represents project, where milestone belongs
    // const [activeProject, set_activeProject] = useState({...props.activeProject});
    
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);

    useEffect(() => {
        // 
        set_milestones_reduxFormat([...activeProject.milestone_items]);

        //
        let extractedMilestones = [];

        activeProject.milestone_items.map((item) => {
            let newMilestone = {
                milestone_id: item.id,
                milestone_type: {...item.milestone_item_type},
                milestone_name: item.name,
                milestone_date: item.date,
                milestone_comment: item.comment
            };

            extractedMilestones.push({...newMilestone});
        })

        console.log('updatedMilestones: ', extractedMilestones);

        set_milestones_localStateFormat([...extractedMilestones]);
    }, []);
    
    const showState = () => {
        console.log('milestones_reduxFormat: ', milestones_reduxFormat);
        console.log('milestone_localStateFormat: ', milestones_localStateFormat);
        console.log('activeProject: ', activeProject);
    }

    const createNewItem = () => {
        // 1 - create new item in database
        // 2 - create new item in local state
        // 3 - create new item in redux store

        const name = document.getElementById('name').value;
        const milestone_item_type = document.getElementById('milestone_item_type').value;
        const date = document.getElementById('date').value;
        const comment = document.getElementById('comment').value;
        const tasks = [];

        const milestoneTypeIndex = milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)

        set_showSpinner_CreateUpdateItem(true);

        if (name === "") return alert('missing input');
        if (milestoneTypes[milestoneTypeIndex].id === "") return alert('missing input');
        if (date === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (tasks === "") return alert('missing input');
        if (activeProject.id === "") return alert('missing input');

        let newMilestone_reduxFormat = {
            id: null,
            name: name,
            milestone_item_type: {...milestoneTypes[milestoneTypeIndex]},
            date: date,
            comment: comment,
            color: milestoneTypes[milestoneTypeIndex].color,
            tasks: tasks,
        }

        let newMilestone_localStateFormat = {
            milestone_id: null,
            milestone_name: name,
            milestone_type: {...milestoneTypes[milestoneTypeIndex]},
            milestone_date: date,
            milestone_comment: comment,
        }

        // 1 - 
        axios({
            method: 'post',
            url: baseUrl + `/company/milestone-items/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: newMilestone_localStateFormat.milestone_name,
                milestone_item_type: newMilestone_localStateFormat.milestone_type.id,
                date: newMilestone_localStateFormat.milestone_date,
                comment: newMilestone_localStateFormat.milestone_comment,
                project: activeProject.id
            }
        })
        .then((response => {
            console.log('milestone created succesfully: ', response.data);

            newMilestone_reduxFormat.id = response.data.id;
            newMilestone_localStateFormat.milestone_id = response.data.id;

            // 2 - 

            let new_milestones_localStateFormat = [...milestones_localStateFormat, newMilestone_localStateFormat];
            new_milestones_localStateFormat.sort((a, b) => {
                return moment(a.milestone_date) - moment(b.milestone_date);
            });
            set_milestones_localStateFormat([...new_milestones_localStateFormat]);

            // 3 - 

            let new_milestones_reduxFormat = [...milestones_reduxFormat, newMilestone_reduxFormat];
            new_milestones_reduxFormat.sort((a, b) => {
                return moment(a.date) - moment(b.date);
            });
            set_milestones_reduxFormat([...new_milestones_reduxFormat]);
            let updatedProject = {...activeProject};
            updatedProject.milestone_items = [...new_milestones_reduxFormat];
            dispatch(apiActions.update_project(updatedProject));

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            set_showSpinner_CreateUpdateItem(false);

            let message = error.message + "\n" + error.response.data;

            alert("Problem with creating new milestone item");

            alert(message);
        })
    }

    const deleteItem = (milestone) => {
        // 1 - delete item from database
        // 2 - delete item from redux store
        // 3 - delete item from local state

        // 3 -
        const index_localState = milestones_localStateFormat.findIndex(elem => elem.milestone_id === milestone.milestone_id);
        const index_reduxStore = milestones_reduxFormat.findIndex(elem => elem.id === milestone.milestone_id);

        let updated_milestones_localStateFormat = [...milestones_localStateFormat];
        updated_milestones_localStateFormat.splice(index_localState, 1);
        set_milestones_localStateFormat([...updated_milestones_localStateFormat]);

        // 2 -
        let updated_milestones_reduxFormat = [...milestones_reduxFormat];
        updated_milestones_reduxFormat.splice(index_reduxStore, 1);
        set_milestones_reduxFormat([...updated_milestones_reduxFormat]);
        let updatedProject = {...activeProject};
        
        updatedProject.milestone_items = [...updated_milestones_reduxFormat];
        dispatch(apiActions.update_project(updatedProject));

        // 1 -
        axios({
            method: 'delete',
            url: baseUrl + `/company/milestone-items/${milestone.milestone_id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // 
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item, index) => {

        document.getElementById('name').value = item.milestone_name;
        document.getElementById('comment').value = item.milestone_comment;
        document.getElementById('date').value = item.milestone_date;

        let firstElem = document.getElementById(`default-milestonetype`);

        firstElem.innerHTML = `${item.milestone_type.short_name} : ${item.milestone_type.name}`;
        firstElem.value = `${item.milestone_type.short_name} : ${item.milestone_type.name}`;

        set_updateMode(true);

        set_selectedItem(item);
    }

    const updateItem = (milestoneItem) => {
        // 1 - update in database
        // 2 - update in local state
        // 3 - update in redux store

        const name = document.getElementById('name').value;
        const milestone_item_type = document.getElementById('milestone_item_type').value;
        const date = document.getElementById('date').value;
        const comment = document.getElementById('comment').value;
        const tasks = milestoneItem.tasks;

        // 

        const milestoneTypeIndex = milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)
        const milestoneIndex = milestones_localStateFormat.findIndex(elem => elem.id === milestoneItem.milestone_id)

        // 

        set_showSpinner_CreateUpdateItem(true);

        if (name === "") return alert('missing input');
        if (milestoneTypes[milestoneTypeIndex].id === "") return alert('missing input');
        if (date === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (tasks === "") return alert('missing input');
        if (activeProject.id === "") return alert('missing input');

        // 1 - 
        axios({
            method: 'put',
            url: baseUrl + `/company/milestone-items/${milestoneItem.milestone_id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                milestone_item_type: milestoneTypes[milestoneTypeIndex].id,
                date: date,
                comment: comment,
                project: activeProject.id,
            }
        })
        .then((response => {
            // 2 -
            let index_localStateFormat = milestones_localStateFormat.findIndex(elem => elem.milestone_id === milestoneItem.milestone_id);

            let updated_milestones_localStateFormat = [...milestones_localStateFormat];

            updated_milestones_localStateFormat[index_localStateFormat] = {
                milestone_id: milestoneItem.milestone_id,
                milestone_type: {...milestoneTypes[milestoneTypeIndex]},
                milestone_name: name,
                milestone_date: date,
                milestone_comment: comment,
            }

            set_milestones_localStateFormat([...updated_milestones_localStateFormat]);

            // 3 - 
            let index_reduxStoreFormat = milestones_reduxFormat.findIndex(elem => elem.id === milestoneItem.milestone_id);

            let updated_milestones_reduxFormat = [...milestones_reduxFormat];

            updated_milestones_reduxFormat[index_reduxStoreFormat] = {
                id: updated_milestones_reduxFormat[index_reduxStoreFormat].id,
                name: name,
                milestone_item_type: {...milestoneTypes[milestoneTypeIndex]},
                date: date,
                comment: comment,
                color: updated_milestones_reduxFormat[index_reduxStoreFormat].color,
                tasks: [...updated_milestones_reduxFormat[index_reduxStoreFormat].tasks]
            }

            set_milestones_reduxFormat([...updated_milestones_reduxFormat]);

            let updated_project = {...activeProject};

            updated_project.milestone_items = [...updated_milestones_reduxFormat];

            dispatch(apiActions.update_project(updated_project));

            // - 
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
                    {  userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "create_milestone_item" ) !== -1 ?
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
                    <img 
                        className='p02-c06-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input 
                        type='button' 
                        className='p02-c06-button' 
                        value={'X'} 
                        onClick={() => dispatch(dashboardActions.set_showModal_manageMilestones(false))} 
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
                        {milestones_localStateFormat.map((milestone, index) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{milestone.milestone_id}</td>
                                <td>{milestone.milestone_type.short_name}</td>
                                <td>{milestone.milestone_name}</td>
                                <td>{milestone.milestone_date != null ? moment(milestone.milestone_date).format("DD-MMM-YYYY") : ''}</td>
                                <td>{milestone.milestone_comment}</td>
                                <td>
                                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_milestone_item" ) !== -1 ? 
                                        <img 
                                            className='p02-c06-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(milestone, index)} 
                                        /> :
                                        <div></div>
                                    }
                                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "delete_milestone_item" ) !== -1 ?
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
                                {milestoneTypes.map((item) => {
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