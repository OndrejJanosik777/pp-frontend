import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import planeSVG from './assets/airplane.svg';
import MilestoneTag from '../milestone-tag';
import './index.scss';

const Project = (props) => {
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
                console.log('document: ', document);
                let index = certificationDocumentIds.findIndex((elem) => elem === document.id);

                if (index === -1) { 
                    certificationDocumentIds.push(document.id)
                }
            })
        })

        set_certificationDocumentIds(certificationDocumentIds);

    }, []);

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
        {/* <div className='p02-left-container'>
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
            <div className='p02-row-left'>
                {`Milestones: ${achievedMilestones.length}/${props.project.milestone_items.length}`}
            </div>
            <div className='p02-row-left'>
                {`Tasks: ${completedTasks}/${totalTasks}`}
            </div>
            <div className='p02-row-left'>
                {`Monuments: ${props.project.monuments.length}`}
            </div>
            <div className='p02-row-left'>
                {`Documents: ${certificationDocumentIds.length}`}
            </div>
        </div>
        <div style={middleStyle}>
            {
            props.project.milestone_items.map((milestoneItem, index) => {
                // console.log('drawing milestone items: ', index)

                return < MilestoneTag
                    key={Math.random() * 100000}
                    dateOffset={dateOffset}
                    topOffset={(index - 1) * 30}  // offset in px from top
                    project={props.project}
                    milestoneItem={milestoneItem}
                    displayLimit={displayedDays}
                    updateMilestoneItemDeadline={updateMilestoneItemDeadline}
                    updateMilestoneItem={updateMilestoneItem}
                    display_modal_createNewTask={display_modal_createNewTask}
                    // popUpCreateTaskModal={setCreateTask_toogle(!createTask_toogle)}
                    // updateMilestoneItem={() => createEditMilestone_toogle(project, milestoneItem)}
                    deleteMilestoneItem={() => display_modal_warning_deleteMilestoneItem(project, milestoneItem)}
                />
            })
            }
        </div> */}
    </div> );
}
 
export default Project;