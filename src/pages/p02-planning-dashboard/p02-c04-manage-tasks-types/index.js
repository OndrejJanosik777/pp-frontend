import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import editSVG from './assets/pencil-square.svg';
import deleteSVG from './assets/trash3.svg';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import pencil_edit from './assets/pencil_edit.png';
import magnifier from './assets/magnifier.png';
import axios from 'axios';
import './index.scss'; 
import { update_TaskTypes } from '../../../app/features/api/apiSlice';

const P02_C04_MANAGE_TASK_TYPES = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let taskTypes = useSelector(state => state.api.taskTypes);
    let userPermissions = useSelector(state => state.api.userProfile.groups);
    let baseUrl = useSelector(state => state.api.baseUrl);

    // local component state
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);
    const [showSpinner_FetchingItems, set_showSpinner_FetchingItems] = useState(props.taskTypes.length === 0);
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState({
        id: undefined,
        name: undefined,
        description: undefined,
    });

    useEffect(() => {
        if (taskTypes.length === 0) fetchItems();
    }, []);

    const fetchItems = () => {
        // console.log('fetching project with id: ', projectId);

        // axios({
        //     method: 'get',
        //     url: baseUrl + '/company/task-types/',
        //     headers: {
        //         "Authorization": token
        //     }
        // })
        // .then((response => {
        //     console.log('fetch tasks types: ', response.data);

        //     let tasksTypes = response.data;

        //     tasksTypes.sort((a, b) => a.id - b.id);

        //     set_taskTypes([...tasksTypes]);

        //     set_showSpinner_FetchingItems(false);
        // }))
        // .catch((error) => {
        //     console.log("error: ", error);

        //     let message = error.message + "\n" + error.response.data;

        //     alert(message);
        // })
    }

    const createNewItem = () => {
        // function will create new item in redux state and database
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;

        set_showSpinner_CreateUpdateItem(true);

        if (name === "" && description === "")
            return alert('missing input');

        // update in database and after success in redux state
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
            dispatch(update_TaskTypes([...taskTypes, response.data]));

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const deleteItem = (item) => {
        // function will delete item from redux state and database
        const index = taskTypes.findIndex(elem => elem.id === item.id)
        let originalItems = [...taskTypes];
        let updatedItems = [...taskTypes];

        updatedItems.splice(index, 1);

        // update in redux state
        dispatch(update_TaskTypes(updatedItems));

        axios({
            method: 'delete',
            url: baseUrl + `/company/task-types/${item.id}/`,
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

            // in case of failure restore originalItem in Redux store
            dispatch(update_TaskTypes(originalItems));
        })
    }

    const updateItem = (item) => {
        // function will update item in state and database
        let name = document.getElementById('name').value;
        let description = document.getElementById('description').value;

        if (name === "" && description === "")
        return alert('missing input');

        const index = taskTypes.findIndex(elem => elem.id === item.id)

        let updatedItem = {
            id: item.id,
            name: name,
            description: description,
        };

        let updatedItems = [...taskTypes];
        updatedItems.splice(index, 1, updatedItem);

        set_showSpinner_CreateUpdateItem(true);

        // update item in database and in redux store
        axios({
            method: 'put',
            url: baseUrl + `/company/task-types/${item.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                id: updatedItem.id,
                name: updatedItem.name,
                description: updatedItem.description,
            }
        })
        .then((response => {
            set_showSpinner_CreateUpdateItem(false);

            document.getElementById('name').value = "";
            document.getElementById('description').value = "";

            dispatch(update_TaskTypes(updatedItems));

            set_updateMode(false);

            set_selectedItem({
                id: undefined,
                name: undefined,
                description: undefined,
            });
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item) => {
        set_updateMode(true);
        set_selectedItem(item);

        document.getElementById('name').value = item.name;
        document.getElementById('description').value = item.description;
    }

    return (<div className='p02-c04-component'>
        <div className='p02-c04-background'></div>
        <div className='p02-c04-window'>
            <div className='p02-c04-nav-bar'>
                <div className='p02-c04-nav-bar-left'>
                    {/* <img 
                        className='p02-c04-icons' 
                        src={delete_cross} 
                        alt=''
                    /> */}
                    {userPermissions.findIndex(elem => elem.name === "all_permissions") !== -1 ?
                        <img 
                            className='p02-c04-icons' 
                            src={create_new} alt='' 
                            onClick={() => set_createMode(!createMode)} 
                        /> :
                        <div></div>
                    }
                </div>
                <div className='p02-c04-nav-bar-right'>
                    <div className='p02-c04-textbox-container'>
                        <input 
                            className='p02-c04-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c04-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c04-icons' src={edit_panels} alt='' />
                    <img className='p02-c04-icons' src={questionmark_blue} alt='' />
                    <input 
                        type='button' 
                        className='p02-c04-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
                    />
                </div>
            </div>
            {showSpinner_FetchingItems ?
            <div className='p02-c04-fetching-items'>
                Loading...
                <div className="spinner-border p02-c04-spinner" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
            :
            <div className='p02-c04-content'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>description</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {taskTypes.map((item) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>
                                    {userPermissions.findIndex(elem => elem.name === "all_permissions") !== -1 ? 
                                        <img 
                                            className='p02-c04-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(item)} 
                                        /> :
                                        <div></div>
                                    }
                                    {userPermissions.findIndex(elem => elem.name === "all_permissions") !== -1 ? 
                                        <img 
                                            className='p02-c04-icons' 
                                            src={delete_cross} 
                                            alt='' 
                                            onClick={() => deleteItem(item)} 
                                        /> :
                                        <div></div>
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            }
            <div className={createMode || updateMode ? 'p02-c04-win-footer' : 'p02-c04-win-footer-hidden'}>
                <div className='p02-c04-footer-row1'>
                    <div className='p02-c04-row1-col1'>name</div>
                    <div className='p02-c04-row1-col2'>
                        <div className='p02-c04-textbox-container'>
                            <input 
                                className='p02-c04-textbox' 
                                type='text' 
                                id='name' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c04-footer-row1'>
                    <div className='p02-c04-row1-col1'>description</div>
                    <div className='p02-c04-row1-col2'>
                        <div className='p02-c04-textbox-container'>
                            <input 
                                type='text' 
                                className='p02-c04-textbox' 
                                id='description' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c04-footer-row2'>
                    <div className='p02-c04-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border p02-c04-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='p02-c04-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='p02-c04-row2-col2'>
                        <input 
                            type='button' 
                            className='p02-c04-button' 
                            value={updateMode ? 'Cancel' : 'Close'} 
                            onClick={updateMode ? () => set_updateMode(false) : () => set_createMode(false)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default P02_C04_MANAGE_TASK_TYPES;