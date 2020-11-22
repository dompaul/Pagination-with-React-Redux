import React from 'react';

/**
 * Button
 * 
 * 
 * 
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const Button = ( props ) => {

    const { isFetching, error, classes, page, disabled } = props;

    if ( error || isFetching ) {
        return null;
    }

    return (
        <button className={ classes } onClick={ props.callback.bind( this, page ) } disabled={ disabled }></button>
    );
}

export default Button;
