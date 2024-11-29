import React, { Component } from 'react'
import arrow_left from './assets/arrow_left.png';
import magnifier_dark from './assets/magnifier_dark.png';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as sideBarActions from '../../app/features/sideBarSlice';
import './index.scss';

const C02_SIDEBAR = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // pick the data from the redux store
    let extendedSideBar = useSelector(state => state.sideBar.extendedSideBar);

    return ( <div className={extendedSideBar ? 
    'c02-side-bar-extended' : 
    'c02-side-bar-collapsed'
    }>
        <div className='co2-left-section'>
            <button 
                className='co2-button-container'
                onClick={ () => {
                    dispatch(sideBarActions.set_extendedSideBar(false));
                    navigate('/dashboard/');
                    }
                }
            >
                <div className='co2-button-name'>Planning Dashboard</div>
            </button>
            <button 
                className='co2-button-container'
                onClick={ () => {
                    dispatch(sideBarActions.set_extendedSideBar(false));
                    navigate('/documents/');
                    }
                }
            >
                <div className='co2-button-name'>Documents overview</div>
            </button>
            <button 
                className='co2-button-container'
                onClick={ () => {
                    dispatch(sideBarActions.set_extendedSideBar(false));
                    navigate('/employees/')
                    }
                }
            >
                <div className='co2-button-name'>Employees</div>
            </button>
            <button 
                className='co2-button-container'
                onClick={ () => {
                    dispatch(sideBarActions.set_extendedSideBar(false));
                    navigate('/test-center/');
                    }
                }
            >
                <div className='co2-button-name'>Test Center</div>
            </button>
            <button 
                className='co2-button-container'
                onClick={ () => {
                    dispatch(sideBarActions.set_extendedSideBar(false));
                    navigate('/hand-calculations/');
                    }
                }
            >
                <div className='co2-button-name'>Hand Calculations</div>
            </button>
            <button 
                className='co2-button-container'
                onClick={ () => {
                    dispatch(sideBarActions.set_extendedSideBar(false));
                    navigate('/tested-parts/');
                    }
                }
            >
                <div className='co2-button-name'>Tested Parts (FSR)</div>
            </button>
            <button 
                className='co2-button-container'
                onClick={ () => {
                    dispatch(sideBarActions.set_extendedSideBar(false));
                    navigate('/material-database/');
                    }
                }
            >
                <div className='co2-button-name'>Material Database</div>
            </button>
        </div>
        <div  className='c02-right-section'>
            <img 
                className='c02-img' 
                src={arrow_left} alt='' 
                // onClick={() => props.set_extendedSideBar(!props.extendedSideBar)}
                onClick={() => dispatch(sideBarActions.set_extendedSideBar(!extendedSideBar))}
            />
            <img className='c02-img-magnifier' src={magnifier_dark} alt='' />
        </div>
    </div> );
}
 
export default C02_SIDEBAR;