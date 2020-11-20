import React from 'react';

/**
 * Responsible for rendering the Launch Item
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const Item = ( props ) => {
    return (
        <li key={ props.index } className="book-item">
            <span className='book-item__label'>
                <span className='book-item__label--alt'> { props.item.book_title }</span>
            </span>
            <span className='book-item__label book-item__label--italic'>
                By
                <span className='book-item__label--alt'> { props.item.book_author[ 0 ] }</span>
            </span>
        </li>
    );
}

export default Item;
