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

const P02_C08_MANAGE_MONUMENTS = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let userPermissions = useSelector(state => state.api.userProfile.groups);
    let baseUrl = useSelector(state => state.api.baseUrl);
    let activeProject = useSelector(state => state.dashboard.activeProject);

    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    // 
    const [monuments, set_monuments] = useState([...activeProject.monuments]);
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [selectedItemIndex, set_selectedItemIndex] = useState(undefined);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);
    // const [userPermissions, set_userPermissions] = useState([...props.userPermissions]);

    useEffect(() => {
        console.log('(modal) component ManageMonuments loaded: ... ');
        console.log('props: ', props);
    }, []);
    
    const showState = () => {
        console.log('props.activeProject: ', activeProject);
        console.log('monuments: ', monuments);
    }

    const createNewItem = () => {
        // 1 - create new item in database
        // 2 - create new item in redux store (...dispatch updated project to redux store)
        // 3 - create new item in local component state
        const part_number = document.getElementById('part_number').value;
        const name = document.getElementById('name').value;
        const hours_D = document.getElementById('hours_D').value;
        const hours_K = document.getElementById('hours_K').value;
        const hours_S = document.getElementById('hours_S').value;
        const hours_Z = document.getElementById('hours_Z').value;

        console.log('creating new monument...');
        console.log('part_number...', part_number);
        console.log('name...', name);
        console.log('hours_D...', hours_D);
        console.log('hours_K...', hours_K);
        console.log('hours_S...', hours_S);
        console.log('hours_Z', hours_Z);

        set_showSpinner_CreateUpdateItem(true);

        if (part_number === "") return alert('missing input');
        if (name === "") return alert('missing input');
        if (hours_D === "") return alert('missing input');
        if (hours_K === "") return alert('missing input');
        if (hours_S === "") return alert('missing input');
        if (hours_Z === "") return alert('missing input');

        // 1
        axios({
            method: 'post',
            url: baseUrl + `/company/monuments/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                part_number: part_number,
                hours_K: hours_K,
                hours_S: hours_S,
                hours_D: hours_D,
                hours_Z: hours_Z,
                project: activeProject.id,
            }
        })
        .then((response => {
            console.log('monument created succesfully: ', response.data);

            let newMonument = {
                id: response.data.id,
                name: response.data.name,
                part_number: response.data.part_number,
                hours_K: response.data.hours_K,
                hours_S: response.data.hours_S,
                hours_D: response.data.hours_D,
                hours_Z: response.data.hours_Z,
            }

            let updatedMonuments = [...monuments, newMonument];
            updatedMonuments.sort((a,b) => a.part_number - b.part_number);
            
            
            // 2
            let updatedProject = {...activeProject};
            updatedProject.monuments = [...updatedMonuments];
            dispatch(apiActions.update_project(updatedProject));

            // 3
            set_monuments([...monuments, newMonument]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            set_showSpinner_CreateUpdateItem(false);
        })
    }

    const deleteItem = (monument, index) => {
        // 1 - delete in database
        // 2 - delete in local component state
        // 3 - delete in redux state

        let updatedMonuments = [...monuments];
        updatedMonuments.splice(index, 1);

        // 1 - deleting in database
        axios({
            method: 'delete',
            url: baseUrl + `/company/monuments/${monument.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // monument deleted succesfully
            
            // 2 - deleting in local component state
            set_monuments([...updatedMonuments]);
            
            // 3 - deleting in redux store
            let updatedProject = {...activeProject};
            updatedProject.monuments = [...updatedMonuments];
            dispatch(apiActions.update_project(updatedProject));
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item, index) => {
        // fill the form with values from selected monument
        document.getElementById('part_number').value = item.part_number;
        document.getElementById('name').value = item.name;
        document.getElementById('hours_D').value = item.hours_D;
        document.getElementById('hours_K').value = item.hours_K;
        document.getElementById('hours_S').value = item.hours_S;
        document.getElementById('hours_Z').value = item.hours_Z;

        set_updateMode(true);

        set_selectedItem(item);

        set_selectedItemIndex(index);
    }

    const updateItem = (item, index) => {
        // 1 - update in database
        // 2 - update in local state
        // 3 - update in redux store

        const part_number = document.getElementById('part_number').value;
        const name = document.getElementById('name').value;
        const hours_D = document.getElementById('hours_D').value;
        const hours_K = document.getElementById('hours_K').value;
        const hours_S = document.getElementById('hours_S').value;
        const hours_Z = document.getElementById('hours_Z').value;

        set_showSpinner_CreateUpdateItem(true);

        if (part_number === "") return alert('missing input');
        if (name === "") return alert('missing input');
        if (hours_D === "") return alert('missing input');
        if (hours_K === "") return alert('missing input');
        if (hours_S === "") return alert('missing input');
        if (hours_Z === "") return alert('missing input');

        // 1
        axios({
            method: 'put',
            url: baseUrl + `/company/monuments/${item.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                part_number: part_number,
                name: name,
                hours_D: hours_D,
                hours_K: hours_K,
                hours_S: hours_S,
                hours_Z: hours_Z,
                certification_documents: item.certification_documents,
                project: activeProject.id,
            }
        })
        // updated succesfully
        .then((response => {
            let updatedMonument = {
                id: response.data.id,
                name: response.data.name,
                part_number: response.data.part_number,
                hours_K: response.data.hours_K,
                hours_S: response.data.hours_S,
                hours_D: response.data.hours_D,
                hours_Z: response.data.hours_Z,
            }

            let updatedMonuments = [...monuments];
            updatedMonuments.splice(index, 1, updatedMonument);

            // 2 
            set_monuments([...updatedMonuments]);
            
            // 3
            let updatedProject = {...activeProject};
            updatedProject.monuments = [...updatedMonuments];
            dispatch(apiActions.update_project(updatedProject));
            
            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    return ( <div className='p02-c08-manage-monuments'>
        <div className='p02-c08-background'></div>
        <div className='p02-c08-window'>
            <div className='p02-c08-nav-bar'>
                <div className='p02-c08-nav-bar-left'>
                    {/* <img 
                        className='p02-c08-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    /> */}
                    {userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "create_monument" ) !== -1 ? 
                    <img 
                        className='p02-c08-icons' 
                        src={create_new} alt='' 
                        onClick={() => set_createMode(!createMode)} 
                    /> :
                    <div></div>
                    }
                </div>
                <div className='p02-c08-nav-bar-right'>
                    <div className='p02-c08-textbox-container'>
                        <input 
                            className='p02-c08-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c08-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c08-icons' src={edit_panels} alt='' />
                    <img 
                        className='p02-c08-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input 
                        type='button' 
                        className='p02-c08-button' 
                        value={'X'} 
                        onClick={() => dispatch(dashboardActions.set_showModal_manageMonuments(false))} 
                    />
                </div>
            </div>
            <div className='p02-c08-content'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>P/N</th>
                            <th>name</th>
                            <th>hours D</th>
                            <th>hours K</th>
                            <th>hours S</th>
                            <th>hours Z</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {monuments.map((monument, index) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{monument.id}</td>
                                <td>{monument.part_number}</td>
                                <td>{monument.name}</td>
                                <td>{monument.hours_D}</td>
                                <td>{monument.hours_K}</td>
                                <td>{monument.hours_S}</td>
                                <td>{monument.hours_Z}</td>
                                <td>
                                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "edit_monument" ) !== -1 ? 
                                        <img 
                                            className='p02-c08-icons' 
                                            src={pencil_edit} 
                                            alt='' 
                                            onClick={() => switchToUpdateMode(monument, index)} 
                                        /> :
                                        <div></div>
                                    }
                                    { userPermissions.findIndex(elem => elem.name === "all_permissions" || elem.name === "delete_monument" ) !== -1 ?
                                        <img 
                                            className='p02-c08-icons' 
                                            src={delete_cross} 
                                            alt='' 
                                            onClick={() => deleteItem(monument, index)} 
                                        /> :
                                        <div></div>
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={createMode || updateMode ? 'p02-c08-win-footer' : 'p02-c08-win-footer-hidden'}>
                <div className='p02-c08-footer-row1'>
                    <div className='p02-c08-row1-col1'>P/N</div>
                    <div className='p02-c08-row1-col2'>
                        <div className='p02-c08-textbox-container'>
                            <input 
                                className='p02-c08-textbox' 
                                type='text' 
                                id='part_number' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c08-footer-row1'>
                    <div className='p02-c08-row1-col1'>name</div>
                    <div className='p02-c08-row1-col2'>
                        <div className='p02-c08-textbox-container'>
                            <input 
                                type='text' 
                                className='p02-c08-textbox' 
                                id='name' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c08-footer-row1'>
                    <div className='p02-c08-row1-col1'>hours D</div>
                    <div className='p02-c08-row1-col2'>
                        <div className='p02-c08-textbox-container'>
                            <input 
                                type='number' 
                                className='p02-c08-date' 
                                id='hours_D' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c08-footer-row1'>
                    <div className='p02-c08-row1-col1'>hours K</div>
                    <div className='p02-c08-row1-col2'>
                        <div className='p02-c08-textbox-container'>
                            <input 
                                type='number' 
                                className='p02-c08-date' 
                                id='hours_K' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c08-footer-row1'>
                    <div className='p02-c08-row1-col1'>hours S</div>
                    <div className='p02-c08-row1-col2'>
                        <div className='p02-c08-textbox-container'>
                            <input 
                                type='number' 
                                className='p02-c08-date' 
                                id='hours_S' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c08-footer-row1'>
                    <div className='p02-c08-row1-col1'>hours Z</div>
                    <div className='p02-c08-row1-col2'>
                        <div className='p02-c08-textbox-container'>
                            <input 
                                type='number' 
                                className='p02-c08-date' 
                                id='hours_Z' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c08-footer-row2'>
                    <div className='p02-c08-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border p02-c08-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='p02-c08-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem, selectedItemIndex) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='p02-c08-row2-col2'>
                        <input 
                            type='button' 
                            className='p02-c08-button' 
                            value={updateMode ? 'Cancel' : 'Close'} 
                            onClick={updateMode ? () => set_updateMode(false) : () => set_createMode(false)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div> );
}
 
export default P02_C08_MANAGE_MONUMENTS;