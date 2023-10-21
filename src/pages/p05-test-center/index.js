import React, { Component } from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import home from './assets/home.png';
import small_arrow_down from './assets/small_arrow_down.png';
import questionmark_blue from './assets/questionmark_blue.png';
import C01_NAVBAR from '../../components/c01-nav-bar';
import C02_SIDEBAR from '../../components/c02-side-bar';
import * as TCActions from '../../app/features/testCenterSlice';
import './index.scss';
import axios from 'axios'; 

const P05_TEST_CENTER = () => {
    const dispatch = useDispatch();
    const [newTCItems, set_newTCItems] = useState([]);

    // pick the data from the redux store
    let baseUrl = useSelector(state => state.api.baseUrl);
    let TCItems = useSelector(state => state.testCenter.TCItems);

    // const [baseUrl, set_baseUrl] = useState(getBaseUrl());
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));
    const [activeMenu, set_activeMenu] = useState('');

    useEffect(() => {
        dispatch(TCActions.fetch_TCItems());
    }, []);

    const showState = () => {
        console.log('newTCItems: ', newTCItems);
    }

    const contentPasted = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let contentText = e.clipboardData.getData('text/plain');
        let contentRows = contentText.split('\n');

        let emptyRow = contentRows.indexOf("");
        contentRows.splice(emptyRow, 1);


        contentRows.map((item, index) => {
            contentRows[index] = contentRows[index].split('\t');
        })

        // console.log('contentText: ', contentText);
        // console.log('contentRows: ', contentRows);
        // console.log('rows: ', contentRows.length);
        // console.log('columns: ', contentRows[0].length);

        // let jsonFormat = {};

        set_newTCItems([...contentRows]);
    }

    const saveNewItems = () => {
        // TODO:
        let jsonFormat = [];

        newTCItems.map((item, index) => {
            let jsonItem = {
                Part_Number: item[0],
                Part_Description: item[1],
                Lagerort: item[2],
                Total: item[3],
                Gut: item[4],
            }

            jsonFormat.push({...jsonItem});
        });

        console.log('jsonFormat: ', jsonFormat);

        axios({
            method: 'post',
            url: baseUrl + `/company/update-items-TC/`,
            headers: {
                "Authorization": token
            },
            data: jsonFormat 
        })
        .then((response => {
            // console.log("response.data: ", response.data);
            dispatch(TCActions.fetch_TCItems());
            // dispatch(dashboardActions.set_spinnerFetchingProjects(true));
            // dispatch(apiActions.fetch_projects());
        }))
        .catch((error) => {
            // console.log("error: ", error);

            // let message = error.message + "\n" + error.response.data;

            // alert(message);

            // dispatch(apiActions.update_projects(originalItems));
        })
    }

    return ( <div className='p05-test-center'>
        <C01_NAVBAR />
        <C02_SIDEBAR />
        <div className='p05-center-section'>
            <img 
                className='p05-img-home' 
                onClick={() => showState()}
                src={home} 
                alt='' 
            />
            <button className='p05-button-container'>
                <div className='p05-button-name'>Quick Links</div>
                <img className='p05-img' src={small_arrow_down} alt='' />
            </button>
            <div className='p05-main-section' id='main-section' name='main-section'>
                <div className='p05-nav-bar'>
                    <div className='p05-nav-bar-left'>
                        <div 
                            className='p05-item' 
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageProjects(true))}
                        >free</div>
                        <div className='p05-item'>|</div>
                        <div 
                            className='p05-item' 
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageMilestoneTypes(true))} 
                        >free</div>
                        <div className='p05-item'>|</div>
                        <div 
                            className='p05-item'
                            // onClick={() => dispatch(dashboardActions.set_showModal_manageTaskTypes(true))}
                        >Tested Monuments</div>
                        <div className='p05-item'>|</div>
                        <div 
                            className={activeMenu === 'ItemsTC' ? 'p05-item-active' : 'p05-item'}
                            onClick={() => set_activeMenu('ItemsTC')}
                        >TC Items overview</div>
                        <div className='p05-item'>|</div>
                        <div 
                            className={activeMenu === 'updateItemFromExcel' ? 'p05-item-active' : 'p05-item'}
                            onClick={() => {
                                set_activeMenu('updateItemFromExcel');
                            }}
                        >update TC Items from Excel Test Material</div>
                    </div>
                    <div className='p05-nav-bar-right'>
                        <img 
                            className='p05-icons' 
                            // onClick={showState}
                            src={questionmark_blue} 
                            alt='' 
                        />
                    </div>
                </div>
                {activeMenu === 'updateItemFromExcel' ? 
                <div>
                    <textarea 
                        id='excelPasteBox' 
                        placeholder='paste from excel' 
                        onPaste={(e) => contentPasted(e)}
                        contentEditable={false}
                    ></textarea>
                    <table>
                        <thead>
                            <tr>
                                <th>Part Number</th>
                                <th>Part Description</th>
                                <th>Lagerort</th>
                                <th>Total</th>
                                <th>Gut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newTCItems.map((item) => {
                                return <tr key={Math.random() * 1000000}>
                                    <td>{item[0]}</td>
                                    <td>{item[1]}</td>
                                    <td>{item[2]}</td>
                                    <td>{item[3]}</td>
                                    <td>{item[4]}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <button onClick={() => saveNewItems()} >save changes</button>
                </div> :
                <div></div>
                }
                {activeMenu === 'ItemsTC' ? 
                <div>
                    <div>number of items: {TCItems.length}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Part Number</th>
                                <th>Part Description</th>
                                <th>Lagerort</th>
                                <th>Total</th>
                                <th>Gut</th>
                                <th>Comment 1</th>
                                <th>Comment 2</th>
                                <th>Insert</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TCItems.map((item) => {
                                return <tr key={Math.random() * 1000000}>
                                    <td>{item.id}</td>
                                    <td>{item.Item_TC_Part_Number}</td>
                                    <td>{item.Item_TC_Part_Description}</td>
                                    <td>{item.Item_TC_Lagerort}</td>
                                    <td>{item.Item_TC_Total}</td>
                                    <td>{item.Item_TC_Gut}</td>
                                    <td>{item.Item_TC_Comment_1}</td>
                                    <td>{item.Item_TC_Comment_2}</td>
                                    <td>{item.Item_TC_Category}</td>
                                    <td>{item.Insert}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <button 
                        // onClick={() => saveNewItems()} 
                    >save changes</button>
                </div> :
                <div></div>
                }
            </div>
        </div>
    </div> );
}
 
export default P05_TEST_CENTER;