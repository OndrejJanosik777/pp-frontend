import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import MilestoneTag from '../milestone-tag';
import './index.scss';

const Project = (props) => {
    const getBaseUrl = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            return 'http://127.0.0.1:8000';
        } else {
            // production code
            return 'https://pp--backend.herokuapp.com';
        }
    }

    const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [achievedMilestones, set_achievedMilestones] = useState({});
    const [completedTasks, set_completedTasks] = useState(0);
    const [totalTasks, set_totalTasks] = useState(0);
    const [certificationDocumentIds, set_certificationDocumentIds] = useState([]);

    useEffect(() => {
        props.project.milestone_items.sort((a, b) => {
            return moment(a.date) - moment(b.date);
        })

        let achievedMilestones = props.project.milestone_items.filter(elem => {
            let now = moment();
            let m_date = moment(elem.date);

            return m_date.diff(now, 'days') < 0;
        })

        set_achievedMilestones(achievedMilestones);

        let totalTasks = 0;
        let completedTasks = 0;

        props.project.milestone_items.map((milestoneItem) => {
            totalTasks += milestoneItem.tasks.length;

            milestoneItem.tasks.map((task) => {
                if (task.status === 100) {
                    completedTasks += 1;
                }
            })
        })

        let certificationDocumentIds = [];

        props.project.monuments.map((monument) => {
            monument.certification_documents.map((document) => {
                // console.log('document: ', document);
                let index = certificationDocumentIds.findIndex((elem) => elem === document.id);

                if (index === -1) { 
                    certificationDocumentIds.push(document.id)
                }
            })
        })

        set_certificationDocumentIds(certificationDocumentIds);
        set_totalTasks(totalTasks);

    }, []);

    const display_modal_createNewTask = (project, milestoneItem) => {
        console.log(`creating new Task for milestone ${milestoneItem.id} within project ${project.id}`);

        props.set_activeProject(project);
        props.set_activeMilestoneItem(milestoneItem);

        props.set_createTask_toogle(!props.createTask_toogle);
    }

    const updateMilestoneItem = (project, milestoneItem) => {
        console.log(`updating milestone item ${milestoneItem.name} within project ${project.name}`);

        props.set_activeProject(project);
        props.set_activeMilestoneItem(milestoneItem);

        props.set_editMilestone_toogle(!props.editMilestone_toogle);
    }

    const updateMilestoneItemDeadline = (days, project, milestoneItem) => {
        // update in component state
        // console.log(`moving milestone with id ${milestoneItemId} within project with id ${projectId} by ${days}... `);

        let projectIndex = props.projects.findIndex(element => element.id === project.id);
        let milestoneIndex = props.projects[projectIndex].milestone_items.findIndex(element => element.id === milestoneItem.id);
        let originalDate = props.projects[projectIndex].milestone_items[milestoneIndex].date;
        // console.log('originalDate: ', originalDate);

        let newDate = moment(originalDate).add(days, 'days').format("YYYY-MM-DD");
        // console.log('newDate: ', newDate);

        let originalProjects = [...props.projects];
        let updatedProjects = [...props.projects];
        updatedProjects[projectIndex].milestone_items[milestoneIndex].date = newDate;
        // console.log('updateddisplayedProjects: ', updateddisplayedProjects);
        // updateMilestoneItem({ ...updateddisplayedProjects[projectIndex].milestone_items[milestoneIndex] })
        props.set_projects([...updatedProjects]);

        let updatedMilestoneItem = { ...updatedProjects[projectIndex].milestone_items[milestoneIndex] };

        // update in database
        axios({
            method: 'patch',
            url: baseUrl + '/company/milestone-items/' + updatedMilestoneItem.id + "/",
            headers: {
                "Authorization": token
            },
            data: {
                // id: milestoneItem.id,
                name: updatedMilestoneItem.name,
                // milestone_item_type: milestoneItem.id,
                date: updatedMilestoneItem.date,
                comment: updatedMilestoneItem.comment
            }
        })
        .then((response => {
            console.log('milestone deadline updated in database: ', response.data);
        }))
        .catch((error) => {
            console.log('problem with updating milestone item: ', error);

            props.set_projects([...originalProjects]);
        })
    }

    const middleStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: `${props.project.milestone_items.length * 50}px`,
        minHeight: '10rem',
        borderWidth: '1px',
        borderColor: 'black',
        borderStyle: 'solid',
        position: 'relative',
        // backgroundColor: 'green',
        width: '100%',
    }

    return ( <div className='p02-c05-project'>
        <div className='p02-left-container'>
            <div>{`#${props.project.id} : ${props.project.number}`}</div>
            <div>{props.project.short_name}</div>
            <div>
                <img
                    className='plane-icons'
                    src={planeSVG}
                    alt=''
                // onClick={() => editMilestoneType(milestoneType.id)} 
                />
            </div>
            <div 
                className='p02-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        props.set_manageMonuments_modalToogle(true);
                    }
                }
            >
                {`Monuments: ${props.project.monuments.length}`}
            </div>
            <div 
                className='p02-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        props.set_manageDocuments_modalToogle(true);
                    }
                }
            >
                {`Documents: ${certificationDocumentIds.length}`}
            </div>
            <div 
                className='p02-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        props.set_manageMilestones_modalToogle(true);
                    }
                }
            >
                {`Milestones: ${achievedMilestones.length}/${props.project.milestone_items.length}`}
            </div>
            <div 
                className='p02-row-left'
                onClick={
                    () => {
                        props.set_activeProject(props.project);
                        // props.set_manageTasks_modalToogle(true);
                    }
                }
            >
                {`Tasks: ${completedTasks}/${totalTasks}`}
            </div>
        </div>
        <div style={middleStyle}>
            {
            props.project.milestone_items.map((milestoneItem, index) => {
                // console.log('drawing milestone items: ', index)

                return < MilestoneTag
                    key={Math.random() * 100000}
                    dateOffset={props.dateOffset}
                    topOffset={(index - 1) * 30}  // offset in px from top
                    project={props.project}
                    milestoneItem={milestoneItem}
                    deltaStart={50 + 8*16}
                    displayLimit={props.displayedDays}
                    updateMilestoneItemDeadline={updateMilestoneItemDeadline}
                    updateMilestoneItem={updateMilestoneItem}
                    display_modal_createNewTask={display_modal_createNewTask}
                    // popUpCreateTaskModal={setCreateTask_toogle(!createTask_toogle)}
                    // updateMilestoneItem={() => createEditMilestone_toogle(project, milestoneItem)}
                    deleteMilestoneItem={() => props.display_modal_warning_deleteMilestoneItem(props.project, milestoneItem)}
                    set_manageTasks_modalToogle={props.set_manageTasks_modalToogle}
                    set_activeMilestoneItem={props.set_activeMilestoneItem}
                    set_activeProject={props.set_activeProject}
                />
            })
            }
        </div>
    </div> );
}
 
export default Project;