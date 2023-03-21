import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import editSVG from './assets/pencil-square.svg';
import deleteSVG from './assets/trash3.svg';
import axios from 'axios';
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

    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [monuments, setMonuments] = useState([]);
    const [fetchingMonuments_spinner, setFetchingMonuments_spinner] = useState(true);
    const [creatingNewMonument_spinner, setCreatingNewMonument_spinner] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [updatedId, setUpdatedId] = useState(0);
    const [updatingTaskType, setUpdatingTaskType] = useState(false);

    useEffect(() => {
        fetchMonuments();
    }, []);

    const fetchMonuments = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/monuments/',
            headers: {
                "Authorization": token
            },
            params: {
                project: props.project.id,
            }
        })
            .then((response => {
                console.log('fetched monuments: ', response.data);
                // let monuments = response.data;
                // tasksTypes.sort((a, b) => a.id - b.id);

                setMonuments([...response.data]);
                setFetchingMonuments_spinner(false);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching monuments');
            })
    }

    const createMonument = () => {
        const name = document.getElementById('name').value;
        const part_number = document.getElementById('part_number').value;
        const hours_K = document.getElementById('hours_K').value;
        const hours_S = document.getElementById('hours_S').value;
        const hours_D = document.getElementById('hours_D').value;
        const hours_Z = document.getElementById('hours_Z').value;

        setCreatingNewMonument_spinner(true);

        if (name === "") return alert('missing name');
        if (part_number === "") return alert('missing part_number');
        if (hours_K === "") return alert('missing hours_K');
        if (hours_S === "") return alert('missing hours_S');
        if (hours_D === "") return alert('missing hours_D');
        if (hours_Z === "") return alert('missing hours_Z');

        axios({
            method: 'post',
            url: baseUrl + '/company/monuments/',
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
                project: props.project.id,
            }
        })
            .then((response => {
                const newMonument = response.data;

                setMonuments([...monuments, newMonument]);
                setCreatingNewMonument_spinner(false);
                props.updateProject(props.project.id);
            }))
            .catch((error) => {
                console.log(error);

                let updatedMonuments = [...monuments];

                updatedMonuments.pop();

                setMonuments([...updatedMonuments]);

                alert('problem with creating new milestone Item Types');

                setCreatingNewMonument_spinner(false);
            })

    }

    const showState = () => {
        console.log('milestoneTypes: ', monuments)
    }

    const editMonument = (id) => {
        // alert(`updating milestoneType ${id}`);

        const index = monuments.findIndex(elem => elem.id === id);
        let selectedMonument = monuments[index];

        document.getElementById('name').value = selectedMonument.name;
        document.getElementById('part_number').value = selectedMonument.part_number;
        document.getElementById('hours_K').value = selectedMonument.hours_K;
        document.getElementById('hours_S').value = selectedMonument.hours_S;
        document.getElementById('hours_D').value = selectedMonument.hours_D;
        document.getElementById('hours_Z').value = selectedMonument.hours_Z;

        setUpdateMode(true);
        setUpdatedId(id);
    }

    const deleteMonument = (id) => {
        // alert(`deleting milestoneType ${id}`);

        const index = monuments.findIndex(elem => elem.id === id)

        let updatedMonuments = [...monuments];
        updatedMonuments.splice(index, 1);

        setMonuments([...updatedMonuments]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/monuments/${id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                props.updateProject(props.project.id);
            }))
            .catch((error) => {
                console.log(error);

                alert('cannot delete this monument.')

                let updatedMonuments = [...monuments];

                setMonuments([...updatedMonuments]);
            })
    }

    const updateMonument = () => {
        // alert(`updating milestoneType ${id}`);
        let newName = document.getElementById('name').value;
        let newPartNumber = document.getElementById('part_number').value;
        let newHours_K = document.getElementById('hours_K').value;
        let newHours_S = document.getElementById('hours_S').value;
        let newHours_D = document.getElementById('hours_D').value;
        let newHours_Z = document.getElementById('hours_Z').value;

        const index = monuments.findIndex(elem => elem.id === updatedId)
        let updatedMonument = monuments[index];
        updatedMonument.id = updatedId;
        updatedMonument.name = newName;
        updatedMonument.part_number = newPartNumber;
        updatedMonument.hours_K = newHours_K;
        updatedMonument.hours_S = newHours_S;
        updatedMonument.hours_D = newHours_D;
        updatedMonument.hours_Z = newHours_Z;

        let updatedMilestoneTypes = [...monuments];
        updatedMilestoneTypes.splice(index, 1, updatedMonument);

        setMonuments([...updatedMilestoneTypes]);
        setUpdatingTaskType(true);

        axios({
            method: 'put',
            url: baseUrl + `/company/monuments/${updatedId}/`,
            headers: {
                "Authorization": token
            },
            data: {
                id: updatedMonument.id,
                name: updatedMonument.name,
                part_number: updatedMonument.part_number,
                hours_K: updatedMonument.hours_K,
                hours_S: updatedMonument.hours_S,
                hours_D: updatedMonument.hours_D,
                hours_Z: updatedMonument.hours_Z,
                project: updatedMonument.project,
            }
        })
            .then((response => {
                setUpdatingTaskType(false);
                setUpdateMode(false);
                document.getElementById('name').value = "";
                document.getElementById('part_number').value = "";
                document.getElementById('hours_K').value = "";
                document.getElementById('hours_S').value = "";
                document.getElementById('hours_D').value = "";
                document.getElementById('hours_Z').value = "";
            }))
            .catch((error) => {
                console.log(error);
                alert('problem with updating Monument.')
            })
    }

    return (<div className='manage-monuments'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4' onClick={showState}>{`MANAGE MONUMENTS FOR \"${props.project.short_name}\"`}</div>
            {fetchingMonuments_spinner ?
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
                :
                <div>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">name</th>
                                <th scope="col">P/N</th>
                                <th scope="col">Hours K</th>
                                <th scope="col">Hours S</th>
                                <th scope="col">Hours D</th>
                                <th scope="col">Hours Z</th>
                                <th scope="col">edit</th>
                                <th scope="col">delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monuments.map((monument) => {
                                return <tr key={Math.random() * 100000}>
                                    <th scope="row">{monument.id}</th>
                                    <td>{monument.name}</td>
                                    <td>{monument.part_number}</td>
                                    <td>{monument.hours_K}</td>
                                    <td>{monument.hours_S}</td>
                                    <td>{monument.hours_D}</td>
                                    <td>{monument.hours_Z}</td>
                                    <td><img className='icons' src={editSVG} alt='' onClick={() => editMonument(monument.id)} /></td>
                                    <td><img className='icons' src={deleteSVG} alt='' onClick={() => deleteMonument(monument.id)} /></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="name" />
                        <label htmlFor="name">name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="part_number" />
                        <label htmlFor="part_number">part number</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="hours_K" />
                        <label htmlFor="hours_K">hours K</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="hours_S" />
                        <label htmlFor="hours_S">hours S</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="hours_D" />
                        <label htmlFor="hours_D">hours D</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="hours_Z" />
                        <label htmlFor="hours_Z">hours Z</label>
                    </div>
                    {updateMode ?
                        <div className='actions'>
                            {updatingTaskType ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <button type="button" className="btn btn-primary close" onClick={updateMonument}>UPDATE</button>
                            }
                            <button type="button" className="btn btn-danger close" onClick={() => setUpdateMode(false)}>CANCEL UPDATE</button>
                        </div>
                        :
                        <div className='actions'>
                            {creatingNewMonument_spinner ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <button type="button" className="btn btn-primary close" onClick={createMonument}>CREATE</button>
                            }
                            <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
                        </div>
                    }
                </div>
            }
        </div>
    </div>);
}

export default ManageMonuments;