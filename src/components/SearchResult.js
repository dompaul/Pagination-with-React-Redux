import React from 'react';

/**
 * Responsible for rendering the wrapper for the LaunchItem component
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const SearchResult = ( props ) => {

    const { error,
            searchValue,
            clickHandler
        } = props;

    if ( error ) {
        return null;
    }

    return (
        <div className='search-result'>
            <h1 className='search-result__text'>Searching for: { searchValue }</h1>
            <button className='search-result__clear' onClick={ clickHandler }></button>
        </div>
    );
}

export default SearchResult;
