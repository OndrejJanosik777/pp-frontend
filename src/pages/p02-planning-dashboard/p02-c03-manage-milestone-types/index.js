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

const P02_C03_MANAGE_MILESTONE_TYPES = (props) => {
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
    const [showSpinner_FetchingItems, set_showSpinner_FetchingItems] = useState(false);
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState({
        id: undefined,
        name: undefined,
        short_name: undefined,
        color: undefined,
    });
    const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);

    const showState = () => {
        // console.log('milestoneTypes: ', props.milestoneTypes)
        console.log('selectedItem: ', selectedItem);
    }

    useEffect(() => {
        // fetchItems();
    }, []);

    const createNewItem = () => {
        const name = document.getElementById('name').value;
        const short_name = document.getElementById('short_name').value;
        let color = document.getElementById('color').value;

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
                short_name: short_name,
                color: color,
            }
        })
        .then((response => {
            const newMilestoneItem = response.data;

            props.set_milestoneTypes([...props.milestoneTypes, newMilestoneItem]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            let updatedMilestoneItems = [...props.milestoneTypes];

            updatedMilestoneItems.pop();

            props.set_milestoneTypes([...updatedMilestoneItems]);
        })
    }

    const deleteItem = (item) => {
        const index = props.milestoneTypes.findIndex(elem => elem.id === item.id)
        let deletedMilestoneType = milestoneTypes[index];

        let updatedMilestoneTypes = [...props.milestoneTypes];
        updatedMilestoneTypes.splice(index, 1);

        props.set_milestoneTypes([...updatedMilestoneTypes]);

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
                console.log("error: ", error);

                let message = error.message + "\n" + error.response.data;
    
                alert(message);

                let updatedMilestoneTypes = [...props.milestoneTypes];

                props.set_milestoneTypes([...updatedMilestoneTypes]);
            })
    }

    const updateItem = (item) => {
        let name = document.getElementById('name').value;
        let short_name = document.getElementById('short_name').value;
        let color = document.getElementById('color').value;

        if (name === "" && short_name === "")
        return alert('missing input');

        const index = props.milestoneTypes.findIndex(elem => elem.id === item.id)
        let updatedMilestoneType = props.milestoneTypes[index];

        updatedMilestoneType.id = item.id;
        updatedMilestoneType.name = name;
        updatedMilestoneType.short_name = short_name;
        updatedMilestoneType.color = color;

        let updatedMilestoneTypes = [...props.milestoneTypes];
        updatedMilestoneTypes.splice(index, 1, updatedMilestoneType);

        props.set_milestoneTypes([...updatedMilestoneTypes]);
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
                color: updatedMilestoneType.color,
            }
        })
        .then((response => {
            set_showSpinner_CreateUpdateItem(false);

            document.getElementById('name').value = "";

            document.getElementById('short_name').value = "";

            set_updateMode(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item) => {
        /* function triggers after user clicked update button for 
        certain milestone type. It will populate the values in footer like
        short name, name and color. It will also save item as selectedItem to component
        state. */
        set_updateMode(true);
        set_selectedItem(item);

        // console.log('selectedItem: ', item);

        document.getElementById('short_name').value = item.short_name;
        document.getElementById('name').value = item.name;
        document.getElementById('color').value = item.color;
    }

    return (<div className='p02-c03-manage-milestone-types'>
        <div className='p02-c03-background'></div>
        <div className='p02-c03-window'>
            <div className='p02-c03-nav-bar'>
                <div className='p02-c03-nav-bar-left'>
                    {/* <img 
                        className='p02-c03-icons' 
                        src={delete_cross} 
                        alt=''
                    /> */}
                    {userPermissions.findIndex(elem => elem === "all_permissions") !== -1 ?
                        <img 
                            className='p02-c03-icons' 
                            src={create_new} alt='' 
                            onClick={() => set_createMode(!createMode)} 
                        /> :
                        <div></div>
                    }
                </div>
                <div className='p02-c03-nav-bar-right'>
                    <div className='p02-c03-textbox-container'>
                        <input 
                            className='p02-c03-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c03-img' src={magnifier} alt=''/>
                    </div>
                    <img className='p02-c03-icons' src={edit_panels} alt='' />
                    <img className='p02-c03-icons' src={questionmark_blue} alt='' onClick={() => showState()} />
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
                            <th>color</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {props.milestoneTypes.map((item, index) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{item.id}</td>
                                <td>{item.short_name}</td>
                                <td>{item.name}</td>
                                <td>
                                    <input 
                                        type="color" 
                                        id={'milestone_type_color_' + index}
                                        name="milestone_type"
                                        value={item.color}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    {userPermissions.findIndex(elem => elem === "all_permissions") !== -1 ?
                                        <img 
                                            className='p02-c03-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(item)} 
                                        /> :
                                        <div></div>
                                    }
                                    {userPermissions.findIndex(elem => elem === "all_permissions") !== -1 ? 
                                        <img 
                                            className='p02-c03-icons' 
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
            <div className={createMode || updateMode ? 'p02-c03-win-footer' : 'p02-c03-win-footer-hidden'}>
                <div className='p02-c03-footer-row1'>
                    <div className='p02-c03-row1-col1'>short name</div>
                    <div className='p02-c03-row1-col2'>
                        <div className='p02-c03-textbox-container'>
                            <input 
                                className='p02-c03-textbox' 
                                type='text' 
                                id='short_name' 
                                placeholder='enter milestone type short name' 
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
                                placeholder='enter milestone type name' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c03-footer-row1'>
                    <div className='p02-c03-row1-col1'>color</div>
                    <div className='p02-c03-row1-col2'>
                        <div className='p02-c03-color-container'>
                            <input 
                                type='color' 
                                className='p02-c03-color' 
                                id='color' 
                                defaultValue={"#ffffff"}
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

export default P02_C03_MANAGE_MILESTONE_TYPES;