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

const ManageMonuments = (props) => {
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

    const deleteItem = (milestone) => {
        // // update in local state

        // const milestoneIndex = props.activeProject.milestone_items.findIndex(elem => elem.id === milestone.id)

        // let updatedProject = {...props.activeProject};
        // let updatedMilestones = [...monuments];

        // updatedProject.milestone_items.splice(milestoneIndex, 1);
        // updatedMilestones.splice(milestoneIndex, 1);

        // props.updateProjectInState(updatedProject);

        // set_monuments([...updatedMilestones]);

        // // update in backend

        // axios({
        //     method: 'delete',
        //     url: baseUrl + `/company/milestone-items/${milestone.id}/`,
        //     headers: {
        //         "Authorization": token
        //     }
        // })
        // .then((response => {
            
        // }))
        // .catch((error) => {
        //     console.log(error);

        //     alert('problem with deleting milestone from backend: ', error);
        // })
    }

    const switchToUpdateMode = (item, index) => {
        // console.log('function : switchToUpdateMode');
        // console.log('updating item: ', item);
        // console.log('updating index: ', index);

        // document.getElementById('name').value = item.name;
        // document.getElementById('comment').value = item.comment;
        // document.getElementById('date').value = item.date;
        // // document.getElementById(`milestonetypes-container`).selectedIndex = index;
        // // let containerElem = document.getElementById(`milestonetypes-container`);
        // let firstElem = document.getElementById(`default-milestonetype`);

        // // containerElem.selectedIndex = 1;
        // // containerElem

        // firstElem.innerHTML = `${item.milestone_item_type.short_name} : ${item.milestone_item_type.name}`;
        // firstElem.value = `${item.milestone_item_type.short_name} : ${item.milestone_item_type.name}`;

        // // console.log('containerElem: ', containerElem);

        // // console.log('containerElem.selectedIndex: ', containerElem.selectedIndex);

        // set_updateMode(true);

        // set_selectedItem(item);
    }

    const updateItem = (milestoneItem) => {
        // // console.log('function : updateItem');

        // const name = document.getElementById('name').value;
        // const milestone_item_type = document.getElementById('milestone_item_type').value;
        // const date = document.getElementById('date').value;
        // const comment = document.getElementById('comment').value;
        // const tasks = milestoneItem.tasks;

        // // console.log('milestone_item_type: ', milestone_item_type);

        // const milestoneTypeIndex = props.milestoneTypes.findIndex(elem => `${elem.short_name} : ${elem.name}` === milestone_item_type)
        // const milestoneIndex = props.activeProject.milestone_items.findIndex(elem => elem.id === milestoneItem.id)

        // // console.log('index: ', index);

        // // console.log('creating new milestone...');
        // // console.log('name...', name);
        // // console.log('milestone_item_type...', props.milestoneTypes[index].id);
        // // console.log('date...', date);
        // // console.log('comment...', comment);
        // // console.log('tasks...', tasks);
        // // console.log('props.activeProject.id...', props.activeProject.id);

        // set_showSpinner_CreateUpdateItem(true);

        // if (name === "") return alert('missing input');
        // if (props.milestoneTypes[milestoneTypeIndex].id === "") return alert('missing input');
        // if (date === "") return alert('missing input');
        // if (comment === "") return alert('missing input');
        // if (tasks === "") return alert('missing input');
        // if (props.activeProject.id === "") return alert('missing input');

        // // update in backend

        // axios({
        //     method: 'put',
        //     url: baseUrl + `/company/milestone-items/${milestoneItem.id}/`,
        //     headers: {
        //         "Authorization": token
        //     },
        //     data: {
        //         name: name,
        //         milestone_item_type: props.milestoneTypes[milestoneTypeIndex].id,
        //         date: date,
        //         comment: comment,
        //         project: props.activeProject.id,
        //     }
        // })
        // .then((response => {
        //     // console.log('milestone updated succesfully: ', response.data);

        //     let updatedProject = {...props.activeProject};

        //     let updatedItem = { ...response.data, tasks: tasks };

        //     updatedItem.milestone_item_type = {...props.milestoneTypes[milestoneTypeIndex]};

        //     updatedProject.milestone_items.splice(milestoneIndex, 1, updatedItem);

        //     updatedProject.milestone_items.sort((a, b) => {
        //         return moment(a.date) - moment(b.date);
        //     });

        //     props.updateProjectInState(updatedProject);

        //     set_monuments([...updatedProject.milestone_items]);

        //     // console.log('milestone updated succesfully: ', updatedItem);

        //     set_showSpinner_CreateUpdateItem(false);
        // }))
        // .catch((error) => {
        //     console.log(error);

        //     alert('problem with updating Milestone Type.')
        // })
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
                                        onClick={() => deleteItem(monument)} 
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
                            onClick={updateMode ? () => updateItem(selectedItem) : createNewItem} 
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
 
export default ManageMonuments;