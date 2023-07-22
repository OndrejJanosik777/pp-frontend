import React, { Component } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    increment, 
    decrement
} from '../../features/counter/counterSlice';
import './index.scss'

const Playground = () => {
    // const count = useSelector(selectCount);
    const count = useSelector(state => state.counter.value);
    const dispatch = useDispatch()

    const thunkFunction = (dispatch, getState) => {
        // logic here that can dispatch actions or read state
        console.log('hello from thunkFunction...', dispatch);
      }
      
    // store.dispatch(thunkFunction)

    return ( <div className='p00-playground'>
        <div className='p00-nav-bar'>
        <button 
            className='p00-button'
            onClick={() => {
                dispatch(increment());
                dispatch(thunkFunction);
            }}
        >Add 1</button>
            {count}
        <button 
            className='p00-button'
            onClick={() => {
                dispatch(decrement());
                dispatch(thunkFunction);
            }}
        >Remove 1</button>
        </div>
        <div className='p00-main-body'>
            {count}
            <div className='p00-small-footer'>I am small footer</div>
        </div>
    </div> );
}
 
export default Playground;