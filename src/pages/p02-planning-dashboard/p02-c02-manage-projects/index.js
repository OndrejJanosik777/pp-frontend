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
import '../../../styles/tables.scss';
import '../../../styles/forms.scss';
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
        console.log('projects: ', projects);
        console.log('selectedItem: ', selectedItem);
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
        let logo_2 = null;

        if (name == "" || short_name == "" || number == "")  {
            return alert('Missing input: name, number or short name')
        }

        let cve_lead = employees.find(elem => elem.employee_initials === document.getElementById('cve_lead').value);
        let stress_lead = employees.find(elem => elem.employee_initials === document.getElementById('stress_lead').value);
        let enviromental_lead = employees.find(elem => elem.employee_initials === document.getElementById('enviromental_lead').value);
        let ple = employees.find(elem => elem.employee_initials === document.getElementById('ple').value);
        let plp = employees.find(elem => elem.employee_initials === document.getElementById('plp').value);

        if (document.getElementById('logo').files.length > 0) {
            logo_2 = document.getElementById('logo').files[0];
        }

        let data = {
            name: name,
            number: number,
            short_name: short_name,
            logo_2: logo_2,
            cve_lead: (cve_lead === undefined ? null : cve_lead.employee_id),
            stress_lead: (stress_lead === undefined ? null : stress_lead.employee_id),
            enviromental_lead: (enviromental_lead === undefined ? null : enviromental_lead.employee_id),
            ple: (enviromental_lead === undefined ? null : ple.employee_id),
            plp: (enviromental_lead === undefined ? null : plp.employee_id)
        }

        set_showSpinner_CreateUpdateProject(true);

        let newProject = null;

        // update in backend database and after success in redux state
        axios({
            method: 'post',
            url: baseUrl + '/company/projects/',
            headers: {
                "Authorization": token,
                'Content-Type': 'multipart/form-data'
            },
            data: data
        })
        .then((response => {
            console.log("projects created sucessfully");

            newProject = {...response.data, displayed: true, milestone_items: [], monuments: [] };

            if (cve_lead !== undefined) {
                newProject.cve_lead = {
                    "id": cve_lead.employee_id,
                    "employee_initials" : cve_lead.employee_initials
                }
            }

            if (stress_lead !== undefined) {
                newProject.stress_lead = {
                    "id": stress_lead.employee_id,
                    "employee_initials" : stress_lead.employee_initials
                }
            }

            if (enviromental_lead !== undefined) {
                newProject.enviromental_lead = {
                    "id": enviromental_lead.employee_id,
                    "employee_initials" : enviromental_lead.employee_initials
                }
            }

            if (ple !== undefined) {
                newProject.ple = {
                    "id": ple.employee_id,
                    "employee_initials" : ple.employee_initials
                }
            }

            if (plp !== undefined) {
                newProject.plp = {
                    "id": plp.employee_id,
                    "employee_initials" : plp.employee_initials
                }
            }

            let updatedProjects = [...projects, newProject];

            dispatch(apiActions.update_projects(updatedProjects))

            set_showSpinner_CreateUpdateProject(false);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })

        // update project visibility
        if (newProject != null) {
            axios({
                method: 'post',
                url: baseUrl + `/company/update-project-visibility/`,
                headers: {
                    "Authorization": token
                },
                data: {
                    project_id: newProject.id
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
        updateProject.ple = document.getElementById('ple').value;
        updateProject.plp = document.getElementById('plp').value;


        if (updateProject.name == "" || updateProject.number == "" || updateProject.short_name == "")  {
            return alert('Missing input: name, number or short name')
        }

        let cve_lead = employees.find(elem => elem.employee_initials === document.getElementById('cve_lead').value);
        let stress_lead = employees.find(elem => elem.employee_initials === document.getElementById('stress_lead').value);
        let enviromental_lead = employees.find(elem => elem.employee_initials === document.getElementById('enviromental_lead').value);
        let ple = employees.find(elem => elem.employee_initials === document.getElementById('ple').value);
        let plp = employees.find(elem => elem.employee_initials === document.getElementById('plp').value);

        let data = {
            name: updateProject.name,
            number: updateProject.number,
            short_name: updateProject.short_name,
            cve_lead: (cve_lead === undefined ? null : cve_lead.employee_id),
            stress_lead: (stress_lead === undefined ? null : stress_lead.employee_id),
            enviromental_lead: (enviromental_lead === undefined ? null : enviromental_lead.employee_id),
            ple: (enviromental_lead === undefined ? null : ple.employee_id),
            plp: (enviromental_lead === undefined ? null : plp.employee_id)
        }

        let method = 'patch';

        if (document.getElementById('logo').files.length > 0 && document.getElementById('logo_updated').checked) {
            data = { ...data, logo_2: document.getElementById('logo').files[0] };
            method = 'patch';
        }
        else if (document.getElementById('logo').files.length === 0 && document.getElementById('logo_updated').checked) {
            data = { ...data, logo_2: null };
            method = 'patch';
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

            if (ple !== undefined) {
                updatedItems[index].ple = {
                    "id": ple.employee_id,
                    "employee_initials" : ple.employee_initials
                }
            }

            if (plp !== undefined) {
                updatedItems[index].plp = {
                    "id": plp.employee_id,
                    "employee_initials" : plp.employee_initials
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
            {/* TOP SECTION - NAVIGATION BAR */}
            <div className='p02-c02-nav-bar'>
                <div>
                    {userPermissions.findIndex(elem => elem.name === "create_project" || elem.name ===  "all_permissions") !== -1 ?
                    <img 
                        className='icons-01' 
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{
                        height: '20px',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        padding: '0 5px'
                    }}>
                        <input style={{ width: '160px', height: '20px' }} type='text' placeholder='Search ...' />
                        <img className='p02-c02-img' src={magnifier} alt='' />
                    </div>
                    <img className='icons-01' src={edit_panels} alt='' />
                    <img 
                        className='icons-01' 
                        src={questionmark_blue} 
                        alt='' 
                        onClick={() => showState()}
                    />
                    <input type='button' className='button-02' value={'X'} onClick={() => dispatch(dashboardActions.set_showModal_manageProjects(false))} />
                </div>
            </div>
            {/* MIDDLE SECTION - TO DISPLAY ITEMS */}
            <div className='table-01-container'>
                <table >
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>show</th>
                            <th>name</th>
                            <th>number</th>
                            <th>logo</th>
                            <th>short name</th>
                            <th>CVE</th>
                            <th>STRESS</th>
                            <th>ENVIRO</th>
                            <th>PLE</th>
                            <th>PLP</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((item) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{item.id}</td>
                                <td className='center'><input type='checkbox' checked={item.displayed} onChange={() => checkboxChanged(item)} /></td>
                                <td>{item.name}</td>
                                <td>{item.number}</td>
                                <td className='logo'><img src={`https://res.cloudinary.com/dpdthtsnm/${item.logo_2}`} alt='' style={{height: '17px'}} ></img></td>
                                <td>{item.short_name}</td>
                                <td>{item.cve_lead != null ? item.cve_lead.employee_initials : ""}</td>
                                <td>{item.stress_lead != null ? item.stress_lead.employee_initials : ""}</td>
                                <td>{item.enviromental_lead != null ? item.enviromental_lead.employee_initials : ""}</td>
                                <td>{item.ple != null ? item.ple.employee_initials : ""}</td>
                                <td>{item.plp != null ? item.plp.employee_initials : ""}</td>
                                <td className='center'>
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
            {/* BOTTOM SECTION - FOR CREATE / EDIT */}
            <div className='create-edit-container'
                style={createMode || updateMode ? { width: '100%' } : { visibility: 'collapse', height: '0' }}>
                <table>
                    <tr>
                        <td className='label-01'>name</td>
                        <td><input 
                            className='text-01' type='text' id='name' 
                            defaultValue={selectedItem === undefined ? "" : selectedItem.name}>
                            </input>
                        </td>
                        <td className='label-01'>CVE LEAD</td>
                        <td>
                            <select name="cve_lead" id="cve_lead">
                                <option value="">--select--</option>
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
                        </td>
                        <td className='label-01'>PLE LEAD</td>
                        <td>
                            <select name="ple" id="ple">
                                <option value="">--select--</option>
                                {employees.map((item) => {
                                    let isSelected = false;

                                    if (selectedItem !== undefined) {
                                        if (selectedItem.ple  !== null) {
                                            isSelected = selectedItem.ple.employee_initials === item.employee_initials;
                                        }
                                    }

                                    return <option 
                                        value={item.employee_initials} 
                                        key={Math.random() * 100000}
                                        selected={isSelected}
                                    >{item.employee_initials}</option>
                                })}
                            </select>
                        </td>
                        <td style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label>LOGO UPLOAD</label>
                            <input type='checkbox' id='logo_updated' style={updateMode ? {} : {visibility: 'hidden'} } />
                        </td>
                    </tr>
                    <tr>
                        <td className='label-01'>number</td>
                        <td><input 
                            className='text-01' type='text' id='number' 
                            defaultValue={selectedItem === undefined ? "" : selectedItem.number}>
                            </input>
                        </td>
                        <td className='label-01'>STRESS LEAD</td>
                        <td>
                            <select name="stress_lead" id="stress_lead">
                                <option value="">--select--</option>
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
                        </td>
                        <td className='label-01'>PLP LEAD</td>
                        <td>
                            <select name="plp" id="plp">
                                <option value="">--select--</option>
                                {employees.map((item) => {
                                    let isSelected = false;

                                    if (selectedItem !== undefined) {
                                        if (selectedItem.plp  !== null) {
                                            isSelected = selectedItem.plp.employee_initials === item.employee_initials;
                                        }
                                    }

                                    return <option 
                                        value={item.employee_initials} 
                                        key={Math.random() * 100000}
                                        selected={isSelected}
                                    >{item.employee_initials}</option>
                                })}
                            </select>
                        </td>
                        <td><input className='p02-c02-textbox' type='file' id='logo' placeholder='...' /></td>
                    </tr>
                    <tr>
                        <td className='label-01'>short name</td>
                        <td><input 
                            className='text-01' type='text' id='short_name' 
                            defaultValue={selectedItem === undefined ? "" : selectedItem.short_name}>
                            </input>
                        </td>
                        <td className='label-01'>ENV LEAD</td>
                        <td>
                            <select name="enviromental_lead" id="enviromental_lead">
                                <option value="">--select--</option>
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
                        </td>
                        <td></td>
                        <td></td>
                        <td className='logo'><img 
                            src={selectedItem === undefined ? "" : `https://res.cloudinary.com/dpdthtsnm/${selectedItem.logo_2}`} 
                            alt='' 
                            style={{height: '17px'}} 
                        ></img></td>
                    </tr>
                </table>
                <div style={{ height: '10px', width: '100%', borderBottom: '1px solid grey' }}></div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '5px 0px' }}>
                    <div>
                        {showSpinner_CreateUpdateProject ?
                            <div className="spinner-border" style={{ width: '15px', height: '15px' }} role="status">
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
                    <div>
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