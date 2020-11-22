import React from 'react';

/**
 * Responsible for rendering the wrapper for the LaunchItem component
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const Search = React.forwardRef( ( props, ref ) => {

    const { error,
            onChangeCallback,
            onSearchCallback
        } = props;

    if ( error ) {
        return null;
    }

    return (
        <form data-testid='search' className='search' onSubmit={ onSearchCallback }>
            <input data-testid='search-input' ref={ ref } onChange={ onChangeCallback } type='search' className='search__input' placeholder='Search...'></input>
            <input data-testid='search-button' type='submit' value='' className='search__submit' />
        </form>
    );
} );

export default Search;
