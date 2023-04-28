import React, { Component } from 'react';
import { useState, useEffect } from 'react';
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

const ManageTasksTypes = (props) => {
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
    const [taskTypes, set_taskTypes] = useState([...props.taskTypes]);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);
    const [showSpinner_FetchingItems, set_showSpinner_FetchingItems] = useState(props.taskTypes.length === 0);
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);

    useEffect(() => {
        if (taskTypes.length === 0) fetchItems();
    }, []);

    const fetchItems = () => {
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

            set_taskTypes([...tasksTypes]);

            set_showSpinner_FetchingItems(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching tasks types');
        })
    }

    const createNewItem = () => {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;

        set_showSpinner_CreateUpdateItem(true);

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
            const newItem = response.data;

            set_taskTypes([...taskTypes, newItem]);
            props.set_taskTypes([...taskTypes, newItem]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log(error);

            let updatedItem = [...taskTypes];

            updatedItem.pop();

            set_taskTypes([...updatedItem]);

            alert('problem with creating new milestone Item Types');

        })
    }

    const deleteItem = (item) => {
        const index = taskTypes.findIndex(elem => elem.id === item.id)

        let updatedItems = [...taskTypes];

        updatedItems.splice(index, 1);

        set_taskTypes([...updatedItems]);

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
                console.log(error);

                alert(error);

                let updatedItems = [...taskTypes];

                set_taskTypes([...updatedItems]);
            })
    }

    const updateItem = (item) => {

        let name = document.getElementById('name').value;
        let description = document.getElementById('description').value;

        if (name === "" && description === "")
        return alert('missing input');

        const index = taskTypes.findIndex(elem => elem.id === item.id)
        let updatedItem = taskTypes[index];

        updatedItem.id = item.id;
        updatedItem.name = name;
        updatedItem.description = description;

        let updatedItems = [...taskTypes];
        updatedItems.splice(index, 1, updatedItem);

        set_taskTypes([...updatedItems]);
        props.set_taskTypes([...updatedItems]);
        set_showSpinner_CreateUpdateItem(true);

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

                set_updateMode(false);
            }))
            .catch((error) => {
                console.log(error);
                alert('problem with updating Milestone Type.')
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
                    <img 
                        className='p02-c04-icons' 
                        src={delete_cross} 
                        alt=''
                    />
                    <img 
                        className='p02-c04-icons' 
                        src={create_new} alt='' 
                        onClick={() => set_createMode(!createMode)} 
                    />
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
                                    <img 
                                        className='p02-c04-icons' 
                                        src={pencil_edit} 
                                        alt='' 
                                        onClick={() => switchToUpdateMode(item)} 
                                    />
                                    <img 
                                        className='p02-c04-icons' 
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

export default ManageTasksTypes;