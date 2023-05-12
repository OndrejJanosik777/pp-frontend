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

const ManageDocuments = (props) => {
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
    const [documents, set_documents] = useState([]);
    const [monuments, set_monuments] = useState([]);
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [selectedItemIndex, set_selectedItemIndex] = useState(undefined);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);
    const [showSpinner_FetchingDocuments, set_showSpinner_FetchingDocuments] = useState(true);

    useEffect(() => {
        console.log('(modal) component ManageMonuments loaded: ... ');

        console.log('props: ', props);

        fetchDocuments();

        set_monuments(() => {
            let monuments = [];

            props.activeProject.monuments.map((monument) => {
                monuments.push({ ...monument, isSelected: false })
            })

            return [...monuments];
        })
    }, []);
    
    const showState = () => {
        console.log('props: ', props);
        console.log('documents: ', documents);
        console.log('monuments: ', monuments);
    }

    const clearForm = () => {
        document.getElementById('name').value = '...';
        document.getElementById('number').value = '...';
        document.getElementById('revision').value = '...';
        document.getElementById('date').value = '';
        document.getElementById('acceptance_status').value = '';
        document.getElementById('comment').value = '...';

        let updatedMonuments = [...monuments];

        updatedMonuments.map((monument) => {
            monument.isSelected = false;
        })

        set_monuments([...updatedMonuments]);
    }

    const createNewItem = () => {
        // console.log('createNewItem function');

        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;
        const revision = document.getElementById('revision').value;
        const date = document.getElementById('date').value;
        const acceptance_status = document.getElementById('acceptance_status').value;
        const comment = document.getElementById('comment').value;
        const selectedMonuments = [];

        monuments.map((monument) => {
            if (monument.isSelected) {
                selectedMonuments.push(monument.id);
            }
        })

        if (name === "") return alert('missing input');
        if (number === "") return alert('missing input');
        if (revision === "") return alert('missing input');
        if (date === "") return alert('missing input');
        if (acceptance_status === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (selectedMonuments.length === 0) return alert('missing input');

        set_showSpinner_CreateUpdateItem(true);

        axios({
            method: 'post',
            url: baseUrl + `/company/certification-documents/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                number: number,
                revision: revision,
                date: date,
                acceptance_status: acceptance_status,
                comment: comment,
                monuments: selectedMonuments,
            }
        })
        .then((response => {
            // console.log('document created succesfully: ', response.data);

            props.updateProject(props.activeProject);

            set_documents([...documents, response.data]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with creating new document ')

            // set_showSpinner_CreateUpdateItem(false);
        })
    }

    const deleteItem = (item, index) => {
        // update in local state

        let updatedItems = [...documents];

        updatedItems.splice(index, 1);

        set_documents([...updatedItems]);

        axios({
            method: 'delete',
            url: baseUrl + `/company/certification-documents/${item.id}/`,
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

    const fetchDocuments = () => {
        axios({
            method: 'get', 
            url: baseUrl + `/company/certification-documents/?project=${props.activeProject.id}`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // let newProjects = [];

            // response.data.map((item) => {
            //     newProjects.push({...item, displayed: true})
            // })

            console.log('documents: ', response.data);

            set_documents(response.data);

            set_showSpinner_FetchingDocuments(false);

            // set_projects(response.data);
            // set_projects(newProjects);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with fetching projects');

            set_showSpinner_FetchingDocuments(false);
        })
    }

    const switchToUpdateMode = (item, index) => {
        console.log('switchToUpdateMode function');
        console.log('item: ', item);
        console.log('index: ', index);

        document.getElementById('name').value = item.name;
        document.getElementById('number').value = item.number;
        document.getElementById('revision').value = item.revision;
        document.getElementById('date').value = item.date;
        document.getElementById('acceptance_status').value = item.acceptance_status;
        document.getElementById('comment').value = item.comment;

        let updatedMonuments = [...monuments];

        item.monuments.map((monumentId) => {
            let monument = updatedMonuments.find(elem => elem.id === monumentId);

            if (monument !== undefined) {
                monument.isSelected = true;
            }

            console.log('updatedMonuments: ', updatedMonuments);
        })

        set_monuments([...updatedMonuments]);

        set_updateMode(true);

        set_selectedItem(item);

        set_selectedItemIndex(index);
    }

    const updateItem = (item, index) => {
        console.log('updateItem function');

        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;
        const revision = document.getElementById('revision').value;
        const date = document.getElementById('date').value;
        const acceptance_status = document.getElementById('acceptance_status').value;
        const comment = document.getElementById('comment').value;
        const selectedMonuments = [];

        monuments.map((monument) => {
            if (monument.isSelected) {
                selectedMonuments.push(monument.id);
            }
        })

        if (name === "") return alert('missing input');
        if (number === "") return alert('missing input');
        if (revision === "") return alert('missing input');
        if (date === "") return alert('missing input');
        if (acceptance_status === "") return alert('missing input');
        if (comment === "") return alert('missing input');
        if (selectedMonuments.length === 0) return alert('missing input');

        set_showSpinner_CreateUpdateItem(true);

        axios({
            method: 'put',
            url: baseUrl + `/company/certification-documents/${item.id}/`,
            headers: {
                "Authorization": token
            },
            data: {
                name: name,
                number: number,
                revision: revision,
                date: date,
                acceptance_status: acceptance_status,
                comment: comment,
                monuments: selectedMonuments,
            }
        })
        .then((response => {
            // console.log('document updated succesfully: ', response.data);

            // props.updateProject(props.activeProject);

            let updatedDocuments = [...documents];

            updatedDocuments.splice(index, 1, response.data)

            set_documents([...updatedDocuments]);

            set_showSpinner_CreateUpdateItem(false);
        }))
        .catch((error) => {
            console.log(error);

            alert('problem with updating Milestone Type.')
        })
    }

    return ( <div className='p02-c09-manage-documents'>
        <div className='p02-c09-background'></div>
        <div className='p02-c09-window'>
            <div className='p02-c09-nav-bar'>
                <div className='p02-c09-nav-bar-left'>
                    <img 
                        className='p02-c09-icons' 
                        src={delete_cross} 
                        alt=''
                        onClick={showState}
                    />
                    <img 
                        className='p02-c09-icons' 
                        src={create_new} alt='' 
                        onClick={() => set_createMode(!createMode)} 
                    />
                    <div className={
                        showSpinner_FetchingDocuments ?
                        'p02-c09-fetching-displayed' :
                        'p02-c09-fetching-hidden'
                        }>
                        loading documents from database ...
                        <div className="spinner-border p02-c09-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                </div>
                <div className='p02-c09-nav-bar-right'>
                    <div className='p02-c09-textbox-container'>
                        <input 
                            className='p02-c09-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c09-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c09-icons' src={edit_panels} alt='' />
                    <img className='p02-c09-icons' src={questionmark_blue} alt='' />
                    <input 
                        type='button' 
                        className='p02-c09-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
                    />
                </div>
            </div>
            <div className='p02-c09-content'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>doc. nr.</th>
                            <th>rev.</th>
                            <th>date</th>
                            <th>status</th>
                            <th>comment</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {documents.map((document, index) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{document.id}</td>
                                <td>{document.name}</td>
                                <td>{document.number}</td>
                                <td>{document.revision}</td>
                                <td>{document.date}</td>
                                <td>{document.acceptance_status}</td>
                                <td>{document.comment}</td>
                                <td>
                                    <img 
                                        className='p02-c09-icons' 
                                        src={pencil_edit} 
                                        alt='' 
                                        onClick={() => {
                                            clearForm();

                                            switchToUpdateMode(document, index);
                                        }} 
                                    />
                                    <img 
                                        className='p02-c09-icons' 
                                        src={delete_cross} 
                                        alt='' 
                                        onClick={() => deleteItem(document, index)} 
                                    />
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={createMode || updateMode ? 'p02-c09-win-footer' : 'p02-c09-win-footer-hidden'}>
                <div className='p02-c09-footer-row1'>
                    <div className='p02-c09-row1-col1'>name</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='name' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>doc. nr.</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='number' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <div className='p02-c09-row1-col1'>rev.</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                className='p02-c09-textbox-short' 
                                type='text' 
                                id='revision' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c09-footer-row1'>
                    <div className='p02-c09-row1-col1'>date</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                type='date' 
                                className='p02-c09-date' 
                                id='date' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                    <label 
                        htmlFor='milestone_item_type' 
                        className='p02-c09-row1-col1'
                    >status</label>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <select 
                                id="acceptance_status" 
                                // className='p02-c09-textbox-short'
                                // selectedIndex={selectedIndex}
                                // onClick={() => console.log('option clicked')}
                                // onChange={document.getElementById(`${item.short_name} : ${item.name}`).selected = true}
                            >
                                <option value="" id='default-milestonetype'>--Please choose an option--</option>
                                <option id='in_work' value='in work'>in work</option>
                                <option id='sended' value='sended'>sended</option>
                                <option id='accepted' value='accepted'>accepted</option>
                                <option id='rejected' value='rejected'>rejected</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='p02-c09-footer-row1'>
                    <div className='p02-c09-row1-col1'>Monuments:</div>
                </div>
                <div className='p02-c09-footer-row1'>
                    <div className='p02-c09-monument-container'>
                        {monuments.map((monument, index) => {
                            return <div 
                                key={Math.random() * 100000} 
                                className={monument.isSelected ? 'p02-c09-monument-selected' : 'p02-c09-monument-not-selected'}
                                onClick={() => {
                                    let updatedMonuments = [...monuments];
                                    updatedMonuments[index].isSelected = !updatedMonuments[index].isSelected;
                                    set_monuments([...updatedMonuments]);
                                }}
                            >{`${monument.name} : ${monument.part_number}`}</div>
                        })}
                    </div>
                </div>
                <div className='p02-c09-footer-row1'>
                    <div className='p02-c09-row1-col1'>comment</div>
                    <div className='p02-c09-row1-col2'>
                        <div className='p02-c09-textbox-container'>
                            <input 
                                type='text' 
                                className='p02-c09-textbox' 
                                id='comment' 
                                placeholder='...' 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c09-footer-row2'>
                    <div className='p02-c09-row2-col1'>
                        {showSpinner_CreateUpdateItem ?
                        <div className="spinner-border p02-c09-spinner" role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <input 
                            type='button' 
                            className='p02-c09-button' 
                            value={updateMode ? 'Update' : 'Create'} 
                            onClick={updateMode ? () => updateItem(selectedItem, selectedItemIndex) : createNewItem} 
                        />
                        }
                    </div>
                    <div className='p02-c09-row2-col2'>
                        <input 
                            type='button' 
                            className='p02-c09-button' 
                            value={updateMode ? 'Cancel' : 'Close'} 
                            onClick={updateMode ? () => {
                                // clearForm();
                                set_updateMode(false);
                                set_createMode(true);
                            } : () => set_createMode(false)} 
                        />
                    </div>
                </div>
            </div>
        </div>

    </div> );
}
 
export default ManageDocuments;