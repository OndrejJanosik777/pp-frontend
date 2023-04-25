import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
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

const ManageMilestones = (props) => {
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);

    useEffect(() => {
        console.log('component ManageMilestones loaded: ... ');
        console.log('props.activeProject: ', props.activeProject);
    }, []);

    const deleteItem = (item) => {
        // const index = taskTypes.findIndex(elem => elem.id === item.id)

        // let updatedItems = [...taskTypes];

        // updatedItems.splice(index, 1);

        // set_taskTypes([...updatedItems]);

        // axios({
        //     method: 'delete',
        //     url: baseUrl + `/company/task-types/${item.id}/`,
        //     headers: {
        //         "Authorization": token
        //     }
        // })
        //     .then((response => {
                
        //     }))
        //     .catch((error) => {
        //         console.log(error);

        //         alert(error);

        //         let updatedItems = [...taskTypes];

        //         set_taskTypes([...updatedItems]);
        //     })
    }

    const switchToUpdateMode = (item) => {
        // set_updateMode(true);
        // set_selectedItem(item);

        // document.getElementById('name').value = item.name;
        // document.getElementById('description').value = item.description;
    }

    return ( <div className='p02-c06-manage-milestones'>
        <div className='p02-c06-background'></div>
        <div className='p02-c06-window'>
            <div className='p02-c06-nav-bar'>
                <div className='p02-c06-nav-bar-left'>
                    <img 
                        className='p02-c06-icons' 
                        src={delete_cross} 
                        alt=''
                    />
                    <img 
                        className='p02-c06-icons' 
                        src={create_new} alt='' 
                        onClick={() => set_createMode(!createMode)} 
                    />
                </div>
                <div className='p02-c06-nav-bar-right'>
                    <div className='p02-c06-textbox-container'>
                        <input 
                            className='p02-c06-textbox' 
                            type='text' 
                            placeholder='Search ...' 
                        />
                        <img className='p02-c06-img' src={magnifier} alt='' />
                    </div>
                    <img className='p02-c06-icons' src={edit_panels} alt='' />
                    <img className='p02-c06-icons' src={questionmark_blue} alt='' />
                    <input 
                        type='button' 
                        className='p02-c06-button' 
                        value={'X'} 
                        onClick={() => props.toogleVisibility(false)} 
                    />
                </div>
            </div>
            <div className='p02-c06-content'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>type</th>
                            <th>name</th>
                            <th>date</th>
                            <th>comment</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO:  */}
                        {props.activeProject.milestone_items.map((item) => {
                            return <tr key={Math.random() * 100000}>
                                <td>{item.id}</td>
                                <td>{item.milestone_item_type.short_name}</td>
                                <td>{item.name}</td>
                                <td>{item.date}</td>
                                <td>{item.comment}</td>
                                <td>
                                    <img 
                                        className='p02-c06-icons' 
                                        src={pencil_edit} 
                                        alt='' 
                                        onClick={() => switchToUpdateMode(item)} 
                                    />
                                    <img 
                                        className='p02-c06-icons' 
                                        src={delete_cross} 
                                        alt='' 
                                        onClick={() => deleteItem(item)} 
                                    />
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div> );
}
 
export default ManageMilestones;