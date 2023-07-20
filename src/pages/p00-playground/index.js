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

    return ( <div className='p00-playground'>
        <div className='p00-nav-bar'>
        <button 
            className='p00-button'
            onClick={() => dispatch(increment())}
        >Add 1</button>
            {count}
        <button 
            className='p00-button'
            onClick={() => dispatch(decrement())}
        >Remove 1</button>
        </div>
        <div className='p00-main-body'>
            {count}
            <div className='p00-small-footer'>I am small footer</div>
        </div>
    </div> );
}
 
export default Playground;