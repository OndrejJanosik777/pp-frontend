import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    increment, 
    decrement,
    incrementByAmount
} from '../../app/features/counter/counterSlice';
import {
    fetchUserProfile
} from '../../app/features/auth/authSlice';
import './index.scss'

const Playground = () => {
    // const count = useSelector(selectCount);
    const count = useSelector(state => state.counter.value);
    const dispatch = useDispatch()

    return ( <div className='p00-playground'>
        <div className='p00-nav-bar'>
        <button 
            className='p00-button'
            onClick={() => {
                dispatch(increment());
                // dispatch(thunkFunction);
            }}
        >Add 1</button>
            {count}
        <button 
            className='p00-button'
            onClick={() => {
                dispatch(decrement());
                // dispatch(incrementByAmount(5));
                // dispatch(thunkFunction);
            }}
        >Remove 1</button>
        </div>
        <div className='p00-main-body'>
            <div>counter.value: {count}</div>
            <div>username: {useSelector(state => state.auth.userProfile.username)}</div>
            <div>first_name: {useSelector(state => state.auth.userProfile.first_name)}</div>
            <div>last_name: {useSelector(state => state.auth.userProfile.last_name)}</div>
            <div>email: {useSelector(state => state.auth.userProfile.email)}</div>
            <div className='p00-small-footer'>
                <button 
                    className='p00-button'
                    // after clicking button dispatching function (action from Slice) to middleware...
                    onClick={() => dispatch(fetchUserProfile())}
                >Fetch User</button>
            </div>
        </div>
    </div> );
}
 
export default Playground;