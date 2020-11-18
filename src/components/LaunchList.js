import React from 'react';
import LaunchItem from './LaunchItem';

/**
 * Responsible for rendering the wrapper for the LaunchItem component
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const LaunchList = ( props ) => {

    const { items, filter, isLoaded, error } = props.state;
    let filteredItems = [ ...items ];

    if ( error ) {
        return (
            <span>Sorry, there has been an error trying to load SpaceX data.</span>
        )
    }

    if ( !isLoaded ) {
        return (
            <span>Loading...</span>
        )
    }

    if ( filter !== '' ) {
        filteredItems = [ ...items ].filter( item => {
            const year = Number( new Date( item.launch_date_utc ).getFullYear() );
            return year === Number( filter );
        } );
    }

    return (
        <ul className="launch-list">
            { filteredItems.map( ( item, index ) => {
                return <LaunchItem key={ index } item={ item } index={ index } />
            } ) }
        </ul>
    );
}

export default LaunchList;
