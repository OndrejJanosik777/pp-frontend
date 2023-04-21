import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import editSVG from './assets/pencil-square.svg';
import deleteSVG from './assets/trash3.svg';
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
    const [milestoneTypes, setMilestoneTypes] = useState([]);
    const [fetchingMilestoneTypes, setFetchingMilestoneTypes] = useState(true);
    const [creatingNewMilestoneType, setCreatingNewMilestoneType] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [updatedId, setUpdatedId] = useState(0);
    const [updatingMilestoneType, setUpdatingMilestoneType] = useState(false);

    useEffect(() => {
        fetchMilestoneItemTypes();
    }, []);

    const fetchMilestoneItemTypes = () => {
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

                setMilestoneTypes([...milestoneTypes]);
                setFetchingMilestoneTypes(false);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching milestone item types')
            })
    }

    const createNewMilestoneType = () => {
        const name = document.getElementById('name').value;
        const short_name = document.getElementById('short_name').value;
        setCreatingNewMilestoneType(true);

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

                setMilestoneTypes([...milestoneTypes, newMilestoneItem]);
                setCreatingNewMilestoneType(false);
            }))
            .catch((error) => {
                console.log(error);

                let updatedMilestoneItems = [...milestoneTypes];

                updatedMilestoneItems.pop();

                setMilestoneTypes([...updatedMilestoneItems]);

                alert('problem with creating new milestone Item Types');

                setCreatingNewMilestoneType(false);
            })

    }

    const showState = () => {
        console.log('milestoneTypes: ', milestoneTypes)
    }

    const editMilestoneType = (id) => {
        // alert(`updating milestoneType ${id}`);

        const index = milestoneTypes.findIndex(elem => elem.id === id);
        let selectedMilestoneType = milestoneTypes[index];

        document.getElementById('name').value = selectedMilestoneType.name;
        document.getElementById('short_name').value = selectedMilestoneType.short_name;

        setUpdateMode(true);
        setUpdatedId(id);
    }

    const deleteMilestoneType = (id) => {
        // alert(`deleting milestoneType ${id}`);

        const index = milestoneTypes.findIndex(elem => elem.id === id)
        let deletedMilestoneType = milestoneTypes[index];

        let updatedMilestoneTypes = [...milestoneTypes];
        updatedMilestoneTypes.splice(index, 1);

        setMilestoneTypes([...updatedMilestoneTypes]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/milestone-item-types/${id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                // alert(`${deletedMilestoneType.short_name} : ${deletedMilestoneType.name} is deleted.`)
            }))
            .catch((error) => {
                console.log(error);

                alert('cannot delete this MilestoneItem. It is used in Project.')

                let updatedMilestoneTypes = [...milestoneTypes];
                // updatedMilestoneTypes.splice(index, 0, deletedMilestoneType);
                setMilestoneTypes([...updatedMilestoneTypes]);
            })
    }

    const updateMilestoneType = () => {
        // alert(`updating milestoneType ${id}`);
        let newName = document.getElementById('name').value;
        let newShortName = document.getElementById('short_name').value;

        const index = milestoneTypes.findIndex(elem => elem.id === updatedId)
        let updatedMilestoneType = milestoneTypes[index];
        updatedMilestoneType.id = updatedId;
        updatedMilestoneType.name = newName;
        updatedMilestoneType.short_name = newShortName;

        let updatedMilestoneTypes = [...milestoneTypes];
        updatedMilestoneTypes.splice(index, 1, updatedMilestoneType);

        setMilestoneTypes([...updatedMilestoneTypes]);
        setUpdatingMilestoneType(true);

        axios({
            method: 'put',
            url: baseUrl + `/company/milestone-item-types/${updatedId}/`,
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
                // alert(`${updatedMilestoneType.short_name} : ${updatedMilestoneType.name} is updated.`)
                setUpdatingMilestoneType(false);
                setUpdateMode(false);
                document.getElementById('name').value = "";
                document.getElementById('short_name').value = "";
            }))
            .catch((error) => {
                console.log(error);
                alert('problem with updating Milestone Type.')
            })
    }

    return (<div className='manage-milestone-types'>
                {/* <div className='c1-background'></div>
                <div className='c1-window'>
            <div className='c1-nav-bar'>
                <div className='c1-nav-bar-left'>
                    <img className='c1-icons' src={delete_cross} alt='' />
                    <img className='c1-icons' src={create_new} alt='' onClick={() => set_createMode(!createMode)} />
                </div>
                <div className='c1-nav-bar-right'>
                    <div className='c1-textbox-container'>
                        <input className='c1-textbox' type='text' placeholder='Search ...' />
                        <img className='c1-img' src={magnifier} alt='' />
                    </div>
                    <img className='c1-icons' src={edit_panels} alt='' />
                    <img className='c1-icons' src={questionmark_blue} alt='' />
                    <input type='button' className='button' value={'X'} onClick={() => props.set_manageProjects_toogle(false)} />
                </div>
            </div>
            <div className='c1-content'>
                <table>
                    <thead>
                        <tr>
                            <th>show</th>
                            <th>name</th>
                            <th>number</th>
                            <th>description</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => {
                            return <tr key={Math.random() * 100000}>
                                <td><input type='checkbox' checked={project.displayed} onChange={() => checkboxChanged(project)} /></td>
                                <td>{project.name}</td>
                                <td>{project.number}</td>
                                <td>{project.short_name}</td>
                                <td>
                                    <img className='c1-icons' src={pencil_edit} alt='' onClick={() => switchToUpdateMode(project)} />
                                    <img className='c1-icons' src={delete_cross} alt='' onClick={() => deleteProject(project)} />
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            {createMode || updateMode ? 
                <div className='c1-win-footer'>
                    <div className='c1-footer-row1'>
                        <div className='c1-row1-col1'>name</div>
                        <div className='c1-row1-col2'>
                            <div className='c1-textbox-container'>
                                <input className='c1-textbox' type='text' id='name' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='c1-footer-row1'>
                        <div className='c1-row1-col1'>number</div>
                        <div className='c1-row1-col2'>
                            <div className='c1-textbox-container'>
                                <input className='c1-textbox' type='text' id='number' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='c1-footer-row1'>
                        <div className='c1-row1-col1'>short name</div>
                        <div className='c1-row1-col2'>
                            <div className='c1-textbox-container'>
                                <input className='c1-textbox' type='text' id='short_name' placeholder='...' />
                            </div>
                        </div>
                    </div>
                    <div className='c1-footer-row2'>
                        <div className='c1-row2-col1'>
                            {showSpinner_CreateUpdateProject ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <input type='button' className='button' value={updateMode ? 'Update' : 'Create'} onClick={updateMode ? updateProject : createNewProject} />
                            }
                        </div>
                        <div className='c1-row2-col2'>
                            <input type='button' className='button' value={updateMode ? 'Cancel' : 'Close'} onClick={updateMode ? () => set_updateMode(false) : () => props.set_manageProjects_toogle(false)} />
                        </div>
                    </div>
                </div>
                :
                <span></span>
            }
        </div> */}
    </div>);
}

export default ManageMilestoneTypes;