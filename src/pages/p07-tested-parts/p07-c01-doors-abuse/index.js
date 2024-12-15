import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './index.scss';
import axios from 'axios';

const P07_C01_DOORS_ABUSE = () => {
    // local state
    let baseUrl = useSelector(state => state.api.baseUrl);
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));

    const [doors, set_doors] = useState([{
        id: 0,
        width: null,
        height: null,
        thickness: null,
        material: "",
        style: "",
        hinges: null,
        outer_distance: null,
        abuse_load: null,
        part_number: "",
        test_report: ""
    }]);

    // functions

    useEffect(() => {
        fetchData();
        // dispatch(documentsActions.fetch_Documents());
    }, []);

    const fetchData = () => {
        axios({
            method: 'get',
            url: baseUrl + '/company_2/doors_abuse/',
            headers: {
                "Authorization": token
            }
        })
        .then((response => {
            console.log("data fetched succesfully: ", response.data);
            
            set_doors([...response.data]);
        }))
        .catch((error) => {
            console.log("error: ", error);

            let message = error.message + "\n" + error.response.data;

            alert(message);
        })
    }

    const showState = () => {
        console.log("display state...");
        console.log("doors: ", doors);
    }


    return ( <div className='p07-c01-doors-abuse'>
        {/* p07-c01-doors-abuse */}
            <div>
                <table style={{ border: "1px solid black" }}>
                    <thead>
                        <tr>
                            <td>{"id"}</td>
                            <td>{"width"}</td>
                            <td>{"height"}</td>
                            <td>{"thickness"}</td>
                            <td>{"material"}</td>
                            <td>{"style"}</td>
                            <td>{"hinges"}</td>
                            <td>{"outer distance"}</td>
                            <td>{"abuse load"}</td>
                            <td>{"P/N"}</td>
                            <td>{"test report"}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {doors.map((item) => {
                            return <tr>
                                <td>{item.id}</td>
                                <td>{item.width}</td>
                                <td>{item.height}</td>
                                <td>{item.thickness}</td>
                                <td>{item.material}</td>
                                <td>{item.style}</td>
                                <td>{item.hinges}</td>
                                <td>{item.outer_distance}</td>
                                <td>{item.abuse_load}</td>
                                <td>{item.part_number}</td>
                                <td>{item.test_report}</td>
                            </tr>
                        })}
                        
                    </tbody>
                </table>
            </div>
            <div>
                <table style={{ border: "1px solid black" }}>
                    <thead>
                        <tr>
                            <td>{"id"}</td>
                            <td>{"width"}</td>
                            <td>{"height"}</td>
                            <td>{"thickness"}</td>
                            <td>{"material"}</td>
                            <td>{"style"}</td>
                            <td>{"hinges"}</td>
                            <td>{"outer distance"}</td>
                            <td>{"abuse load"}</td>
                            <td>{"P/N"}</td>
                            <td>{"test report"}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td><input type='text' id='width'/></td>
                            <td><input type='text' id='height'/></td>
                            <td><input type='text' id='thickness'/></td>
                            <td><input type='text' id='material'/></td>
                            <td><input type='text' id='style'/></td>
                            <td><input type='text' id='outer_distance'/></td>
                            <td><input type='text' id='hinges'/></td>
                            <td><input type='text' id='abuse_load'/></td>
                            <td><input type='text' id='P/N'/></td>
                            <td><input type='text' id='test_report'/></td>
                        </tr>
                    </tbody>
                </table>
                <button style={{ width: "100%" }}>(+) Add</button>
                <button style={{ width: "100%" }} onClick={() => showState() }>Display State</button>
            </div>
    </div> );
}
 
export default P07_C01_DOORS_ABUSE;