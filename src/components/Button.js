import React from 'react';

/**
 * Renders the Button component
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const Button = ( props ) => {

    const { isLoaded, error } = props.state;

    if ( error || !isLoaded ) {
        return null;
    }

    return (
        <button onClick={ props.event.bind( this ) } className={ props.classes }>
            { props.text }
        </button>
    );
}

export default Button;
