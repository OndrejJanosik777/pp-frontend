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

const ManageMilestoneTypes = (props) => {
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
    const [milestoneTypes, set_milestoneTypes] = useState([]);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);
    const [showSpinner_FetchingItems, set_showSpinner_FetchingItems] = useState(true);
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/milestone-item-types/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            let milestoneTypes = response.data;
            milestoneTypes.sort((a, b) => a.id - b.id);

            set_milestoneTypes([...milestoneTypes]);

            set_showSpinner_FetchingItems(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching milestone item types')
        })
    }

    const createNewItem = () => {
        const name = document.getElementById('name').value;
        const short_name = document.getElementById('short_name').value;

        set_showSpinner_CreateUpdateItem(true);

        if (name === "" && short_name === "")
            return alert('missing input');

        axios({
            method: 'post',
            url: baseUrl + '/company/milestone-item-types/',
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                short_name: short_name
            }
        })
        .then((response => {
            const newMilestoneItem = response.data;

            set_milestoneTypes([...milestoneTypes, newMilestoneItem]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log(error);

            let updatedMilestoneItems = [...milestoneTypes];

            updatedMilestoneItems.pop();

            set_milestoneTypes([...updatedMilestoneItems]);

            alert('problem with creating new milestone Item Types');

        })
    }

    const deleteItem = (item) => {
        const index = milestoneTypes.findIndex(elem => elem.id === item.id)
        let deletedMilestoneType = milestoneTypes[index];

        let updatedMilestoneTypes = [...milestoneTypes];
        updatedMilestoneTypes.splice(index, 1);

        set_milestoneTypes([...updatedMilestoneTypes]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/milestone-item-types/${item.id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                
            }))
            .catch((error) => {
                console.log(error);

                alert(error);

                let updatedMilestoneTypes = [...milestoneTypes];

                set_milestoneTypes([...updatedMilestoneTypes]);
            })
    }

    const updateItem = (item) => {

        let name = document.getElementById('name').value;
        let short_name = document.getElementById('short_name').value;

        if (name === "" && short_name === "")
        return alert('missing input');

        const index = milestoneTypes.findIndex(elem => elem.id === item.id)
        let updatedMilestoneType = milestoneTypes[index];

        updatedMilestoneType.id = item.id;
        updatedMilestoneType.name = name;
        updatedMilestoneType.short_name = short_name;

        let updatedMilestoneTypes = [...milestoneTypes];
        updatedMilestoneTypes.splice(index, 1, updatedMilestoneType);

        set_milestoneTypes([...updatedMilestoneTypes]);
        set_showSpinner_CreateUpdateItem(true);

        axios({
            method: 'put',
            url: baseUrl + `/company/milestone-item-types/${item.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                id: updatedMilestoneType.id,
                name: updatedMilestoneType.name,
                short_name: updatedMilestoneType.short_name,
            }
        })
            .then((response => {
                set_showSpinner_CreateUpdateItem(false);

                document.getElementById('name').value = "";

                document.getElementById('short_name').value = "";

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

        document.getElementById('short_name').value = item.short_name;
        document.getElementById('name').value = item.name;
    }

    const showState = () => {
        console.log('milestoneTypes: ', milestoneTypes)
    }

    return (<div className='p02-c03-manage-milestone-types'>
        <div className='p02-c03-background'></div>
        <div className='p02-c03-window'>
            <div className='p02-c03-nav-bar'>
                <div className='p02-c03-nav-bar-left'>
                    <img 
                        className='p02-c03-icons' 
                        src={delete_cross} 
                        alt=''
                    />
                    <img 
                        className='p02-c03-icons' 
                        src={create_new} alt='' 
                        onClick={() => set_createMode(!createMode)} 
                    />
                </div>
                <div className='p02-c03-nav-bar-right'>
                    <div className='p02-c03-textbox-container'>
                        <input 
                            className='p02-c03-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c03-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c03-icons' src={edit_panels} alt='' />
                    <img className='p02-c03-icons' src={questionmark_blue} alt='' />
                    <input 
                        type='button' 
                        className='p02-c03-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
                    />
                </div>
            </div>
            {showSpinner_FetchingItems ?
            <div className='p02-c03-fetching-items'>
                Loading...
                <div className="spinner-border p02-c03-spinner" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
            :
            <div className='p02-c03-content'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>short name</th>
                            <th>name</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {milestoneTypes.map((item) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{item.id}</td>
                                <td>{item.short_name}</td>
                                <td>{item.name}</td>
                                <td>
                                    <img 
                                        className='p02-c03-icons' 
                                        src={pencil_edit} 
                                        alt='' 
                                        onClick={() => switchToUpdateMode(item)} 
                                    />
                                    <img 
                                        className='p02-c03-icons' 
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
            <div className={createMode || updateMode ? 'p02-c03-win-footer' : 'p02-c03-win-footer-hidden'}>
                <div className='p02-c03-footer-row1'>
                    <div className='p02-c03-row1-col1'>short name</div>
                    <div className='p02-c03-row1-col2'>
                        <div className='p02-c03-textbox-container'>
                            <input 
                                className='p02-c03-textbox' 
                                type='text' 
                                id='short_name' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c03-footer-row1'>
                    <div className='p02-c03-row1-col1'>name</div>
                    <div className='p02-c03-row1-col2'>
                        <div className='p02-c03-textbox-container'>
                            <input 
                                type='text' 
                                className='p02-c03-textbox' 
                                id='name' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c03-footer-row2'>
                    <div className='p02-c03-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border p02-c03-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='p02-c03-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='p02-c03-row2-col2'>
                        <input 
                            type='button' 
                            className='p02-c03-button' 
                            value={updateMode ? 'Cancel' : 'Close'} 
                            onClick={updateMode ? () => set_updateMode(false) : () => set_createMode(false)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default ManageMilestoneTypes;