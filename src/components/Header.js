import React from 'react';
import Button from './Button';
import SearchResult from './SearchResult';
import CONSTANTS from '../common/constants';

/**
 * Header
 * 
 * Renders the header container and details about the pagination/ search results
 * 
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
            decrementPage,
            searchValue,
            search,
            clearSearch
        } = props;

    if ( error ) {
        return null;
    }

    /**
     * getShowingRangeStart
     * 
     * 
     */
    const getShowingRangeStart = () => {
        return page === maxPage ? count - items.length + 1 : ( page * pageSize + 1 ) - items.length;
    }

    /**
     * getShowingRangeEnd
     * 
     * 
     */
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
            { search
                ? <SearchResult searchValue={ searchValue } error={ error } clickHandler={ clearSearch }></SearchResult>
                : null
            }
        </header>
    );
}

export default Header;
