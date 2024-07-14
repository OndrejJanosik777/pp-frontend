import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; 

const PLAYGOUND_02 = () => {
    // let baseUrl = useSelector(state => state.api.baseUrl);
    let baseUrl = "http://127.0.0.1:8000";
    const [token, set_token] = useState("Bearer " + localStorage.getItem('PP-token'));

    // https://res.cloudinary.com/dpdthtsnm/

    const [aircrafts, set_aircrafts] = useState([]);

    useEffect(() => {
        // fetch employee data for drop down menu
        fetchAircrafts();
    }, []);

    const create = () => {
        console.log('new aicraft object created');

        let type = document.getElementById('type');
        let avatar = document.getElementById('avatar');

        console.log('baseUrl: ', baseUrl);
        // console.log('type: ', type);
        console.log('type: ', type);
        console.log('avatar: ', avatar);
        console.log('avatar: ', avatar.files[0]);

        // URL.createObjectURL()

        axios({
            method: 'post',
            url: `http://127.0.0.1:8000/company/aircraft/`,
            headers: {
                "Authorization": token,
                'Content-Type': 'multipart/form-data'
            },
            data: {
                type: type.value,
                picture: avatar.files[0]
            }
        })
        .then((response => {
            console.log('new aicraft object created: ', response.data);

            fetchAircrafts();
        }))
        .catch((error) => {
            console.log("error: ", error);
            let message = error.message + "\n" + error.response.data;
            alert(message);
        })
    }

    const fetchAircrafts = () => {
        axios({
            method: 'get',
            url: `http://127.0.0.1:8000/company/aircraft/`,
            headers: {
                "Authorization": token
                // 'Content-Type': 'multipart/form-data'
            }
        })
        .then((response => {
            console.log('aicrafts fetched succesfully: ', response.data);
            set_aircrafts([...response.data]);
        }))
        .catch((error) => {
            console.log("error: ", error);
            let message = error.message + "\n" + error.response.data;
            alert(message);
        })
    }

    return ( <div className='PLAYGOUND_02'>
        <div>create new aircraft object:</div>
        <div>
            <label for="type" >type</label>
            <input type='text' name='type' id='type' ></input>
        </div>
        <div>
            <label for="avatar" >type</label>
            <input type='file' name='avatar' id='avatar' ></input>
        </div>
        <div>
            <input type='button' name='create' id='create' onClick={() => create()} value={'CREATE'} ></input>
        </div>
        <hr></hr>
        <table>
            {aircrafts.map((item, index) => {
                return <tr>
                    <td>{item.id}</td>
                    <td>{item.type}</td>
                    <td><img src={`https://res.cloudinary.com/dpdthtsnm/${item.picture}`} alt=''></img></td>
                </tr>
            })}
        </table>
    </div> );
}
 
export default PLAYGOUND_02;