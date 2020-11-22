import React from 'react';
import Item from './Item';

/**
 * Listing
 * 
 * Renders the list container
 * 
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const Listing = ( props ) => {

    const { items } = props;

    return (
        <ul className="book-list">
            { items.map( ( item, index ) => {
                return <Item key={ index } index={ index } item={ item }></Item>
            } ) }
        </ul>
    );
}

export default Listing;
