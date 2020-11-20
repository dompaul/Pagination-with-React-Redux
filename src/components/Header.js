import React from 'react';
import Button from './Button';
import CONSTANTS from '../common/constants';

/**
 * Responsible for rendering the wrapper for the LaunchItem component
 * @param {Object} props Passed-in arguments from the constructor class including the state
 */
const Header = ( props ) => {

    const { isFetching,
            error,
            page,
            maxPage,
            count,
            items,
            pageSize,
            incrementPage,
            decrementPage
        } = props;

    if ( error || isFetching ) {
        return null;
    }

    const getShowingRangeStart = () => {
        return page === maxPage ? count - items.length + 1 : ( page * pageSize + 1 ) - items.length;
    }

    const getShowingRangeEnd = () => {
        return page === maxPage ? ( count ) : ( page * pageSize );
    }

    return (
        <header className='header'>
            <div className='header__page-info'>
                <p className='header__text'>{ CONSTANTS.LABELS.SHOWING } { getShowingRangeStart() } - { getShowingRangeEnd() } - of { count } { CONSTANTS.LABELS.RESULTS }</p>
                <p className='header__page'>Page { page }</p>
            </div>
            <div className='controls'>
                <Button
                    page={ page }
                    callback={ decrementPage }
                    error={ error }
                    isFetching={ isFetching }
                    classes='controls__button controls__button--prev'
                    text='Prev'
                    disabled={ page === 1 }>
                </Button>
                <Button
                    page={ page }
                    callback={ incrementPage }
                    error={ error }
                    isFetching={ isFetching }
                    classes='controls__button controls__button--next'
                    text='Next'
                    disabled={ page === maxPage }>
                </Button>
            </div>
        </header>
    );
}

export default Header;
