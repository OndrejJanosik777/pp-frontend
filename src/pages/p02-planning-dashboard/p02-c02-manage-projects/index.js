import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import create_new from './assets/create_new.png';
import edit_panels from './assets/edit_panels.png';
import questionmark_blue from './assets/questionmark_blue.png';
import delete_cross from './assets/delete_cross.png';
import pencil_edit from './assets/pencil_edit.png';
import magnifier from './assets/magnifier.png';
import * as apiActions from '../../../app/features/api/apiSlice';
import * as dashboardActions from '../../../app/features/dashboardSlice';
import './index.scss';
import axios from 'axios'; 

const P02_C02_MANAGE_PROJECTS = (props) => {
    const dispatch = useDispatch();

    // pick the data from the redux store
    let projects = useSelector(state => state.api.projects);
    let userPermissions = useSelector(state => state.api.userProfile.groups);
    let baseUrl = useSelector(state => state.api.baseUrl);

    // const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    // const [projects, set_projects] = useState([]);
    const [showSpinner_CreateUpdateProject, set_showSpinner_CreateUpdateProject] = useState(false);
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState();
    const [employees, set_employees] = useState([]);
    // const [userPermissions, set_userPermissions] = useState([...props.userPermissions])
    
    useEffect(() => {
        // fetch employee data for drop down menu
        fetchEmployeeData();
    }, []);

    const showState = () => {
        // console.log('userPermissions: ', userPermissions);
        // console.log('logo: ', document.getElementById('logo').files);

        console.log('employees: ', employees);
    }

    const checkboxChanged = (item) => {
        // let updatedItem = { ...item };

        // updatedItem.displayed = !updatedItem.displayed;

        // dispatch(apiActions.update_project(updatedItem));

        axios({
            method: 'post',
            url: baseUrl + `/company/update-project-visibility/`,
            headers: {
                "Authorization": token
            },
            data: {
                project_id: item.id
            }
        })
        .then((response => {
            // console.log("projects updated sucessfully");
            dispatch(dashboardActions.set_spinnerFetchingProjects(true));
            dispatch(apiActions.fetch_projects());
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            // dispatch(apiActions.update_projects(originalItems));
        })
    }

    const deleteItem = (item) => {
        let index = projects.findIndex(elem => elem.id === item.id)
        let originalItems = [...projects];
        let updatedItems = [...projects];

        updatedItems.splice(index, 1);

        // set_projects(updatedProjects);

        dispatch(apiActions.update_projects(updatedItems));

        // props.set_projects(updatedProjects);

        axios({
            method: 'delete',
            url: baseUrl + `/company/projects/${item.id}/`,
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            // console.log("projects deleted sucessfully");
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);

            dispatch(apiActions.update_projects(originalItems));
        })
    }

    const createItem = () => {
        // function will create new item in redux state and backend database
        let name = document.getElementById('name').value;
        let number = document.getElementById('number').value;
        let short_name = document.getElementById('short_name').value;
        let logo = document.getElementById('logo');

        if (name == "" || short_name == "" || number == "")  {
            return alert('Missing input: name, number or short name')
        }

        set_showSpinner_CreateUpdateProject(true);

        // update in backend database and after success in redux state
        axios({
            method: 'post',
            url: baseUrl + '/company/projects/',
            headers: {
                "Authorization": token,
                'Content-Type': 'multipart/form-data'
            },
            data: {
                name: name,
                number: number,
                short_name: short_name,
                logo: logo.files[0]
            }
        })
        .then((response => {
            console.log("projects created sucessfully");

            let newProject = {...response.data, displayed: true, milestone_items: [], monuments: [] };

            let updatedProjects = [...projects, newProject];

            dispatch(apiActions.update_projects(updatedProjects))

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const switchToUpdateMode = (item) => {
        set_updateMode(true);
        set_selectedItem(item);
    }

    const updateItem = (item) => {
        // function will update item in state and database
        let updateProject = {...item};

        updateProject.name = document.getElementById('name').value;
        updateProject.number = document.getElementById('number').value;
        updateProject.short_name = document.getElementById('short_name').value;


        if (updateProject.name == "" || updateProject.number == "" || updateProject.short_name == "")  {
            return alert('Missing input: name, number or short name')
        }

        let cve_lead = employees.find(elem => elem.employee_initials === document.getElementById('cve_lead').value);
        let stress_lead = employees.find(elem => elem.employee_initials === document.getElementById('stress_lead').value);
        let enviromental_lead = employees.find(elem => elem.employee_initials === document.getElementById('enviromental_lead').value);

        let data = {
            name: updateProject.name,
            number: updateProject.number,
            short_name: updateProject.short_name,
            cve_lead: (cve_lead === undefined ? null : cve_lead.employee_id),
            stress_lead: (stress_lead === undefined ? null : stress_lead.employee_id),
            enviromental_lead: (enviromental_lead === undefined ? null : enviromental_lead.employee_id),
        }

        let method = 'patch';

        if (document.getElementById('logo').files.length > 0 && document.getElementById('logo_updated').checked) {
            data = { ...data, logo: document.getElementById('logo').files[0] };
            method = 'put';
        }
        else if (document.getElementById('logo').files.length === 0 && document.getElementById('logo_updated').checked) {
            data = { ...data, logo: null };
            method = 'put';
        }

        console.log('method: ', method);
        console.log('data: ', data);

        const index = projects.findIndex(elem => elem.id === item.id);

        set_showSpinner_CreateUpdateProject(true);

        // update item in database and in redux store
        axios({
            method: method,
            url: baseUrl + `/company/projects/${updateProject.id}/`,
            headers: {
                "Authorization": token,
                'Content-Type': 'multipart/form-data'
            },
            data: data
        })
        .then((response => {
            console.log("projects updated sucessfully");
            console.log("response.data: ", response.data);

            // let index = projects.findIndex(elem => elem.id === response.data.id);

            let updatedItems = [...projects];

            updatedItems[index] = {
                ...response.data, 
                displayed: updateProject.displayed, 
                milestone_items: [...updateProject.milestone_items],
                monuments: [...updateProject.monuments]
            };

            if (cve_lead !== undefined) {
                updatedItems[index].cve_lead = {
                    "id": cve_lead.employee_id,
                    "employee_initials" : cve_lead.employee_initials
                }
            }

            if (stress_lead !== undefined) {
                updatedItems[index].stress_lead = {
                    "id": stress_lead.employee_id,
                    "employee_initials" : stress_lead.employee_initials
                }
            }

            if (enviromental_lead !== undefined) {
                updatedItems[index].enviromental_lead = {
                    "id": enviromental_lead.employee_id,
                    "employee_initials" : enviromental_lead.employee_initials
                }
            }

            dispatch(apiActions.update_projects(updatedItems));

            // set_updateMode(false);

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const fetchEmployeeData = (item) => {
        axios({
            method: 'get',
            url: baseUrl + '/company/get-employees-data/',
            headers: {
                "Authorization": token,
            },
        })
        .then((response => {
            console.log("/company/get-employees-data/ fetched succesfully...");

            set_employees([...response.data]);
        }))
        .catch((error) => {
            console.log("/company/get-employees-data/ fetched NOT succesfully...");
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    return ( <div className='p02-c02-manage-projects'>
        <div className='p02-c02-background'></div>
        <div className='p02-c02-window'>
            <div className='p02-c02-nav-bar'>
                <div className='p02-c02-nav-bar-left'>
                    {/* <img className='p02-c02-icons' src={delete_cross} alt='' /> */}
                    {userPermissions.findIndex(elem => elem.name === "create_project" || elem.name ===  "all_permissions") !== -1 ?
                    <img 
                        className='p02-c02-icons' 
                        src={create_new} 
                        alt='' 
                        onClick={() => {
                                set_selectedItem(undefined);
                                set_createMode(!createMode);
                            }
                        } 
                    />
                    :
                    <div></div>
                    }
                </div>
                <div className='p02-c02-nav-bar-right'>
                    <div className='p02-c02-textbox-container'>
                        <input className='p02-c02-textbox' type='text' placeholder='Search ...' />
                        <img className='p02-c02-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c02-icons' src={edit_panels} alt='' />
                    <img 
                        className='p02-c02-icons' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input type='button' className='button' value={'X'} onClick={() => dispatch(dashboardActions.set_showModal_manageProjects(false))} />
                </div>
            </div>
            <div className='p02-c02-content'>
                <table>
                    <thead>
                        <tr>
                            <th>show</th>
                            <th>name</th>
                            <th>number</th>
                            <th>short name</th>
                            <th>CVE</th>
                            <th>STRESS</th>
                            <th>ENVIRO</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((item) => {
                            return <tr key={Math.random() * 100000}>
                                <td><input type='checkbox' checked={item.displayed} onChange={() => checkboxChanged(item)} /></td>
                                <td>{item.name}</td>
                                <td>{item.number}</td>
                                <td>{item.short_name}</td>
                                <td>{item.cve_lead != null ? item.cve_lead.employee_initials : ""}</td>
                                <td>{item.stress_lead != null ? item.stress_lead.employee_initials : ""}</td>
                                <td>{item.enviromental_lead != null ? item.enviromental_lead.employee_initials : ""}</td>
                                <td>
                                    {userPermissions.find(elem => elem.name === "edit_project"  || elem.name ===  "all_permissions") ?
                                        <img className='p02-c02-icons' src={pencil_edit} alt='' onClick={() => switchToUpdateMode(item)} />
                                        :
                                        <div></div>
                                    }
                                    {userPermissions.find(elem => elem.name === "delete_project"  || elem.name ===  "all_permissions") ? 
                                        <img className='p02-c02-icons' src={delete_cross} alt='' onClick={() => deleteItem(item)} />
                                        :
                                        <div></div>
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={createMode || updateMode ? 'p02-c02-win-footer' : 'p02-c02-win-footer-hidden'}>
                <div className='p02-c02-footer-row1'>
                    <div className='p02-c02-row1-col1'>name</div>
                    <div className='p02-c02-row1-col2'>
                        <div className='p02-c02-textbox-container'>
                            <input 
                                className='p02-c02-textbox' 
                                type='text' 
                                id='name' 
                                placeholder='...' 
                                defaultValue={selectedItem === undefined ? "" : selectedItem.name} 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c02-footer-row1'>
                    <div className='p02-c02-row1-col1'>number</div>
                    <div className='p02-c02-row1-col2'>
                        <div className='p02-c02-textbox-container'>
                            <input 
                                className='p02-c02-textbox' 
                                type='text' 
                                id='number' 
                                placeholder='...' 
                                defaultValue={selectedItem === undefined ? "" : selectedItem.number}
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c02-footer-row1'>
                    <div className='p02-c02-row1-col1'>short name</div>
                    <div className='p02-c02-row1-col2'>
                        <div className='p02-c02-textbox-container'>
                            <input 
                                className='p02-c02-textbox' 
                                type='text' 
                                id='short_name' 
                                placeholder='...'
                                defaultValue={selectedItem === undefined ? "" : selectedItem.short_name} 
                            />
                        </div>
                    </div>
                </div>
                <div className='p02-c02-footer-row2'>
                    <div className='p02-c02-row1-col1'>Logo</div>
                    <div className='p02-c02-row1-col2'>
                        <div className='p02-c02-textbox-container'>
                            <input className='p02-c02-textbox' type='file' id='logo' placeholder='...' />
                        </div>
                    </div>
                    {updateMode ? 
                        <div className='p02-c02-row1-col2'>
                            <div className='p02-c02-textbox-container'>
                                <label>Update Logo</label>
                                <input className='p02-c02-textbox' type='checkbox' id='logo_updated' />
                            </div>
                        </div> :
                        <div></div>
                    }
                </div>
                <div className='p02-c02-footer-row2'>
                    <div className='p02-c02-row1-col1'>CVE LEAD</div>
                    <div className='p02-c02-row1-col2'>
                        <div className='p02-c02-textbox-container'>
                            <select name="cve_lead" id="cve_lead">
                                <option value="">--Please choose an option--</option>
                                {employees.map((item) => {
                                    let isSelected = false;

                                    if (selectedItem !== undefined) {
                                        if (selectedItem.cve_lead  !== null) {
                                            isSelected = selectedItem.cve_lead.employee_initials === item.employee_initials;
                                        }
                                    }

                                    return <option 
                                        value={item.employee_initials} 
                                        key={Math.random() * 100000}
                                        selected={isSelected}
                                    >{item.employee_initials}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='p02-c02-row1-col1'>STRESS LEAD</div>
                    <div className='p02-c02-row1-col2'>
                        <div className='p02-c02-textbox-container'>
                            <select name="stress_lead" id="stress_lead">
                                <option value="">--Please choose an option--</option>
                                {employees.map((item, index) => {
                                    let isSelected = false;

                                    if (selectedItem !== undefined) {
                                        if (selectedItem.stress_lead  !== null) {
                                            isSelected = selectedItem.stress_lead.employee_initials === item.employee_initials;
                                        }
                                    }

                                    return <option 
                                        value={item.employee_initials} 
                                        key={Math.random() * 100000}
                                        selected={isSelected}
                                    >{item.employee_initials}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='p02-c02-row1-col1'>ENVIROMENTAL LEAD</div>
                    <div className='p02-c02-row1-col2'>
                        <div className='p02-c02-textbox-container'>
                            <select name="enviromental_lead" id="enviromental_lead">
                                <option value="">--Please choose an option--</option>
                                {employees.map((item) => {
                                    let isSelected = false;

                                    if (selectedItem !== undefined) {
                                        if (selectedItem.enviromental_lead  !== null) {
                                            isSelected = selectedItem.enviromental_lead.employee_initials === item.employee_initials;
                                        }
                                    }

                                    return <option 
                                        value={item.employee_initials} 
                                        key={Math.random() * 100000}
                                        selected={isSelected}
                                    >{item.employee_initials}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='p02-c02-footer-row2'>
                    <div className='p02-c02-row2-col1'>
                        {showSpinner_CreateUpdateProject ?
                            <div className="spinner-border p02-c02-spinner" role="status">
                                <span className="sr-only"></span>
                            </div>
                            :
                            <input 
                                type='button' 
                                className='button' 
                                value={updateMode ? 'Update' : 'Create'} 
                                onClick={updateMode ? () => updateItem(selectedItem) : createItem} 
                            />
                        }
                    </div>
                    <div className='p02-c02-row2-col2'>
                        <input 
                            type='button' 
                            className='button' 
                            value={updateMode ? 'Cancel' : 'Close'} 
                            onClick={updateMode ? () => set_updateMode(false) : () => set_createMode(false)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div> );
}
 
export default P02_C02_MANAGE_PROJECTS;