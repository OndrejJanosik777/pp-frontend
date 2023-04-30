import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import editSVG from './assets/pencil-square.svg';
import deleteSVG from './assets/trash3.svg';
import axios from 'axios';
import './index.scss';

const ManageCertificationDocuments = (props) => {
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
    const [certificationDocuments, setCertificationDocuments] = useState([]);
    const [relatedMonuments, setRelatedMonuments] = useState([]);
    const [fetchingData_spinner, setFetchingData_spinner] = useState(true);
    const [creatingNewMonument_spinner, setCreatingNewMonument_spinner] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [updatedId, setUpdatedId] = useState(0);
    const [updatingTaskType, setUpdatingTaskType] = useState(false);

    useEffect(() => {
        fetchMonuments();
        fetchCertificationDocuments();
    }, []);

    const fetchCertificationDocuments = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company/certification-documents/',
            headers: {
                "Authorization": token
            },
            params: {
                project: props.project.id,
            }
        })
            .then((response => {
                console.log('fetched certification documents: ', response.data);
                let certificationDocuments = response.data;
                // monuments.sort((a, b) => parseInt(a.part_number) - parseInt(b.part_number));

                setCertificationDocuments([...certificationDocuments]);
                setFetchingData_spinner(false);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching monuments');
            })
    }

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
                let monuments = response.data;
                monuments.sort((a, b) => parseInt(a.part_number) - parseInt(b.part_number));

                setMonuments([...monuments]);
                setFetchingData_spinner(false);
            }))
            .catch((error) => {
                console.log(error);

                alert('problem with fetching monuments');
            })
    }

    const createCertificationDocument = () => {
        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;
        const revision = document.getElementById('revision').value;
        const date = document.getElementById('date').value;
        const comment = document.getElementById('comment').value;
        const acceptance_status = document.getElementById('acceptance-status').value;

        setCreatingNewMonument_spinner(true);

        if (name === "") return alert('missing name');
        if (number === "") return alert('missing number');
        if (revision === "") return alert('missing revision');
        if (date === "") return alert('missing date');
        if (comment === "") return alert('missing comment');
        if (acceptance_status === "") return alert('missing acceptance_status');
        if (relatedMonuments.length === 0) return alert('missing related monument');

        let relatedMonumentIds = [];

        console.log('relatedMonuments: ', relatedMonuments);
        relatedMonuments.map((monument) => {
            relatedMonumentIds.push(monument.id);
        })

        axios({
            method: 'post',
            url: baseUrl + '/company/certification-documents/',
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                number: number,
                revision: revision,
                date: date,
                comment: comment,
                acceptance_status: acceptance_status,
                monuments: [...relatedMonumentIds],
            }
        })
        .then((response => {
            const newCertificationDocument = response.data;

            setCertificationDocuments([...certificationDocuments, newCertificationDocument]);
            setCreatingNewMonument_spinner(false);
            props.updateProject(props.project.id);
        }))
        .catch((error) => {
            console.log(error);

            let updatedCertificationDocuments = [...certificationDocuments];

            updatedCertificationDocuments.pop();

            setCertificationDocuments([...updatedCertificationDocuments]);

            alert('problem with creating new certification document');

            setCreatingNewMonument_spinner(false);
        })

    }

    const editCertificationDocument = (id) => {
        // alert(`updating milestoneType ${id}`);

        const index = certificationDocuments.findIndex(elem => elem.id === id);
        let selectedCertificationDocument = certificationDocuments[index];

        document.getElementById('name').value = selectedCertificationDocument.name;
        document.getElementById('number').value = selectedCertificationDocument.number;
        document.getElementById('revision').value = selectedCertificationDocument.revision;
        document.getElementById('date').value = selectedCertificationDocument.date;
        document.getElementById('comment').value = selectedCertificationDocument.comment;
        document.getElementById('acceptance-status').value = selectedCertificationDocument.acceptance_status;

        let newRelatedMonuments = [];

        selectedCertificationDocument.monuments.map((monumentId) => {
            let index = monuments.findIndex((elem) => elem.id === monumentId);

            newRelatedMonuments.push({ ...monuments[index] });
        })

        setRelatedMonuments([...newRelatedMonuments]);

        setUpdateMode(true);
        setUpdatedId(id);
    }

    const deleteCertificationDocument = (id) => {
        // alert(`deleting milestoneType ${id}`);

        const index = certificationDocuments.findIndex(elem => elem.id === id)

        let updatedCertificationDocuments = [...certificationDocuments];
        updatedCertificationDocuments.splice(index, 1);

        setCertificationDocuments([...updatedCertificationDocuments]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/certification-documents/${id}/`,
            headers: {
                "Authorization": token
            }
        })
            .then((response => {
                props.updateProject(props.project.id);
            }))
            .catch((error) => {
                console.log(error);

                alert('cannot delete this certification document.')

                let updatedDocuments = [...certificationDocuments];

                setCertificationDocuments([...updatedDocuments]);
            })
    }

    const showState = () => {
        console.log('relatedMonuments: ', relatedMonuments)
    }

    const updateCertificationDocument = () => {
        // alert(`updating milestoneType ${id}`);
        let newName = document.getElementById('name').value;
        let newNumber = document.getElementById('number').value;
        let newRevision = document.getElementById('revision').value;
        let newDate = document.getElementById('date').value;
        let newComment = document.getElementById('comment').value;
        let newAcceptance_status = document.getElementById('acceptance-status').value;

        let relatedMonumentIds = [];

        relatedMonuments.map((monument) => {
            relatedMonumentIds.push(monument.id);
        })

        if (newName === "") return alert('missing name');
        if (newNumber === "") return alert('missing number');
        if (newRevision === "") return alert('missing revision');
        if (newDate === "") return alert('missing date');
        if (newComment === "") return alert('missing comment');
        if (newAcceptance_status === "") return alert('missing acceptance_status');
        if (relatedMonuments.length === 0) return alert('missing related monument');

        /*update in state*/
        const index = certificationDocuments.findIndex(elem => elem.id === updatedId)
        let updatedDocument = certificationDocuments[index];
        updatedDocument.id = updatedId;
        updatedDocument.name = newName;
        updatedDocument.number = newNumber;
        updatedDocument.revision = newRevision;
        updatedDocument.date = newDate;
        updatedDocument.comment = newComment;
        updatedDocument.acceptance_status = newAcceptance_status;
        updatedDocument.monuments = [...relatedMonumentIds];

        let updatedCertificationDocuments = [...certificationDocuments];
        updatedCertificationDocuments.splice(index, 1, updatedDocument);

        setCertificationDocuments([...updatedCertificationDocuments]);
        setUpdatingTaskType(true);

        axios({
            method: 'put',
            url: baseUrl + `/company/certification-documents/${updatedId}/`,
            headers: {
                "Authorization": token
            },
            data: {
                id: updatedId,
                name: newName,
                number: newNumber,
                revision: newRevision,
                date: newDate,
                comment: newComment,
                acceptance_status: newAcceptance_status,
                monuments: [...relatedMonumentIds],
            }
        })
            .then((response => {
                setUpdatingTaskType(false);
                setUpdateMode(false);
                document.getElementById('name').value = "";
                document.getElementById('number').value = "";
                document.getElementById('revision').value = "";
                document.getElementById('date').value = "";
                document.getElementById('comment').value = "";
                document.getElementById('acceptance-status').value = "";
                setRelatedMonuments([]);
            }))
            .catch((error) => {
                console.log(error);
                alert('problem with updating Monument.')
            })
    }

    const updateClickedMonument = (monument) => {
        console.log('monument clicked: ', monument.name);

        let updatedMonuments = [...relatedMonuments];
        const index = relatedMonuments.findIndex((element) => element.id === monument.id);

        console.log('index: ', index);

        if (index === -1) {
            updatedMonuments.push(monument);

            // setRelatedMonuments([...updatedMonuments]);
        }
        else {
            updatedMonuments.splice(index, 1);

            // setRelatedMonuments([...updatedMonuments]);
        }

        console.log('updatedMonuments: ', updatedMonuments);

        setRelatedMonuments([...updatedMonuments]);
    }

    return (<div className='manage-certification-documents'>
        <div className='background'></div>
        <div className='container'>
            <div className='text-center fs-4' onClick={showState}>{`CERTIFICATION DOCUMENTS OF \"${props.project.short_name}\"`}</div>
            {fetchingData_spinner ?
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
                                <th scope="col">number</th>
                                <th scope="col">revision</th>
                                <th scope="col">date</th>
                                <th scope="col">status</th>
                                <th scope="col">monuments</th>
                                <th scope="col">edit</th>
                                <th scope="col">delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificationDocuments.map((certificationDocument) => {
                                return <tr key={Math.random() * 100000}>
                                    <td scope="row">{certificationDocument.id}</td>
                                    <td>{certificationDocument.name}</td>
                                    <td>{certificationDocument.number}</td>
                                    <td>{certificationDocument.revision}</td>
                                    <td>{certificationDocument.date}</td>
                                    <td>{certificationDocument.acceptance_status}</td>
                                    {/* <td>{certificationDocument.hours_Z}</td> */}
                                    <td><img className='icons' src={editSVG} alt='' onClick={() => editCertificationDocument(certificationDocument.id)} /></td>
                                    <td><img className='icons' src={deleteSVG} alt='' onClick={() => deleteCertificationDocument(certificationDocument.id)} /></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <div className='container-monuments justify-content-between'>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="name" />
                            <label htmlFor="name">name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="number" />
                            <label htmlFor="number">number</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="revision" />
                            <label htmlFor="revision">revision</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="date" className="form-control" id="date" />
                            <label htmlFor="date">date</label>
                        </div>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="comment" />
                        <label htmlFor="comment">comment</label>
                    </div>
                    <div className='row'>
                        <label htmlFor="acceptance-status">Acceptance status:</label>
                        <select name="acceptance-status" id="acceptance-status">
                            <option value="">--Please choose an option--</option>
                            <option>in work</option>;
                            <option>sended</option>;
                            <option>accepted</option>;
                            <option>rejected</option>;
                        </select>
                    </div>
                    <div>Related Monument:</div>
                    <div className='container-monuments'>
                        {monuments.map((monument) => {
                            let class_name = 'monument';

                            let index = relatedMonuments.findIndex((element) => element.id === monument.id);

                            if (index !== -1) {
                                class_name = 'monument-active'
                            }

                            return <div
                                key={Math.random() * 100000}
                                className={class_name}
                                onClick={() => updateClickedMonument(monument)}
                            >
                                {`${monument.part_number} : ${monument.name}`}
                            </div>
                        })}
                        {/* <div className='monument'>2852000 : G4</div> */}
                        {/* <div className='monument-active'>2852000 : G4</div> */}
                    </div>
                    {updateMode ?
                        <div className='actions'>
                            {updatingTaskType ?
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                <button type="button" className="btn btn-primary close" onClick={updateCertificationDocument}>UPDATE</button>
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
                                <button type="button" className="btn btn-primary close" onClick={createCertificationDocument}>CREATE</button>
                            }
                            <button type="button" className="btn btn-danger close" onClick={props.toogleVisibility}>CANCEL</button>
                        </div>
                    }
                </div>
            }
        </div>
    </div>);
}

export default ManageCertificationDocuments;