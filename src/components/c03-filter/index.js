import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import filter from './assets/filter-svgrepo-com.svg';
import '../c03-filter/index.scss';

/*
    <C03_FILTER 
        items={items}
        filteredItems={filteredItems}
        set_filteredItems={set_filteredItems}
    />
*/
const C03_FILTER = (props) => {
    const [active, set_active] = useState(false);
    // const [items, set_items] = useState([])
    // const [filteredItems, set_filteredItems] = useState([]);
//
    useEffect(() => {
        // if (props.items !== undefined) set_items([...props.items]);
        // if (props.filteredItems !== undefined) set_filteredItems([...props.filteredItems]);
    }, []);

    const updateItem = (item) => {
        let updated_filteredItems = [...props.filteredItems];

        let index = -1;

        props.filteredItems.map((filteredItem, filteredIndex) => {
            // check if item is in filteredItem array
            if (filteredItem === item) {
                index = filteredIndex;
            }
        })

        if (index !== -1) {
            // item is already filtered -> remove it from filter
            updated_filteredItems.splice(index, 1);
        }
        else {
            // item is not filtered yet -> add it to the filter
            updated_filteredItems.push(item);
        }

        props.set_filteredItems([...updated_filteredItems]);
        // set_filteredItems([...updated_filteredItems]);
    }

    const updateAll = () => {
        // check if all items are checked
        if (props.filteredItems.length === 0) {
            // yes all items are checked - action -> uncheck all
            props.set_filteredItems([...props.items]);
            // set_filteredItems([...items]);
            
        }
        else {
            // no all items are not checked - action -> check all
            props.set_filteredItems([]);
            // set_filteredItems([]);
        }
    }

    return ( <div className='c03-filter'>
        {/* <div className='p02-c09-icon'> */}
            <img 
                className={active ? 'p02-c09-img-active' : 'p02-c09-img-inactive'}
                src={filter} 
                alt='' 
                // className={filteredMilestones.length != 0 ? 'p02-c09-img-active' : 'p02-c09-img-inactive'} 
                onClick={() => set_active(!active)}
            ></img>
            {active ?
                <ul 
                    className='p02-c09-filter-choises' 
                    onMouseLeave={() => set_active(false)}
                >
                    <li>
                        <input 
                            type='checkbox' 
                            id='all' 
                            name='all' 
                            checked={props.filteredItems.length == 0} 
                            onChange={() => updateAll()}
                            // onChange={() => updateFilterMilestones('all')}
                        />
                        <label for='all'>all</label>
                    </li>
                    {props.items.map((item) => {
                        let isFiltered = props.filteredItems.includes(item);

                        return <li>
                            <input 
                                type='checkbox' 
                                id={item} 
                                name={item} 
                                checked={!isFiltered}
                                onChange={() => updateItem(item)} 
                            />
                            <label for={item}>{item}</label>
                        </li>
                    })}
                </ul>
                :
                <div></div>
            }
        {/* </div> */}
    </div> );
}
 
export default C03_FILTER;