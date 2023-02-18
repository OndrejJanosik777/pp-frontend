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

    const [loaded, setLoaded] = useState([]);
    const [baseUrl, setBaseUrl] = useState(getBaseUrl());
    const [token, setToken] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [milestoneTypes, setMilestoneTypes] = useState([]);
    const [fetchingMilestoneTypes, setFetchingMilestoneTypes] = useState(true);
    const [creatingNewMilestoneType, setCreatingNewMilestoneType] = useState(false);

    useEffect(() => {
        fetchMilestoneItemTypes();
    }, [loaded]);

    const fetchMilestoneItemTypes = () => {
        // console.log('fetching project with id: ', projectId);

        axios({
            method: 'get',
            url: baseUrl + '/company/milestone-item-type/',
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
            url: baseUrl + '/company/milestone-item-type/',
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

                alert('problem with creating new milestone Item');
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
            url: baseUrl + `/company/milestone-item-type/${id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                alert(`${deletedMilestoneType.short_name} : ${deletedMilestoneType.name} is deleted.`)
            }))
            .catch((error) => {
                console.log(error);

                alert('cannot delete this MilestoneItem. It is used in Project.')

                let updatedMilestoneTypes = [...milestoneTypes];
                // updatedMilestoneTypes.splice(index, 0, deletedMilestoneType);
                setMilestoneTypes([...updatedMilestoneTypes]);
            })
    }

    return (<div className='manage-milestone-types'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4' onClick={showState}>MANAGE MILESTONE TYPES</div>
            {fetchingMilestoneTypes ?
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
                                <th scope="col">short name</th>
                                <th scope="col">name</th>
                                <th scope="col">edit</th>
                                <th scope="col">delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milestoneTypes.map((milestoneType) => {
                                return <tr key={Math.random() * 100000}>
                                    <th scope="row">{milestoneType.id}</th>
                                    <td>{milestoneType.short_name}</td>
                                    <td>{milestoneType.name}</td>
                                    <td><img className='icons' src={editSVG} alt='' onClick={() => editMilestoneType(milestoneType.id)} /></td>
                                    <td><img className='icons' src={deleteSVG} alt='' onClick={() => deleteMilestoneType(milestoneType.id)} /></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="short_name" />
                        <label htmlFor="short_name">short name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="name" />
                        <label htmlFor="name">name</label>
                    </div>
                    <div className='actions'>
                        {creatingNewMilestoneType ?
                            <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                            :
                            <button type="button" className="btn btn-primary close" onClick={createNewMilestoneType}>CREATE</button>
                        }
                        <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
                    </div>
                </div>
            }
        </div>
    </div>);
}

export default ManageMilestoneTypes;