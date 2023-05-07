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
    // 
    const [updateMode, set_updateMode] = useState(false);
    const [createMode, set_createMode] = useState(false);
    const [selectedItem, set_selectedItem] = useState(undefined);
    const [selectedItemIndex, set_selectedItemIndex] = useState(undefined);
    const [showSpinner_CreateUpdateItem, set_showSpinner_CreateUpdateItem] = useState(false);

    useEffect(() => {
        console.log('(modal) component ManageMonuments loaded: ... ');
        console.log('props: ', props);
    }, []);
    
    const showState = () => {
        console.log('props: ', props);
        console.log('monuments: ', documents);
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
        </div>

    </div> );
}
 
export default ManageDocuments;