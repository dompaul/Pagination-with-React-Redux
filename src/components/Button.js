import React from 'react';

/**
 * Button
 * 
 * Renders the Previous/Next buttons used for pagination
 * 
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const Button = ( props ) => {

    const { isFetching, error, classes, disabled, callback } = props;

    if ( error || isFetching ) {
        return null;
    }

    return (
        <button data-testid='button' className={ classes } onClick={ callback } disabled={ disabled }></button>
    );
}

export default Button;
