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

const P02_C08_MANAGE_MONUMENTS = (props) => {
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
    const [monuments, set_monuments] = useState([...props.activeProject.monuments]);
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [selectedItemIndex, set_selectedItemIndex] = useState(undefined);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);

    useEffect(() => {
        console.log('(modal) component ManageMonuments loaded: ... ');
        console.log('props: ', props);
    }, []);
    
    const showState = () => {
        console.log('props: ', props);
        console.log('monuments: ', monuments);
    }

    const createNewItem = () => {
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
                project: props.activeProject.id,
            }
        })
        .then((response => {
            console.log('monument created succesfully: ', response.data);

            props.updateProject(props.activeProject);

            set_monuments([...monuments, response.data]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with creating new milestone ')

            // set_showSpinner_CreateUpdateItem(false);
        })
    }

    const deleteItem = (monument, index) => {
        // update in local state

        let updatedMonuments = [...monuments];

        updatedMonuments.splice(index, 1);

        set_monuments([...updatedMonuments]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/monuments/${monument.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            props.updateProject(props.activeProject);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with deleting milestone from backend: ', error);
        })
    }

    const switchToUpdateMode = (item, index) => {
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
                project: item.project,
            }
        })
        .then((response => {
            // console.log('milestone updated succesfully: ', response.data);

            let updatedMonuments = [...monuments];

            updatedMonuments.splice(index, 1, response.data);

            set_monuments([...updatedMonuments]);

            props.updateProject(props.activeProject);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with updating Milestone Type.')
        })
    }

    return ( <div className='p02-c08-manage-monuments'>
        <div className='p02-c08-background'></div>
        <div className='p02-c08-window'>
            <div className='p02-c08-nav-bar'>
                <div className='p02-c08-nav-bar-left'>
                    <img 
                        className='p02-c08-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    />
                    <img 
                        className='p02-c08-icons' 
                        src={create_new} alt='' 
                        onClick={() => set_createMode(!createMode)} 
                    />
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
                    <img className='p02-c08-icons' src={questionmark_blue} alt='' />
                    <input 
                        type='button' 
                        className='p02-c08-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
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
                                    <img 
                                        className='p02-c08-icons' 
                                        src={pencil_edit} 
                                        alt='' 
                                        onClick={() => switchToUpdateMode(monument, index)} 
                                    />
                                    <img 
                                        className='p02-c08-icons' 
                                        src={delete_cross} 
                                        alt='' 
                                        onClick={() => deleteItem(monument, index)} 
                                    />
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